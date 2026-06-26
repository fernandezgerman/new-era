import React from 'react';
import {MercadoPagoDocumentacion} from "@/pages/documentacion/mercadoPagoDocumentacion/index.jsx";
import {AgrupacionDeCajasLista} from "@/pages/agrupacionDeCajas/index.jsx";
import {AccesosAlSistema} from "@/pages/accesosAlSistema/index.jsx";
import {ListarAudits} from "@/pages/audits/index.jsx";
import {ValorizacionHistorico} from "@/pages/ValorizacionHistorico/index.jsx";
import {ArreglosDeStockChartCard} from "@/widgets/Dashboard/ArreglosStockChart/index.jsx";
import {ProcesamientoDeCostosDocumentacion} from "@/pages/documentacion/procesamientoDeCostos/index.jsx";
import {ReporteGastos} from "@/pages/reporteGastos/index.jsx";
import {ProveedoresListasImportar} from "@/pages/proveedoresImportarListas/index.jsx";
import {OrdenesDeCompraReporte} from "@/pages/ordenesDeCompra/index.jsx";
import RustDeskInstalacionDocumentacion from "@/pages/documentacion/RustDeskDocumentacion/index.jsx";
import {ExistenciasSinCompras} from "@/pages/ExistenciasSinCompras/index.jsx";

// Documentacion: https://reactcommunity.org/react-modal/
const ReactMenu = {
    /** DOCUMENTACION */
    "info-mp": MercadoPagoDocumentacion,
    "info-proc-costos": ProcesamientoDeCostosDocumentacion,
    "info-rust-desk": RustDeskInstalacionDocumentacion,

    /** CONTABILIDAD */
    "agrp-cajas": AgrupacionDeCajasLista,


    /** Productos */
    "exis-sin-cmp": ExistenciasSinCompras,

    /** CONTABILIDAD */
    "cnf-accs-hra": AccesosAlSistema,
    "audits" :ListarAudits,
    "vlrs_histo" :ValorizacionHistorico,
    "mis-indicadores" : ArreglosDeStockChartCard,
    "rep-gastos": ReporteGastos,
    "impr-cmp": ProveedoresListasImportar,
    "ord-cmp-2": OrdenesDeCompraReporte
};

export default ReactMenu;
