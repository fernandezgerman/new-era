import ResourcesBase from "./ResourcesBase.jsx";
import Resource from "@/resources/Resource.jsx";

export default class AgrupacionDeCajas extends ResourcesBase {
    async deleteAgrupacionCaja(agrupacionId) {
        const resource = new Resource();
        return resource.deleteEntity(
            'AgrupacionCaja',
            agrupacionId);
    }

    async saveAgrupacionCaja(data, cajas, usuarios) {
        try {
            const isEdition = data?.id > 0;
            const method = isEdition ? window.axios.patch : window.axios.post;
            const response = this.processResponse(
                await method('/api/resources/agrupacion-caja' + (isEdition ? '/' + data.id : ''), {
                    ...data,
                    relations:
                        [
                            {
                                entity: 'agrupacion-caja-caja',
                                payload: cajas.map((value) => ({
                                    id: value.id,
                                    idsucursal: value.sucursal.id,
                                    idusuario: value.usuario.id,
                                    deleted: value.deleted
                                }))
                            },
                            {
                                entity: 'agrupacion-caja-usuario',
                                payload: usuarios.map((value) => ({
                                    id: value.id,
                                    idusuario: value.usuario.id,
                                    deleted: value.deleted
                                }))
                            },
                        ]
                })
            );

            return response;
        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }
}
