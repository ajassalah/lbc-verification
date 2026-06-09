<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard')
                ->with('error', 'You are not authorized to access users.');
        }

        $query = User::query()->latest();

        if ($search = $request->input('name')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('name', 'like', '%' . $term . '%')
                            ->orWhere('email', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        // Filter by role if provided
        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);

        // Get unique roles for the filter dropdown
        $roles = User::select('role')->distinct()->pluck('role');

        $currentPage = $request->input('page', 1);


        $adminCount = User::where('role', 'admin')->count();
        $userCount = User::where('role', 'user')->count();
        $totalUsersCount = User::count();

        return Inertia::render('Users/Index', [
            'users' => UserResource::collection($users),
            'params' => array_merge($request->all(), ['page' => $currentPage, 'per_page' => $perPage]),
            'roles' => $roles,

            'adminCount' => $adminCount,
            'userCount' => $userCount,
            'totalUsersCount' => $totalUsersCount,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard')
                ->with('error', 'You are not authorized to perform this action.');
        }

        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard')
                ->with('error', 'You are not authorized to perform this action.');
        }

        // Validated data from the request
        $validated = $request->validated();

        // Create the user with validated data
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'allow_manual_learner_id' => $validated['allow_manual_learner_id'],
            'allow_manual_certificate_reference' => false,
        ]);

        return redirect()->route('users.index')
            ->with('message', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard')
                ->with('error', 'You are not authorized to perform this action.');
        }

        $user = User::findOrFail($id);
        return Inertia::render('Users/Edit', [
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard')
                ->with('error', 'You are not authorized to perform this action.');
        }

        $user = User::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:user,admin',
            'allow_manual_learner_id' => 'required|boolean',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        unset($validated['password_confirmation']);

        $user->update($validated);

        return redirect()->route('users.index')
            ->with('message', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Check if user is admin
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard')
                ->with('error', 'You are not authorized to perform this action.');
        }

        $user->delete();
        return redirect()->route('users.index')
            ->with('message', 'User deleted successfully.');
    }
}
