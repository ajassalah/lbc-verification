<?php

namespace App\Http\Controllers;

use App\Models\Center;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CenterController extends Controller
{
    public function index(Request $request)
    {
        $query = Center::query()->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('number', 'like', '%' . $search . '%');
            });
        }

        $perPage = $request->input('per_page', 10);
        $centers = $query->paginate($perPage);

        return Inertia::render('Centers/Index', [
            'centers' => $centers,
            'params' => array_merge($request->all(), [
                'page' => $request->input('page', 1),
                'per_page' => $perPage,
            ]),
        ]);
    }

    public function create()
    {
        return Inertia::render('Centers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:centers,name',
            'number' => 'required|string|max:255|unique:centers,number',
        ]);

        Center::create($validated);

        return redirect()->route('centers.index')
            ->with('message', 'Center created successfully.');
    }

    public function edit(Center $center)
    {
        return Inertia::render('Centers/Edit', [
            'center' => $center,
        ]);
    }

    public function update(Request $request, Center $center)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:centers,name,' . $center->id,
            'number' => 'required|string|max:255|unique:centers,number,' . $center->id,
        ]);

        $center->update($validated);

        return redirect()->route('centers.index')
            ->with('message', 'Center updated successfully.');
    }

    public function destroy(Center $center)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('centers.index')
                ->with('error', 'You are not authorized to perform this action.');
        }

        $center->delete();

        return redirect()->route('centers.index')
            ->with('message', 'Center deleted successfully.');
    }
}
