import ResourcesBase from './ResourcesBase.jsx';

export default class ProveedoresImportarListas extends ResourcesBase {
    async importarPorArchivo(idproveedor, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            return this.processResponse(
                await window.axios.post(
                    `/api/importar/listas/proveedor/${idproveedor}/file`,
                    formData,
                    {
                        headers: {'Content-Type': 'multipart/form-data'},
                        timeout: 180000
                    },
                ),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async getDetallesPreCarga(idcabecera, page = 1) {
        try {
            return this.processResponse(
                await window.axios.get(
                    `/api/importar/listas/pre-carga/${idcabecera}/detalles`,
                    {params: {page}},
                ),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async getDetallesLista(idlista, page = 1) {
        try {
            return this.processResponse(
                await window.axios.get(
                    `/api/importar/listas/${idlista}/detalles`,
                    {params: {page}},
                ),
            );
        } catch (err) {
            this.handleError(err);
        }
    }

    async definirColumnas(idcabecera, payload) {
        try {
            return this.processResponse(
                await window.axios.post(
                    `/api/importar/listas/pre-carga/${idcabecera}/definir-columnas`,
                    payload,
                    {timeout: 180000}
                ),
            );
        } catch (err) {
            this.handleError(err);
        }
    }
}
