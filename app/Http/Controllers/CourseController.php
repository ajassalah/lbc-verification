<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\DataOption;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Start with a base query that includes modules and createdBy relationship
        $query = Course::with(['modules', 'createdBy'])
            ->orderBy('name');

        // Search by name or code if provided
        if ($search = $request->input('name')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('name', 'like', '%' . $term . '%')
                            ->orWhere('code', 'like', '%' . $term . '%')
                            ->orWhere('description', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by faculty if provided
        if ($faculty = $request->input('faculty')) {
            $query->where('faculty', $faculty);
        }

        // Paginate the results
        $perPage = $request->input('per_page', 10);
        $courses = $query->paginate($perPage);

        // Get unique faculty values for the filter dropdown
        $facultyOptions = Course::select('faculty')
            ->distinct()
            ->whereNotNull('faculty')
            ->pluck('faculty')
            ->toArray();

        // Add default faculty options if the list is empty
        $facultyOptions = collect(DataOption::valuesFor(DataOption::COURSE_FACULTY))
            ->merge($facultyOptions)
            ->filter()
            ->unique()
            ->values()
            ->all();

        // Current page for pagination
        $currentPage = $request->input('page', 1);

        // Return the view with the courses and filters
        return inertia('Courses/Index', [
            'courses' => CourseResource::collection($courses),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
            'facultyOptions' => $facultyOptions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Courses/Create', [
            'facultyOptions' => DataOption::valuesFor(DataOption::COURSE_FACULTY),
            'moduleLevelOptions' => DataOption::valuesFor(DataOption::MODULE_LEVEL),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            $validated = $request->validated();
            $modules = $validated['modules'] ?? [];

            // Remove modules from course data
            unset($validated['modules']);

            // Handle image upload if present
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('courses', 'public');
                $validated['image'] = $path;
            }

            // Add user id as created_by
            $validated['created_by'] = auth()->id();

            $validated['level'] = null;
            $validated['total_credits'] = 0;

            // Create the course
            $course = Course::create($validated);

            // Create modules for this course
            foreach ($modules as $moduleData) {
                $moduleData['course_id'] = $course->id;
                $moduleData['created_by'] = auth()->id();
                $course->modules()->create($moduleData);
            }

            DB::commit();

            return redirect()->route('courses.index')
                ->with('message', 'Course created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create course: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        // Load the modules and creator with eager loading
        $course->load(['modules']);


        // Calculate module summary values
        $units = $course->modules
            ->pluck('level')
            ->filter()
            ->unique()
            ->values()
            ->all();
        $years = $course->modules
            ->pluck('year')
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();

        // Get levels and years

        return inertia('Courses/Show', [
            'course' => new CourseResource($course),
            'moduleLevelOptions' => DataOption::valuesFor(DataOption::MODULE_LEVEL),
            'moduleStats' => [
                'total' => $course->modules->count(),
                'units' => $units,
                'years' => $years,
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        return inertia('Courses/Edit', [
            'course' => $course->load('modules'),
            'facultyOptions' => DataOption::valuesFor(DataOption::COURSE_FACULTY),
            'moduleLevelOptions' => DataOption::valuesFor(DataOption::MODULE_LEVEL),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {

        // Start a database transaction
        DB::beginTransaction();

        try {
            $data = $request->validated();
            $modules = $data['modules'] ?? [];
            unset($data['modules'], $data['image']);

            // Handle image upload if present
            if ($request->hasFile('image')) {
                // Delete old image if it exists
                if ($course->image) {
                    Storage::disk('public')->delete($course->image);
                }
                $path = $request->file('image')->store('courses', 'public');
                $data['image'] = $path;
            } else if ($request->has('image') && !$request->input('image')) {
                // If image field is explicitly empty, delete old image and set to null
                if ($course->image) {
                    Storage::disk('public')->delete($course->image);
                }
                $data['image'] = null;
            } else {
                // Otherwise keep the existing image
                unset($data['image']);
            }

            $data['level'] = null;
            $data['total_credits'] = 0;

            // Update course data
            $course->update($data);

            // Get existing module IDs
            $existingModuleIds = $course->modules()->pluck('id')->toArray();
            $updatedModuleIds = collect($modules)->pluck('id')->filter()->toArray();

            // Only admins can remove existing modules from a course.
            $moduleIdsToDelete = array_diff($existingModuleIds, $updatedModuleIds);
            if (auth()->user()?->role === 'admin' && count($moduleIdsToDelete) > 0) {
                $course->modules()->whereIn('id', $moduleIdsToDelete)->delete();
            }

            // Update or create modules
            foreach ($modules as $moduleData) {
                $moduleData['unit_count'] = null;
                $moduleData['credit_count'] = null;
                $moduleData['description'] = null;

                if (isset($moduleData['id'])) {
                    $module = Module::find($moduleData['id']);
                    $module->update($moduleData);
                } else {
                    $moduleData['course_id'] = $course->id;
                    $moduleData['created_by'] = auth()->id();
                    $course->modules()->create($moduleData);
                }
            }

            $course->update(['total_credits' => 0]);

            DB::commit();

            return redirect()->route('courses.show', $course)
                ->with('message', 'Course updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update course: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        // Check if user is admin
        if (auth()->user()->role !== 'admin') {
            return redirect()->route('courses.index')
                ->with('error', 'You are not authorized to perform this action.');
        }

        try {
            // Start a transaction to ensure all related modules are also deleted
            DB::beginTransaction();

            // Delete course image if exists
            if ($course->image) {
                Storage::disk('public')->delete($course->image);
            }

            // Delete related modules first to maintain referential integrity
            $course->modules()->delete();

            // Delete the course
            $course->delete();

            DB::commit();

            return redirect()->route('courses.index')
                ->with('message', 'Course deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->route('courses.index')
                ->with('error', 'Failed to delete course: ' . $e->getMessage());
        }
    }
}
