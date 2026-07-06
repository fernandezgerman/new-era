import React from 'react';
import {useCaja} from "@/dataHooks/useCajas.jsx";
import {Loading} from "@/components/Loading.jsx";
import {PageHeader} from "@/components/H.jsx";
import {CajaWidget} from "@/widgets/CajaDetalle/CajaWidget.jsx";
export const CajaDetalle = ({idUsuario,idSucursal, numeroCaja}) => {


    const {data: caja, isLoading, isRefetching, refetch } = useCaja(idUsuario,idSucursal, numeroCaja);
    const loading = isLoading || isRefetching;

    return (
        <div className={'h-full '}>
            {loading && (<Loading className={'text-center mt-10'} />)}
            {!loading && caja && (<CajaWidget caja={caja} refetch={refetch} />)}

        </div>);

}
