<?php

namespace App\Http\Controllers;

use App\Http\Resources\CertificateViewLogResource;
use App\Models\CertificateViewLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificateViewLogController extends Controller
{
    private function authorizeAdmin(): void
    {
        abort_if(auth()->user()?->role !== 'admin', 403);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $query = CertificateViewLog::query()->latest();

        if ($search = $request->input('search')) {
            $terms = explode(' ', $search);

            $query->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->where(function ($subQuery) use ($term) {
                        $subQuery->where('reference_no', 'like', '%' . $term . '%')
                            ->orWhere('country', 'like', '%' . $term . '%')
                            ->orWhere('region', 'like', '%' . $term . '%')
                            ->orWhere('city', 'like', '%' . $term . '%');
                    });
                }
            });
        }

        $perPage = $request->input('per_page', 10);
        $logs = $query->paginate($perPage);

        // Calculate statistics for the view logs
        $totalViewsCount = CertificateViewLog::count();

        // Get unique countries count and top country
        $locationStats = [
            'uniqueCountriesCount' => CertificateViewLog::whereNotNull('country')->distinct('country')->count('country'),
            'topCountry' => CertificateViewLog::whereNotNull('country')
                ->select('country', \DB::raw('count(*) as total'))
                ->groupBy('country')
                ->orderByDesc('total')
                ->first(),
            'internationalViewsCount' => CertificateViewLog::whereNotNull('country')
                ->where('country', '!=', 'Sri Lanka')
                ->count(),
        ];

        // Calculate device statistics based on user agent
        $mobileCount = CertificateViewLog::whereNotNull('user_agent')
            ->where(function ($query) {
                $query->where('user_agent', 'like', '%Mobile%')
                    ->orWhere('user_agent', 'like', '%Android%')
                    ->orWhere('user_agent', 'like', '%iPhone%')
                    ->orWhere('user_agent', 'like', '%iPad%');
            })
            ->count();

        $desktopCount = CertificateViewLog::whereNotNull('user_agent')
            ->where(function ($query) {
                $query->where('user_agent', 'like', '%Windows%')
                    ->orWhere('user_agent', 'like', '%Macintosh%')
                    ->orWhere('user_agent', 'like', '%Linux%')
                    ->whereNotIn('user_agent', ['%Mobile%', '%Android%', '%iPhone%', '%iPad%']);
            })
            ->count();

        $deviceStats = [
            'mobileCount' => $mobileCount,
            'desktopCount' => $desktopCount,
            'tabletCount' => $totalViewsCount - ($mobileCount + $desktopCount),
        ];

        return Inertia::render('CertificateViewLogs/Index', [
            'logs' => CertificateViewLogResource::collection($logs),
            'params' => array_merge($request->all(), ['page' => 1, 'per_page' => $perPage]),
            'totalViewsCount' => $totalViewsCount,
            'totalCountriesCount' => $locationStats['uniqueCountriesCount'],
            'mostViewedCountry' => $locationStats['topCountry'] ? $locationStats['topCountry']->country : 'N/A',
            'locationStats' => $locationStats,
            'deviceStats' => $deviceStats,
        ]);
    }
    /**
     * Show the form for show a resource.
     */
    public function show(CertificateViewLog $certificateViewLog)
    {
        $this->authorizeAdmin();

        return Inertia::render('CertificateViewLogs/Show', [
            'log' => new CertificateViewLogResource($certificateViewLog),
        ]);
    }

    /**
     * Destroy the specified resource from storage.
     */

    public function destroy(CertificateViewLog $certificateViewLog)
    {
        $this->authorizeAdmin();

        $certificateViewLog->delete();

        return redirect()->route('certificate-view-logs.index')->with('success', 'Certificate view log deleted successfully.');
    }
}
