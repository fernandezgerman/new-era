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

    /*

    entity = 'string'
    includes = ['include1', 'include2'...]
    filtros = {active: true, usuario_id: 65}
    orden= {orden1: {name: 'fecha', direction: 'asc'}} or 'descripcion'

     */
    async getEntities(entity, includes = [], filtros =null, orden = null, limit = null)
    {
        try{
            const f = filtros ? JSON.stringify(filtros, null, 2) : '';
            const o = orden ? JSON.stringify( (typeof orden === "string") ? {orden1: {name: orden, direction: 'asc'}} : orden, null, 2) : '';


            return this.processResponse(
                await window.axios.get('/api/resources/'+entity+'?includes='+includes+'&filtros='+f+'&orden='+o+'&limit='+( limit ?? 500) )
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
