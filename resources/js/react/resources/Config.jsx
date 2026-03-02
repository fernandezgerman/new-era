import ResourcesBase from "./ResourcesBase.jsx";

export default class Config extends ResourcesBase
{
    async getValue(key)
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/config/value?key=' + key)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
