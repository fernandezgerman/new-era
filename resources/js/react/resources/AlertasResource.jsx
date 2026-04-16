import ResourcesBase from "./ResourcesBase.jsx";
import Resource from "@/resources/Resource.jsx";

export default class AlertasResource extends ResourcesBase {

    async marcarAlertasComoLeidas(idTipoAlerta) {
        try {
            const method = window.axios.post;


            return method('/api/dashboard/alerta/alerta-tipo/' + idTipoAlerta + '/marcar-como-leidas');

        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }
    async marcarAlertaComoLeida(idAlerta) {
        try {
            const method = window.axios.post;

            return method('/api/dashboard/alerta/' + idAlerta + '/marcar-como-leida');

        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }

    async marcarAlertaComoNoLeida(idAlerta) {
        try {
            const method = window.axios.post;

            return method('/api/dashboard/alerta/' + idAlerta + '/marcar-como-no-leida');

        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }

}
