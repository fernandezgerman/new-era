import React from 'react';
import {useTareasCreadasPorElUsuario} from "@/widgets/Planka/hooks/useTareasCreadasPorElUsuario.jsx";
import {processDate} from "@/utils/dates.jsx";
import moment from "moment";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

const COLOR_ORDER = ['gray', 'red', 'blue', 'green'];

const COLOR_CLASSES = {
    gray: 'bg-gray-200 text-black',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
};

export const AlertasPlanka = ({onMenuSelected}) => {
    const {data: tareas} = useTareasCreadasPorElUsuario();

    const referencias = tareas?.referencias ?? {};
    const data = tareas?.data ?? [];
    const total = data.length;

    const countsByEstado = data.reduce((acc, tarea) => {
        const estado = tarea.estado;
        acc[estado] = (acc[estado] ?? 0) + 1;
        return acc;
    }, {});


    const segments = COLOR_ORDER
        .filter((color) => referencias[color])
        .map((color) => {
            const estado = referencias[color];
            const count = countsByEstado[estado] ?? 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return {color, estado, count, percentage};
        })
        .filter((segment) => segment.count > 0);

    const updated_at = tareas?.updated_at ? processDate(moment(tareas.updated_at), false, true) : '?';

    const onClick = () => {
        onMenuSelected('tbltsk',' Tareas', 'Dashboard');
    }

    return (
        <ErrorBoundary>
            <div
                className={'grid grid-cols-1 text-xs border w-[88%] border-solid border-gray-300 rounded-lg ml-5 p-2 mb-2'}>
                <div className={'flex'}>
                    <div className={'text-left italic text-xs '}>TAREAS QUE PEDI</div>
                    <div className={'ml-auto italic text-xs'}>{updated_at}</div>
                </div>

                <div className={'mx-2 mt-2 min-h-7 flex'}>
                    {countsByEstado.length === 0 && (<div className={'w-full pt-2 italic text-center'}>No hay tareas</div>)}
                    {segments.map((segment, index) => {
                        const isFirst = index === 0;
                        const isLast = index === segments.length - 1;
                        const rounded = [
                            isFirst ? 'rounded-l-lg' : '',
                            isLast ? 'rounded-r-lg' : '',
                        ].filter(Boolean).join(' ');

                        return (
                            <div
                                key={segment.color}
                                onClick={onClick}
                                className={`pt-1.5 cursor-pointer text-center border border-solid block ${COLOR_CLASSES[segment.color]} ${rounded}`}
                                style={{width: `${segment.percentage}%`}}
                                title={segment.estado}
                            >
                                {segment.count}
                            </div>
                        );
                    })}
                </div>
            </div>
        </ErrorBoundary>
    );
};
