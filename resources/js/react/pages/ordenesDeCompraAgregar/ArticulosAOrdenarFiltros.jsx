import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Input} from '@/components/Input.jsx';
import {Checkbox} from '@/components/Checkbox.jsx';
import {SelectRubro} from '@/components/selects/SelectRubro.jsx';
import {SelectSucursal} from '@/components/selects/SelectSucursales.jsx';
import {SelectMarca} from '@/components/selects/SelectMarca.jsx';

export const ArticulosAOrdenarFiltros = ({
                                             rubros,
                                             setRubros,
                                             sucursal,
                                             setSucursal,
                                             diasventas,
                                             setDiasventas,
                                             marcas,
                                             setMarcas,
                                             soloStockActivo,
                                             setSoloStockActivo,
                                             soloVendidos,
                                             setSoloVendidos,
                                             fieldErrors = {},
                                             disabled = false,
                                         }) => {
    return (
        <ErrorBoundary>
            <div className={'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'}>
                <div>
                    <SelectSucursal
                        sucursal={sucursal}
                        setSucursal={setSucursal}
                        label={'Sucursal'}
                        placeHolder={'Seleccione una sucursal'}
                        errorMessage={fieldErrors.sucursal}
                        disabled={disabled}
                    />
                </div>
                <div>
                    <SelectRubro
                        multiple
                        rubro={rubros}
                        setRubro={setRubros}
                        label={'Rubros'}
                        placeHolder={'Seleccione uno o más rubros'}
                        errorMessage={fieldErrors.rubros}
                        disabled={disabled}
                    />
                </div>
                <div>
                    <Input
                        type={'number'}
                        value={diasventas ?? ''}
                        setValue={(val) => setDiasventas(Number.isFinite(val) ? parseInt(val, 10) : null)}
                        label={'Días de ventas'}
                        placeHolder={'Ej: 30'}
                        className={'mt-0'}
                        maxCharacters={3}
                        errorMessage={fieldErrors.diasventas}
                        disabled={disabled}
                    />
                </div>
                <div>
                    <SelectMarca
                        marca={marcas}
                        setMarca={setMarcas}
                        label={'Marcas (opcional)'}
                        placeHolder={'Seleccione marcas'}
                        errorMessage={fieldErrors.marcas}
                        disabled={disabled}
                    />
                </div>
                <div>
                    <Checkbox
                        label={'Solo stock activo'}
                        value={soloStockActivo}
                        onChange={setSoloStockActivo}
                        checkboxClassName={'mt-2'}
                        className={'mt-0 text-center'}
                        left={true}
                    />
                </div>
                <div>
                    <Checkbox
                        checkboxClassName={'mt-2'}
                        label={'Solo vendidos'}
                        value={soloVendidos}
                        onChange={setSoloVendidos}
                        className={'mt-0 text-center'}
                        left={true}
                    />
                </div>

            </div>
        </ErrorBoundary>
    );
};
