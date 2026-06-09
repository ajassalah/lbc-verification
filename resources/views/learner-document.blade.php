<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $documentLabel }} - {{ $learner->full_name }}</title>
        <link rel="icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc" type="image/png">
        <link rel="shortcut icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc" type="image/png">
        <link rel="apple-touch-icon" href="{{ asset('image/lbc-logo.png') }}?v=lbc">
        <style>
            html, body {
                margin: 0;
                min-height: 100%;
                background: #f8fafc;
                font-family: Arial, sans-serif;
            }

            .document-frame {
                width: 100vw;
                height: 100vh;
                border: 0;
                display: block;
                background: #fff;
            }

            .image-wrap {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
            }

            .image-wrap img {
                max-width: 100%;
                max-height: calc(100vh - 48px);
                object-fit: contain;
                background: #fff;
                box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
            }

            .download {
                position: fixed;
                top: 16px;
                right: 16px;
                z-index: 10;
                padding: 10px 14px;
                border-radius: 6px;
                background: #2563eb;
                color: #fff;
                text-decoration: none;
                font-size: 14px;
                font-weight: 700;
            }
        </style>
    </head>
    <body>
        @if ($isPdf)
            <iframe class="document-frame" src="{{ $documentUrl }}" title="{{ $documentLabel }}"></iframe>
        @elseif ($isImage)
            <div class="image-wrap">
                <img src="{{ $documentUrl }}" alt="{{ $documentLabel }}">
            </div>
        @else
            <a class="download" href="{{ $documentUrl }}">Open Document</a>
        @endif
    </body>
</html>
