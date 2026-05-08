<?php

namespace App\Services\ListasDePrecios\Factories;

use App\Models\Articulo;
use App\Models\ArticuloPrecioHistorico;
use App\Models\Lista;
use App\Models\ListaDependienteExcepcion;
use App\Models\PrecioExcepcion;
use App\Services\ListasDePrecios\Contracts\PrecioHistoricoDTOInterface;
use App\Services\ListasDePrecios\DTOs\ArticuloListaHistoricoDTO;
use App\Services\ListasDePrecios\DTOs\PrecioTemporalHistoricoDTO;
use App\Services\ListasDePrecios\DTOs\PromocionesHistoricoDTO;
use App\Services\ListasDePrecios\Enums\ArticuloPrecioHistoricoTipo;
use Exception;

class ArticuloPrecioHistoricoFactory
{
    public static function make(PrecioHistoricoDTOInterface $precioHistoricoDTOInterface): ArticuloPrecioHistorico
    {
        return match(true)
        {
            $precioHistoricoDTOInterface instanceof ArticuloListaHistoricoDTO => self::makeFromArticuloListaHistoricoDTO($precioHistoricoDTOInterface),
            $precioHistoricoDTOInterface instanceof PrecioTemporalHistoricoDTO => self::makeFromPrecioTemporalHistoricoDTO($precioHistoricoDTOInterface),
            $precioHistoricoDTOInterface instanceof PromocionesHistoricoDTO => self::makeFromPromocionesHistoricoDTO($precioHistoricoDTOInterface),
            default => throw new Exception('No existe factory para el DTO seleccionado')
        };
    }

    private static function makeFromPromocionesHistoricoDTO(PromocionesHistoricoDTO $promocionesHistoricoDTO): ArticuloPrecioHistorico
    {
        $promocionArticulo = null;
        if ($promocionesHistoricoDTO->id !== null) {
            $promocionArticulo = \App\Models\PromocionArticulo::find($promocionesHistoricoDTO->id);
        }

        $oldValues = [];
        $newValues = [];

        if ($promocionArticulo) {
            // Compare and fill only changes

            $oldValues['promocion'] = $promocionArticulo->idpromocion;
            $newValues['promocion'] = $promocionesHistoricoDTO->idPromocion;

            $oldValues['porcentaje'] = (float)$promocionArticulo->porcentaje;
            $newValues['porcentaje'] = $promocionesHistoricoDTO->porcentaje;

            $oldValues['cantidad'] = (float)$promocionArticulo->cantidad;
            $newValues['cantidad'] = $promocionesHistoricoDTO->cantidad;

            $oldValues['precio'] = (float)$promocionArticulo->precio;
            $newValues['precio'] = $promocionesHistoricoDTO->precio;

            $oldValues['activo'] = (int)$promocionArticulo->activo;
            $newValues['activo'] = (int)$promocionesHistoricoDTO->activo;

            $oldValues['id'] = (int)$promocionesHistoricoDTO->id;
            $newValues['id'] = (int)$promocionesHistoricoDTO->id;
        } else {
            // New record or not found, set all values into newValues
            $newValues = [
                'promocion' => $promocionesHistoricoDTO->idPromocion,
                'porcentaje' => $promocionesHistoricoDTO->porcentaje,
                'cantidad' => $promocionesHistoricoDTO->cantidad,
                'precio' => $promocionesHistoricoDTO->precio,
                'activo' => $promocionesHistoricoDTO->activo,
            ];
        }

        $articuloPrecioHistorico = new ArticuloPrecioHistorico();
        $articuloPrecioHistorico->idarticulo = $promocionesHistoricoDTO->idArticulo;
        $articuloPrecioHistorico->tipo = ArticuloPrecioHistoricoTipo::PROMOCION->value;
        $articuloPrecioHistorico->oldvalues = $oldValues;
        $articuloPrecioHistorico->newvalues = $newValues;

        return $articuloPrecioHistorico;
    }

    private static function makeFromPrecioTemporalHistoricoDTO(PrecioTemporalHistoricoDTO $precioTemporalHistoricoDTO): ArticuloPrecioHistorico
    {
        $precioTemporal = null;
        if ($precioTemporalHistoricoDTO->id !== null) {
            $precioTemporal = \App\Models\PrecioTemporal::find($precioTemporalHistoricoDTO->id);
        }

        $oldValues = [];
        $newValues = [];

        if ($precioTemporal) {
            // Compare and fill only changes

            $oldValues['precio'] = (float)$precioTemporal->precio;
            $newValues['precio'] = $precioTemporalHistoricoDTO->precio;

            $fechaDTO = $precioTemporalHistoricoDTO->fecha?->toDateString();
            $fechaDB = $precioTemporal->fechacaducidad?->toDateString();
            $oldValues['fechaCaducidad'] = $fechaDB;
            $newValues['fechaCaducidad'] = $fechaDTO;

            $oldValues['cantidadMaxima'] = $precioTemporal->cantidadmaxima;
            $newValues['cantidadMaxima'] = $precioTemporalHistoricoDTO->cantidad;

            $oldValues['listaPrecio'] = $precioTemporal->idlistaprecio;
            $newValues['listaPrecio'] = $precioTemporalHistoricoDTO->idLista;

            $oldValues['sucursal'] = $precioTemporal->idsucursal;
            $newValues['sucursal'] = $precioTemporalHistoricoDTO->idSucursal;

            $oldValues['activo'] = (int)$precioTemporal->activo;
            $newValues['activo'] = (int)$precioTemporalHistoricoDTO->activo;

            $oldValues['id'] = $precioTemporalHistoricoDTO->id;
            $newValues['id'] = $precioTemporalHistoricoDTO->id;
        } else {
            // New record or not found, set all values into newValues
            $newValues = [
                'precio' => $precioTemporalHistoricoDTO->precio,
                'fechaCaducidad' => $precioTemporalHistoricoDTO->fecha?->toDateString(),
                'cantidadMaxima' => $precioTemporalHistoricoDTO->cantidad,
                'listaPrecio' => $precioTemporalHistoricoDTO->idLista,
                'sucursal' => $precioTemporalHistoricoDTO->idSucursal,
                'activo' => $precioTemporalHistoricoDTO->activo,
            ];
        }

        $articuloPrecioHistorico = new ArticuloPrecioHistorico();
        $articuloPrecioHistorico->idarticulo = $precioTemporalHistoricoDTO->idArticulo;
        $articuloPrecioHistorico->idlista = $precioTemporalHistoricoDTO->idLista;
        $articuloPrecioHistorico->tipo = ArticuloPrecioHistoricoTipo::PRECIO_TEMPORAL->value;
        $articuloPrecioHistorico->oldvalues = $oldValues;
        $articuloPrecioHistorico->newvalues = $newValues;

        return $articuloPrecioHistorico;
    }
    private static function makeFromArticuloListaHistoricoDTO(ArticuloListaHistoricoDTO $articuloListaHistoricoDTO): ArticuloPrecioHistorico
    {
        /** @var Lista $lista */
        $lista = get_entity_or_fail('Lista', $articuloListaHistoricoDTO->idLista);
        /** @var Articulo $articulo */
        $articulo = get_entity_or_fail('Articulo', $articuloListaHistoricoDTO->idArticulo);

        $oldValues = null;
        $newValues = null;

        $articuloPrecioHistorico = new ArticuloPrecioHistorico();

        if($lista->calculaenbaseaotralista)
        {
            //Cargo la lista excepcion si existe
            $listaDependienteExcepcion = ListaDependienteExcepcion::query()
                ->where('idarticulo', $articulo->id)
                ->where('idlista', $lista->id)
                ->first();


            $porcentajeCambio = (float)($articuloListaHistoricoDTO->precioExcepcionListaBase > 0 && $articuloListaHistoricoDTO->precioExcepcion > 0
                ? ((($articuloListaHistoricoDTO->precioExcepcion / $articuloListaHistoricoDTO->precioExcepcionListaBase) -1)  * 100)
                : 0.00) ?? 0.00;

            //Si el porcentaje cambio o alguno de los dos es null loguea
            if((float)($listaDependienteExcepcion?->porcentaje ?? 0) !== $porcentajeCambio)
            {
                $oldValues = [
                    'porcentajeExcepcion' => $listaDependienteExcepcion?->porcentaje,
                    'precioExcepcion' => $articuloListaHistoricoDTO->precioExcepcionListaBase * (1 + ($listaDependienteExcepcion?->porcentaje / 100))
                ];

                $newValues = [
                    'porcentajeExcepcion' => $porcentajeCambio,
                    'precioExcepcion' => $articuloListaHistoricoDTO->precioExcepcion
                ];

            }
            $articuloPrecioHistorico->tipo = ArticuloPrecioHistoricoTipo::LISTA_DEPENDIENTE->value;
        }else{
            //Si cambia el aplicar minimos de utilidad:
            if((bool)$articulo->aplicapminutilidad !== (bool)$articuloListaHistoricoDTO->aplicaMinimoDeUtilidad)
            {
                $oldValues = [
                    'aplicaMinimoDeUtilidad' => (bool)$articulo->aplicapminutilidad
                ];

                $newValues = [
                    'aplicaMinimoDeUtilidad' => (bool)$articuloListaHistoricoDTO->aplicaMinimoDeUtilidad
                ];
            }


            $precioExcepcion = PrecioExcepcion::query()
                ->where('idarticulo', $articulo->id)
                ->where('idlista', $lista->id)
                ->first();

            //Si el precio excepcion cambio
            if((float)$precioExcepcion->precio !== (float)$articuloListaHistoricoDTO->precioExcepcion)
            {
                $oldValues = [
                    ...($oldValues ?? []),
                    'precioExcepcion' => $precioExcepcion->precio
                ];

                $newValues = [
                    ...($newValues ?? []),
                    'precioExcepcion' => $articuloListaHistoricoDTO->precioExcepcion
                ];
            }
            $articuloPrecioHistorico->tipo = ArticuloPrecioHistoricoTipo::LISTA_PRINCIPAL->value;
        }

        $articuloPrecioHistorico->idarticulo = $articulo->id;
        $articuloPrecioHistorico->idlista = $lista->id;
        $articuloPrecioHistorico->oldvalues = $oldValues;
        $articuloPrecioHistorico->newvalues = $newValues;

        return $articuloPrecioHistorico;
    }
}
