<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\User;
use App\Models\Learner;
use App\Models\Course;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all user IDs to randomly assign as certificate creators
        $userIds = User::pluck('id')->toArray();

        // Get all learner and course IDs
        $learnerIds = Learner::pluck('id')->toArray();
        $courseIds = Course::pluck('id')->toArray();

        // If no learners or courses exist, create some basic ones first
        if (empty($learnerIds)) {
            $this->command->info('No learners found. Please run LearnerSeeder first.');
            return;
        }

        if (empty($courseIds)) {
            $this->command->info('No courses found. Please run CourseSeeder first.');
            return;
        }

        // Center names for certificates
        $centers = [
            'Villarica Main Campus',
            'Villarica Online Learning Center',
            'Institute of Advanced Technology',
            'School of Business and Economics',
            'Health Sciences Academy',
        ];

        // Create 50 sample certificates
        for ($i = 0; $i < 50; $i++) {
            // Generate realistic dates
            $endDate = Carbon::now()->subDays(rand(30, 365));
            $startDate = Carbon::parse($endDate)->subMonths(rand(6, 48)); // 6 months to 4 years duration
            $awardingDate = Carbon::parse($endDate)->addDays(rand(10, 30));

            // Create the certificate with new structure
            Certificate::create([
                'learner_id' => $learnerIds[array_rand($learnerIds)],
                'course_id' => $courseIds[array_rand($courseIds)],
                'reference_no' => 'VRC-' . strtoupper(Str::random(3)) . '-' . rand(10000, 99999),
                'course_start_date' => $startDate->format('Y-m-d'),
                'course_end_date' => $endDate->format('Y-m-d'),
                'awarding_date' => $awardingDate->format('Y-m-d'),
                'center_name' => $centers[array_rand($centers)],
                'status' => ['Pending', 'Verified'][rand(0, 1)],
                'created_by' => $userIds[array_rand($userIds)],
                'gender' => ['Male', 'Female', 'Other'][rand(0, 2)],
                'country' => ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Philippines'][rand(0, 5)],
                'cumulative_credits_earned' => rand(20, 120),
                'cumulative_grade_point_average' => round(rand(250, 1000) / 100, 2), // GPA between 2.50 and 10.00
                'modules_data' => json_encode(['year_1' => ['modules' => ['Module 1', 'Module 2']], 'year_2' => ['modules' => ['Module 3', 'Module 4']]]),
            ]);
        }
    }
}
