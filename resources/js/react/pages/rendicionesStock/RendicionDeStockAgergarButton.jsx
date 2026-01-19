import React, {useState} from 'react';
import {Button} from "@/components/Buttons.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {ModalDialog} from "@/components/Modal.jsx";
import {useUsuarioSucursalesHabilitadas} from "@/dataHooks/useUsuarioHooks.jsx";
import {useAuthUsuario} from "@/dataHooks/useAuthUsuario.jsx";
import {Select} from "@/components/Select.jsx";
import {useRubros} from "@/dataHooks/useRubros.jsx";
import {RendicionesStock} from "@/pages/rendicionesStock/index.jsx";
import RendicionesDeStock from "@/resources/RendicionesDeStock.jsx";

export const RendicionDeStockAgergarButton = ({
                                                  onAgregarRendicionDeStock = () => {
                                                  }
                                              }) => {
    const {data: authUser, isLoading: loadingUser} = useAuthUsuario();
    const {data, isLoading, isRefetching} = useUsuarioSucursalesHabilitadas({usuarioId: authUser?.id});
    const {data: rubros, isLoading: isLoadingRubros, isRefetching: isRefetchingRubros} = useRubros();

    const [agregarArreglo, setAgregarArreglo] = useState(false);
    const [sucursal, setSucursal] = useState(false);
    const [rubro, setRubro] = useState(false);
    const [error, setError] = useState(false);
    const [adding, setAdding] = useState(false);

    const loading = loadingUser || isLoading || isRefetching || isLoadingRubros || isRefetchingRubros || adding;

    const onAgregarRendicionClick = () => {
        setError(false);
        if (!rubro) {
            setError('Debe seleccionar un rubro');
            return;
        }
        if (!sucursal) {
            setError('Debe seleccionar una sucursal');
            return;
        }

        setAdding(true);

        const rendicionStockResource = new RendicionesDeStock();

        rendicionStockResource.create(rubro, sucursal)
            .then((response) => {
                onAgregarRendicionDeStock(response);
                setAgregarArreglo(false);
            })
            .finally(() => {
                setAdding(false);
            })
            .catch(error => {
                setError(error?.message ?? error);
            });
    }

    return (
        <ErrorBoundary>
            <div className={'w-full mt-4 '}>
                <Button className={'mt-0! bg-pink-500! '} onClick={() => setAgregarArreglo(true)}>
                    Agregar arreglo
                </Button>
            </div>
            <ModalDialog title={'Agregar arreglo de stock'} showModal={agregarArreglo}
                         onCloseModal={() => setAgregarArreglo(loading)}>
                <div className="flex-auto p-6 ">
                    <div className="mb-4">
                        <Select
                            options={data?.map((sucursal) => ({value: sucursal.id, label: sucursal.nombre}))}
                            value={sucursal}
                            isLoading={loading}
                            setValue={setSucursal}
                            placeholder="Seleccione una sucursal"
                        />
                    </div>
                    <div className="mb-2">
                        <Select
                            options={rubros?.map((rubro) => ({value: rubro.id, label: rubro.nombre}))}
                            value={rubro}
                            isLoading={loading}
                            setValue={setRubro}
                            placeholder="Seleccione un rubro"
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm mb-4">{error}</div>
                    )}
                    <div className="text-center">
                        <Button type="button"
                                onClick={onAgregarRendicionClick}
                                className={' w-full  bg-pink-500! '}
                                disabled={loading || sucursal === null}>{loading ? 'Aguarde...' : 'Continuar'}</Button>
                    </div>
                </div>
            </ModalDialog>
        </ErrorBoundary>
    );

}
