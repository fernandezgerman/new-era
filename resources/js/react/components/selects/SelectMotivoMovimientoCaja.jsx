import React, {useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useMotivosMovimientosCaja} from '@/dataHooks/useMotivosMovimientosCaja.jsx';

export const SelectMotivoMovimientoCaja = ({
    motivo,
    setMotivo,
    errorMessage,
    className,
    label = 'Tipo movimiento',
    placeHolder = 'Seleccione tipos de movimiento',
    disabled = false,
    multiple = true,
}) => {
    const {data: motivos, isLoading, isError, error} = useMotivosMovimientosCaja();
    const [motivoId, setMotivoId] = useState(
        multiple
            ? (motivo?.map((m) => parseInt(m.id, 10)) ?? [])
            : (motivo?.id ?? null),
    );

    useEffect(() => {
        if (multiple || isLoading) {
            return;
        }
        const rawId = motivo?.id ?? null;
        setMotivoId(rawId != null ? parseInt(rawId, 10) : null);
    }, [motivo?.id, isLoading, multiple]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (multiple) {
            const selected = motivos?.filter((m) => motivoId?.includes(parseInt(m.id, 10))) ?? [];
            setMotivo(selected);
            return;
        }

        setMotivo(
            motivoId != null
                ? motivos?.find((m) => parseInt(m.id, 10) === parseInt(motivoId, 10)) ?? null
                : null,
        );
    }, [motivoId, isLoading, motivos, multiple, setMotivo]);

    const options = useMemo(
        () => (motivos ?? []).map((m) => ({
            key: uuid(),
            value: m.id,
            label: (m?.descripcion ?? 'Motivo #' + m.id).toString(),
        })),
        [motivos],
    );

    return (
        <ErrorBoundary>
            <Select
                options={options}
                value={motivoId}
                className={(className ?? '') + ' mt-4'}
                setValue={(val) => {
                    if (multiple) {
                        setMotivoId(val.map((v) => parseInt(v, 10)));
                    } else {
                        setMotivoId(val != null ? parseInt(val, 10) : null);
                    }
                }}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error al cargar tipos de movimiento') : null)}
                isLoading={isLoading}
                disabled={disabled}
                searchResultLimit={-1}
                multiple={multiple}
                allowRemove={multiple}
            />
        </ErrorBoundary>
    );
};
