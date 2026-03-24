import React, {useEffect, useState} from 'react';
import {PageHeader} from "@/components/H.jsx";
import {Table} from "@/components/Table.jsx";
import {LabelError} from "@/components/Label.jsx";
import {useUsuarios} from "@/dataHooks/useUsuarioHooks.jsx";
import {useAudits} from "@/dataHooks/useAudits.jsx";
import {Select} from "@/components/Select.jsx";
import {DatePicker} from "@/components/DatePicker.jsx";
import {Button, ViewIconButton} from "@/components/Buttons.jsx";
import {CustomModal} from "@/components/Modal.jsx";
import moment from "moment";
import {processDate} from "@/utils/dates.jsx";
import uuid from "react-uuid";
import {Card} from "@/components/Card.jsx";

const eventTranslate = (event) =>
{
    switch (event){
        case 'updated':
            return 'Modifico';
        case 'created':
            return 'Agrego nuevo';
        case 'deleted':
            return 'Elimino';
        default:
            return event;
    }

}
const processAuditableText = (text, event) => {
    if (!text) return text;

    const fromModels = text.replace(/App\\Models\\/g, '') !== text;

    let processed = text.replace(/\.php/g, '')
        .replace(/paginas\//g, '')
        .replace(/http:\/\/192\.168\.1\.38\//g, '')
        .replace(/http:\/\/newerakioscos\.com\//g, '')
        .replace(/\ajax/g, '')
        .replace(/App\\Models\\/g, '');



    processed = processed.replace(/([a-z])([A-Z])/g, '$1 $2');

    return processed + (fromModels ? ' (' + eventTranslate(event) + ')' : '');
}
export const ListarAudits = () => {

    const [userId, setUserId] = useState('');
    const [cacheKey, setCacheKey] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedAudit, setSelectedAudit] = useState(null);
    const resultPerPage = 100;
    const [limit, setLimit] = useState(resultPerPage);

    const [hasta, setHasta] = useState(null);
    const [filters, setFilters] = useState(null);

    const {data: usuarios} = useUsuarios([], 'nombre', {activo: true});
    const {data: audits, isLoading, isError, error, refetch, isRefetching} = useAudits([],  filters, cacheKey, limit);

    const usuariosOptions = usuarios?.map(u => ({
        value: u.id,
        label: `${u.nombre} ${u.apellido}`
    })) || [];

    const handleSearch = () => {
        if (!userId || !hasta) {
            alert('Todos los campos son obligatorios');
            return;
        }

        setFilters({
            user_id: userId,
            created_at: {
                valor: hasta,
                operador: 'menoroigual',
            },

        });
    };

    useEffect(() => {
        setCacheKey(uuid());
    }, [filters]);

    useEffect(() => {
        if(limit !== resultPerPage){
            setCacheKey(uuid());
        }
    }, [limit]);

    const header = [
        {name: '#'},
        {name: 'Fecha'},
        {name: 'Tipo Auditable'},
        /*{name: 'Valores Anteriores'},
        {name: 'Valores Nuevos'},*/
        //{name: 'Evento'},
        {name: 'IP'}
        /* {name: 'User Agent'},*/

    ];

    const data = audits?.map((audit) => {
        const desc = processAuditableText(audit.auditable_type, audit.event);
        const finalDesc = desc === '' || desc === undefined || desc === null? processAuditableText(audit.event, '') : desc ;

        return {
            key: audit.id,
            content: [
                {content: audit.id, key: audit.id + '-id'},
                {content: processDate(moment(audit.created_at)), key: audit.id + '-date'},
                {content: processAuditableText(finalDesc), key: audit.id + '-type'},
                /*{content: <pre className="text-xs">{JSON.stringify(audit.old_values, null, 2)}</pre>, key: audit.id + '-old'},
                {content: <pre className="text-xs">{JSON.stringify(audit.new_values, null, 2)}</pre>, key: audit.id + '-new'},*/
                //{content: processAuditableText(audit.event), key: audit.id + '-event'},
                {content: audit.ip_address, key: audit.id + '-ip'},
                {content: <ViewIconButton
                        className={' text-xxs mb-2 py-0.5!'}
                        onClick={() => {
                            setSelectedAudit(audit);
                            setShowModal(true);
                        }}
                    />},
            ]
        };
    }) ?? [];

    const loading = isLoading || isRefetching;

    const loadMore = !loading && !isError && data.length > 0;
    return <>
        <PageHeader
            loading={isLoading}
            onRefresh={refetch}
        >
            <CustomModal
                isOpen={showModal}
                setIsOpen={setShowModal}
                titulo={'Detalle de la auditoría'}
                widthEnPX={'lg'}
                footer={<Button onClick={() => setShowModal(false)}>Cerrar</Button>}
            >
                {selectedAudit && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                        <div>
                            <h3 className="font-bold mb-2">Valores Anteriores</h3>
                            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto border border-gray-200 dark:border-gray-700">
                                {JSON.stringify(selectedAudit.old_values, null, 2)}
                            </pre>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Valores Nuevos</h3>
                            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto border border-gray-200 dark:border-gray-700">
                                {JSON.stringify(selectedAudit.new_values, null, 2)}
                            </pre>
                        </div>
                        <div className="md:col-span-2">
                            <h3 className="font-bold mb-2 mt-4">Información Adicional</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="font-semibold">ID:</span> <span>{selectedAudit.id}</span>
                                <span className="font-semibold">Fecha:</span> <span>{processDate(moment(selectedAudit.created_at))}</span>
                                <span className="font-semibold">IP:</span> <span>{selectedAudit.ip_address}</span>
                                <span className="font-semibold">User Agent:</span> <span className="break-all">{selectedAudit.user_agent}</span>
                                <span className="font-semibold">Auditable Type:</span> <span>{processAuditableText(selectedAudit.auditable_type, selectedAudit.event)}</span>
                                <span className="font-semibold">Auditable ID:</span> <span>{selectedAudit.auditable_id}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CustomModal>
            Seguimiento del usuario
        </PageHeader>
        <Card className="">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <Select
                        label="Usuario"
                        options={usuariosOptions}
                        value={userId}
                        setValue={setUserId}
                        placeholder="Seleccione un usuario"
                    />
                </div>
                <div>
                    <DatePicker
                        label="Hasta"
                        value={hasta}
                        setValue={(date) => setHasta(moment(date).format('YYYY-MM-DD')+' 23:59:59')}
                    />
                </div>
                <div>
                    <Button onClick={handleSearch} className="w-full! mt-0!">
                        Buscar
                    </Button>
                </div>
            </div>
        </Card>
        <br/>
        {!isError && <Table
            isLoading={loading}
            destacarColumnasPares
            header={header}
            data={data}
            emptyText={'No se encontraron auditorías para los filtros seleccionados'}
        />}
        {loadMore && (<Button onClick={() => setLimit(limit + resultPerPage)} className="w-full! mb-15!">
            Cargar mas
        </Button>)}
        {isError && <LabelError>{(error instanceof Error ? error.message : 'Error al cargar las auditorías')}</LabelError>}
    </>;
}
