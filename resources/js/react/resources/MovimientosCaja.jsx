import ResourcesBase from "./ResourcesBase.jsx";

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
}
