import ResourcesBase from "./ResourcesBase.jsx";

export default class RendicionesDeStock extends ResourcesBase
{
    urlBase = '/api/rendiciones-stock';
    async create(rubroId, sucursalId)
    {
        try{
            const response = this.processResponse(
                await window.axios.post(this.urlBase, {
                    idrubro: rubroId,
                    idsucursal: sucursalId
                })
            );

            return response;
        }catch(err)
        {
            this.handleError(err)
        }
    }
    async listToday()
    {
        try{
            const response = this.processResponse(
                await window.axios.get(this.urlBase + '/list-today')
            );

            return response;
        }catch(err)
        {
            this.handleError(err)
        }
    }
    async getRendicionArticulosPendientes(rendicionStockId)
    {
        try{
            const response = this.processResponse(
                await window.axios.get(this.urlBase + '/' + rendicionStockId + '/articulos-pendientes')
            );

            return response;
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async getRendicionArticulosRendidos(rendicionStockId)
    {
        try{
            const response = this.processResponse(
                await window.axios.get(this.urlBase + '/' + rendicionStockId + '/articulos-rendidos')
            );

            return response;
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async setRendir(rendicionStockId, articuloId, cantidad)
    {
        try{
            const response = this.processResponse(
                await window.axios.post(this.urlBase + '/' + rendicionStockId + '/rendir',
                    {
                        idarticulo: articuloId,
                        cantidad: cantidad
                    })
            );

            return response;
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
