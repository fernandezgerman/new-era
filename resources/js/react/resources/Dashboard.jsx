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
                await window.axios.get('/api/dashboard/alertas',)
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
                await window.axios.post('/ajaxAlertasInicioDetalle.php',{
                    IncluirVistas: null,
                    inpUsuarioAlertasId: null,
                    alertaTipoId: alertaTipoId,
                })
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

}
