import ResourcesBase from "./ResourcesBase.jsx";

export default class RendicionesStock extends ResourcesBase {
    async getGraficosSobrantesVsArreglos(fechaDesde, semanas) {
        try {
            return this.processResponse(
                await window.axios.get(`api/rendiciones-stock/sobrantes-vs-arreglos?fechaDesde=${fechaDesde}&semanas=${semanas}`)
            );
        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }

    async getGraficosSobrantesVsArreglosPorSucursal(fechaDesde, fechaHasta) {
        try {
            return this.processResponse(
                await window.axios.post(`api/rendiciones-stock/sobrantes-vs-arreglos/por-sucursal`,{fechaDesde, fechaHasta})
            );
        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }
    async getGraficosSobrantesVsArreglosArticulosPorSucursal(fechaDesde, fechaHasta, idsucursal) {
        try {
            return this.processResponse(
                await window.axios.post(`api/rendiciones-stock/sobrantes-vs-arreglos/por-articulos`,{fechaDesde, fechaHasta, idsucursal})
            );
        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }

    async getGraficosSobrantesVsArreglosArticuloPorSucursal(fechaDesde, fechaHasta, idsucursal, idarticulo) {
        try {
            return this.processResponse(
                await window.axios.post(`api/rendiciones-stock/sobrantes-vs-arreglos/por-articulo`,{fechaDesde, fechaHasta, idsucursal, idarticulo})
            );
        } catch (err) {
            console.log('err', err);
            this.handleError(err)
        }
    }

}
