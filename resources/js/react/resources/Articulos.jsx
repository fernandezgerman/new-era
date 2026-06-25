import ResourcesBase from './ResourcesBase.jsx';

export default class ArticulosResource extends ResourcesBase {
    async getNoComprados(params = {}) {
        try {
            return this.processResponse(
                await window.axios.get('/api/articulos/no-comprados', {params}),
            );
        } catch (err) {
            this.handleError(err);
        }
    }
}
