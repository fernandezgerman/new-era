<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alerta extends BaseModel
{
    use HasFactory;

    protected $table = 'alertas';

    protected $primaryKey = 'id';

    public $timestamps = false;

    /**
     * Tipo of this alerta.
     */
    public function tipo()
    {
        return $this->belongsTo(AlertaTipo::class, 'idalertatipo');
    }

    /**
     * Destinatarios of this alerta.
     */
    public function destinatarios()
    {
        return $this->hasMany(AlertaDestinatario::class, 'idalerta');
    }

    /**
     * Users who receive this alerta (through pivot table alertasdestinatarios).
     */
    public function usuarios()
    {
        return $this->belongsToMany(User::class, 'alertasdestinatarios', 'idalerta', 'idusuario')
            ->withPivot(['fechahoravisto']);
    }
}
