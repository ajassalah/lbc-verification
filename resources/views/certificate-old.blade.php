<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Old Certificate</title>
    <link rel="icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc" type="image/png">
    <link rel="shortcut icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bree+Serif&family=Caprasimo&family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Slab:wght@100..900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: 540pt 780pt;
            margin: 0;
            padding: 0;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            color: #1f2933;
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 10pt;
        }

        .page {
            width: 540pt;
            height: 780pt;
            position: relative;
            overflow: hidden;
        }

        .page:not(:last-child) {
            page-break-after: always;
        }

        .background {
            position: absolute;
            top: 0;
            left: 0;
            width: 540pt;
            height: 780pt;
            z-index: -1;
        }

        .center {
            text-align: center;
        }

        .bold {
            font-weight: 700;
        }

        .cert-course {
            position: absolute;
            top: 164pt;
            left: 110pt;
            width: 320pt;
            color: #444;
            font-weight: 900;
            line-height: 1.16;
        }

        .cert-course .course-primary {
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 36px;
            font-weight: 900;
        }

        .cert-course .course-secondary {
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 36px;
            font-weight: 900;
        }

        .cert-course .course-line {
            position: relative;
            height: 39px;
            line-height: 1;
        }

        .cert-course .course-line span {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
        }

        .cert-course .course-line .offset-left {
            left: -0.65pt;
        }

        .cert-course .course-line .offset-right {
            left: 0.65pt;
        }

        .cert-course .course-line .offset-top {
            top: -0.35pt;
        }

        .cert-course .course-line .offset-bottom {
            top: 0.35pt;
        }

        .cert-course .small {
            display: block;
            margin: 4pt 0;
            color: #444;
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 18px;
            font-weight: 400;
        }

        .cert-awarded {
            position: absolute;
            top: 300pt;
            left: 0;
            width: 540pt;
            color: #444;
            font-size: 18px;
        }

        .cert-name {
            position: absolute;
            top: 330pt;
            left: 40pt;
            width: 460pt;
            color: #444;
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 20px;
            font-weight: 700;
        }

        .cert-body {
            position: absolute;
            top: 375pt;
            left: 120pt;
            width: 300pt;
            color: #444;
            font-size: 18px;
            line-height: 1.18;
        }

        .cert-grade {
            position: absolute;
            top: 485pt;
            left: 200pt;
            width: 140pt;
            color: #444;
            font-size: 18px;
            font-weight: 700;
        }

        .cert-date {
            position: absolute;
            top: 520pt;
            left: 190pt;
            width: 160pt;
            color: #444;
            font-size: 18px;
        }

        .summary-value-bg {
            position: absolute;
            top: 130pt;
            left: 174pt;
            width: 345pt;
            height: 90pt;
            background: #ecece8e1;
        }

        .transcript-summary {
            position: absolute;
            top: 128pt;
            left: 36pt;
            width: 474pt;
            color: #000000;
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 8.4pt;
            line-height: 1.22;
            z-index: 1;
        }

        .transcript-summary .label {
            display: inline-block;
            width: 140pt;
        }

        .transcript-summary .value {
            color: #000000;
        }

        .table-column-bg {
            display: none;
        }

        .table-column-bg.ref {
            left: 24pt;
            width: 72pt;
        }

        .table-column-bg.module {
            left: 112pt;
            width: 236pt;
        }

        .table-column-bg.level {
            left: 362pt;
            width: 42pt;
        }

        .table-column-bg.points {
            left: 418pt;
            width: 48pt;
        }

        .table-column-bg.grade {
            left: 480pt;
            width: 42pt;
        }

        .transcript-table {
            position: absolute;
            top: 236pt;
            left: 24pt;
            width: 498pt;
            table-layout: auto;
            border-collapse: separate;
            border-spacing: 10pt 0;
            color: #000000;
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 8.2pt;
        }

        .transcript-table th {
            padding: 7pt 6pt;
            background: #ecece8e1;
            color: #000000;
            font-weight: 700;
            text-align: center;
            border: 0;
        }

        .transcript-table td {
            padding: 2.5pt 6pt;
            vertical-align: top;
            background: #ecece8e1;
            border: 0;
        }

        .transcript-table .ref {
            width: 1%;
            text-align: left;
            white-space: nowrap;
        }

        .transcript-table .module {
            width: auto;
            text-align: left;
            padding-left: 12pt;
        }

        .transcript-table .level {
            width: 1%;
            text-align: center;
            white-space: nowrap;
        }

        .transcript-table .points {
            width: 1%;
            text-align: center;
            white-space: nowrap;
        }

        .transcript-table .grade {
            width: 1%;
            text-align: center;
            white-space: nowrap;
        }

        .transcript-table .empty-row td {
            height: 12pt;
            padding-top: 0;
            padding-bottom: 0;
            background: transparent;
        }

        .final-assessment {
            position: absolute;
            top: 580pt;
            left: 112pt;
            width: 360pt;
            font-family: 'Poppins', DejaVu Sans, Arial, sans-serif;
            font-size: 8pt;
            line-height: 1.35;
            font-weight: 400;
        }

        .final-assessment .award {
            display: inline;
            margin-left: 0;
            max-width: none;
            color: #000;
            font-size: 8pt;
            font-weight: 700;
            text-transform: uppercase;
        }


        .qualified-line {
            position: absolute;
            top: 675pt;
            left: 120pt;
            width: 300pt;
            font-size: 8pt;
            font-style: italic;
            font-weight: 700;
            text-align: center;
        }

        .letter-date {
            position: absolute;
            top: 185pt;
            left: 48pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
        }

        .student-info-title {
            position: absolute;
            top: 224pt;
            left: 48pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            font-weight: 700;
            text-decoration: underline;
        }

        .letter-info {
            position: absolute;
            top: 247pt;
            left: 48pt;
            width: 390pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            line-height: 1.22;
        }

        .letter-info .label {
            display: inline-block;
            width: 108pt;
        }

        .course-info .label {
            display: inline-block;
            width: 132pt;
        }

        .letter-heading {
            position: absolute;
            left: 48pt;
            width: 420pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            font-weight: 700;
        }

        .letter-body {
            position: absolute;
            top: 405pt;
            left: 48pt;
            width: 480pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            line-height: 1.12;
            font-weight: 400;
        }

        .course-info {
            position: absolute;
            top: 465pt;
            left: 48pt;
            width: 480pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            line-height: 1.15;
        }

        .letter-close {
            position: absolute;
            top: 600pt;
            left: 48pt;
            width: 420pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            line-height: 1.2;
        }

        .letter-signoff {
            position: absolute;
            top: 638pt;
            left: 48pt;
            width: 170pt;
            font-family: "Times New Roman", Times, DejaVu Serif, serif;
            font-size: 12pt;
            line-height: 1.1;
        }

        .letter-signature-img {
            display: block;
            width: 78pt;
            height: auto;
            margin-top: 6pt;
            margin-bottom: 2pt;
        }
    </style>
</head>

<body>
    @php
        $readImage = function (string $path): string {
            return 'data:image/jpeg;base64,' . base64_encode(file_get_contents(storage_path($path)));
        };

        $certificateBackground = $readImage('certificate/Old certificate/LBC Certificate-01.jpg');
        $transcriptBackground = $readImage('certificate/Old certificate/LBC Transcript-01.jpg');
        $letterBackground = $readImage('certificate/Old certificate/LBC Compltion Letter-01.jpg');
        $letterSignature = $readImage('certificate/Old certificate/Signature HD-01.png');
        $printCopyOld = (bool) ($printCopyOld ?? false);

        $parseDate = function ($date) {
            if (! $date) {
                return null;
            }

            try {
                return \Carbon\Carbon::parse($date);
            } catch (\Throwable $exception) {
                return null;
            }
        };

        $ordinalDay = function (\Carbon\Carbon $date, bool $pad = false): string {
            $day = (int) $date->format('j');
            $suffix = 'th';

            if (! in_array($day % 100, [11, 12, 13], true)) {
                $suffix = match ($day % 10) {
                    1 => 'st',
                    2 => 'nd',
                    3 => 'rd',
                    default => 'th',
                };
            }

            return ($pad ? $date->format('d') : (string) $day) . $suffix;
        };

        $formatOrdinalDate = function ($date, bool $withComma = false, bool $padDay = false) use ($parseDate, $ordinalDay): string {
            $parsed = $parseDate($date);

            if (! $parsed) {
                return '';
            }

            return $ordinalDay($parsed, $padDay) . ' of ' . $parsed->format('F') . ($withComma ? ', ' : ' ') . $parsed->format('Y');
        };

        $formatMonthYear = function ($date) use ($parseDate): string {
            $parsed = $parseDate($date);

            return $parsed ? $parsed->format('F Y') : '';
        };

        $formatSlashDate = function ($date) use ($parseDate): string {
            $parsed = $parseDate($date);

            return $parsed ? $parsed->format('d/m/Y') : '';
        };

        $formatDuration = function ($duration): string {
            if ($duration === null || $duration === '') {
                return '';
            }

            if (is_numeric($duration)) {
                return (int) $duration . ' ' . ((int) $duration === 1 ? 'Month' : 'Months');
            }

            return (string) $duration;
        };

        $formatLevel = function ($level): string {
            if ($level === null || $level === '') {
                return '';
            }

            return trim(preg_replace('/^Level\s*/i', '', (string) $level));
        };

        $pointsForGrade = function ($grade): string {
            return [
                'A+' => '5.00',
                'A' => '4.00',
                'B' => '3.00',
                'C' => '2.00',
                'D' => '1.00',
                'E' => 'Absent',
            ][strtoupper((string) $grade)] ?? '';
        };

        $courseName = $course->name ?? '';
        $courseDuration = $formatDuration($course->duration ?? null);
        $learnerName = $learner->full_name ?? '';
        $referenceNumber = $certificate->reference_no ?? '';
        $awardedMonthYear = $formatMonthYear($certificate->awarding_date);
        $grade = $certificate->grade ?? '';
        $dateOfBirthLong = $formatOrdinalDate($learner->date_of_birth ?? null);
        $dateOfBirthShort = $formatSlashDate($learner->date_of_birth ?? null);
        $startDateLong = $formatOrdinalDate($certificate->course_start_date, true);
        $examDateLong = $formatOrdinalDate($certificate->date_of_exam, true, true);
        $letterStartDate = $formatMonthYear($certificate->course_start_date);
        $letterEndDate = $formatMonthYear($certificate->course_end_date);

        $courseParts = preg_split('/\s+in\s+/i', $courseName, 2);
        $certificateCourseLines = count($courseParts) === 2
            ? [
                'primary' => $courseParts[0],
                'secondary' => preg_split('/\s+/', trim($courseParts[1])),
            ]
            : [$courseName];
        $courseTitleLine = function (string $text, string $class): string {
            $escaped = e($text);

            return <<<HTML
                <div class="{$class} course-line">
                    <span class="offset-left">{$escaped}</span>
                    <span class="offset-right">{$escaped}</span>
                    <span class="offset-top">{$escaped}</span>
                    <span class="offset-bottom">{$escaped}</span>
                    <span>{$escaped}</span>
                </div>
            HTML;
        };

        $modulesData = is_array($certificate->modules_data) ? $certificate->modules_data : json_decode($certificate->modules_data ?: '{}', true);
        $years = $modulesData['years'] ?? [];
        $allModules = collect($years)->flatMap(fn ($year) => $year['modules'] ?? [])->values();

        $gender = strtolower((string) ($learner->gender ?? ''));
        $subjectPronoun = $gender === 'female' ? 'She' : 'He';
        $possessivePronoun = $gender === 'female' ? 'Her' : 'His';
    @endphp

    <div class="page">
        <img class="background" src="{{ $certificateBackground }}" alt="">

        <div class="cert-course center">
            @if(isset($certificateCourseLines['primary']))
                {!! $courseTitleLine($certificateCourseLines['primary'], 'course-primary') !!}
                <span class="small">in</span>
                @foreach($certificateCourseLines['secondary'] as $line)
                    {!! $courseTitleLine($line, 'course-secondary') !!}
                @endforeach
            @else
                {!! $courseTitleLine($courseName, 'course-primary') !!}
            @endif
        </div>

        <div class="cert-awarded center">is awarded to</div>
        <div class="cert-name center">{{ $learnerName }}</div>
        <div class="cert-body center">
            who has fulfilled the<br>
            course requirements of the institution of<br>
            <span class="bold">{{ $courseName }}</span><br>
            examination with an overall grading of
        </div>
        <div class="cert-grade center">"{{ $grade }}"</div>
        <div class="cert-date center">{{ $awardedMonthYear }}</div>
    </div>

    <div class="page">
        <img class="background" src="{{ $transcriptBackground }}" alt="">

        <div class="summary-value-bg"></div>

        <div class="transcript-summary">
            <div><span class="label">Name</span>: <span class="value">{{ $learnerName }}</span></div>
            <div><span class="label">Reference</span>: <span class="value">{{ $referenceNumber }}</span></div>
            <div><span class="label">D.O.B</span>: <span class="value">{{ $dateOfBirthLong }}</span></div>
            <div><span class="label">Programme</span>: <span class="value">{{ $courseName }}</span></div>
            <div><span class="label">Duration of Programme</span>: <span class="value">{{ $courseDuration }}</span></div>
            <div><span class="label">Starting Date of Programme</span>: <span class="value">{{ $startDateLong }}</span></div>
            <div><span class="label">Date of Exam</span>: <span class="value">{{ $examDateLong }}</span></div>
        </div>

        <div class="table-column-bg ref"></div>
        <div class="table-column-bg module"></div>
        <div class="table-column-bg level"></div>
        <div class="table-column-bg points"></div>
        <div class="table-column-bg grade"></div>

        <table class="transcript-table">
            <colgroup>
                <col class="ref">
                <col class="module">
                <col class="level">
                <col class="points">
                <col class="grade">
            </colgroup>
            <thead>
                <tr>
                    <th class="ref">Unit Ref</th>
                    <th class="module">Module Name</th>
                    <th class="level">Unit</th>
                    <th class="points">Points</th>
                    <th class="grade">Grade</th>
                </tr>
            </thead>
            <tbody>
                <tr class="empty-row">
                    <td class="ref">&nbsp;</td>
                    <td class="module">&nbsp;</td>
                    <td class="level">&nbsp;</td>
                    <td class="points">&nbsp;</td>
                    <td class="grade">&nbsp;</td>
                </tr>
                @foreach($allModules as $module)
                    <tr>
                        <td class="ref">{{ $module['code'] ?? '' }}</td>
                        <td class="module">{{ $module['name'] ?? '' }}</td>
                        <td class="level">{{ $formatLevel($module['level'] ?? '') }}</td>
                        <td class="points">{{ $pointsForGrade($module['grade'] ?? '') }}</td>
                        <td class="grade">{{ strtoupper((string) ($module['grade'] ?? '')) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="final-assessment">
            <span>Final Assessment Award :</span>
            <span class="award">{{ $courseName }}</span>
        </div>

        <div class="qualified-line">
            The learner has qualified for the above award in {{ $awardedMonthYear }}
        </div>
    </div>

    <div class="page">
        @if(! $printCopyOld)
            <img class="background" src="{{ $letterBackground }}" alt="">
        @endif

        <div class="letter-date">Date: {{ $formatSlashDate($certificate->completion_letter_date) }}</div>
        <div class="student-info-title">Student information:</div>

        <div class="letter-info">
            <div><span class="label">Full Name</span>: {{ $learnerName }}</div>
            <div><span class="label">Date of Birth</span>: {{ $dateOfBirthShort }}</div>
            <div><span class="label">Nationality</span>: {{ $learner->nationality ?? '' }}</div>
            <div><span class="label">Learner Number</span>: {{ $referenceNumber }}</div>
        </div>

        <div class="letter-heading" style="top: 327pt;">To Whom It May Concern</div>
        <div class="letter-heading" style="top: 371pt;">Re:<span style="text-decoration: underline;">Course Completion Letter</span></div>

        <div class="letter-body">
            I would like to confirm that the above named student attended full time course at London Business
            Campus. {{ $subjectPronoun }} has successfully completed
            {{ $courseName }} in our esteemed campus and has obtained a Certificate.
            <br>
            {{ $possessivePronoun }} details are mentioned below,
        </div>

        <div class="course-info">
            <div style="margin-bottom: 24pt;">Course Information</div>
            <div><span class="label">Course Title</span>: {{ $courseName }}</div>
            <div><span class="label">Duration</span>: {{ $courseDuration }}</div>
            <div><span class="label">Commencement Date</span>: {{ $letterStartDate }}</div>
            <div><span class="label">Course End Date</span>: {{ $letterEndDate }}</div>
            <div><span class="label">Medium of Instruction</span>: {{ $certificate->medium_of_instruction ?? '' }}</div>
            <div><span class="label">Mode of Study</span>: {{ $certificate->mode_of_study ?? '' }}</div>
        </div>

        <div class="letter-close">
            Should you require further information please do not hesitate to contact us.
        </div>

        <div class="letter-signoff">
            <div>Yours sincerely</div>
            <img class="letter-signature-img" src="{{ $letterSignature }}" alt="Signature">
            <div>Riyaza</div>
            <div>Registrar</div>
            <div>London Business Campus</div>
        </div>
    </div>
</body>

</html>
