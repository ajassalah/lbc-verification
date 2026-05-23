<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Http\Requests\UpdateModuleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ModuleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Module $module)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Module $module)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuleRequest $request, Module $module)
    {
        try {
            $course = $module->course;

            // Start a transaction
            DB::beginTransaction();

            // Update the module with validated data
            $module->update([
                ...$request->validated(),
                'unit_count' => null,
                'credit_count' => null,
                'description' => null,
            ]);

            $course->update(['total_credits' => 0]);

            DB::commit();

            // Return a redirect back with success message
            return redirect()->back()
                ->with('success', 'Module updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to update module: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        if (auth()->user()?->role !== 'admin') {
            return redirect()->back()
                ->with('error', 'You are not authorized to delete modules.');
        }

        try {
            // Get course before deletion
            $course = $module->course;
            $courseId = $course->id;
            // Start transaction
            DB::beginTransaction();

            // Delete the module
            $module->delete();

            $course->update(['total_credits' => 0]);

            DB::commit();

            // Return a success response
            return redirect()->route('courses.show', $courseId)
                ->with('success', 'Module deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to delete module: ' . $e->getMessage());
        }
    }

    /**
     * Get modules for a specific course.
     */
    public function getModulesByCourse($courseId)
    {
        $modules = Module::where('course_id', $courseId)
            ->orderBy('year', 'asc')
            ->get();

        return response()->json($modules);
    }
}
