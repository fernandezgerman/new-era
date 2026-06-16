import React, {useMemo} from 'react';
import moment from 'moment';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {AlternativeCard} from '@/components/Card.jsx';
import {Table} from '@/components/Table.jsx';
import {Label} from '@/components/Label.jsx';
import {processDate} from '@/utils/dates.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {ArticulosAOrdenarProveedorNombre} from './ArticulosAOrdenarProveedorNombre.jsx';
import {ArticulosAOrdenarMejorPrecioAward} from './ArticulosAOrdenarMejorPrecioAward.jsx';

const COMPRAS_HEADER = [
    {name: 'Proveedor', className: 'text-left'},
    {name: 'Fecha', className: 'text-left'},
    {name: 'Sucursal', className: 'text-left'},
    {name: 'Cantidad', className: 'text-right'},
    {name: 'Costo c/imp.', className: 'text-right'},
    {name: '', className: 'w-8'},
];

const LISTAS_PRECIOS_HEADER = [
    {name: 'Proveedor', className: 'text-left'},
    {name: 'Descripción', className: 'text-left'},
    {name: 'Fecha lista', className: 'text-left'},
    {name: 'Precio', className: 'text-right'},
    {name: '', className: 'w-8'},
];

const ROW_BASE_CLASS = 'border-b border-slate-200 dark:border-slate-700!';
const CELL_BASE_CLASS = 'text-sm text-slate-800 dark:text-slate-100!';
const CELL_RIGHT_CLASS = 'text-sm text-right text-slate-800 dark:text-slate-100!';
const BOLD_ROW_CLASS = ' font-bold italic ';
const BOLD_CELL_CLASS = ' font-bold text-slate-900 dark:text-slate-50! ';

const buildCompraRowKey = (detalle, idx) =>
    'compra-' + (detalle?.id ?? 'x') + '-' + idx;

const buildListaRowKey = (lista, idx) =>
    'lista-' + (lista?.id ?? 'x') + '-' + idx;

const getLowestPriceRowKeys = (ultimasCompras = [], listasPrecios = []) => {
    const candidates = [];

    ultimasCompras.forEach((detalle, idx) => {
        const precio = Number(detalle?.costo_con_impuestos);
        if (Number.isFinite(precio) && precio > 0) {
            candidates.push({
                key: buildCompraRowKey(detalle, idx),
                precio,
            });
        }
    });

    listasPrecios.forEach((lista, idx) => {
        const precio = Number(lista?.precio);
        if (Number.isFinite(precio) && precio > 0) {
            candidates.push({
                key: buildListaRowKey(lista, idx),
                precio,
            });
        }
    });

    if (candidates.length === 0) {
        return new Set();
    }

    const minPrecio = Math.min(...candidates.map((c) => c.precio));

    return new Set(
        candidates
            .filter((c) => c.precio === minPrecio)
            .map((c) => c.key),
    );
};

const withBoldRow = (rowKey, lowestPriceRowKeys, rowClassName, cells) => {
    const isLowestPrice = lowestPriceRowKeys.has(rowKey);

    return {
        key: rowKey,
        className: rowClassName + (isLowestPrice ? BOLD_ROW_CLASS : ''),
        content: cells.map((cell) => ({
            ...cell,
            className: (cell.className ?? '') + (isLowestPrice && cell.key !== 'award' ? BOLD_CELL_CLASS : ''),
        })),
    };
};

const buildAwardCell = (isLowestPrice) => ({
    key: 'award',
    content: isLowestPrice ? <ArticulosAOrdenarMejorPrecioAward /> : null,
    className: 'w-8 text-right',
});

export const ArticulosAOrdenarFilaDetalle = ({item, onSelectProveedor}) => {
    const ventas = item?.ventas ?? {};
    const costoConImpuestos = Number(item?.costo_con_impuestos) || 0;

    const {comprasTableData, listasPreciosTableData} = useMemo(() => {
        const ultimasCompras = item?.proveedores?.ultimas_compras ?? [];
        const listasPrecios = item?.proveedores?.listas_precios ?? [];
        const lowestPriceRowKeys = getLowestPriceRowKeys(ultimasCompras, listasPrecios);

        const compras = ultimasCompras.map((detalle, idx) => {
            const rowKey = buildCompraRowKey(detalle, idx);
            const isLowestPrice = lowestPriceRowKeys.has(rowKey);

            return withBoldRow(rowKey, lowestPriceRowKeys, ROW_BASE_CLASS, [
                {
                    key: 'proveedor',
                    content: (
                        <ArticulosAOrdenarProveedorNombre
                            proveedor={detalle?.compra?.proveedor}
                            onSelectProveedor={onSelectProveedor}
                        />
                    ),
                    className: CELL_BASE_CLASS,
                },
                {
                    key: 'fecha',
                    content: detalle?.compra?.fechaemision
                        ? processDate(moment(detalle.compra.fechaemision), true, false)
                        : '—',
                    className: CELL_BASE_CLASS + ' whitespace-nowrap',
                },
                {
                    key: 'sucursal',
                    content: detalle?.compra?.sucursal?.nombre ?? '—',
                    className: CELL_BASE_CLASS,
                },
                {
                    key: 'cantidad',
                    content: processNumber(Number(detalle?.cantidad) || 0, 0, false, '#'),
                    className: CELL_RIGHT_CLASS,
                },
                {
                    key: 'costo',
                    content: processNumber(Number(detalle?.costo_con_impuestos) || 0, 2, false, '$'),
                    className: CELL_RIGHT_CLASS,
                },
                buildAwardCell(isLowestPrice),
            ]);
        });

        const listas = listasPrecios.map((lista, idx) => {
            const rowKey = buildListaRowKey(lista, idx);
            const isLowestPrice = lowestPriceRowKeys.has(rowKey);

            return withBoldRow(rowKey, lowestPriceRowKeys, ROW_BASE_CLASS, [
                {
                    key: 'proveedor',
                    content: (
                        <ArticulosAOrdenarProveedorNombre
                            proveedor={lista?.proveedor_lista?.proveedor}
                            onSelectProveedor={onSelectProveedor}
                        />
                    ),
                    className: CELL_BASE_CLASS,
                },
                {
                    key: 'descripcion',
                    content: lista?.descripciondelproveedor ?? '—',
                    className: CELL_BASE_CLASS,
                },
                {
                    key: 'fechalista',
                    content: lista?.fechalista
                        ? processDate(moment(lista.fechalista), true)
                        : '—',
                    className: CELL_BASE_CLASS + ' whitespace-nowrap',
                },
                {
                    key: 'precio',
                    content: processNumber(Number(lista?.precio) || 0, 2, false, '$'),
                    className: CELL_RIGHT_CLASS,
                },
                buildAwardCell(isLowestPrice),
            ]);
        });

        return {
            comprasTableData: compras,
            listasPreciosTableData: listas,
        };
    }, [item?.proveedores?.ultimas_compras, item?.proveedores?.listas_precios, onSelectProveedor]);

    return (
        <ErrorBoundary>
            <AlternativeCard className={'mt-3 mb-1'}>
                <div className={'grid grid-cols-1 gap-3 md:grid-cols-4'}>
                    <div>
                        <Label className={'mb-1! text-center pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                            Costo con impuesto
                        </Label>
                        <p className={'text-sm font-medium text-center text-slate-900 dark:text-slate-100'}>
                            {processNumber(costoConImpuestos, 2, false, '$')}
                        </p>
                    </div>
                    <div>
                        <Label className={'mb-1! pl-0! text-center text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                            Ultima compra a
                        </Label>
                        <p className={'text-sm font-medium text-center text-slate-900 dark:text-slate-100'}>
                            <ArticulosAOrdenarProveedorNombre
                                proveedor={item?.ultima_compra?.compra?.proveedor}
                                onSelectProveedor={onSelectProveedor}
                                center
                            />
                        </p>
                    </div>
                    <div className={'relative'}>
                        <div className={'mb-1 flex items-center justify-center gap-1.5'}>
                            <Label className={'mb-0! text-center pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                                Proveedor mejor precio
                            </Label>
                            {parseInt(item?.proveedores?.recomendado?.id, 10) > 0 ? (
                                <ArticulosAOrdenarMejorPrecioAward />
                            ) : null}
                        </div>
                        <p className={'text-sm font-medium text-center text-slate-900 dark:text-slate-100'}>
                            <ArticulosAOrdenarProveedorNombre
                                proveedor={item?.proveedores?.recomendado}
                                onSelectProveedor={onSelectProveedor}
                                center
                            />
                        </p>
                    </div>
                    <div>
                        <Label className={'mb-1! text-center pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                            Ventas ultimos {ventas?.dias ?? '—'} dias
                        </Label>
                        <p className={'text-sm font-medium text-center text-slate-900 dark:text-slate-100'}>
                            {processNumber(Number(ventas?.vendido) || 0, 0, false, '#')}
                            {' '}
                            (promedio: {processNumber(Number(ventas?.promedio) || 0, 2, false, '#')})
                        </p>
                    </div>
                </div>

                <div className={'mt-4'}>
                    <Label className={'mb-2! pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                        Ultimas compras por sucursal
                    </Label>
                    <Table
                        header={COMPRAS_HEADER}
                        data={comprasTableData}
                        emptyText={'Sin compras registradas'}
                    />
                </div>

                <div className={'mt-4'}>
                    <Label className={'mb-2! pl-0! text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400'}>
                        Listas de precios de proveedores
                    </Label>
                    <Table
                        header={LISTAS_PRECIOS_HEADER}
                        data={listasPreciosTableData}
                        emptyText={'Sin listas de precios registradas'}
                    />
                </div>
            </AlternativeCard>
        </ErrorBoundary>
    );
};
