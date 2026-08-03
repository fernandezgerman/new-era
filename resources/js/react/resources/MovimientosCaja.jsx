import ResourcesBase from "./ResourcesBase.jsx";
import Resource from "./Resource.jsx";

const MOVIMIENTO_CAJA_INCLUDES = [
    'usuario',
    'usuarioDestino',
    'sucursal',
    'sucursalDestino',
    'motivo',
];

export default class MovimientosCaja extends ResourcesBase
{
    async movimientosCajaPendientesParaLiq(idSucursal)
    {
        try {
            return this.processResponse(
                await window.axios.get('/api/movimientos-pendientes-para-liq/'+idSucursal)
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async getReporteMercadoPago(payload = {})
    {
        try {
            return this.processResponse(
                await window.axios.post('/api/movimientos-caja/reporte-mercado-pago', payload),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async getReporteMovimientosCaja({filtros = {}, page = 1, perPage = 100, orden = null} = {})
    {
        const resource = new Resource();
        return resource.getEntities(
            'movimiento-caja',
            MOVIMIENTO_CAJA_INCLUDES,
            filtros,
            orden ?? [{name: 'fechahoramovimiento', direction: 'desc'}],
            null,
            page,
            perPage,
        );
    }
}
