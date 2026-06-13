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
        if (Schema::hasTable('learners')) {
            return;
        }

        Schema::create('learners', function (Blueprint $table) {
            $table->id();
            $table->string('prefix')->nullable();
            $table->string('full_name');
            $table->string('name_with_initials');
            $table->date('date_of_birth');
            $table->string('profile_picture')->nullable();
            $table->string('gender');
            $table->string('email');
            $table->string('learner_id')->unique();
            $table->string('proof_type');
            $table->string('proof_id');
            $table->string('id_proof_document')->nullable(); // For uploading ID proof document PDF
            $table->string('cv_document')->nullable(); // For uploading CV PDF
            $table->string('phone_no')->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();
            $table->string('nationality')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learners');
    }
};
