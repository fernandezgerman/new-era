import ResourcesBase from "./ResourcesBase.jsx";

export default class Permisos extends ResourcesBase
{
    async permitido(codigo)
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/permisos/check?codigo=' + codigo)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
