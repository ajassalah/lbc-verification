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
        if (Schema::hasTable('certificates')) {
            return;
        }

        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learner_id')->nullable();
            $table->foreignId('course_id')->nullable();
            $table->string('reference_no');
            $table->date('course_start_date');
            $table->date('course_end_date');
            $table->date('awarding_date');
            $table->date('date_of_exam')->nullable();
            $table->string('specialization')->nullable();
            $table->string('center_name')->nullable();
            $table->enum('status', ['Pending', 'Verified'])->default('Pending');
            $table->string('grade')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('country')->nullable();
            $table->integer('cumulative_credits_earned')->nullable();
            $table->decimal('cumulative_grade_point_average', 4, 2)->nullable();
            $table->json('modules_data')->nullable()->comment('JSON structure containing yearly module data');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
