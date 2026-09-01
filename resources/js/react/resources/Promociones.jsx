import ResourcesBase from './ResourcesBase.jsx';

export default class PromocionesResource extends ResourcesBase {
    async setPromocionArticulos(payload) {
        try {
            return this.processResponse(
                await window.axios.post('/api/promociones/articulos', payload),
            );
        } catch (err) {
            this.handleError(err);
        }
    }
}
