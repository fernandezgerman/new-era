import ResourcesBase from "./ResourcesBase.jsx";

export default class ArticulosHistoricoPrecios extends ResourcesBase {
    async getArticuloHistorico(articuloId) {
        try {

            return this.processResponse(
                await window.axios.get(`api/articulos/${articuloId}/historico-precios`)
            );

        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }
}
