<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class RendicionStockDuplicityReport extends Mailable
{
    use Queueable, SerializesModels;

    public $duplicates;

    /**
     * Create a new message instance.
     *
     * @param Collection $duplicates
     */
    public function __construct(Collection $duplicates)
    {
        $this->duplicates = $duplicates;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Rendicion Stock Duplicity Report - Duplicates Detected')
                    ->view('emails.rendicion_stock_duplicity_report');
    }
}
