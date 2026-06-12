<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create or refresh the highest-level admin user.
        User::updateOrCreate(
            ['email' => 'admin@ukeeverification.com'],
            [
                'name' => 'Super Admin',
                'role' => 'admin',
                'password' => 'SuperAdmin@2026!',
                'email_verified_at' => now(),
                'allow_manual_learner_id' => true,
                'allow_manual_certificate_reference' => true,
            ]
        );

        $this->call([
            CourseSeeder::class,
        ]);

        // Demo data depends on fakerphp/faker, which is not installed in production.
        if (app()->environment(['local', 'testing']) && class_exists(\Faker\Factory::class)) {
            $this->call([
                LearnerSeeder::class,
                CertificateSeeder::class,
            ]);
        }
    }
}
