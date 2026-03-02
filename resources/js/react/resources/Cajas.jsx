import ResourcesBase from "./ResourcesBase.jsx";
import Resource from "@/resources/Resource.jsx";

export default class Cajas extends ResourcesBase {
    async getUltimaCaja(usuarioId, sucursalId) {
        try {

            return this.processResponse(
                await window.axios.get(`api/caja/sucursal/${sucursalId}/usuario/${usuarioId}/ultima-caja`)
            );

        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }
}
