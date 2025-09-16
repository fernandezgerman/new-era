import React, {useEffect, useState} from 'react';
import {LeftMenuBar} from "@/widgets/menu/Menu.jsx";
import {Header} from "@/widgets/menu/Header.jsx";
import {LegacyFrame} from "@/widgets/Legacy/LegacyIframe.jsx";

export const Dashboard = () => {
    const getInitialPagina = () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const pagina = (params.get('pagina') || '').trim();
            return pagina !== '' ? pagina : 'inicio';
        } catch (e) {
            return 'inicio';
        }
    };

    const [iframeHrefs, setIframeHrefs] = React.useState(() => ({url: `principal_iframe.php?pagina=${getInitialPagina()}`}));
    const [flag, setFlag] = useState(0);
    const [breadcrumb1, setBreadcrumb1] = useState('Inicio');
    const [breadcrumb2, setBreadcrumb2] = useState('');

    const onMenuSelected = (codigo, nbreadcrumb1, nbreadcrumb2, method = 'get', postData =[]) => {
        setBreadcrumb1(nbreadcrumb1);
        setBreadcrumb2(nbreadcrumb2);
        setIframeHrefs({
            url: 'principal_iframe.php?f=' + flag + '&pagina=' + codigo,
            method: method,
            postData: postData
        });
        setFlag(flag + 1);
    }

    return (
        <div className="flex flex-row w-full h-[calc(100vh-0px)]">
            <LeftMenuBar onMenuSelected={onMenuSelected}/>
            <div className="flex-1 min-w-0 max-w-[990px] h-full overflow-hidden">
                <Header onMenuSelected={onMenuSelected} breadCrumbFirst={breadcrumb1} breadCrumbSecond={breadcrumb2}/>
                <LegacyFrame iframeHrefs={iframeHrefs}/>
            </div>
        </div>);
}
