<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class CertificateVerificationAttemptedNotification extends Notification
{
    use Queueable;

    public $referenceNo;

    public function __construct($referenceNo)
    {
        $this->referenceNo = $referenceNo;
    }

    /**
     * Channels: database + email
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    // /**
    //  * Email content
    //  */
    // public function toMail($notifiable)
    // {
    //     return (new MailMessage)
    //         ->subject('Certificate Verification Attempted')
    //         ->greeting('Hello ' . $notifiable->name . ',')
    //         ->line('A certificate verification was attempted.')
    //         ->line('Reference Number: ' . $this->referenceNo)
    //         ->line('Please review the verification log if necessary.')
    //         ->salutation('Regards, ' . config('app.name'));
    // }

    /**
     * Database content
     */
    public function toArray($notifiable)
    {
        return [
            'title' => 'Certificate Verification',
            'message' => "A certificate verification was attempted for Reference #: {$this->referenceNo}",
            'reference_no' => $this->referenceNo,
            'action_url' => route('certificates.verify', $this->referenceNo),
        ];
    }
}
