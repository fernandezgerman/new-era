<?php

namespace App\Services\Auditoria\OwenIt\CustomAudit;

use OwenIt\Auditing\Models\Audit;

class CustomAudit extends Audit
{
    /**
     * The connection name for the model.
     *
     * @var string|null
     */
    protected $connection = 'audits';

}
