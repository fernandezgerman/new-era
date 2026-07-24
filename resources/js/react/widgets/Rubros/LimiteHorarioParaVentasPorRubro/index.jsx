import React, {useEffect, useState} from 'react';
import {useRubro} from "@/dataHooks/useRubros.jsx";
import {
    useLimiteVentaPorHoraRubro,
    useSaveLimiteVentaPorHoraRubro,
} from "@/dataHooks/useLimiteVentaPorHoraRubro.jsx";
import {Checkbox} from "@/components/Checkbox.jsx";
import {TimePicker} from "@/components/TimePicker.jsx";
import {Select} from "@/components/Select.jsx";
import {AceptarButton} from "@/components/Buttons.jsx";
import {AlertSuccess, AlertDanger} from "@/components/Alerts.jsx";
import {Loading} from "@/components/Loading.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

const HORAS_OPTIONS = Array.from({length: 24}, (_, i) => {
    const value = i + 1;
    return {value, label: `${value}hs`};
});

const formatHoraDesde = (hour) => {
    if (hour === null || hour === undefined || hour === '') {
        return null;
    }
    const n = Number(hour);
    if (Number.isNaN(n)) {
        return null;
    }
    return `${String(n).padStart(2, '0')}:00`;
};

const parseHoraDesde = (value) => {
    if (!value || value === 'Todos') {
        return null;
    }
    const hour = parseInt(String(value).split(':')[0], 10);
    return Number.isNaN(hour) ? null : hour;
};

const emptyForm = {
    activo: false,
    horadesde: null,
    horas: null,
};

export const LimiteHorarioParaVentasPorRubro = ({rubroId}) => {
    const hasRubro = !!rubroId && !Number.isNaN(Number(rubroId));

    if (!hasRubro) {
        return (
            <p className="text-sm italic text-gray-600">
                Guarde el nuevo rubro y luego editelo para agregar permisos de venta por hora
            </p>
        );
    }

    return <LimiteHorarioParaVentasPorRubroForm rubroId={Number(rubroId)} />;
};

const LimiteHorarioParaVentasPorRubroForm = ({rubroId}) => {
    const {data: rubro} = useRubro(rubroId);
    const {data: limite, isLoading, isError, error} = useLimiteVentaPorHoraRubro(rubroId);
    const {mutate: saveLimite, isPending: saving} = useSaveLimiteVentaPorHoraRubro(rubroId);

    const [form, setForm] = useState(emptyForm);
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (limite) {
            setForm({
                activo: !!limite.activo,
                horadesde: formatHoraDesde(limite.horadesde),
                horas: limite.horas ?? null,
            });
        } else {
            setForm(emptyForm);
        }
        setErrores({});
        setErrorGeneral(null);

    }, [limite]);

    const validate = () => {
        const errors = {};

        if (form.activo !== true && form.activo !== false) {
            errors.activo = 'Indique si está activo';
        }

        if (!form.horadesde || form.horadesde === 'Todos') {
            errors.horadesde = 'Seleccione una hora desde';
        }

        if (!form.horas) {
            errors.horas = 'Seleccione la cantidad de horas';
        }

        setErrores(errors);
        return Object.keys(errors).length === 0;
    };

    const onSave = () => {
        setErrorGeneral(null);
        setSuccessMessage(null);

        if (!validate()) {
            return;
        }

        const payload = {
            idrubro: rubroId,
            activo: !!form.activo,
            horadesde: parseHoraDesde(form.horadesde),
            horas: Number(form.horas),
        };

        saveLimite(
            {id: limite?.id, data: payload},
            {
                onSuccess: () => {
                    setSuccessMessage('Configuración guardada correctamente');
                },
                onError: (err) => {
                    setErrorGeneral(err?.message ?? 'Error al guardar la configuración');
                },
            },
        );
    };

    if (isLoading) {
        return <Loading className="mt-4" />;
    }

    if (isError) {
        return <AlertDanger className="mt-4">{error?.message ?? 'Error al cargar la configuración'}</AlertDanger>;
    }

    return (
        <ErrorBoundary>
            <div className="tabla_excepciones w-full mt-2 ml-0!">
                Configuración de venta por hora{rubro?.nombre ? ` — ${rubro.nombre}` : ''}
            </div>

            <div className="mt-4 space-y-4 max-w-md">

                {errorGeneral && <AlertDanger>{errorGeneral}</AlertDanger>}
                {successMessage && <AlertSuccess>{successMessage}</AlertSuccess>}

                <div className={'flex'}>
                    <Checkbox
                        value={form.activo}
                        className={'flex'}
                        onChange={(activo) => setForm({...form, activo})}
                        errorMessage={errores.activo}
                    />

                    <div>Activar</div>
                </div>


                <TimePicker
                    todos={false}
                    label="Hora desde"
                    itemClass={['ne-dark-body']}
                    className={'ne-dark!'}
                    value={form.horadesde}
                    setValue={(horadesde) => setForm({...form, horadesde})}
                    errorMessage={errores.horadesde}
                />

                <Select
                    label="Cantidad de horas"
                    options={HORAS_OPTIONS}
                    value={form.horas}
                    setValue={(horas) => setForm({...form, horas: horas === null || horas === '' ? null : Number(horas)})}
                    placeholder="Seleccione horas"
                    allowSearch={false}
                    itemClass={['ne-dark-body']}
                    errorMessage={errores.horas}
                />

                <AceptarButton disabled={saving} onClick={onSave}>
                    {saving ? 'Guardando...' : 'Guardar limite'}
                </AceptarButton>
            </div>
        </ErrorBoundary>
    );
};
