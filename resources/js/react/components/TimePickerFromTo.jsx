import React from 'react';
import {Select} from "@/components/Select.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {TimePicker} from "@/components/TimePicker.jsx";
import {LabelError, LabelSuccess} from "@/components/Label.jsx";

const TimePickerFromTo = ({dateFrom, dateTo, setDateFrom, setDateTo,errorMessageTo,  errorMessageFrom, validMessageFrom, validMessageTo}) => {

    return (
        <ErrorBoundary>
            <div className="grid grid-cols-2 ">
                <div className={'pr-2'}>
                    <TimePicker label={'Hora desde'} value={dateFrom} setValue={setDateFrom}/>
                    {errorMessageFrom && <LabelError className={'ml-2'}>{errorMessageFrom}</LabelError>}
                    {validMessageFrom && <LabelSuccess className={'ml-2'}>{validMessageFrom}</LabelSuccess>}
                </div>
                <div className={'pl-2'}>
                    <TimePicker label={'Hora hasta'} value={dateTo} setValue={setDateTo}/>
                    {errorMessageTo && <LabelError className={'ml-2'}>{errorMessageTo}</LabelError>}
                    {validMessageTo && <LabelSuccess className={'ml-2'}>{validMessageTo}</LabelSuccess>}
                </div>
            </div>
        </ErrorBoundary>
    );
};

export {TimePickerFromTo};
