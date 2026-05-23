<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Certificate - {{ $certificate->reference_no }}</title>
        <link rel="icon" href="{{ asset('image/ukee logo.png') }}" type="image/png">
        <style>
            html,
            body {
                margin: 0;
                height: 100%;
                background: #111827;
            }

            iframe {
                width: 100vw;
                height: 100vh;
                border: 0;
                display: block;
                background: #fff;
            }
        </style>
    </head>
    <body>
        <iframe src="{{ $documentUrl }}" title="Certificate {{ $certificate->reference_no }}"></iframe>
    </body>
</html>
