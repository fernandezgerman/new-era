<?php

use App\Services\ComprasDudosas\Enums\TipoDeCompraDudosa;
use App\Services\ComprasDudosas\Rules\CompraDudosaRuleAumentoElCosto;
use App\Services\ComprasDudosas\Rules\CompraDudosaRuleBajoElCosto;
use App\Services\ComprasDudosas\Rules\CompraDudosaRuleCostoCero;
use App\Services\ComprasDudosas\Rules\CompraDudosaRuleCostoMayorAlPrecio;

return [
    // Importante: EL orden es clave para determinar la jerqrquia en q seran aplicadas las reglas
   'rules' => [
       CompraDudosaRuleCostoMayorAlPrecio::class,
       CompraDudosaRuleCostoCero::class,
       CompraDudosaRuleAumentoElCosto::class,
       CompraDudosaRuleBajoElCosto::class,
   ],
    'lista_precio_comparable_id' => 2,
    'multiplos_de_comparacion' => [
        TipoDeCompraDudosa::COSTO_AUMENTO_DEMASIADO->value => [
            'base' => 0.20,
            'variantes' => [
                'diferente_proveedor' => 0.05,
                'diferente_sucursal' => 0.05,
                'inflacion_por_dia' => 0.33 / 360 //Inflacion interanual (tomada el 09/2026), por dia
            ]
        ],
        TipoDeCompraDudosa::COSTO_DISMINUYO_DEMASIADO->value => [
            'base' => 0.05,
            'variantes' => [
                'diferente_proveedor' => 0.05,
                'diferente_sucursal' => 0.05,
                'inflacion_por_dia' => 0
            ]
        ],
    ]
];
