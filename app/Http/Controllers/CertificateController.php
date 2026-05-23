<?php

namespace App\Http\Controllers;

use App\Events\CertificateVerificationAttempted;
use App\Models\Certificate;
use App\Models\OldCertificate;
use App\Http\Requests\StoreCertificateRequest;
use App\Http\Requests\UpdateCertificateRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Resources\CertificateResource;
use App\Http\Resources\CourseResource;
use App\Http\Resources\LearnerResource;
use App\Models\CertificateViewLog;
use App\Models\Center;
use App\Models\Course;
use App\Models\Learner;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class CertificateController extends Controller
{
    private const CERTIFICATE_REFERENCE_START = 8985;
    private const CERTIFICATE_REFERENCE_INCREMENT = 3;

    private function toRoman(int $number): string
    {
        $map = [
            1000 => 'M',
            900 => 'CM',
            500 => 'D',
            400 => 'CD',
            100 => 'C',
            90 => 'XC',
            50 => 'L',
            40 => 'XL',
            10 => 'X',
            9 => 'IX',
            5 => 'V',
            4 => 'IV',
            1 => 'I',
        ];

        $roman = '';

        foreach ($map as $value => $symbol) {
            while ($number >= $value) {
                $roman .= $symbol;
                $number -= $value;
            }
        }

        return $roman;
    }

    private function nextReferenceNo(): string
    {
        $maxReferenceNumber = Certificate::query()
            ->pluck('reference_no')
            ->map(fn ($referenceNo) => preg_match('/-(\d+)$/', (string) $referenceNo, $matches) ? (int) $matches[1] : null)
            ->filter()
            ->max();

        $nextNumber = (! $maxReferenceNumber || $maxReferenceNumber < self::CERTIFICATE_REFERENCE_START)
            ? self::CERTIFICATE_REFERENCE_START
            : $maxReferenceNumber + self::CERTIFICATE_REFERENCE_INCREMENT;

        return 'UQAN-' . $this->toRoman((int) now()->format('Y')) . '-' . $nextNumber;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Certificate::query()->latest();

        // Search by student name, reference_no, or student_id
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->whereHas('learner', function ($learnerQuery) use ($term) {
                            $learnerQuery->where('full_name', 'like', '%' . $term . '%')
                                ->orWhere('learner_id', 'like', '%' . $term . '%');
                        })
                            ->orWhere('reference_no', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by course if provided
        if ($course = $request->input('course')) {
            $query->whereHas('course', function ($q) use ($course) {
                $q->where('id', $course)->orWhere('name', 'like', '%' . $course . '%');
            });
        }

        // Filter by status if provided
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }        // Eager load relationships
        $query->with(['course', 'learner']);

        $perPage = $request->input('per_page', 10);
        $certificates = $query->paginate($perPage);

        // Get unique courses for filter dropdown
        $courses = \App\Models\Course::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);
        $statuses = Certificate::select('status')->distinct()->pluck('status');

        $currentPage = $request->input('page', 1);


        $totalCertificatesCount = Certificate::count();
        $totalVerifiedCount = Certificate::where('status', 'verified')->count();
        $totalPendingCount = Certificate::where('status', 'pending')->count();

        return Inertia::render('Certificates/Index', [
            'certificates' => CertificateResource::collection($certificates),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
            'courses' => $courses,
            'statuses' => $statuses,

            'totalCertificatesCount' => $totalCertificatesCount,
            'totalVerifiedCount' => $totalVerifiedCount,
            'totalPendingCount' => $totalPendingCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $courses = \App\Models\Course::where('status', true)->get(['id', 'name', 'code', 'total_credits']);
        $learners = \App\Models\Learner::get(['id', 'full_name', 'learner_id']);
        $centers = Center::orderBy('name')->get(['id', 'name', 'number']);

        return Inertia::render('Certificates/Create', [
            'courses' => $courses,
            'learners' => $learners,
            'centers' => $centers,
            'nextReferenceNo' => $this->nextReferenceNo(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCertificateRequest $request)
    {
        $validated = $request->validated();

        if (! $request->user()?->allow_manual_certificate_reference) {
            $validated['reference_no'] = $this->nextReferenceNo();
        }

        Certificate::create($validated);

        return redirect()->route('certificates.index')->with('success', 'Certificate created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Certificate $certificate)
    {
        // Eager load the relationships
        $certificate->load(['createdBy', 'learner', 'course']);

        // Access the user's name through the createdBy relationship
        $user = $certificate->createdBy;

        // Make sure modules_data is properly processed
        if ($certificate->modules_data && is_string($certificate->modules_data)) {
            try {
                $certificate->modules_data = json_decode($certificate->modules_data, true);
            } catch (\Exception $e) {
                // If there's an error, just leave it as is
                Log::warning("Error decoding modules_data for certificate {$certificate->id}: " . $e->getMessage());
            }
        }

        return Inertia::render('Certificates/Show', [
            'certificate' => $certificate,
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Certificate $certificate)
    {
        $certificate->load('course.modules', 'learner');

        // Get active courses for the dropdown
        $courses = Course::where('status', true)->get();

        // Get all learners for the dropdown
        $learners = Learner::all();
        $centers = Center::orderBy('name')->get(['id', 'name', 'number']);

        return Inertia::render('Certificates/Edit', [
            'certificate' => CertificateResource::make($certificate),
            'courses' => CourseResource::collection($courses),
            'learners' => LearnerResource::collection($learners),
            'centers' => $centers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCertificateRequest $request, Certificate $certificate)
    {
        // Get validated data
        $validatedData = $request->validated();

        // Parse the modules_data to ensure it's valid JSON before saving
        if (isset($validatedData['modules_data'])) {
            if (is_string($validatedData['modules_data'])) {
                // Already a string, make sure it's valid JSON
                json_decode($validatedData['modules_data']);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return back()->withErrors(['modules_data' => 'Invalid JSON structure']);
                }
            } else {
                // Convert to JSON string
                $validatedData['modules_data'] = json_encode($validatedData['modules_data']);
            }
        }

        $certificate->update($validatedData);

        return redirect()->route('certificates.index')->with('success', 'Certificate updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certificate $certificate)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('certificates.index')
                ->with('error', 'You are not authorized to perform this action.');
        }

        $certificate->delete();
        return response()->json(['message' => 'Certificate deleted.']);
    }

    /**
     * Search for a reference_no certificate by reference number.
     */
    public function search(Request $request)
    {
        $request->validate([
            'reference_no' => 'required|string',
        ]);

        // Search in both tables to check if certificate exists
        $oldCertificate = \App\Models\OldCertificate::where('reference_no', $request->reference_no)->first();
        $certificate = Certificate::where('reference_no', $request->reference_no)->first();

        if ($oldCertificate || $certificate) {
            // Redirect to the verify route with reference_no only
            return redirect()->route('certificates.verify', ['reference_no' => $request->reference_no]);
        } else {
            // Certificate not found in either table
            return redirect()->route('certificates.verify', [
                'reference_no' => $request->reference_no,
                'not_found' => true
            ]);
        }
    }

    /**
     * Display the verification page for a certificate.
     */
    public function verify(Request $request, $reference_no)
    {
        event(new CertificateVerificationAttempted($reference_no));
        // Log the verification attempt
        $this->logVerificationAttempt($request, $reference_no);

        if ($request->has('not_found')) {
            return Inertia::render('Verify', [
                'certificate' => 0,
                'reference_no' => $reference_no,
                'certificate_type' => null,
            ]);
        }

        $certificate = null;
        $certificateType = null;

        // Search in both tables (old certificates first, then new certificates)
        $certificate = \App\Models\OldCertificate::where('reference_no', $reference_no)->first();
        if ($certificate) {
            $certificateType = 'old';
        } else {
            $certificate = Certificate::with(['course', 'learner'])
                ->where('reference_no', $reference_no)
                ->first();
            if ($certificate) {
                $certificateType = 'new';
            }
        }

        if (!$certificate) {
            return Inertia::render('Verify', [
                'certificate' => 0,
                'reference_no' => $reference_no,
                'certificate_type' => null,
            ]);
        }

        return Inertia::render('Verify', [
            'certificate' => $certificate,
            'reference_no' => $reference_no,
            'certificate_type' => $certificateType,
        ]);
    }

    /**
     * Log a certificate verification attempt with IP geolocation data.
     */
    private function logVerificationAttempt(Request $request, string $reference_no): void
    {
        Log::info("Certificate verification attempt", [
            'reference_no' => $reference_no,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        try {
            // Get IP and user agent
            $ip = $request->ip();
            $userAgent = $request->userAgent();


            // Initialize geolocation data with null values
            $geoData = [
                'status' => null,
                'country' => null,
                'country_code' => null,
                'region' => null,
                'region_name' => null,
                'city' => null,
                'zip' => null,
                'lat' => null,
                'lon' => null,
                'timezone' => null,
                'isp' => null,
                'org' => null,
                'as' => null,
                'proxy' => null,
                'hosting' => null
            ];

            // Get geolocation data from IP API
            try {
                $response = Http::timeout(3)->get("http://ip-api.com/json/{$ip}");

                if ($response->successful()) {
                    $data = $response->json();

                    if (isset($data['status']) && $data['status'] === 'success') {
                        // Map camelCase API response fields to snake_case database fields
                        $fieldMapping = [
                            'countryCode' => 'country_code',
                            'regionName' => 'region_name',
                        ];

                        // Copy values from API response to our data array
                        foreach ($geoData as $field => $value) {
                            // For fields that need mapping from camelCase to snake_case
                            $apiField = array_flip($fieldMapping)[$field] ?? $field;

                            if (isset($data[$apiField])) {
                                $geoData[$field] = $data[$apiField];
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                // If API call fails, we continue with null values
                Log::warning("Failed to retrieve IP geolocation data: {$e->getMessage()}");
            }

            // Create the log entry with all available data
            CertificateViewLog::create(array_merge([
                'reference_no' => $reference_no,
                'ip' => $ip,
                'user_agent' => $userAgent,
            ], $geoData));
        } catch (\Exception $e) {
            // Don't interrupt certificate verification if logging fails
            Log::error("Failed to log certificate verification attempt: {$e->getMessage()}");
        }
    }

    /**
     * Generate PDF certificate
     */
    public function generatePDF(Certificate $certificate)
    {
        if (Auth::check() && Auth::user()->role !== 'admin') {
            abort(403);
        }

        if (! request()->boolean('raw')) {
            $certificate->load(['learner']);

            return view('certificate-document', [
                'certificate' => $certificate,
                'documentUrl' => route('certificates.pdf', [
                    'certificate' => $certificate,
                    'raw' => 1,
                ]),
            ]);
        }

        // Load relationships
        $certificate->load(['learner', 'course']);
        $centerNumber = Center::where('name', $certificate->center_name)->value('number');

        // Calculate additional fields
        $graduationDate = $certificate->awarding_date ? Carbon::parse($certificate->awarding_date) : null;
        $courseDuration = null;

        if ($certificate->course_start_date && $certificate->course_end_date) {
            $startDate = Carbon::parse($certificate->course_start_date);
            $endDate = Carbon::parse($certificate->course_end_date);
            $courseDuration = $startDate->diffInMonths($endDate);
        }

        $data = [
            'certificate' => $certificate,
            'learner' => $certificate->learner,
            'course' => $certificate->course,
            'graduationDate' => $graduationDate ? $graduationDate->format('F j, Y') : null,
            'courseDuration' => $courseDuration,
            'createdBy' => $certificate->createdBy ? $certificate->createdBy->name : 'Unknown',
            'centerNumber' => $centerNumber,
        ];


        $pdf = Pdf::loadView('certificate', $data);
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOption('enable-javascript', true);
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('images', true);
        $pdf->setOption('enable-smart-shrinking', true);
        $pdf->setOption('margin-top', 0);
        $pdf->setOption('margin-right', 0);
        $pdf->setOption('margin-bottom', 0);
        $pdf->setOption('margin-left', 0);
        $pdf->setOption('print-media-type', true);
        $pdf->setOption('no-background', false);
        $pdf->setOption('disable-smart-shrinking', false);

        $filename = 'Certificate_' . $certificate->reference_no . '.pdf';

        return $pdf->stream($filename);
    }
}
