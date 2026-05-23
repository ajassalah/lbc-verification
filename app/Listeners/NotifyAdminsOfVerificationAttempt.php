<?php

namespace App\Listeners;

use App\Events\CertificateVerificationAttempted;
use App\Models\User;
use App\Notifications\CertificateVerificationAttemptedNotification;

class NotifyAdminsOfVerificationAttempt
{
    public function handle(CertificateVerificationAttempted $event)
    {
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            $admin->notify(new CertificateVerificationAttemptedNotification($event->referenceNo));
        }
    }
}
