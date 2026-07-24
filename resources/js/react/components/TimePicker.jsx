import React from 'react';
import {Select} from "@/components/Select.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {LabelError, LabelSuccess} from "@/components/Label.jsx";

const TimePicker = ({value, setValue, label = "Seleccione Hora", className = "", errorMessage, validMessage, itemClass=[], todos= true}) => {
    const hours = Array.from({length: 24}, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return {
            value: `${hour}:00`,
            label: `${hour}:00`
        };
    });

    const options = todos ? [
        {value: 'Todos', label: 'Todos'},
        ...hours
    ] : hours;

    return (
        <ErrorBoundary>
            <Select
                itemClass={itemClass}
                options={options}
                value={value}
                setValue={setValue}
                label={label}
                className={className}
                placeholder="Seleccione una hora"
            />
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            {validMessage && <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess>}
        </ErrorBoundary>
    );
};

export { TimePicker };
