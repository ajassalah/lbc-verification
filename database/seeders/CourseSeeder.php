<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define course data
        $courses = [
            [
                'name' => 'Computer Science',
                'code' => 'CS-BSC',
                'description' => 'A comprehensive program covering algorithms, programming languages, artificial intelligence, and software engineering.',
                'entry_requirements' => 'High school diploma or equivalent with strong mathematics background',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 9500.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Science and Technology',
                'modules' => [
                    // Year 1
                    ['name' => 'Introduction to Programming', 'code' => 'CS101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Data Structures and Algorithms', 'code' => 'CS102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Computer Architecture', 'code' => 'CS103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Mathematics for Computing', 'code' => 'CS104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Database Systems', 'code' => 'CS201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Software Engineering', 'code' => 'CS202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Operating Systems', 'code' => 'CS203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Web Development', 'code' => 'CS204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Artificial Intelligence', 'code' => 'CS301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Computer Networks', 'code' => 'CS302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Information Security', 'code' => 'CS303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Final Year Project', 'code' => 'CS304', 'unit_count' => 2, 'credit_count' => 30, 'year' => 3],
                ],
            ],
            [
                'name' => 'Business Administration',
                'code' => 'BA-BSC',
                'description' => 'A program focusing on management principles, organizational behavior, marketing, finance, and entrepreneurship.',
                'entry_requirements' => 'High school diploma or equivalent with good communication skills',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 8800.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Business and Economics',
                'modules' => [
                    // Year 1
                    ['name' => 'Principles of Management', 'code' => 'BA101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Introduction to Economics', 'code' => 'BA102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Business Mathematics', 'code' => 'BA103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Business Communication', 'code' => 'BA104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Financial Accounting', 'code' => 'BA201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Marketing Management', 'code' => 'BA202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Human Resource Management', 'code' => 'BA203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Business Law', 'code' => 'BA204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Strategic Management', 'code' => 'BA301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Entrepreneurship', 'code' => 'BA302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'International Business', 'code' => 'BA303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Business Analytics', 'code' => 'BA304', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                ],
            ],
            [
                'name' => 'Mechanical Engineering',
                'code' => 'ME-BEng',
                'description' => 'Study of design, manufacturing, and operation of mechanical systems including thermodynamics, materials science, and structural analysis.',
                'entry_requirements' => 'High school diploma with strong mathematics and physics background',
                'level' => 'Undergraduate',
                'duration' => 48, // 4 years
                'fee' => 10500.00,
                'total_credits' => 240,
                'faculty' => 'Faculty of Engineering',
                'modules' => [
                    // Year 1
                    ['name' => 'Engineering Mathematics I', 'code' => 'ME101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Engineering Mechanics', 'code' => 'ME102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Materials Science', 'code' => 'ME103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Engineering Drawing & CAD', 'code' => 'ME104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Thermodynamics', 'code' => 'ME201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Fluid Mechanics', 'code' => 'ME202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Manufacturing Processes', 'code' => 'ME203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Machine Design', 'code' => 'ME204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Heat Transfer', 'code' => 'ME301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Control Systems', 'code' => 'ME302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Mechanical Vibrations', 'code' => 'ME303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Automotive Engineering', 'code' => 'ME304', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    // Year 4
                    ['name' => 'Robotics', 'code' => 'ME401', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Advanced Manufacturing', 'code' => 'ME402', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Engineering Project Management', 'code' => 'ME403', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Final Year Engineering Project', 'code' => 'ME404', 'unit_count' => 2, 'credit_count' => 30, 'year' => 4],
                ],
            ],
            [
                'name' => 'Psychology',
                'code' => 'PSY-BSc',
                'description' => 'Study of human behavior and mental processes, including cognitive, social, developmental, and clinical psychology.',
                'entry_requirements' => 'High school diploma with good science background',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 9200.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Social Sciences',
                'modules' => [
                    // Year 1
                    ['name' => 'Introduction to Psychology', 'code' => 'PSY101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Research Methods', 'code' => 'PSY102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Biological Psychology', 'code' => 'PSY103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Psychology of Learning', 'code' => 'PSY104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Cognitive Psychology', 'code' => 'PSY201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Developmental Psychology', 'code' => 'PSY202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Social Psychology', 'code' => 'PSY203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Personality Psychology', 'code' => 'PSY204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Clinical Psychology', 'code' => 'PSY301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Abnormal Psychology', 'code' => 'PSY302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Counseling Psychology', 'code' => 'PSY303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Psychology Research Project', 'code' => 'PSY304', 'unit_count' => 2, 'credit_count' => 30, 'year' => 3],
                ],
            ],
            [
                'name' => 'Graphic Design',
                'code' => 'GD-BA',
                'description' => 'Study of visual communication and design principles for print and digital media, including typography, layout, and branding.',
                'entry_requirements' => 'Portfolio submission and high school diploma',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 8900.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Arts and Design',
                'modules' => [
                    // Year 1
                    ['name' => 'Design Fundamentals', 'code' => 'GD101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Typography I', 'code' => 'GD102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Digital Imaging', 'code' => 'GD103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Drawing for Design', 'code' => 'GD104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Typography II', 'code' => 'GD201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Web Design', 'code' => 'GD202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Branding & Identity', 'code' => 'GD203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Packaging Design', 'code' => 'GD204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Motion Graphics', 'code' => 'GD301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'UX/UI Design', 'code' => 'GD302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Design for Social Impact', 'code' => 'GD303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Portfolio Development', 'code' => 'GD304', 'unit_count' => 2, 'credit_count' => 30, 'year' => 3],
                ],
            ],
            [
                'name' => 'Nursing',
                'code' => 'NUR-BSN',
                'description' => 'Professional program preparing students for careers in healthcare, focusing on patient care, medical knowledge, and clinical skills.',
                'entry_requirements' => 'High school diploma with strong science background and health clearance',
                'level' => 'Undergraduate',
                'duration' => 48, // 4 years
                'fee' => 10800.00,
                'total_credits' => 240,
                'faculty' => 'Faculty of Health Sciences',
                'modules' => [
                    // Year 1
                    ['name' => 'Anatomy and Physiology', 'code' => 'NUR101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Foundations of Nursing', 'code' => 'NUR102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Health Assessment', 'code' => 'NUR103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Medical Terminology', 'code' => 'NUR104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Pharmacology', 'code' => 'NUR201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Adult Nursing I', 'code' => 'NUR202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Mental Health Nursing', 'code' => 'NUR203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Clinical Practice I', 'code' => 'NUR204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Adult Nursing II', 'code' => 'NUR301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Maternal and Child Health', 'code' => 'NUR302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Nursing Research', 'code' => 'NUR303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Clinical Practice II', 'code' => 'NUR304', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    // Year 4
                    ['name' => 'Critical Care Nursing', 'code' => 'NUR401', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Community Health Nursing', 'code' => 'NUR402', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Nursing Leadership', 'code' => 'NUR403', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Clinical Placement', 'code' => 'NUR404', 'unit_count' => 2, 'credit_count' => 30, 'year' => 4],
                ],
            ],
            [
                'name' => 'Civil Engineering',
                'code' => 'CE-BEng',
                'description' => 'Study of design, construction, and maintenance of infrastructure including buildings, bridges, roads, and water systems.',
                'entry_requirements' => 'High school diploma with strong mathematics and physics background',
                'level' => 'Undergraduate',
                'duration' => 48, // 4 years
                'fee' => 10500.00,
                'total_credits' => 240,
                'faculty' => 'Faculty of Engineering',
                'modules' => [
                    // Year 1
                    ['name' => 'Engineering Mathematics', 'code' => 'CE101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Structural Mechanics', 'code' => 'CE102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Engineering Geology', 'code' => 'CE103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Civil Engineering Drawing', 'code' => 'CE104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Structural Analysis', 'code' => 'CE201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Soil Mechanics', 'code' => 'CE202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Construction Materials', 'code' => 'CE203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Hydraulics', 'code' => 'CE204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Reinforced Concrete Design', 'code' => 'CE301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Steel Structure Design', 'code' => 'CE302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Highway Engineering', 'code' => 'CE303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Water Resources Engineering', 'code' => 'CE304', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    // Year 4
                    ['name' => 'Foundation Engineering', 'code' => 'CE401', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Construction Management', 'code' => 'CE402', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Environmental Engineering', 'code' => 'CE403', 'unit_count' => 1, 'credit_count' => 15, 'year' => 4],
                    ['name' => 'Final Year Design Project', 'code' => 'CE404', 'unit_count' => 2, 'credit_count' => 30, 'year' => 4],
                ],
            ],
            [
                'name' => 'English Literature',
                'code' => 'EL-BA',
                'description' => 'Study of literary works in English, focusing on critical analysis, literary theory, and historical context.',
                'entry_requirements' => 'High school diploma with strong English language skills',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 8200.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Arts and Humanities',
                'modules' => [
                    // Year 1
                    ['name' => 'Introduction to Literary Studies', 'code' => 'EL101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Classical Literature', 'code' => 'EL102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Poetry and Poetics', 'code' => 'EL103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Narrative Fiction', 'code' => 'EL104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Shakespeare and Renaissance Drama', 'code' => 'EL201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Romanticism', 'code' => 'EL202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Victorian Literature', 'code' => 'EL203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Literary Theory', 'code' => 'EL204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Modernism', 'code' => 'EL301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Postcolonial Literature', 'code' => 'EL302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Contemporary Fiction', 'code' => 'EL303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Dissertation', 'code' => 'EL304', 'unit_count' => 2, 'credit_count' => 30, 'year' => 3],
                ],
            ],
            [
                'name' => 'Economics',
                'code' => 'ECON-BSc',
                'description' => 'Study of resource allocation, market behavior, production, and consumption patterns in society.',
                'entry_requirements' => 'High school diploma with strong mathematics background',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 9000.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Business and Economics',
                'modules' => [
                    // Year 1
                    ['name' => 'Principles of Microeconomics', 'code' => 'ECON101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Principles of Macroeconomics', 'code' => 'ECON102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Mathematics for Economics', 'code' => 'ECON103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Statistics for Economics', 'code' => 'ECON104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Intermediate Microeconomics', 'code' => 'ECON201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Intermediate Macroeconomics', 'code' => 'ECON202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Econometrics', 'code' => 'ECON203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'International Economics', 'code' => 'ECON204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Development Economics', 'code' => 'ECON301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Public Economics', 'code' => 'ECON302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Behavioral Economics', 'code' => 'ECON303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Economics Research Project', 'code' => 'ECON304', 'unit_count' => 2, 'credit_count' => 30, 'year' => 3],
                ],
            ],
            [
                'name' => 'Environmental Science',
                'code' => 'ENV-BSc',
                'description' => 'Interdisciplinary study of environmental issues, ecosystems, conservation, and sustainable resource management.',
                'entry_requirements' => 'High school diploma with strong science background',
                'level' => 'Undergraduate',
                'duration' => 36, // 3 years
                'fee' => 9300.00,
                'total_credits' => 180,
                'faculty' => 'Faculty of Science and Technology',
                'modules' => [
                    // Year 1
                    ['name' => 'Introduction to Environmental Science', 'code' => 'ENV101', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Ecology', 'code' => 'ENV102', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Earth Systems Science', 'code' => 'ENV103', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    ['name' => 'Environmental Chemistry', 'code' => 'ENV104', 'unit_count' => 1, 'credit_count' => 15, 'year' => 1],
                    // Year 2
                    ['name' => 'Conservation Biology', 'code' => 'ENV201', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Climate Change Science', 'code' => 'ENV202', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Environmental Policy', 'code' => 'ENV203', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    ['name' => 'Geographic Information Systems', 'code' => 'ENV204', 'unit_count' => 1, 'credit_count' => 15, 'year' => 2],
                    // Year 3
                    ['name' => 'Sustainable Resource Management', 'code' => 'ENV301', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Environmental Impact Assessment', 'code' => 'ENV302', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Pollution Control', 'code' => 'ENV303', 'unit_count' => 1, 'credit_count' => 15, 'year' => 3],
                    ['name' => 'Environmental Research Project', 'code' => 'ENV304', 'unit_count' => 2, 'credit_count' => 30, 'year' => 3],
                ],
            ],
        ];

        // Create courses and modules
        foreach ($courses as $courseData) {
            $modules = $courseData['modules'];
            unset($courseData['modules']);

            $courseData['slug'] = Str::slug($courseData['name']);

            $course = Course::updateOrCreate(
                ['code' => $courseData['code']],
                $courseData
            );

            // Create modules for the course
            foreach ($modules as $moduleData) {
                $moduleData['course_id'] = $course->id;

                Module::updateOrCreate(
                    ['code' => $moduleData['code']],
                    $moduleData
                );
            }
        }
    }
}
