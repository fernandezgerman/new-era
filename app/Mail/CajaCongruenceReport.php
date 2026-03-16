<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CajaCongruenceReport extends Mailable
{
    use Queueable, SerializesModels;

    public $messages;
    public $dateFrom;
    public $dateTo;

    /**
     * Create a new message instance.
     *
     * @param array $messages
     * @param string $dateFrom
     * @param string $dateTo
     */
    public function __construct(array $messages, string $dateFrom, string $dateTo)
    {
        $this->messages = $messages;
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Caja Congruence Report - Errors Detected')
                    ->view('emails.caja_congruence_report');
    }
}
