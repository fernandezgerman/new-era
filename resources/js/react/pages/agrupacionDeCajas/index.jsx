import React, {useState} from 'react';
import {PageHeader} from "@/components/H.jsx";
import {Table} from "@/components/Table.jsx";
import {AddAgrupacionModal} from "@/pages/agrupacionDeCajas/AddAgrupacionModal.jsx";
import AgrupacionDeCajas from "@/resources/AgrupacionDeCajas.jsx";
import {useAgrupacionCajas} from "@/dataHooks/useAgrupacionCajas.jsx";
import {LabelError} from "@/components/Label.jsx";
import {DeleteIconButton, EditIconButton, ViewIconButton} from "@/components/Buttons.jsx";
import {AgrupacionCaja} from "@/widgets/AgrupacionDeCaja/index.jsx";

const ColumnaAgrupada = ({children}) => {
    return (<div className={' p-0.5 px-2 mt-1 text-[12px] w-fit rounded-2xl bg-blue-500 text-white'}>
        {children}
    </div>);
}
export const AgrupacionDeCajasLista = () => {

    const [addAgrupacionCaja, setAddAgrupacionCaja] = useState(false);
    const [agrupacionSeleccionada, setAgrupacionSeleccionada] = useState(null);
    const [agrupacionView, setAgrupacionView] = useState(null);
    const {data: agrupaciones, isLoading, isRefetching, refetch} = useAgrupacionCajas();
    const [errorMessage, setErrorMessage] = useState('');

    const openModal = () => {
        setAddAgrupacionCaja({});
    }

    const onDelete = (agrupacionId) => {
        const resource = new AgrupacionDeCajas();
        resource.deleteAgrupacionCaja(agrupacionId).then(() => {
            refetch();
        }).catch((error) => {
            setErrorMessage(error?.message ?? error)
        });

    }
    const onSave = async (agrupacionCaja) => {
        const resource = new AgrupacionDeCajas();

        setErrorMessage('');
        await resource.saveAgrupacionCaja(
            {
                descripcion: agrupacionCaja.descripcion,
                importeinicial: agrupacionCaja.importeinicial,
                activo: agrupacionCaja.activo,
                id: agrupacionCaja.id
            },
            agrupacionCaja.cajas,
            agrupacionCaja.usuarios
        ).then(() => {
            refetch();

        }).catch(error => {
            setErrorMessage(error?.message ?? error);
        });

        return errorMessage;
    }

    const header = [
        {
            name: 'Descripcion'
        },
        {
            name: 'Visible para:'
        },
        {
            name: 'Cajas Agrupadas:'
        },
        {}
    ];
    const data = agrupaciones?.map((agrupacion) => ({
        key: agrupacion.id,
        className: '',
        content: [
            {
                content: agrupacion.descripcion + (agrupacion.activo ? '' : ' (INACTIVO)'),
                key: agrupacion.id + '-descripcion',
                className: ' pt-2 '
            },
            {
                content: agrupacion.usuarios.map((usuario) =>
                    <ColumnaAgrupada>{usuario.usuario.nombre + ' ' + usuario.usuario.apellido}</ColumnaAgrupada>),
                key: agrupacion.id + '-usuario',
                className: ' pt-2 '
            },
            {
                content: agrupacion.cajas.map((usuario) =>
                    <ColumnaAgrupada>{usuario.sucursal.nombre + '/' + usuario.usuario.nombre + ' ' + usuario.usuario.apellido}</ColumnaAgrupada>),
                key: agrupacion.id + '-cajas',
                className: ' pt-2 '
            },
            {
                content: <>

                    <ViewIconButton onClick={() => setAgrupacionView(agrupacion)} />
                    <EditIconButton onClick={() => setAgrupacionSeleccionada({...agrupacion})}/>
                    <DeleteIconButton onClick={() => onDelete(agrupacion.id)} withConfirmation
                                      confirmationTitle={<>Esta seguro que desea eliminar la agrupacion de
                                          caja <b>{agrupacion.descripcion}</b></>}/>

                </>,
                key: agrupacion.id + '-iconos',
                className: ' pt-2 '
            }
        ]
    })) ?? [];

    const onViewAgrupacionBack = () => {
        setAgrupacionView(null);
    }

    return <>
        {agrupacionView === null && (
            <>
                <AddAgrupacionModal onSave={onSave}
                                    agrupacionSeleccionada={agrupacionSeleccionada}
                                    addAgrupacionCaja={addAgrupacionCaja}
                                    setAddAgrupacionCaja={setAddAgrupacionCaja}/>

                <PageHeader
                    onAdd={() => setAgrupacionSeleccionada({})}
                    onRefresh={refetch}
                    loading={isRefetching}
                >
                    Agrupacion de cajas
                </PageHeader>
                <br/>
                {errorMessage && <LabelError className={'m-2'}>{errorMessage}</LabelError>}
                <Table
                    isLoading={isLoading || isRefetching}
                    destacarColumnasPares
                    header={header}
                    data={data}
                    emptyText={'No se encontraron registros'}
                />
            </>)}
        {agrupacionView !== null && <AgrupacionCaja agrupacionCajaId={agrupacionView.id} onBack={onViewAgrupacionBack}/>}
    </>;
}
