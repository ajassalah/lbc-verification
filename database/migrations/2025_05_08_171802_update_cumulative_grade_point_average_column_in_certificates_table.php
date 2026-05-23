<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Change the decimal precision for cumulative_grade_point_average from (1,1) to (3,2)
     * This allows for values from 0.00 to 9.99, covering the GPA range of 0 to 4.0
     */
    public function up(): void
    {
        if (!Schema::hasTable('certificates') || !Schema::hasColumn('certificates', 'cumulative_grade_point_average')) {
            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            $table->decimal('cumulative_grade_point_average', 4, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('certificates') || !Schema::hasColumn('certificates', 'cumulative_grade_point_average')) {
            return;
        }

        // First, handle existing data that would be out of range for decimal(1,1)
        // Option 1: Set values > 0.9 to NULL
        DB::table('certificates')
            ->where('cumulative_grade_point_average', '>', 0.9)
            ->update(['cumulative_grade_point_average' => null]);

        // Option 2: Alternatively, cap values at 0.9
        // DB::table('certificates')
        //     ->where('cumulative_grade_point_average', '>', 0.9)
        //     ->update(['cumulative_grade_point_average' => 0.9]);

        Schema::table('certificates', function (Blueprint $table) {
            $table->decimal('cumulative_grade_point_average', 1, 1)->nullable()->change();
        });
    }
};
