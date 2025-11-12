<?php

namespace App\Services\MediosDeCobro\DTOs;

class WebhookEventDTO
{
    public function __construct(array|\stdClass $data)
    {
        $content = $data;
        if(is_array($data)){
            $content = (object)$data;
        }
        $this->content = $content;
    }
    public \stdClass $content;
}
