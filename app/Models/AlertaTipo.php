<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlertaTipo extends Model
{
    use HasFactory;

    protected $table = 'alertastipos';

    protected $primaryKey = 'id';

    public $timestamps = false;

    /**
     * Alertas of this tipo.
     */
    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'idalertatipo');
    }
}
