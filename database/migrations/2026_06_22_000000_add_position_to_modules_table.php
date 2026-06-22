<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('modules') || Schema::hasColumn('modules', 'position')) {
            return;
        }

        Schema::table('modules', function (Blueprint $table) {
            $table->unsignedInteger('position')->default(0)->after('course_id');
            $table->index(['course_id', 'position']);
        });

        DB::table('modules')
            ->select(['id', 'course_id'])
            ->orderBy('course_id')
            ->orderBy('id')
            ->get()
            ->groupBy('course_id')
            ->each(function ($modules): void {
                foreach ($modules->values() as $position => $module) {
                    DB::table('modules')
                        ->where('id', $module->id)
                        ->update(['position' => $position]);
                }
            });
    }

    public function down(): void
    {
        if (! Schema::hasTable('modules') || ! Schema::hasColumn('modules', 'position')) {
            return;
        }

        Schema::table('modules', function (Blueprint $table) {
            $table->dropIndex(['course_id', 'position']);
            $table->dropColumn('position');
        });
    }
};
