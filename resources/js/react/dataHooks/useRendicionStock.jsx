import Resource from "../resources/Resource.jsx";
import {useQuery} from "@tanstack/react-query";
import Authentication from "../resources/Authentication.jsx";
import Cajas from "@/resources/Cajas.jsx";
import RendicionesStock from "@/resources/RendicionesStock.jsx";

const useGraficosSobrantesVsArreglos = (fechaDesde, semanas) => {
    return useQuery({
        queryKey: ['getGraficosSobrantesVsArreglos' + fechaDesde + '-' + semanas],
        queryFn: async () => {
            const objRendicionesStock = new RendicionesStock();
            return await objRendicionesStock.getGraficosSobrantesVsArreglos(fechaDesde, semanas);
        },
        enabled: !!fechaDesde && !!semanas,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 1 hours
    });
}

const useGraficosArreglosPorSucursal = (fechaDesde, fechaHasta) => {
    return useQuery({
        queryKey: ['getGraficosSobrantesVsArreglosPorSucursal' + fechaDesde + '-' + fechaHasta],
        queryFn: async () => {
            const objRendicionesStock = new RendicionesStock();
            return await objRendicionesStock.getGraficosSobrantesVsArreglosPorSucursal(fechaDesde, fechaHasta);
        },
        enabled: !!fechaDesde && !!fechaHasta,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 1 hours
    });
}

const useGraficosArreglosPorArticulosSucursal = (fechaDesde, fechaHasta, idsucursal) => {
    return useQuery({
        queryKey: ['getGraficosSobrantesVsArreglosArticulosPorSucursal' + fechaDesde + '-' + fechaHasta + '-' + idsucursal],
        queryFn: async () => {
            const objRendicionesStock = new RendicionesStock();
            return await objRendicionesStock.getGraficosSobrantesVsArreglosArticulosPorSucursal(fechaDesde, fechaHasta, idsucursal);
        },
        enabled: !!fechaDesde && !!fechaHasta,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 1 hours
    });
}

const useGraficosArreglosPorArticuloSucursal = (fechaDesde, fechaHasta, idsucursal, idarticulo) => {
    return useQuery({
        queryKey: ['getGraficosSobrantesVsArreglosArticuloPorSucursal' + fechaDesde + '-' + fechaHasta + '-' + idsucursal + '-' + idarticulo],
        queryFn: async () => {
            const objRendicionesStock = new RendicionesStock();
            return await objRendicionesStock.getGraficosSobrantesVsArreglosArticuloPorSucursal(fechaDesde, fechaHasta, idsucursal, idarticulo);
        },
        enabled: !!fechaDesde && !!fechaHasta && !!idsucursal && !!idarticulo,
        select: (data) => data,
        staleTime: 1000 * 60 * 60 * 1, // 1 hours
    });
}

export { useGraficosArreglosPorArticuloSucursal, useGraficosArreglosPorArticulosSucursal, useGraficosSobrantesVsArreglos, useGraficosArreglosPorSucursal };
