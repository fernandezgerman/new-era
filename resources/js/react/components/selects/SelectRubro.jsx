import React, {useEffect, useMemo, useState} from 'react';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Select} from '@/components/Select.jsx';
import uuid from 'react-uuid';
import {useRubros} from '@/dataHooks/useRubros.jsx';

export const SelectRubro = ({
    rubro,
    setRubro,
    errorMessage,
    className,
    label = 'Rubro',
    placeHolder = 'Seleccione un rubro',
    disabled = false,
    multiple = false,
}) => {
    const {data: rubros, isLoading, isError, error} = useRubros();
    const [rubroId, setRubroId] = useState(
        multiple
            ? (rubro?.map((r) => parseInt(r.id, 10)) ?? [])
            : (rubro?.id ?? null),
    );

    useEffect(() => {
        if (multiple || isLoading) {
            return;
        }
        const rawId = rubro?.id ?? null;
        setRubroId(rawId != null ? parseInt(rawId, 10) : null);
    }, [rubro?.id, isLoading, multiple]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (multiple) {
            const selected = rubros?.filter((r) => rubroId?.includes(parseInt(r.id, 10))) ?? [];
            setRubro(selected);
            return;
        }

        setRubro(
            rubroId != null
                ? rubros?.find((r) => parseInt(r.id, 10) === parseInt(rubroId, 10)) ?? null
                : null,
        );
    }, [rubroId, isLoading, rubros, multiple, setRubro]);

    const options = useMemo(
        () => (rubros ?? []).map((r) => ({
            key: uuid(),
            value: r.id,
            label: (r?.nombre ?? 'Rubro #' + r.id).toString(),
        })),
        [rubros],
    );

    return (
        <ErrorBoundary>
            <Select
                options={options}
                value={rubroId}
                className={(className ?? '') + ' mt-4'}
                setValue={(val) => {
                    if (multiple) {
                        setRubroId(val.map((v) => parseInt(v, 10)));
                    } else {
                        setRubroId(val != null ? parseInt(val, 10) : null);
                    }
                }}
                placeholder={placeHolder}
                label={label}
                errorMessage={errorMessage ?? (isError ? (error?.message ?? 'Error al cargar rubros') : null)}
                isLoading={isLoading}
                disabled={disabled}
                searchResultLimit={-1}
                multiple={multiple}
                allowRemove={multiple}
            />
        </ErrorBoundary>
    );
};
