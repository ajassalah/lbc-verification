<?php

namespace App\Http\Controllers;

use App\Models\DataOption;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DataOptionController extends Controller
{
    public function index()
    {
        return Inertia::render('Data/Index', [
            'options' => DataOption::groupedValues(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in([
                DataOption::COURSE_FACULTY,
                DataOption::MODULE_LEVEL,
                DataOption::MEDIUM_OF_INSTRUCTION,
                DataOption::MODE_OF_STUDY,
            ])],
            'value' => ['required', 'string', 'max:255'],
        ]);

        $value = trim($validated['value']);
        $nextSortOrder = ((int) DataOption::where('type', $validated['type'])->max('sort_order')) + 1;

        DataOption::firstOrCreate(
            ['type' => $validated['type'], 'value' => $value],
            ['sort_order' => $nextSortOrder]
        );

        return redirect()->route('data.index')->with('message', 'Data option added successfully.');
    }

    public function destroy(Request $request)
    {
        abort_if($request->user()?->role !== 'admin', 403);

        $validated = $request->validate([
            'type' => ['required', Rule::in([
                DataOption::COURSE_FACULTY,
                DataOption::MODULE_LEVEL,
                DataOption::MEDIUM_OF_INSTRUCTION,
                DataOption::MODE_OF_STUDY,
            ])],
            'value' => ['required', 'string', 'max:255'],
        ]);

        DataOption::where('type', $validated['type'])
            ->where('value', $validated['value'])
            ->delete();

        return redirect()->route('data.index')->with('message', 'Data option deleted successfully.');
    }
}
