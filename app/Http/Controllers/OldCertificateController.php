<?php

namespace App\Http\Controllers;

use App\Models\OldCertificate;
use App\Http\Resources\OldCertificateResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OldCertificateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = OldCertificate::query()->latest();

        // Search by student name, reference_no, or student_id
        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('student_name', 'like', '%' . $term . '%')
                            ->orWhere('student_id', 'like', '%' . $term . '%')
                            ->orWhere('reference_no', 'like', '%' . $term . '%')
                            ->orWhere('student_email', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by course if provided
        if ($course = $request->input('course')) {
            $query->where('course_name', 'like', '%' . $course . '%');
        }

        // Filter by status if provided
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $perPage = $request->input('per_page', 10);
        $certificates = $query->paginate($perPage);

        // Get unique courses for filter dropdown (from course_name field)
        $courses = OldCertificate::select('course_name')
            ->distinct()
            ->whereNotNull('course_name')
            ->orderBy('course_name')
            ->pluck('course_name')
            ->map(function ($courseName) {
                return ['name' => $courseName];
            });

        $statuses = OldCertificate::select('status')->distinct()->pluck('status');

        $currentPage = $request->input('page', 1);

        $totalCertificatesCount = OldCertificate::count();
        $totalVerifiedCount = OldCertificate::where('status', 'Verified')->count();
        $totalPendingCount = OldCertificate::where('status', 'Pending')->count();

        return Inertia::render('OldCertificates/Index', [
            'certificates' => OldCertificateResource::collection($certificates),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
            'courses' => $courses,
            'statuses' => $statuses,
            'totalCertificatesCount' => $totalCertificatesCount,
            'totalVerifiedCount' => $totalVerifiedCount,
            'totalPendingCount' => $totalPendingCount,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(OldCertificate $oldCertificate)
    {
        // Load the creator relationship if it exists
        $oldCertificate->load('createdBy');

        // Access the user who created this certificate
        $user = $oldCertificate->creator;

        return Inertia::render('OldCertificates/Show', [
            'certificate' => new OldCertificateResource($oldCertificate),
            'user' => $user,
        ]);
    }
}
