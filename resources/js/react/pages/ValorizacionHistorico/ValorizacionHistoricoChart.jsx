import React, {useState, useMemo} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {LineChart, lineClasses} from '@mui/x-charts/LineChart';
import {chartsTooltipClasses} from '@mui/x-charts/ChartsTooltip';

import moment from "moment";
import {processDate} from "@/utils/dates.jsx";
import {processNumber} from "@/utils/numbers.jsx";
import {SelectSucursal} from "@/components/selects/SelectSucursales.jsx";
import {Button} from "@/components/Buttons.jsx";

const margin = {right: 24};

// ==================== COLORES FIJOS POR SERIE ====================
const SERIES_COLORS = {
    stock: '#3b82f6',     // Azul brillante
    cajas: '#10b981',     // Verde esmeralda
    ctacte: '#ef4444',    // Rojo
    val: '#8b5cf6',       // Violeta
    sugerido: '#f59e0b',  // Naranja/ámbar (destacado)
};

const STOCK = 3;
const CAJAS = 2;
const CTACTE = 1;
const VAL = 0;

export default function StyledLineChart({data, sucursales, setSucursales}) {

    const [visibleSeries, setVisibleSeries] = useState({
        stock: true,
        cajas: true,
        ctacte: true,
        val: true,
        sugerido: true,
    });

    const toggleSeries = (key) => {
        setVisibleSeries(prev => ({...prev, [key]: !prev[key]}));
    };

    const calculateValorizacion = (index) => {
        if (!data?.[STOCK] || !data?.[CAJAS] || !data?.[CTACTE] || !data?.[VAL]) return 0;

        const stock = data[STOCK].detalles[index]?.importe || 0;
        const cajas = data[CAJAS].detalles[index]?.importe || 0;
        const ctacte = data[CTACTE].detalles[index]?.importe || 0;
        const val = data[VAL].detalles[index]?.importe || 0;

        return (stock + cajas - ctacte) - val;
    };

    // ==================== SERIES CON COLORES FIJOS ====================
    const xSeries = useMemo(() => {
        const series = [];

        // Stock
        if (visibleSeries.stock && data[STOCK]) {
            series.push({
                data: data[STOCK].detalles.map(d => d.importe),
                label: data[STOCK].descripcion,
                id: `${data[STOCK].id}-ID`,
                color: SERIES_COLORS.stock,
                showMark: true,
                valueFormatter: (value) => value != null ? processNumber(value, 1, true, '$') : '',
            });
        }

        // Cajas
        if (visibleSeries.cajas && data[CAJAS]) {
            series.push({
                data: data[CAJAS].detalles.map(d => d.importe),
                label: data[CAJAS].descripcion,
                id: `${data[CAJAS].id}-ID`,
                color: SERIES_COLORS.cajas,
                showMark: true,
                valueFormatter: (value) => value != null ? processNumber(value, 1, true, '$') : '',
            });
        }

        // Cta Cte
        if (visibleSeries.ctacte && data[CTACTE]) {
            series.push({
                data: data[CTACTE].detalles.map(d => d.importe),
                label: data[CTACTE].descripcion,
                id: `${data[CTACTE].id}-ID`,
                color: SERIES_COLORS.ctacte,
                showMark: true,
                valueFormatter: (value) => value != null ? processNumber(value, 1, true, '$') : '',
            });
        }

        // VAL
        if (visibleSeries.val && data[VAL]) {
            series.push({
                data: data[VAL].detalles.map(d => d.importe),
                label: data[VAL].descripcion,
                id: `${data[VAL].id}-ID`,
                color: SERIES_COLORS.val,
                showMark: true,
                valueFormatter: (value) => value != null ? processNumber(value, 1, true, '$') : '',
            });
        }

        // Sugerido
        if (visibleSeries.sugerido && data[STOCK]) {
            series.push({
                data: data[STOCK].detalles.map((_, index) => calculateValorizacion(index)),
                label: 'Sugerido',
                id: 'Sugerido-ID',
                color: SERIES_COLORS.sugerido,
                showMark: true,
                valueFormatter: (value) => value != null ? processNumber(value, 1, true, '$') : '',
                // Línea destacada (punteada)
                strokeDasharray: '6 4',
            });
        }

        return series;
    }, [data, visibleSeries]);

    const xLabels = useMemo(() => {
        if (!data?.[0]?.detalles) return [];
        return data[0].detalles.map((item) => processDate(moment(item.fecha), true));
    }, [data]);


    return (
        <div className={' w-full h-[700px] pt-4 pr-4'}>
            {/* Controles de visibilidad */}
            <div className={' w-full grid grid-cols-6 '}>
                <div>
                    <Typography variant="subtitle2" sx={{mr: 2, fontWeight: 600}}>
                        Sucursales:
                    </Typography>
                </div>
                <div className={'col-span-5 mb-4'}>
                    <SelectSucursal placeHolder={' '} label={''} multiple={true} setSucursal={setSucursales}
                                    sucursal={sucursales} className={'w-full mb-4 '}/>
                </div>

                {/* fila 2  */}

                <div className={'row-span-2'}>
                    <Typography variant="subtitle2" sx={{mr: 2, fontWeight: 600}}>
                        Mostrar series:
                    </Typography>
                </div>

                <FormControlLabel
                    className={'col-span-2'}
                    control={<Checkbox checked={visibleSeries.stock} onChange={() => toggleSeries('stock')}
                                       color="primary"/>}
                    label={data[STOCK]?.descripcion || 'Stock'}
                />
                <FormControlLabel
                    className={'col-span-2'}
                    control={<Checkbox checked={visibleSeries.cajas} onChange={() => toggleSeries('cajas')}
                                       color="primary"/>}
                    label={data[CAJAS]?.descripcion || 'Cajas'}
                />

                <FormControlLabel
                    className={''}
                    control={<Checkbox checked={visibleSeries.sugerido} onChange={() => toggleSeries('sugerido')}
                                       color="primary"/>}
                    label="Sugerido"
                />

                <FormControlLabel
                    className={'col-span-2'}
                    control={<Checkbox checked={visibleSeries.ctacte} onChange={() => toggleSeries('ctacte')}
                                       color="primary"/>}
                    label={data[CTACTE]?.descripcion || 'Cta Cte'}
                />
                <FormControlLabel
                    className={'col-span-2'}
                    control={<Checkbox checked={visibleSeries.val} onChange={() => toggleSeries('val')}
                                       color="primary"/>}
                    label={data[VAL]?.descripcion || 'VAL'}
                />
            </div>

            {/* Gráfico */}
            <LineChart
                className={'mt-4'}
                series={xSeries}
                xAxis={[{
                    id: 'x-axis',
                    scaleType: 'point',
                    data: xLabels,
                    height: 28
                }]}
                yAxis={[{width: 50}]}

                slotProps={{
                    tooltip: {
                        trigger: 'axis',
                        position: 'left',
                        popper: {
                            sx: {
                                '& .MuiPaper-root': {
                                    backgroundColor: '#1e2937',
                                    color: '#e2e8f0',
                                    border: '1px solid #475569',
                                    borderRadius: '10px',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.4)',
                                    padding: '10px 14px',
                                    minWidth: '200px',
                                }
                            }
                        }
                    }
                }}

                sx={{
                    [`& .${chartsTooltipClasses.root}`]: {
                        backgroundColor: '#1e2937',
                        color: '#e2e8f0',
                        border: '1px solid #475569',
                        borderRadius: '10px',
                    },
                    [`& .${chartsTooltipClasses.axisValueCell}`]: {
                        color: '#94a3b8',
                        fontWeight: 600,
                    },
                    [`& .${chartsTooltipClasses.valueCell}`]: {
                        color: '#60a5fa',
                        fontWeight: 700,
                    },
                }}

                margin={margin}
            />
        </div>
    );
}
