import React, {useEffect, useState} from 'react';

import {PageHeader} from "@/components/H.jsx";
import StyledLineChart from "@/pages/ValorizacionHistorico/ValorizacionHistoricoChart.jsx";
import {useQuery} from "@tanstack/react-query";
import {useValorizacionHistorico} from "@/dataHooks/useValorizacionHistorico.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {LabelError} from "@/components/Label.jsx";


const ValorizacionHistoricoHeader = ({refetch, isLoading}) => {
    return (<PageHeader
        onRefresh={refetch}
        isLoading={isLoading}
    >
        Valorizacion Historico
    </PageHeader>);
}
export const ValorizacionHistorico = ({}) => {

    const [sucursales, setSucursales] = useState([]);
    const {data, isLoading, isRefetching, refetch, isError, error}
        = useValorizacionHistorico(sucursales.map(sucursal => sucursal.id));

    const loading = isLoading || isRefetching;
    return (
        <ErrorBoundary>
            <ValorizacionHistoricoHeader refetch={refetch} isLoading={loading}/>
            {loading && <div className={'text-center mt-10'}>Cargando...</div>}
            {isError && <LabelError>Error: {error?.message}</LabelError>}
            {data && !loading && <StyledLineChart data={data} sucursales={sucursales} setSucursales={setSucursales} />}
        </ErrorBoundary>);
}
