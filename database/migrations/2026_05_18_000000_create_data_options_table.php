<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_options', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('value');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['type', 'value']);
            $table->index('type');
        });

        $now = now();
        $rows = [];

        foreach ([
            'School of Engineering',
            'School of Business',
            'School of Arts',
            'School of Computer Science',
            'School of Medicine',
            'School of Law',
            'School of Education',
        ] as $index => $value) {
            $rows[] = ['type' => 'course_faculty', 'value' => $value, 'sort_order' => $index + 1, 'created_at' => $now, 'updated_at' => $now];
        }

        foreach (['3', '4', '5', '6', '7'] as $index => $value) {
            $rows[] = ['type' => 'module_level', 'value' => $value, 'sort_order' => $index + 1, 'created_at' => $now, 'updated_at' => $now];
        }

        DB::table('data_options')->insert($rows);
    }

    public function down(): void
    {
        Schema::dropIfExists('data_options');
    }
};
