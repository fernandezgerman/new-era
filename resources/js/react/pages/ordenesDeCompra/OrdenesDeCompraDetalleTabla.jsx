import React, {useMemo} from 'react';
import {Table} from '@/components/Table.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {buildArticulosMap} from './ordenesDeCompraUtils.jsx';

const DETALLE_HEADER = [
    {key: 'codigo', name: 'Código', className: 'text-left'},
    {key: 'articulo', name: 'Artículo', className: 'text-left'},
    {key: 'rubro', name: 'Rubro', className: 'text-left'},
    {key: 'cantidad', name: 'Cantidad', className: 'text-right'},
    {key: 'estimado', name: 'Estimado', className: 'text-right'},
];

export const OrdenesDeCompraDetalleTabla = ({detalles, articulosCatalog = []}) => {
    const articulosMap = useMemo(
        () => buildArticulosMap(articulosCatalog),
        [articulosCatalog],
    );

    const tableData = useMemo(() => {
        let totalCantidad = 0;
        let totalEstimado = 0;

        const rows = (detalles ?? []).map((det, idx) => {
            const articulo = det.articulo;
            const cantidad = Number(det?.cantidad) || 0;
            const costo = Number(det?.costoestimado) || 0;
            const subtotal = cantidad * costo;
            totalCantidad += cantidad;
            totalEstimado += subtotal;

            return {
                key: 'det-' + (det?.id ?? idx),
                className: 'border-b border-slate-300 dark:border-slate-600 text-white! ',
                content: [
                    {
                        key: 'codigo',
                        content: articulo?.codigo ?? det?.idarticulo ?? '—',
                        className: 'whitespace-nowrap text-white! ',
                    },
                    {
                        key: 'articulo',
                        content: articulo?.nombre ?? articulo?.descripcion ?? '—',
                        className: 'max-w-[14rem] truncate text-white! ',
                    },
                    {
                        key: 'rubro',
                        content: articulo?.rubro?.nombre ?? '—',
                        className: 'max-w-[12rem] truncate text-white! ',
                    },
                    {
                        key: 'cantidad',
                        content: processNumber(cantidad, 0, false, '#'),
                        className: 'text-right whitespace-nowrap text-white! ',
                    },
                    {
                        key: 'estimado',
                        content: processNumber(subtotal, 2, false, '$'),
                        className: 'text-right whitespace-nowrap text-white! ',
                    },
                ],
            };
        });

        if (rows.length > 0) {
            rows.push({
                key: 'det-total',
                className: 'font-semibold border-t border-slate-300 dark:border-slate-600',
                content: [
                    {key: 'codigo', content: 'Total', colSpan: 3},
                    {
                        key: 'cantidad',
                        content: processNumber(totalCantidad, 0,false, '#'),
                        className: 'text-right whitespace-nowrap',
                    },
                    {
                        key: 'estimado',
                        content: processNumber(totalEstimado, 2, false, '$'),
                        className: 'text-right whitespace-nowrap',
                    },
                ],
            });
        }

        return rows;
    }, [detalles, articulosMap]);

    return (
        <div className={'mt-4 ml-2 border-l-2 border-pink-500 pl-4 '}>
            <Table
                header={DETALLE_HEADER}
                data={tableData}
                emptyText={'Sin artículos en esta orden.'}
                containerClassName={'overflow-x-auto '}
            />
        </div>
    );
};
