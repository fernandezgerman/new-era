import React from 'react';
import {useConfigValue} from "@/dataHooks/useConfigValue.jsx";

export const TareasDashboard = () => {

    const {data: defaultBoard, isLoading} = useConfigValue({key: 'planka.default_landing'});
    return (
        <div className="w-full h-full">
            {defaultBoard && !isLoading && (<iframe
                src={defaultBoard}
                title="Planka"
                className={'h-[calc(100%-20px)] w-full'}
                allow="clipboard-read; clipboard-write"
            ></iframe>)}
        </div>
    );
};
