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
            if (! Schema::hasColumn('certificates', 'grade')) {
                $table->string('grade')->nullable()->after('status');
            }

            if (! Schema::hasColumn('certificates', 'date_of_exam')) {
                $table->date('date_of_exam')->nullable()->after('awarding_date');
            }

            if (Schema::hasColumn('certificates', 'center_name')) {
                $table->string('center_name')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('certificates')) {
            return;
        }

        Schema::table('certificates', function (Blueprint $table) {
            if (Schema::hasColumn('certificates', 'grade')) {
                $table->dropColumn('grade');
            }

            if (Schema::hasColumn('certificates', 'date_of_exam')) {
                $table->dropColumn('date_of_exam');
            }
        });
    }
};
