<?php

namespace App\Promociones;

use App\Models\Promocion;
use App\Models\PromocionArticulo;
use App\Promociones\DTOs\ArticuloPromocionDTO;
use App\Services\Actualizaciones\ActualizacionesManager;
use App\Services\Actualizaciones\DTO\ActualizacionIdentifierDTO;
use App\Services\Actualizaciones\Enums\CodigoMotivoActualizacion;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PromocionesManager
{
    public function __construct(private ActualizacionesManager $actualizacionesManager)
    {
    }

    /**
     * @param Collection<ArticuloPromocionDTO> $articulosPromocion
     */
    public function AddArticulosToPromociones(Collection $articulosPromocion): void
    {
        DB::transaction(function () use ($articulosPromocion) {
            foreach ($articulosPromocion as $articuloDTO) {
                /** @var Promocion $promocion */
                $promocion = get_entity_or_fail('Promocion', $articuloDTO->promocion_id);
                $this->actualizacionesManager->insertarActualizacion($promocion);

                if ($articuloDTO->id === null) {
                    // INSERT INTO promocionesarticulos(idpromocion,idarticulo,porcentaje,cantidad,precio,activo)
                    // VALUES(p_promocion_id,p_articulo_id,p_porcentaje,p_cantidad,p_precio,p_activo);
                    PromocionArticulo::query()->create([
                        'idpromocion' => $articuloDTO->promocion_id,
                        'idarticulo' => $articuloDTO->articulo_id,
                        'porcentaje' => $articuloDTO->porcentaje,
                        'cantidad' => $articuloDTO->cantidad,
                        'precio' => $articuloDTO->precio,
                        'activo' => $articuloDTO->activo,
                    ]);
                } else {
                    // UPDATE promocionesarticulos SET ... WHERE id = p_id;
                    PromocionArticulo::query()
                        ->where('id', $articuloDTO->id)
                        ->update([
                            'idpromocion' => $articuloDTO->promocion_id,
                            'idarticulo' => $articuloDTO->articulo_id,
                            'porcentaje' => $articuloDTO->porcentaje,
                            'cantidad' => $articuloDTO->cantidad,
                            'precio' => $articuloDTO->precio,
                            'activo' => $articuloDTO->activo,
                        ]);
                }
            }
        });
    }
}
