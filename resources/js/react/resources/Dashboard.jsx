import ResourcesBase from "./ResourcesBase.jsx";

export default class Dashboard extends ResourcesBase
{
    async leftMenu()
    {
        try{
            return this.processResponse(
                await window.axios.get('/api/dashboard/left-menu',)
            );
        }catch(err)
        {
            this.handleError(err)
        }
    }
}
