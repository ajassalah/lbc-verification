<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('certificates')) {
            return;
        }

        if (!Schema::hasColumn('certificates', 'course_start_date') || !Schema::hasColumn('certificates', 'course_end_date')) {
            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            $table->date('course_start_date')->nullable()->change();
            $table->date('course_end_date')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('certificates')) {
            return;
        }

        if (!Schema::hasColumn('certificates', 'course_start_date') || !Schema::hasColumn('certificates', 'course_end_date')) {
            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            $table->date('course_start_date')->nullable(false)->change();
            $table->date('course_end_date')->nullable(false)->change();
        });
    }
};
