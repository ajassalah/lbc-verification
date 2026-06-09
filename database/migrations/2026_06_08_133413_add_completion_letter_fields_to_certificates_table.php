<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('certificates')) {
            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            if (! Schema::hasColumn('certificates', 'completion_letter_date')) {
                $table->date('completion_letter_date')->nullable()->after('date_of_exam');
            }

            if (! Schema::hasColumn('certificates', 'medium_of_instruction')) {
                $table->string('medium_of_instruction')->nullable()->after('completion_letter_date');
            }

            if (! Schema::hasColumn('certificates', 'mode_of_study')) {
                $table->string('mode_of_study')->nullable()->after('medium_of_instruction');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('certificates')) {
            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            foreach (['completion_letter_date', 'medium_of_instruction', 'mode_of_study'] as $column) {
                if (Schema::hasColumn('certificates', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
