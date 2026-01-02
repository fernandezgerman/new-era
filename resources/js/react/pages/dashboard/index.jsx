import React, {useEffect, useState} from 'react';
import {LeftMenuBar, MobileRightMenu} from "@/widgets/menu/Menu.jsx";
import {Header} from "@/widgets/menu/Header.jsx";
import {LegacyFrame} from "@/widgets/Legacy/LegacyIframe.jsx";
import {isMobile} from "react-device-detect";
import {CollapsibleRightMenu} from "@/widgets/menu/CollapsibleRightMenu.jsx";

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

    const [iframeHrefs, setIframeHrefs] = React.useState(() => ({url: `iframe-content.php?pagina=${getInitialPagina()}`}));
    const [flag, setFlag] = useState(0);
    const [breadcrumb1, setBreadcrumb1] = useState('Inicio');
    const [breadcrumb2, setBreadcrumb2] = useState('');

    const onMenuSelected = (codigo, nbreadcrumb1, nbreadcrumb2, method = 'get', postData =[]) => {
        setBreadcrumb1(nbreadcrumb1);
        setBreadcrumb2(nbreadcrumb2);

        // Split incoming postData into GET and POST arrays/objects
        const getData = Array.isArray(postData)
            ? postData.filter((item) => (item?.type || item?.method || '').toString().toUpperCase() === 'GET')
            : [];
        const remainingPostData = Array.isArray(postData)
            ? postData.filter((item) => (item?.type || item?.method || '').toString().toUpperCase() !== 'GET')
            : postData;

        setIframeHrefs({
            url: 'iframe-content.php?f=' + flag + '&pagina=' + codigo,
            method: method,
            getData: getData,
            postData: remainingPostData
        });
        setFlag(flag + 1);
    }

    const MarginLeft = isMobile ? " " : "  ml-[90px]  ";

    return (
        <div className="flex flex-row w-full max-w-[1250px] h-[calc(100vh-0px)] nexl:ml-[calc(50vw-625px)] ">
            <LeftMenuBar onMenuSelected={onMenuSelected}/>
            {isMobile && <MobileRightMenu  onMenuSelected={onMenuSelected} breadCrumbFirst={breadcrumb1} breadCrumbSecond={breadcrumb2}/>}
            <div className={"nexl:ml-0 flex-1 min-w-0 max-w-[990px] h-full overflow-hidden " + MarginLeft}>
                {!isMobile && <Header onMenuSelected={onMenuSelected} breadCrumbFirst={breadcrumb1} breadCrumbSecond={breadcrumb2}/>}
                <LegacyFrame iframeHrefs={iframeHrefs}/>
            </div>
            {/*<CollapsibleRightMenu /> */}
        </div>);
}
