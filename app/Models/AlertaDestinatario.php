<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlertaDestinatario extends Model
{
    use HasFactory;

    protected $table = 'alertasdestinatarios';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'idalerta',
        'idusuario',
        'fechahoravisto',
    ];

    public function alerta()
    {
        return $this->belongsTo(Alerta::class, 'idalerta');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idusuario');
    }
}
