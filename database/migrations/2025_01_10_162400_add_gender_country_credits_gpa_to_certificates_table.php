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

        Schema::table('certificates', function (Blueprint $table) {
            if (!Schema::hasColumn('certificates', 'gender')) {
                $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            }

            if (!Schema::hasColumn('certificates', 'country')) {
                $table->string('country')->nullable();
            }

            if (!Schema::hasColumn('certificates', 'cumulative_credits_earned')) {
                $table->integer('cumulative_credits_earned')->nullable();
            }

            if (!Schema::hasColumn('certificates', 'cumulative_grade_point_average')) {
                $table->decimal('cumulative_grade_point_average', 1, 1)->nullable();
            }
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

        Schema::table('certificates', function (Blueprint $table) {
            $columns = [];

            foreach (['gender', 'country', 'cumulative_credits_earned', 'cumulative_grade_point_average'] as $column) {
                if (Schema::hasColumn('certificates', $column)) {
                    $columns[] = $column;
                }
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};
