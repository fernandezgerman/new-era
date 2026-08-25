import {useQuery} from "@tanstack/react-query";
import Resource from "@/resources/Resource.jsx";

export const useVentaSucursal = ({ idVentaSucursal }) => {
    return useQuery({
        queryKey: ['venta-sucursal-id-'+idVentaSucursal],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntity(
                'ventaSucursal',
                idVentaSucursal,
                [
                    'sucursal',
                    'articulo',
                    'lista',
                    'extra.compraDetalle.compra.proveedor',
                    'articulosCompuestos',
                    'descuentos.tipoDescuento',
                    'descuentos.motivoDescuento',
                    'descuentos.usuarioAutorizo',
                    'preciosTemporales.precioTemporal',
                    'promocionVenta.promocion',
                ]);
        },
        enabled: !!idVentaSucursal && true ,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

}
