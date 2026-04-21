<?php

namespace App\Services\Auditoria\DTO;

use App\Contracts\DTOInterface;

class AuditoriaDTO implements DTOInterface
{
    public function __construct(
        public ?string $user_type = null,
        public ?int $user_id = null,
        public string $event,
        public string $auditable_type,
        public int $auditable_id,
        public array $old_values,
        public array $new_values,
        public ?string $url = null,
        public ?string $ip_address = null,
        public ?string $user_agent = null,
        public ?string $tags = null,
        public ?string $created_at = null,
        public ?string $updated_at = null,
    ) {
    }

    public function toArray(): array
    {
        return [
            'user_type' => $this->user_type,
            'user_id' => $this->user_id,
            'event' => $this->event,
            'auditable_type' => $this->auditable_type,
            'auditable_id' => $this->auditable_id,
            'old_values' => json_encode(array_filter($this->old_values)),
            'new_values' => json_encode(array_filter($this->new_values)),
            'url' => $this->url,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            'tags' => $this->tags,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
