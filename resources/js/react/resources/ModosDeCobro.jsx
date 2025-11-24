import ResourcesBase from "./ResourcesBase.jsx";

export default class ModosDeCobro extends ResourcesBase
{
    async testConnection(token)
    {
        try{

            const response = this.processResponse(
                await window.axios.post('/api/medios-de-cobro/test-connection', {
                    token: token
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
