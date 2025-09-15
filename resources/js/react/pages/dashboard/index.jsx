import React, {useEffect, useState} from 'react';
import {LeftMenuBar} from "@/widgets/menu/Menu.jsx";
import {Header} from "@/widgets/menu/Header.jsx";

const LegacyFrame = ({iframeHrefs}) => {
    const iframeRef = React.useRef(null);
    const formRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Prepare POST params from server-injected global (set in Blade)
    const postParams = (typeof window !== 'undefined' && window.__POST__ && typeof window.__POST__ === 'object') ? window.__POST__ : null;
    const hasPost = !!(postParams && Object.keys(postParams).length > 0);

    useEffect(() => {
        if (hasPost && formRef.current) {
            // Update action to current iframe hrefs and submit the POST to the iframe target
            try {
                formRef.current.action = iframeHrefs || 'principal_iframe.php';
                formRef.current.submit();
            } catch (e) {
                console.error('Failed to submit POST to iframe:', e);
            }
        }
    }, [iframeHrefs, hasPost]);

    return (
        <>
            {/* Hidden form to post parameters into the iframe when available */}
            {hasPost && (
                <form ref={formRef} method="POST" target="legacy_iframe" style={{display: 'none'}}>
                    {/* CSRF token if required by Laravel */}
                    {typeof window !== 'undefined' && window.__CSRF__ && (
                        <input type="hidden" name="_token" value={window.__CSRF__} />
                    )}
                    {Object.entries(postParams).map(([key, value]) => (
                        Array.isArray(value) ? (
                            value.map((v, idx) => (
                                <input key={`${key}-${idx}`} type="hidden" name={`${key}${Array.isArray(value) ? '[]' : ''}`} value={String(v)} />
                            ))
                        ) : (
                            <input key={key} type="hidden" name={key} value={typeof value === 'object' ? JSON.stringify(value) : String(value)} />
                        )
                    ))}
                </form>
            )}

            {iframeHrefs !== null && (
                <iframe
                    onLoad={()=>setIsLoading(false)}
                    ref={iframeRef}
                    name="legacy_iframe"
                    src={iframeHrefs}
                    width="100%"
                    className={'h-[calc(100vh-200px)]'+(isLoading ? ' hidden' : '')}
                    title="Contenido Externo"
                >
                </iframe>
            )}
        </>
    );
}
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

    const [iframeHrefs, setIframeHrefs] = React.useState(() => `principal_iframe.php?pagina=${getInitialPagina()}`);
    const [flag, setFlag] = useState(0);
    const [breadcrumb1, setBreadcrumb1] = useState('Inicio');
    const [breadcrumb2, setBreadcrumb2] = useState('');
    const onMenuSelected = (codigo, nbreadcrumb1, nbreadcrumb2) => {
        setBreadcrumb1(nbreadcrumb1);
        setBreadcrumb2(nbreadcrumb2);
        setIframeHrefs('principal_iframe.php?f='+flag+'&pagina=' + codigo);
        setFlag(flag+1);
    }
    useEffect(() => {
        console.log('iframeHrefs', iframeHrefs);
    }, []);

    return (
        <div className="flex flex-row w-full h-[calc(100vh-0px)]">
            <LeftMenuBar onMenuSelected={onMenuSelected} />
            <div className="flex-1 min-w-0 max-w-[990px] h-full overflow-hidden">
                <Header onMenuSelected={onMenuSelected} breadCrumbFirst={breadcrumb1} breadCrumbSecond={breadcrumb2}/>
                <LegacyFrame iframeHrefs={iframeHrefs}/>
            </div>
        </div>);
}


