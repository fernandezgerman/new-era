import React from 'react';

export const TareasDashboard = ({logout, className, ref}) => {

    const defaultBoard = logout ? import.meta.env.VITE_PLANKA_LOGOUT : import.meta.env.VITE_PLANKA_DEFAULT_LANDING ;

    return (
        <div className={"w-full h-full " + className}>
            {defaultBoard && (<iframe
                ref={ref}
                src={defaultBoard + (logout ? '?logout=true' : '')}
                title="Planka"
                className={'h-[calc(100%-20px)] w-full'}
                allow="clipboard-read; clipboard-write"
            ></iframe>)}
        </div>
    );
};
