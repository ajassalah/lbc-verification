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
        if (!Schema::hasTable('modules')) {
            return;
        }

        Schema::table('modules', function (Blueprint $table) {
            if (!Schema::hasColumn('modules', 'level')) {
                $table->string('level')->nullable()->after('code');
            }

            if (!Schema::hasColumn('modules', 'description')) {
                $table->text('description')->nullable()->after('credit_count');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('modules')) {
            return;
        }

        Schema::table('modules', function (Blueprint $table) {
            $columns = [];

            foreach (['level', 'description'] as $column) {
                if (Schema::hasColumn('modules', $column)) {
                    $columns[] = $column;
                }
            }

            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }
};
