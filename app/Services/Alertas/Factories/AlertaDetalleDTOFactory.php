<?php

namespace App\Services\Alertas\Factories;

use App\Models\SolicitudDePago;
use App\Services\Alertas\Collections\AlertaDetalleInformeParametroCollection;
use App\Services\Alertas\Collections\AlertaDetalleInformesCollection;
use App\Services\Alertas\DTOs\AlertaDetalleDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeDTO;
use App\Services\Alertas\DTOs\AlertaDetalleInformeParametroDTO;
use App\Services\Alertas\Enums\AlertaColor;
use Illuminate\Support\Carbon;

class AlertaDetalleDTOFactory
{
    public static function makeFromSolicitudPago(SolicitudDePago $solicitudDePago): AlertaDetalleDTO
    {
        $color = AlertaColor::tryFrom($solicitudDePago->color);

        $dto = new AlertaDetalleDTO(config('alertas.solicitud_de_pago_alerta_id'));

        $dto->color = $color;
        $dto->descripcion =' De la sucursal <b>'.$solicitudDePago->sucursal->nombre.'</b>  para proveedor <b>'.$solicitudDePago->proveedor->nombre.'</b>';
        $dto->fechaHora = Carbon::createFromFormat('Y-m-d H:i:s', $solicitudDePago->ultimoEstado->fechahora);
        $dto->id = $solicitudDePago->id;
        $dto->alertaDestinatarioId = auth()->user()->id;
        $dto->nombre = $solicitudDePago->estado.' $'.$solicitudDePago->importe;
        $dto->alertaDetalleInforme = self::getSolicitudesDetalleInformeForSolicitudDePago($solicitudDePago);

        return $dto;
    }
    private static function getSolicitudesDetalleInformeForSolicitudDePago(SolicitudDePago $solicitudDePago): AlertaDetalleInformesCollection
    {
        $informe = new AlertaDetalleInformeDTO();
        $informe->alertaId = config('alertas.solicitud_de_pago_alerta_id');
        $informe->codigoPagina = 'slctdpgadtr';
        $informe->nombre = 'Ver solicitudes '.$solicitudDePago->estado;
        $informe->id = $solicitudDePago->id;
        $informe->parametros = new AlertaDetalleInformeParametroCollection();

        $parametros = new AlertaDetalleInformeParametroDTO();
        $parametros->clave = 'estado';
        $parametros->valor = $solicitudDePago->ultimoEstado->estado;
        $parametros->id = 0;
        $parametros->type = 'GET';
        $informe->parametros->add($parametros);

        $parametros = new AlertaDetalleInformeParametroDTO();
        $parametros->clave = 'cargainstantanea';
        $parametros->valor = 1;
        $parametros->id = 0;
        $parametros->type = 'GET';
        $informe->parametros->add($parametros);

        $parametros = new AlertaDetalleInformeParametroDTO();
        $parametros->clave = 'pagina';
        $parametros->valor = 'slctdpgadtr';
        $parametros->id = 0;
        $parametros->type = 'GET';
        $informe->parametros->add($parametros);

        return new AlertaDetalleInformesCollection([$informe]);
    }
}
