<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CertificateVerificationAttempted
{
    use Dispatchable, SerializesModels;

    public $referenceNo;

    public function __construct($referenceNo)
    {
        $this->referenceNo = $referenceNo;
    }
}
