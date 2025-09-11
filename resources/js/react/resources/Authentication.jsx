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
}
