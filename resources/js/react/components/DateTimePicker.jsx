import React, {useMemo} from 'react';
import {ConfigProvider, DatePicker as AntdDatePicker} from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import {Label, LabelError, LabelSuccess} from '@/components/Label.jsx';
import useSystemTheme from '@/utils/useSystemTheme.jsx';

dayjs.locale('es');

const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

const toDayjsValue = (value) => {
    if (value == null || value === '') {
        return null;
    }
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
};

const DateTimePicker = ({
    value,
    setValue,
    placeHolder = 'Seleccione fecha y hora',
    className = '',
    label = 'Fecha y hora',
    errorMessage,
    validMessage,
    disabled = false,
}) => {
    const darkMode = useSystemTheme();
    const dayjsValue = useMemo(() => toDayjsValue(value), [value]);

    return (
        <ErrorBoundary>
            {label ? <Label className="cursor-pointer pl-2  ">{label}</Label> : null}
            <ConfigProvider locale={esES}>
                <AntdDatePicker
                    showTime={{format: 'HH:mm'}}
                    format={DATE_TIME_FORMAT}
                    value={dayjsValue}
                    onChange={(next) => setValue(next ? next.toDate() : null)}
                    placeholder={placeHolder}
                    disabled={disabled}
                    allowClear
                    className={
                        'date-picker-wrapper w-full! h-10! '
                        + (darkMode ? ' date-picker-wrapper-dark ' : ' ')
                        + className
                    }
                    styles={{
                        root: {width: '100%'},
                    }}
                />
            </ConfigProvider>
            {errorMessage ? <LabelError className={'ml-2'}>{errorMessage}</LabelError> : null}
            {validMessage ? <LabelSuccess className={'ml-2'}>{validMessage}</LabelSuccess> : null}
        </ErrorBoundary>
    );
};

export {DateTimePicker};
