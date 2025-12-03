import ResourcesBase from "./ResourcesBase.jsx";

export default class ModosDeCobro extends ResourcesBase
{
    async testConnection(configuracionId)
    {
        try{

            const response = this.processResponse(
                await window.axios.post('/api/medios-de-cobro/test-connection', {
                    configuracionId: configuracionId
                })
            );

            if(!response.connection_valid)
            {
                throw new Error(response.error);
            }

            return response;
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
