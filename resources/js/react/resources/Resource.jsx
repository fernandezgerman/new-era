import ResourcesBase from "./ResourcesBase.jsx";

export default class Resource extends ResourcesBase
{
    async getEntity(entity, id, includes = [])
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/resources/'+entity+'/'+id+'?includes='+includes )
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
