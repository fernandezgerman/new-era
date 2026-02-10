<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Existencia extends Model
{
    protected $table = 'existencias';

    // Composite primary key (idsucursal, idarticulo)
    protected $primaryKey = null; // no single key
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'idsucursal',
        'idarticulo',
        'cantidad',
    ];

    protected $casts = [
        'idsucursal' => 'int',
        'idarticulo' => 'int',
        'cantidad' => 'decimal:3',
    ];

    // Ensure updates/deletes target the composite key
    protected function setKeysForSaveQuery($query): Builder
    {
        return $query
            ->where('idsucursal', $this->getAttribute('idsucursal'))
            ->where('idarticulo', $this->getAttribute('idarticulo'));
    }

    public function getKeyName()
    {
        return null;
    }

    public function articulo()
    {
        return $this->belongsTo(Articulo::class, 'idarticulo');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'idsucursal');
    }
}
