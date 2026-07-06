import React from "react";
import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";

const useCaja = (idUsuario, idSucursal, numero) => {
    return useQuery({
        queryKey: ['get-caja-'+idUsuario+'-'+idSucursal+'-'+numero],
        queryFn: async () => {
            const resource = new Resource();
            const filtros = {
                'idusuario': idUsuario,
                'idsucursal': idSucursal,
                'numero': numero
            };

            const includes = [
                'usuario', 'sucursal', 'pagos', 'ventas',
                'compras.proveedor',
                'compras.sucursal',
                'compras.compraDetalles.articulo.rubro',
                'movimientosCaja.usuario',
                'movimientosCaja.motivo',
                'movimientosCaja.usuarioDestino',
                'movimientosCaja.sucursal',
                'movimientosCaja.sucursalDestino',
                'movimientosCajaDestinatario.usuario',
                'movimientosCajaDestinatario.motivo',
                'movimientosCajaDestinatario.usuarioDestino',
                'movimientosCajaDestinatario.sucursal',
                'movimientosCajaDestinatario.sucursalDestino',
            ];
            const cajas = await resource.getEntities('caja', includes, filtros);

            return cajas?.length > 0 ? cajas[0] : null;
        },
        enabled: !!idUsuario && !!idSucursal && !!numero,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 , // 1hora
    });

}

export { useCaja };

