<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'course_start_date')) {
                $table->date('course_start_date')->nullable()->after('faculty');
            }

            if (!Schema::hasColumn('courses', 'course_end_date')) {
                $table->date('course_end_date')->nullable()->after('course_start_date');
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('courses')) {
            return;
        }

        Schema::table('courses', function (Blueprint $table) {
            $columns = [];

            foreach (['course_start_date', 'course_end_date'] as $column) {
                if (Schema::hasColumn('courses', $column)) {
                    $columns[] = $column;
                }
            }

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
