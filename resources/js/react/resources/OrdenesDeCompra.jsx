import ResourcesBase from './ResourcesBase.jsx';

export default class OrdenesDeCompraResource extends ResourcesBase {
    async getOrdenesDeCompra(params = {}) {
        try {
            return this.processResponse(
                await window.axios.get('/api/ordenes-de-compra', {params}),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async getArticulosAOrdenar(params = {}) {
        try {
            return this.processResponse(
                await window.axios.get('/api/ordenes-de-compra/articulos-a-ordenar', {params}),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async addOrdenDeCompra(payload = {}) {
        try {
            return this.processResponse(
                await window.axios.post('/api/ordenes-de-compra/add', payload),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async addAndSendOrdenDeCompra(payload = {}) {
        try {
            return this.processResponse(
                await window.axios.post('/api/ordenes-de-compra/add-and-send-email', payload),
            );
        } catch (err) {
            if (err?.response?.status === 400) {
                this.handleError(err);
            }

            const message = err?.response?.data?.message
                ?? 'Error al guardar y enviar la orden de compra por email.';
            throw new Error(message);
        }
    }

    async sendOrdenDeCompraEmail(id) {
        try {
            return this.processResponse(
                await window.axios.post(`/api/ordenes-de-compra/${id}/send-email`),
            );
        } catch (err) {
            const message = err?.response?.data?.message
                ?? 'Error al enviar el email de la orden de compra.';
            throw new Error(message);
        }
    }
}
