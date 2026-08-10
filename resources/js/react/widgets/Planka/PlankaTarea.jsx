import React, {useRef, useState} from 'react';
import {useConfigValue} from "@/dataHooks/useConfigValue.jsx";

export const PlankaTarea = ({tareaId}) => {

    const iframeRef = useRef(null);
    const {data: cardView, isLoading} = useConfigValue({key: 'planka.card_view'});

    const [visible, setVisible] = useState(true);

    return (
        <div className="w-full h-full" >
            {cardView && !isLoading && visible &&  (<iframe
                ref={iframeRef}
                src={cardView + tareaId + '?restrictMode=1'}
                onChange={()=> console.log('change')}
                title="Planka"
                className={'h-[calc(100%-20px)] w-full'}
                allow="clipboard-read; clipboard-write"
            ></iframe>)}
        </div>
    );
};
