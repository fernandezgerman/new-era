import ResourcesBase from "./ResourcesBase.jsx";

export default class Authentication extends ResourcesBase
{
    async login(usuario, password)
    {
        try{
            return this.processResponse(
                await window.axios.post('/api/login', {
                    clave: password,
                    usuario:usuario
                })
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async me()
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/user')
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }

    async getSucursalActual()
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/sucursal/actual')
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
    async establecerSucursalActual(sucursalId)
    {
        try{
            return this.processResponse(
                await window.axios.post('/api/sucursal/'+sucursalId+'/establecer-actual')
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
