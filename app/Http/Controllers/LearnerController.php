<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLearnerRequest;
use App\Http\Requests\UpdateLearnerRequest;
use App\Http\Resources\LearnerResource;
use App\Models\Learner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class LearnerController extends Controller
{
    private const LEARNER_ID_START = 35051;
    private const LEARNER_ID_INCREMENT = 3;

    private function nextLearnerId(): string
    {
        $maxLearnerId = Learner::query()
            ->pluck('learner_id')
            ->map(function ($learnerId) {
                $learnerId = trim((string) $learnerId);

                if (! preg_match('/^\d{5}$/', $learnerId)) {
                    return null;
                }

                $numericLearnerId = (int) $learnerId;

                return $numericLearnerId >= self::LEARNER_ID_START ? $numericLearnerId : null;
            })
            ->filter()
            ->max();

        if (! $maxLearnerId || $maxLearnerId < self::LEARNER_ID_START) {
            return (string) self::LEARNER_ID_START;
        }

        return (string) ($maxLearnerId + self::LEARNER_ID_INCREMENT);
    }

    private function nationalityFormOptions(): array
    {
        $nationalities = config('nationalities', []);

        return [
            'nationalityOptions' => array_column($nationalities, 'nationality'),
            'nationalityDialCodes' => collect($nationalities)->pluck('dial_code', 'nationality')->toArray(),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Start with a base query for learners
        $query = Learner::query()
            ->orderByRaw('CAST(learner_id AS UNSIGNED) DESC')
            ->orderByDesc('id');

        // Search by name or email if provided
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where('full_name', 'like', '%' . $term . '%')
                        ->orWhere('email', 'like', '%' . $term . '%')
                        ->orWhere('name_with_initials', 'like', '%' . $term . '%')
                        ->orWhere('proof_id', 'like', '%' . $term . '%')
                        ->orWhere('learner_id', 'like', '%' . $term . '%');
                }
            });
        }

        // Filter by gender if provided
        if ($gender = $request->input('gender')) {
            $query->where('gender', $gender);
        }

        // Filter by country if provided
        if ($country = $request->input('country')) {
            $query->where('country', $country);
        }

        // Paginate the results
        $perPage = $request->input('per_page', 10);
        $learners = $query->paginate($perPage);

        // Get unique gender and country values for filter dropdowns
        $genderOptions = Learner::select('gender')
            ->distinct()
            ->whereNotNull('gender')
            ->pluck('gender')
            ->toArray();

        // If gender options are empty, add default options
        if (empty($genderOptions)) {
            $genderOptions = ['Male', 'Female', 'Other'];
        }

        $countryOptions = Learner::select('country')
            ->distinct()
            ->whereNotNull('country')
            ->pluck('country')
            ->toArray();

        // Current page for pagination
        $currentPage = $request->input('page', 1);

        // Get learner statistics
        $maleCount = Learner::where('gender', 'Male')->count();
        $femaleCount = Learner::where('gender', 'Female')->count();
        $totalLearnersCount = Learner::count();

        // Return the view with the learners and filters
        return inertia('Learners/Index', [
            'learners' => LearnerResource::collection($learners),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
            'genderOptions' => $genderOptions,
            'countryOptions' => $countryOptions,
            'maleCount' => $maleCount,
            'femaleCount' => $femaleCount,
            'totalLearnersCount' => $totalLearnersCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Define gender and proof type options
        $genderOptions = ['Male', 'Female', 'Other'];
        $proofTypeOptions = ['Passport', 'National ID', 'Driving Licence', 'Other'];
        $countryOptions = config('countries');
        $nationalityOptions = $this->nationalityFormOptions();

        return inertia('Learners/Create', [
            'genderOptions' => $genderOptions,
            'proofTypeOptions' => $proofTypeOptions,
            'countryOptions' => $countryOptions,
            ...$nationalityOptions,
            'nextLearnerId' => $this->nextLearnerId(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLearnerRequest $request)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            if (! $request->user()?->allow_manual_learner_id) {
                $validated['learner_id'] = $this->nextLearnerId();
            }

            // Handle profile picture upload if present
            if ($request->hasFile('profile_picture')) {
                $path = $request->file('profile_picture')->store('learners/profile_pictures', 'public');
                $validated['profile_picture'] = $path;
            }

            // Handle ID proof document upload if present
            if ($request->hasFile('id_proof_document')) {
                $path = $request->file('id_proof_document')->store('learners/id_proof_documents', 'public');
                $validated['id_proof_document'] = $path;
            }

            // Handle CV document upload if present
            if ($request->hasFile('cv_document')) {
                $path = $request->file('cv_document')->store('learners/cv_documents', 'public');
                $validated['cv_document'] = $path;
            }

            // Create the learner
            $learner = Learner::create($validated);

            DB::commit();

            return redirect()->route('learners.index')
                ->with('message', 'Learner created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors(['error' => 'An error occurred while creating the learner: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Learner $learner)
    {
        return inertia('Learners/Show', [
            'learner' => new LearnerResource($learner),
        ]);
    }

    public function document(Request $request, Learner $learner, string $document)
    {
        $documents = [
            'id-proof' => [
                'path' => $learner->id_proof_document,
                'label' => 'ID Proof Document',
            ],
            'cv' => [
                'path' => $learner->cv_document,
                'label' => 'CV/Resume',
            ],
        ];

        abort_unless(isset($documents[$document]), 404);

        $documentData = $documents[$document];
        $path = $this->normalizePublicStoragePath($documentData['path']);

        abort_if(! $path || ! Storage::disk('public')->exists($path), 404);

        $mimeType = Storage::disk('public')->mimeType($path) ?: 'application/octet-stream';

        if ($request->boolean('raw')) {
            return response()->file(Storage::disk('public')->path($path), [
                'Content-Type' => $mimeType,
                'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
            ]);
        }

        return view('learner-document', [
            'learner' => $learner,
            'documentLabel' => $documentData['label'],
            'documentUrl' => route('learners.documents.show', [
                'learner' => $learner,
                'document' => $document,
                'raw' => 1,
            ]),
            'isImage' => str_starts_with($mimeType, 'image/'),
            'isPdf' => $mimeType === 'application/pdf',
        ]);
    }

    private function normalizePublicStoragePath(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'storage/')) {
            return substr($path, strlen('storage/'));
        }

        if (str_starts_with($path, 'public/')) {
            return substr($path, strlen('public/'));
        }

        return $path;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Learner $learner)
    {
        // Define gender and proof type options
        $genderOptions = ['Male', 'Female', 'Other'];
        $proofTypeOptions = ['Passport', 'National ID', 'Driving Licence', 'Other'];
        $countryOptions = config('countries');
        $nationalityOptions = $this->nationalityFormOptions();

        return inertia('Learners/Edit', [
            'learner' => new LearnerResource($learner),
            'genderOptions' => $genderOptions,
            'proofTypeOptions' => $proofTypeOptions,
            'countryOptions' => $countryOptions,
            ...$nationalityOptions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */    public function update(UpdateLearnerRequest $request, Learner $learner)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            // Handle profile picture upload if present
            if ($request->hasFile('profile_picture')) {
                // Delete old image if exists
                if ($learner->profile_picture) {
                    Storage::disk('public')->delete($learner->profile_picture);
                }

                $path = $request->file('profile_picture')->store('learners/profile_pictures', 'public');
                $validated['profile_picture'] = $path;
            } else {
                // Preserve existing profile picture if no new upload
                $validated['profile_picture'] = $learner->profile_picture;
            }

            // Handle ID proof document upload if present
            if ($request->hasFile('id_proof_document')) {
                // Delete old document if exists
                if ($learner->id_proof_document) {
                    Storage::disk('public')->delete($learner->id_proof_document);
                }

                $path = $request->file('id_proof_document')->store('learners/id_proof_documents', 'public');
                $validated['id_proof_document'] = $path;
            } else {
                // Preserve existing ID proof document if no new upload
                $validated['id_proof_document'] = $learner->id_proof_document;
            }

            // Handle CV document upload if present
            if ($request->hasFile('cv_document')) {
                // Delete old document if exists
                if ($learner->cv_document) {
                    Storage::disk('public')->delete($learner->cv_document);
                }

                $path = $request->file('cv_document')->store('learners/cv_documents', 'public');
                $validated['cv_document'] = $path;
            } else {
                // Preserve existing CV document if no new upload
                $validated['cv_document'] = $learner->cv_document;
            }

            // Update the learner
            $learner->update($validated);

            DB::commit();

            return redirect()->route('learners.index')
                ->with('message', 'Learner updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors(['error' => 'An error occurred while updating the learner: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Learner $learner)
    {
        // Check if user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->back()->withErrors([
                'error' => 'You do not have permission to delete learners.'
            ]);
        }

        try {
            // Delete profile picture if exists
            if ($learner->profile_picture) {
                Storage::disk('public')->delete($learner->profile_picture);
            }

            // Delete ID proof document if exists
            if ($learner->id_proof_document) {
                Storage::disk('public')->delete($learner->id_proof_document);
            }

            // Delete CV document if exists
            if ($learner->cv_document) {
                Storage::disk('public')->delete($learner->cv_document);
            }

            // Delete the learner
            $learner->delete();

            return redirect()->route('learners.index')
                ->with('message', 'Learner deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'An error occurred while deleting the learner: ' . $e->getMessage()]);
        }
    }
}
