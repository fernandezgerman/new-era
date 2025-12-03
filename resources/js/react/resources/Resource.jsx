import ResourcesBase from "./ResourcesBase.jsx";

export default class Resource extends ResourcesBase
{

    async getEntity(entity, id, includes = [], filtros = null, orden = [])
    {
        try{
            const f = filtros ? JSON.stringify(filtros, null, 2) : '';
            return this.processResponse(
                await window.axios.get('/api/resources/'+entity+'/'+id+'?includes='+includes+'&filtros='+f+'&orden='+orden )
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async getEntities(entity, includes = [], filtros =null, orden = [])
    {
        try{
            const f = filtros ? JSON.stringify(filtros, null, 2) : '';
            return this.processResponse(
                await window.axios.get('/api/resources/'+entity+'?includes='+includes+'&filtros='+f+'&orden='+orden )
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async insertEntity(entity, data,includes = [])
    {
        try{
            return this.processResponse(
                await window.axios.post('/api/resources/'+entity+'?includes='+includes, data)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async updateEntity(entity, id, data, includes = [])
    {
        try{
            return this.processResponse(
                await window.axios.patch('/api/resources/'+entity+'/'+id+'?includes='+includes, data)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async deleteEntity(entity, id)
    {
        try{
            return this.processResponse(
                await window.axios.delete('/api/resources/'+entity+'/'+id)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
