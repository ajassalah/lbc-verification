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
        if (Schema::hasTable('old_certificates')) {
            return;
        }

        Schema::create('old_certificates', function (Blueprint $table) {
            $table->id();
            $table->string('student_id');
            $table->string('student_name');
            $table->string('student_email')->nullable();
            $table->string('student_phone')->nullable();
            $table->string('student_address')->nullable();
            $table->string('student_dob')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('country')->nullable();
            $table->integer('cumulative_credits_earned')->nullable();
            $table->decimal('cumulative_grade_point_average', 3, 1)->nullable();
            $table->enum('proof_type', ['Nic', 'Passport', 'Driving_license', 'Aadhar', 'Pan', 'Voter']);
            $table->string('proof_id');
            $table->string('reference_no');
            $table->string('course_name');
            $table->string('course_duration');
            $table->string('course_start_date');
            $table->string('course_end_date');
            $table->string('awarding_date');
            $table->string('center_name');
            $table->enum('status', ['Pending', 'Verified'])->default('Pending');
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('old_certificates');
    }
};
