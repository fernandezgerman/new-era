import ResourcesBase from "./ResourcesBase.jsx";

export default class Liquidaciones extends ResourcesBase {
    async getValorizacionHistorico(sucursalesId) {
        try {
            const queryParams = sucursalesId && sucursalesId.length > 0 ? sucursalesId.map(s => 'sucursalesId[]=' + s).join('&') : '';
            return this.processResponse(
                await window.axios.get(`api/liquidaciones/valorizacion-historico?${queryParams}`)
            );
        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }
}
