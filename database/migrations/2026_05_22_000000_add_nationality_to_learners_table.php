<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('learners') || Schema::hasColumn('learners', 'nationality')) {
            return;
        }

        Schema::table('learners', function (Blueprint $table) {
            $table->string('nationality')->nullable()->after('country');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('learners') || ! Schema::hasColumn('learners', 'nationality')) {
            return;
        }

        Schema::table('learners', function (Blueprint $table) {
            $table->dropColumn('nationality');
        });
    }
};
