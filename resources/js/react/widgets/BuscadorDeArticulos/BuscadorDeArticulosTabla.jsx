import React, {useEffect, useRef} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {DivCenterContentHyV} from '@/components/Containers/DivCenterContentHyV.jsx';
import {processNumber} from '@/utils/numbers.jsx';
import {
    getArticuloPrecioLista,
    getArticuloRubroNombre,
} from './buscadorDeArticulosUtils.jsx';

const selectedRowClass = ' bg-green-600! text-white! text-base! font-semibold! ';
const rowClass = ' cursor-pointer text-sm ';

const ArticuloResultadoFila = ({
    articulo,
    isSelected,
    onSelect,
    rowRef,
}) => (
    <tr
        ref={rowRef}
        className={
            (isSelected ? selectedRowClass : rowClass)
            + (isSelected ? ' hover:bg-green-600! ' : ' hover:bg-slate-100 dark:hover:bg-slate-800 ')
        }
        onClick={() => onSelect(articulo.id)}
    >
        <td className={'px-2 py-2'}>{articulo.codigo ?? '-'}</td>
        <td className={'px-2 py-2'}>{articulo.nombre ?? '-'}</td>
        <td className={'px-2 py-2'}>{getArticuloRubroNombre(articulo)}</td>
        <td className={'px-2 py-2 text-right'}>{processNumber(articulo.costo ?? 0, 2, false, '$')}</td>
        <td className={'px-2 py-2 text-right'}>{processNumber(getArticuloPrecioLista(articulo) ?? 0, 2, false, '$')}</td>
    </tr>
);

export const BuscadorDeArticulosTabla = ({
    articulos = [],
    selectedArticuloId = null,
    onSelectArticulo,
    isLoading = false,
    hasSearched = false,
}) => {
    const rowRefs = useRef({});

    useEffect(() => {
        if (selectedArticuloId == null) {
            return;
        }

        rowRefs.current[selectedArticuloId]?.scrollIntoView({
            block: 'nearest',
        });
    }, [selectedArticuloId, articulos]);

    if (!hasSearched) {
        return (
            <div className={'  items-center justify-center w-full p-6 text-slate-600 dark:text-slate-400'}>
                Complete los filtros y presione Buscar.
            </div>
        );
    }

    if (!isLoading && articulos.length === 0) {
        return (
            <div className={'w-full p-6 text-slate-600 dark:text-slate-400  items-center justify-center'}>
                No se encontraron artículos para los filtros indicados.
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className={'max-h-[calc(100vh-420px)] overflow-y-auto'}>
                <table className={'table w-full'}>
                    <thead>
                        <tr>
                            <th className={'sticky top-0  bg-white px-2 py-2 text-left text-xxs font-bold uppercase text-slate-500 dark:bg-slate-900'}>Código</th>
                            <th className={'sticky top-0  bg-white px-2 py-2 text-left text-xxs font-bold uppercase text-slate-500 dark:bg-slate-900'}>Nombre</th>
                            <th className={'sticky top-0  bg-white px-2 py-2 text-left text-xxs font-bold uppercase text-slate-500 dark:bg-slate-900'}>Rubro</th>
                            <th className={'sticky top-0  bg-white px-2 py-2 text-right text-xxs font-bold uppercase text-slate-500 dark:bg-slate-900'}>Costo</th>
                            <th className={'sticky top-0  bg-white px-2 py-2 text-right text-xxs font-bold uppercase text-slate-500 dark:bg-slate-900'}>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articulos.map((articulo) => (
                            <ArticuloResultadoFila
                                key={articulo.id}
                                articulo={articulo}
                                isSelected={Number(selectedArticuloId) === Number(articulo.id)}
                                onSelect={onSelectArticulo}
                                rowRef={(element) => {
                                    if (element) {
                                        rowRefs.current[articulo.id] = element;
                                        return;
                                    }
                                    delete rowRefs.current[articulo.id];
                                }}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </ErrorBoundary>
    );
};
