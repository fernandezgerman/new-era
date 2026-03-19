import React from 'react';
import {Select} from "@/components/Select.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {LabelError, LabelSuccess} from "@/components/Label.jsx";

const DayOfWeek = ({value, setValue, label = "Día de la semana", className = "", errorMessage, validMessage}) => {
    const days = [
        {value: 'Lunes', label: 'Lunes'},
        {value: 'Martes', label: 'Martes'},
        {value: 'Miércoles', label: 'Miércoles'},
        {value: 'Jueves', label: 'Jueves'},
        {value: 'Viernes', label: 'Viernes'},
        {value: 'Sábado', label: 'Sábado'},
        {value: 'Domingo', label: 'Domingo'}
    ];

    const options = [
        {value: 'Todos', label: 'Todos'},
        ...days
    ];

    return (
        <ErrorBoundary>
            <Select
                options={options}
                value={value}
                setValue={setValue}
                label={label}
                className={className}
                placeholder="Seleccione un día"
            />
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            {validMessage && <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess>}
        </ErrorBoundary>
    );
};

export { DayOfWeek };
