<?php

namespace Database\Seeders;

use App\Models\Learner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class LearnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Define arrays for sample data
        $prefixes = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
        $genders = ['Male', 'Female', 'Other'];
        $proofTypes = ['Passport', 'National ID', 'Driving Licence', 'Other'];
        $countries = [
            'Sri Lanka',
            'United States',
            'United Kingdom',
            'Canada',
            'Australia',
            'India',
            'China',
            'Japan',
            'Germany',
            'France'
        ];

        // Create 15 learners
        for ($i = 0; $i < 15; $i++) {
            $gender = $faker->randomElement($genders);
            $firstName = $gender === 'Male' ? $faker->firstNameMale : $faker->firstNameFemale;
            $middleName = $faker->boolean(70) ? $faker->firstName : '';
            $lastName = $faker->lastName;

            $fullName = $middleName ? "$firstName $middleName $lastName" : "$firstName $lastName";
            $nameWithInitials = strtoupper(substr($firstName, 0, 1)) . '. ' .
                ($middleName ? strtoupper(substr($middleName, 0, 1)) . '. ' : '') .
                $lastName;

            // Generate learner_id with initials and random number
            $initials = strtoupper(substr($firstName, 0, 1)) .
                ($middleName ? strtoupper(substr($middleName, 0, 1)) : '') .
                strtoupper(substr($lastName, 0, 1));
            $learnerId = $initials . '-' . date('Y') . '-' . $faker->unique()->randomNumber(5, true);

            // Create the learner record
            Learner::create([
                'learner_id' => $learnerId,
                'prefix' => $faker->boolean(70) ? $faker->randomElement($prefixes) : null,
                'full_name' => $fullName,
                'name_with_initials' => $nameWithInitials,
                'date_of_birth' => $faker->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
                'profile_picture' => null, // Not setting profile pictures in the seed
                'gender' => $gender,
                'email' => $faker->unique()->safeEmail(),
                'learner_id' => $learnerId,
                'proof_type' => $faker->randomElement($proofTypes),
                'proof_id' => $faker->boolean(50) ? $faker->randomElement(['P', 'B']) . $faker->numerify('#######') : $faker->numerify('ID-########'),
                'phone_no' => $faker->phoneNumber(),
                'address_line_1' => $faker->streetAddress(),
                'address_line_2' => $faker->boolean(30) ? $faker->secondaryAddress() : null,
                'city' => $faker->city(),
                'state' => $faker->state(),
                'postal_code' => $faker->postcode(),
                'country' => $faker->randomElement($countries),
            ]);
        }
    }
}
