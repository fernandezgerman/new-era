import React, {useEffect, useState} from 'react';
import {PageHeader} from "@/components/H.jsx";
import {useAccesosPorHora, useDeleteAccesoPorHora} from "@/dataHooks/useAccesosPorHora.jsx";
import {AddAccesosAlSistema} from "@/widgets/AccesosAlSistema/addAccesosAlSistema.jsx";
import {Table} from "@/components/Table.jsx";
import {DeleteIconButton, EditIconButton} from "@/components/Buttons.jsx";
import {ChipBlue, ChipGreen, ChipRed} from "@/components/Chip.jsx";
import {LabelError} from "@/components/Label.jsx";

export const AccesosAlSistema = () => {

    const [addAccesosAlSistema, setAddAccesosAlSistema] = useState(false);
    const [accesoSeleccionado, setAccesoSeleccionado] = useState(null);
    const {data: accesos, isLoading, refetch, isRefetching, isError, error} = useAccesosPorHora();

    const {mutate: deleteAcceso} = useDeleteAccesoPorHora();

    const loading = isLoading || isRefetching;

    const onDelete = (id) => {
        deleteAcceso(id, {
            onSuccess: () => {
                refetch();
            }
        });
    }

    const header = [
        {name: 'Acción'},
        {name: 'Target'},
        {name: 'Momento'},
        {name: 'Horario'},
        {}
    ];

    const data = accesos?.map((acceso) => {
        let targetText = 'Todos';
        if (acceso.targettype === 'Usuario' || acceso.targettype === 'App\\Models\\User') {
            targetText = `Usuario: ${acceso.target?.nombre || ''} ${acceso.target?.apellido || ''}`;
        } else if (acceso.targettype === 'Perfil' || acceso.targettype === 'App\\Models\\Perfil') {
            targetText = `Perfil: ${acceso.target?.nombre || ''}`;
        }

        let momentoText = 'Siempre';
        if (acceso.diadelasemana) {
            const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            momentoText = `${dias[acceso.diadelasemana] || acceso.diadelasemana}`;
        } else if (acceso.fecha) {
            momentoText = `${acceso.fecha}`;
        }

        const showHora = (desde, hasta) => {

            if( desde === null && hasta === null)
            {
                return 'Siempre';
            }
            if( desde === null)
            {
                desde = '00:00 hs';

            }else {
                desde = desde+':00 hs';
            }

            if( hasta === null)
            {
                hasta = '23:59 hs';
            }else{
                hasta = hasta +':00 hs';
            }

            return `${desde} - ${hasta}`;
        }

        const ComponentAccion = (acceso.accion === 'Restringir' ? ChipRed : ChipGreen);

        return {
            key: acceso.id,
            content: [
                {content: <ComponentAccion>{acceso.accion}</ComponentAccion>, key: acceso.id + '-accion', className: ' pt-2 '},
                {content: <ChipBlue>{targetText}</ChipBlue>, key: acceso.id + '-target', className: ' pt-2 '},
                {content: <ChipBlue> {momentoText}</ChipBlue>, key: acceso.id + '-momento', className: ' pt-2 '},
                {content: <ChipBlue>{showHora(acceso.horadesde, acceso.horahasta)}</ChipBlue>, key: acceso.id + '-horario', className: ' pt-2 '},
                {
                    content: <>
                        <EditIconButton onClick={() => {
                            setAccesoSeleccionado(acceso);
                            setAddAccesosAlSistema(true);
                        }}/>
                        <DeleteIconButton
                            onClick={() => onDelete(acceso.id)}
                            withConfirmation
                            confirmationTitle={<>¿Está seguro que desea eliminar este acceso?</>}
                        />
                    </>,
                    key: acceso.id + '-iconos',
                    className: ' pt-2 '
                }
            ]
        };
    }) ?? [];

    useEffect(() => {
        if(accesoSeleccionado !== null)
        {
            setAddAccesosAlSistema(true);
        }
    }, [accesoSeleccionado]);
    return <>
        <PageHeader
            onAdd={() => {
                setAccesoSeleccionado({
                    accion: 'Restringir',
                    targettype: null,
                    target: null,
                    tipodemomento: null,
                    diadelasemana: null,
                    fecha: null,
                    horadesde: 'Todos',
                    horahasta: 'Todos',
                });
            }}
            loading={loading}
            onRefresh={refetch}
        >
            <AddAccesosAlSistema
                isOpen={addAccesosAlSistema}
                setIsOpen={setAddAccesosAlSistema}
                accesoSeleccionado={accesoSeleccionado}
            />
            Accessos al sistema por hora
        </PageHeader>
        <br/>
        {!isError && <Table
            isLoading={loading}
            destacarColumnasPares
            header={header}
            data={data}
            emptyText={'No se encontraron registros'}
        />}
        {isError && <LabelError>{(error instanceof Error ? error.message : 'Error desconocido al cargar los accesos')}</LabelError>}
    </>;
}
