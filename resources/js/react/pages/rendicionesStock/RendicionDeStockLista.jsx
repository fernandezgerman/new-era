import React, {useEffect, useState} from 'react';
import {Card} from "@/components/Card.jsx";
import {Table} from "@/components/Table.jsx";
import {Button, EditIconButton} from "@/components/Buttons.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {HO2} from "@/components/HOverlay.jsx";
import RendicionesDeStock from "@/resources/RendicionesDeStock.jsx";
import {AlertNeutral, AlertSuccess} from "@/components/Alerts.jsx";
import {RendicionDeStockAgergarButton} from "@/pages/rendicionesStock/RendicionDeStockAgergarButton.jsx";
import {isMobile} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faSyncAlt} from "@fortawesome/free-solid-svg-icons";


export const RendicionesStockLista = ({setRendicionSeleccionada}) => {
    const [rendicionesPendientes, setRendicionesPendientes] = useState([]);
    const [error, setError] = useState(false);
    const [loadingTable, setLoadingTable] = useState(false);

    const formatFechaApertura = (value, soloHora) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d)) return String(value);
        const pad = (n) => n.toString().padStart(2, '0');
        const day = pad(d.getDate());
        const month = pad(d.getMonth() + 1);
        const year = d.getFullYear();
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return soloHora ? `${hours}:${minutes}` : `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const loadStockResource = () => {
        const rendicionStockResource = new RendicionesDeStock();
        setLoadingTable(true);
        rendicionStockResource.listToday()
            .then((result) => {
                setRendicionesPendientes(result);
            })
            .finally(() => {
                setLoadingTable(false);
            })
            .catch(error => {
                setError(error?.message ?? error);
            });
    }

    useEffect(() => {
        loadStockResource();
    }, []);

    const headers = [
        {name: 'Sucursal'},
        {name: 'Rubro'},
        {name: 'Fecha'},
        {name: 'Diferencia'},
        {name: 'Estado'}
    ];

    const headersForMobile = [
        {name: 'Listado de pendientes'},
    ];

    const CalculateDiferencia = ({rendido, sistema}) => {

        const dif = rendido - sistema;

        const color = dif < 0 ? ' text-red-800 ' : ' text-yellow-800 ';


        return <span className={color}>{dif}</span>;
    }

    const data = rendicionesPendientes.map((rendicionStock) => [
        {
            content: <><EditIconButton onClick={() => setRendicionSeleccionada(rendicionStock)} /> {rendicionStock.sucursal.nombre}</>,
        },
        {
            content: rendicionStock.rubro.nombre,
        },
        {
            content: formatFechaApertura(rendicionStock.fechaapertura),
        },
        {
            content: <CalculateDiferencia rendido={rendicionStock.valorRendido} sistema={rendicionStock.valorSistema} />,
            className: ' text-right pr-4 ',
        },
        {
            content:  rendicionStock.estado === 'PENDIENTE' ? <AlertNeutral className={'p-x-1 py-1 w-28!'}>Pendiente</AlertNeutral> : <AlertSuccess>Finalizado</AlertSuccess>,
        }
    ]);

    const dataForMobile = rendicionesPendientes.reduce((acum, rendicionStock, index) => {
        acum.push([
            {
                content: <>
                    <EditIconButton onClick={() => setRendicionSeleccionada(rendicionStock)} />
                    {formatFechaApertura(rendicionStock.fechaapertura, true) + ' - ' + rendicionStock.sucursal.nombre}
                    </>,
                colSpan: 2,
                className: (index % 2 === 0 ? '' : ' bg-gray-100 dark:ne-dark-body ') + ' justify-center p-2'
            }
            ]
        );

        acum.push([
            {
                content:  rendicionStock.rubro.nombre,
                className: (index % 2 === 0 ? '' : ' bg-gray-100  dark:ne-dark-body ') + ' pl-10 '
            },
            {
                content: <CalculateDiferencia rendido={rendicionStock.valorRendido} sistema={rendicionStock.valorSistema} />,
                className: (index % 2 === 0 ? '' : ' bg-gray-100  dark:ne-dark-body ') + ' justify-center '
            }
            ]
        );
/*
        acum.push([
                {
                    content: <Button className={'mt-1! p-2 bg-pink-500! '}>Continuar</Button>,
                    colSpan: 2,
                    className: index % 2 === 0 ? '' : ' bg-gray-100  dark:ne-dark-body '
                },
            ]
        );*/

        return acum;
    }, []);

    const onAgregarRendicionDeStock = (rendicion) => {
        setRendicionSeleccionada(rendicion);
    }

    const title = <>
        Arreglos pendientes
        <FontAwesomeIcon icon={faSyncAlt} className={' absolute right-3 cursor-pointer ' + (loadingTable ? ' animate-spin ' : '')} onClick={loadStockResource} />
    </>
    return (
        <ErrorBoundary>
            <div className={'w-full'}>
                <HO2 className="mt-5 flex justify-center ">Arreglos de stock</HO2>
                <Card loading={loadingTable} title={title} childrenClassName={'pt-0'}>
                    <p>ATENCION! Recuerde que solo se podran continuar o corregir rendiciones del dia de HOY.</p>
                    <Table header={isMobile ? headersForMobile : headers} data={isMobile ? dataForMobile : data} />
                    <div className={isMobile ? 'ml-[calc((100vw/2)-120px)] mt-3' : ''}>
                        <RendicionDeStockAgergarButton onAgregarRendicionDeStock={onAgregarRendicionDeStock} />
                    </div>
                </Card>

            </div>
        </ErrorBoundary>);
}
