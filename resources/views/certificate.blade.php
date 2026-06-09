<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Certificate</title>
    <link rel="icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc" type="image/png">
    <link rel="shortcut icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc" type="image/png">
    <link rel="apple-touch-icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
            padding: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }

        body {
            color: #000;
            font-family: 'Poppins', sans-serif;
            font-size: 12pt;
            font-weight: 400;
        }

        .page {
            width: 210mm;
            height: 297mm;
            position: relative;
            overflow: hidden;
        }

        .page:not(:last-child) {
            page-break-after: always;
        }

        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm;
            height: 297mm;
            z-index: -1;
        }

        .accent {
            color: #000;
        }

        .center {
            text-align: center;
        }

        .certificate-programme {
            position: absolute;
            top: 102mm;
            left: 15mm;
            width: 180mm;
            text-align: center;
            font-size: 16pt;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            text-transform: uppercase;
            color: #000;
        }

        .certificate-text {
            position: absolute;
            left: 15mm;
            width: 180mm;
            text-align: center;
            font-size: 12pt;
            font-weight: 400;
            font-family: 'Poppins', sans-serif;
        }

        .learner-name {
            position: absolute;
            top: 137mm;
            left: 15mm;
            width: 180mm;
            text-align: center;
            font-size: 16pt;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            color: #000;
            text-transform: uppercase;
        }

        .meta-line {
            position: absolute;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 12pt;
        }

        .meta-line .label {
            color: #000;
        }

        .meta-line .value {
            color: #000;
        }

        .certificate-footer-values {
            position: absolute;
            bottom: 20mm;
            left: 15mm;
            width: 180mm;
            text-align: center;
            font-size: 12pt;
            font-weight: 400;
            font-family: 'Poppins', sans-serif;
            color: #000;
        }

        .certificate-footer-values span {
            position: static;
        }

        .certificate-signature {
            position: absolute;
            left: 88mm;
            bottom: 49mm;
            width: 42mm;
            text-align: left;
            font-family: 'Poppins', sans-serif;
            color: #000;
        }

        .certificate-signature img {
            width: 38mm;
            height: auto;
            display: block;
            margin: 0 0 -4mm 0;
        }

        .signature-text {
            font-size: 9pt;
            line-height: 1.15;
            font-weight: 400;
        }

        .certificate-signature .signature-text {
            font-size: 10pt;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            padding-left: 0;
        }

        .transcript-details {
            position: absolute;
            top: 74mm;
            left: 12mm;
            width: 180mm;
            font-size: 12pt;
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            line-height: 1.45;
        }

        .transcript-details strong,
        .transcript-details .accent {
            font-size: 12pt;
            font-family: 'Poppins', sans-serif;
        }

        .transcript-details strong {
            font-weight: 400;
        }

        .transcript-details .accent {
            font-weight: 700;
        }

        .transcript-details .row {
            margin-bottom: 2mm;
        }

        .transcript-note {
            position: absolute;
            top: 96mm;
            left: 12mm;
            width: 180mm;
            font-size: 12pt;
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            line-height: 1.05;
        }

        .transcript-table-wrap {
            position: absolute;
            top: 108mm;
            left: 12mm;
            width: 180mm;
        }

        .transcript-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11pt;
            font-family: 'Poppins', sans-serif;
            font-weight: 400;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
        }

        .transcript-table thead th {
            text-align: left;
            font-size: 11pt;
            font-weight: 700;
            font-family: 'Poppins', sans-serif;
            border-bottom: 2px solid #000;
            padding: 1mm 1.2mm;
        }

        .transcript-table tbody td {
            font-size: 11pt;
            font-weight: 400;
            font-family: 'Poppins', sans-serif;
            padding: 0.8mm 1.2mm;
            vertical-align: top;
        }

        .transcript-table .col-ref {
            width: 28mm;
        }

        .transcript-table .col-title {
            width: 86mm;
        }

        .transcript-table .col-level {
            width: 16mm;
            text-align: center;
        }

        .transcript-table .col-credit {
            width: 18mm;
            text-align: center;
        }

        .transcript-table .col-grade {
            width: 18mm;
            text-align: center;
        }

        .transcript-summary {
            width: 100%;
            text-align: center;
            font-size: 10pt;
            font-weight: 400;
            font-family: 'Poppins', sans-serif;
            margin-top: 1.5mm;
            padding-top: 0;
        }

        .transcript-footer-values {
            position: absolute;
            bottom: 20mm;
            left: 12mm;
            width: 180mm;
            text-align: center;
            font-size: 12pt;
            font-weight: 400;
            font-family: 'Poppins', sans-serif;
            color: #000;
        }

        .transcript-footer-values span {
            position: static;
        }

        .transcript-signature {
            position: absolute;
            left: 14mm;
            bottom: 43mm;
            width: 45mm;
            text-align: left;
            font-family: 'Poppins', sans-serif;
            color: #000;
        }

        .transcript-signature img {
            width: 38mm;
            height: auto;
            display: block;
            margin-bottom: 1mm;
        }
    </style>
</head>

<body>
    @php
        $modulesData = is_array($certificate->modules_data) ? $certificate->modules_data : json_decode($certificate->modules_data, true);
        $years = $modulesData['years'] ?? [];
        $allModules = collect($years)
            ->flatMap(fn ($year) => $year['modules'] ?? [])
            ->values();

        $formatLevel = function ($level) {
            if ($level === null || $level === '') {
                return 'N/A';
            }

            return trim(preg_replace('/^Level\s*/i', '', (string) $level)) ?: 'N/A';
        };

        $totalCredits = $allModules->sum(fn ($module) => (int) ($module['credits'] ?? 0));
        $hasFail = $allModules->contains(fn ($module) => strtoupper((string) ($module['grade'] ?? '')) === 'FAIL');
        $allPass = $allModules->count() > 0 && $allModules->every(fn ($module) => strtoupper((string) ($module['grade'] ?? '')) === 'PASS');
        $gradingType = $hasFail ? 'FAIL' : ($allPass ? 'PASS' : 'PENDING');
        $awardedMonthYear = $certificate->awarding_date ? \Carbon\Carbon::parse($certificate->awarding_date)->format('F Y') : '';
        $courseName = $course->name ?? '';
        $learnerName = strtoupper($learner->full_name ?? '');
        $transcriptLearnerName = str($learner->full_name ?? '')->lower()->title();
        $transcriptCourseName = (string) str($courseName)->lower()->title();
        $transcriptCourseName = strtoupper(substr($transcriptCourseName, 0, 4)) . substr($transcriptCourseName, 4);
        $centerName = $certificate->center_name ?? '';
        $stId = $learner->learner_id ?? '';
        $referenceNumber = $certificate->reference_no ?? '';
        $centerNumberValue = $centerNumber ?? '';
        $certificateBackground = 'data:image/jpeg;base64,' . base64_encode(file_get_contents(storage_path('certificate/UKEE Certificate.jpeg')));
        $transcriptBackground = 'data:image/jpeg;base64,' . base64_encode(file_get_contents(storage_path('certificate/UKEE Transcript.jpeg')));
        $signatureImage = 'data:image/png;base64,' . base64_encode(file_get_contents(storage_path('certificate/UKEE Sig 1.png')));
    @endphp

    <div class="page">
        <img class="background-image"
            src="{{ $certificateBackground }}"
            alt="UKEE Certificate">

        <div class="certificate-programme">{{ $courseName }}</div>

        <div class="certificate-text" style="top: 121mm;">
            This is to certify that
        </div>

        <div class="learner-name">{{ $learnerName }}</div>

        <div class="certificate-text" style="top: 149mm;">
            has successfully completed a regulated qualification at
        </div>

        <div class="certificate-text accent" style="top: 164mm;">
            {{ $centerName }}
        </div>

        <div class="certificate-text accent" style="top: 178mm;">
            Awarded on {{ $awardedMonthYear }}
        </div>

        <div class="certificate-signature">
            <img src="{{ $signatureImage }}" alt="Course Director Signature">
            <div class="signature-text">
                Course Director<br>
                Tulip Flazer
            </div>
        </div>

        <div class="certificate-footer-values">
            ST ID: {{ $stId }} | RN: {{ $referenceNumber }} | CN: {{ $centerNumberValue }}
        </div>
    </div>

    <div class="page">
        <img class="background-image"
            src="{{ $transcriptBackground }}"
            alt="UKEE Transcript">

        <div class="transcript-details">
            <div class="row">
                <strong>Name:</strong>
                <span class="accent">{{ $transcriptLearnerName }}</span>
            </div>
            <div class="row">
                <strong>Programme:</strong>
                <span class="accent">{{ $transcriptCourseName }}</span>
            </div>
        </div>

        <div class="transcript-note">
            The learner has been awarded the following credits for achieving the required learning outcomes
            of the unit(s) listed
        </div>

        <div class="transcript-table-wrap">
            <table class="transcript-table">
                <thead>
                    <tr>
                        <th class="col-ref">Unit Ref</th>
                        <th class="col-title">Title</th>
                        <th class="col-level">Level</th>
                        <th class="col-credit">Credit</th>
                        <th class="col-grade">Grade</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($allModules as $module)
                        <tr>
                            <td class="col-ref accent">{{ $module['code'] ?? '' }}</td>
                            <td class="col-title accent">{{ $module['name'] ?? '' }}</td>
                            <td class="col-level accent">{{ $formatLevel($module['level'] ?? null) }}</td>
                            <td class="col-credit accent">{{ $module['credits'] ?? 0 }}</td>
                            <td class="col-grade accent">{{ strtoupper((string) ($module['grade'] ?? '')) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="transcript-summary">
                <span>TOTAL CREDIT ACHIEVED:</span>
                <span class="accent">{{ $totalCredits }}</span>
                <span> | GRADING TYPE:</span>
                <span class="accent">{{ $gradingType }}</span>
            </div>
        </div>

        <div class="transcript-signature">
            <img src="{{ $signatureImage }}" alt="Course Director Signature">
            <div class="signature-text">
                Course Director<br>
                Tulip Flazer
            </div>
        </div>

        <div class="transcript-footer-values">
            ST ID: {{ $stId }} | RN: {{ $referenceNumber }} | CN: {{ $centerNumberValue }} | Awarded on {{ $awardedMonthYear }}
        </div>
    </div>
</body>

</html>
