<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'allow_manual_learner_id' => (bool) $request->user()->allow_manual_learner_id,
                    'allow_manual_certificate_reference' => (bool) $request->user()->allow_manual_certificate_reference,
                ] : null,
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'warning' => fn() => $request->session()->get('warning'),
                'error' => fn() => $request->session()->get('error')
            ],
            'notifications' => $request->user() ? $request->user()->unreadNotifications()->limit(5)->get()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => class_basename($notification->type),
                    'data' => $notification->data,
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            }) : [],
            'notification_count' => $request->user() ? $request->user()->unreadNotifications()->count() : 0,
        ];
    }
}
