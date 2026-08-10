import ResourcesBase from "./ResourcesBase.jsx";

export default class Dashboard extends ResourcesBase
{
    async leftMenu()
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/dashboard/left-menu',)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
    async getAlertas(){
        try{
            return this.processResponse(
                await window.axios.get('/api/alerta',)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
    /* TODO: Move the endpoint from legacy version to API new era */
    async getAlertaDetalle(alertaTipoId) {
        try{
            return this.processResponse(
                await window.axios.get('api/alerta/'+alertaTipoId+'/detalles')
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async getAlertaSucursalInicioLiquidacion(sucursalId) {
        try{
            return this.processResponse(
                await window.axios.get('api/alerta/inicio/sucursal/'+sucursalId)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

}
