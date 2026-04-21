import React, {useState, useEffect} from 'react';
import {BarChart} from '@mui/x-charts/BarChart';
import {GradientBar} from "@/components/GrediantBar.jsx";
import moment from "moment";
import {useGraficosSobrantesVsArreglos} from "@/dataHooks/useRendicionStock.jsx";
import {ViewIconButton} from "@/components/Buttons.jsx";
import {H1, H3} from "@/components/H.jsx";
import {Loading} from "@/components/Loading.jsx";

export const ArreglosChart = ({handleSelectSemana})=> {

    const { data, isLoading } = useGraficosSobrantesVsArreglos(moment().format('YYYY-MM-DD'), 6); //moment().format('YYYY-MM-DD'), 6);

    if(!data) return <Loading className={'mt-5 col-span-8 text-center w-full'}/>;
    const dataset = data.map((record) => {
        return {
            semana: record.semana,
            arreglos: record.arreglos,
            sobrantes: record.sobrantes,
            variacion: record.variacion,
            desde: record.desde,
            hasta: record.hasta,
        }
    });
// Formatter reutilizable (el que más vas a usar)
    const valueFormatter = (value) => {
        if (value == null) return '';
        let text;

        if(value > 1000) {
            text = (value / 1000).toFixed(1) + 'K';
        }
        if(value > 1000000) {
            text = (value / 1000000).toFixed(1) + 'M';
        }
        return text;

    };

    const whiteBarLabel = (item) => {
        const formatted = valueFormatter(item.value);
//        if (!formatted) return null;

        return (formatted);
    };

    const formatSemanasText = (item) => {

        return <span className={'text-geen-500'}>{item.value}</span>;
    };

    const handleOnClickSemana = (semana) => {
        handleSelectSemana(semana.desde,   semana.hasta, semana );
    }

    return (
        <>
            <H3>Mis Indicadores</H3>
            <BarChart
                dataset={dataset}
                xAxis={[{
                    scaleType: 'band',
                    dataKey: 'semana',
/*                    label: 'Semana',
                    tickLabelStyle: { fill: '#ddd' },
                    labelStyle:{fill: '#ddd'},*/
                    barLabel: formatSemanasText,
                }]}
                yAxis={[{
                    label: 'Importe en pesos',
                    valueFormatter: valueFormatter,  // ← Formato en el eje Y y tooltip
                    labelStyle:{fill: '#ddd'},
                    tickLabelStyle: { fill: '#ddd' },
                }]}
                series={[
                    {
                        dataKey: 'arreglos',
                        label: <span className={'text-white bg-gray-800 p-1 rounded '}> Arreglos</span>,
                        color: '#ef4444',
                        labelStyle:{fill: '#ddd'},
                        valueFormatter: valueFormatter,        // tooltip
                        barLabel: whiteBarLabel,
                    },
                    {
                        dataKey: 'sobrantes',
                        label: <span className={'text-white bg-gray-800 p-1 rounded '}> Sobrantes</span>,
                        color: '#22c55e',
                        valueFormatter: valueFormatter,
                        barLabel: whiteBarLabel,
                    },
                    {
                        dataKey: 'variacion',
                        label: <span className={'text-white bg-gray-800 p-1 rounded '}> Final</span>,
                        color: '#f88e15',
                        valueFormatter: valueFormatter,           // con signo +/-
                        barLabel: whiteBarLabel,
                    }
                ]}
                height={450}
                barLabel="value"   // si querés mostrar siempre el valor (se puede combinar con función)
                sx={{
                    '& .MuiChartsAxis-tickLabel': { fill: '#e2e8f0' },
                    '& .MuiChartsAxis-label': { fill: '#ddd' },
                    // Extra: si querés mejorar el label de las barras
                    '& .MuiBarLabel-root': {
                        fontSize: 13,
                        fill: '#ddd',
                        fontWeight: 600,
                    }
                }}

            />
            <div className={'grid grid-cols-6 ne-dark-body! text-white w-[calc(100%-110px)] top-[-35px] relative h-10 ml-[88px] '}>
                {dataset.map((header) => <div className={'text-center text-xs'}><ViewIconButton onClick={() => handleOnClickSemana(header)}  className={'text-xs p-0.5'}/> {header.semana} </div>)}
            </div>
        </>
    );
};
