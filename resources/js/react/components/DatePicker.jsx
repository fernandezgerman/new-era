import React from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {Datepicker} from "flowbite-react";
import useSystemTheme from "@/utils/useSystemTheme.jsx";
import {Label, LabelError, LabelSuccess} from "@/components/Label.jsx";


const DatePicker = ({value, setValue, placeHolder = "Seleccione Fecha", className = "", label = 'Fecha', errorMessage, validMessage}) => {

    const darkMode = useSystemTheme();
    // date-picker-wrapper-dark
    return (
        <ErrorBoundary>
            <Label className="cursor-pointer pl-2  ">{label}</Label>
            <Datepicker
                language="es"
                value={value}
                onChange={setValue}
                className={' date-picker-wrapper '+ className +  (darkMode ? ' date-picker-wrapper-dark ' :' ')}
                placeholder={placeHolder}
            />
            {errorMessage && <LabelError className={'ml-2'}>{errorMessage}</LabelError>}
            {validMessage && <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess>}
        </ErrorBoundary>
    );
};

export { DatePicker };
