<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CertificateViewLogController;
use App\Http\Controllers\CenterController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DataOptionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LearnerController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OldCertificateController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/certificates/search', [CertificateController::class, 'search'])->name('certificates.search');

// Added the route show reference number in url 
Route::get('/certificates/verify/reference_no={reference_no}', [CertificateController::class, 'verify'])
    ->where('reference_no', '.*')
    ->name('certificates.verify');

// Certificate PDF generation route
Route::get('/certificates/{certificate}/pdf', [CertificateController::class, 'generatePDF'])->name('certificates.pdf');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/modules/by-course/{courseId}', [ModuleController::class, 'getModulesByCourse'])->name('modules.by-course');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::get('/notifications/{id}/view', [NotificationController::class, 'view'])->name('notifications.view');

    Route::resource('/certificates', CertificateController::class);
    Route::resource('/old-certificates', OldCertificateController::class);
    Route::resource('/users', UserController::class);
    Route::resource('/certificate-view-logs', CertificateViewLogController::class);
    Route::resource('/centers', CenterController::class)->except(['show']);
    Route::get('/data', [DataOptionController::class, 'index'])->name('data.index');
    Route::post('/data/options', [DataOptionController::class, 'store'])->name('data-options.store');
    Route::delete('/data/options', [DataOptionController::class, 'destroy'])->name('data-options.destroy');
    Route::get('/learners/{learner}/documents/{document}', [LearnerController::class, 'document'])->name('learners.documents.show');
    Route::resource('/courses', CourseController::class);
    Route::resource('/modules', ModuleController::class)->except(['index', 'create', 'store', 'show']);
    // Added route to fetch modules by course
    Route::get('/modules/course/{courseId}', [ModuleController::class, 'getModulesByCourse'])->name('modules.byCourse');
    Route::resource('/learners', LearnerController::class);
});

require __DIR__ . '/auth.php';
