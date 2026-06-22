<?php

use App\Models\Course;
use App\Services\CourseCertificateSynchronizer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('courses') || ! Schema::hasTable('certificates')) {
            return;
        }

        $synchronizer = app(CourseCertificateSynchronizer::class);

        Course::query()->eachById(
            fn (Course $course) => $synchronizer->sync($course)
        );
    }

    public function down(): void
    {
        // Transcript snapshots cannot be restored after synchronization.
    }
};
