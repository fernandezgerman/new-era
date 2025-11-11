import React, {useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {isMobile} from "react-device-detect";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons";
export const LegacyFrame = ({iframeHrefs}) => {
    const iframeRef = React.useRef(null);
    const formRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentQs, setCurrentQs] = React.useState('');

    // Prepare POST params from server-injected global (set in Blade)
    const [postParams, setPostParams] = useState((typeof window !== 'undefined' && window.__POST__ && typeof window.__POST__ === 'object') ? window.__POST__ : null);
    const hasPost = !!(postParams && Object.keys(postParams).length > 0);


    const recargarIframe = () => {
        if (iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.location.reload();
            setIsLoading(true);
        }
    };

    useEffect(() => {
        setPostParams(iframeHrefs?.postData?.length > 0 ? iframeHrefs?.postData :(typeof window !== 'undefined' && window.__POST__ && typeof window.__POST__ === 'object') ? window.__POST__ : null);
    }, [iframeHrefs, hasPost]);

    useEffect(() => {
        if (hasPost && formRef.current) {
            // Update action to current iframe hrefs and submit the POST to the iframe target
            try {
                // Append current window query parameters to the iframe URL
                const baseUrl = iframeHrefs.url || 'iframe-content.php';
                const currentQs = (typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';

                // If baseUrl already has query, merge appropriately
                const separator = baseUrl.includes('?') ? (currentQs ? '&' : '') : (currentQs ? '?' : '');
                formRef.current.action = `${baseUrl}${separator}${currentQs ? currentQs.replace(/^\?/, '') : ''}`;
                formRef.current.submit();
            } catch (e) {
                console.error('Failed to submit POST to iframe:', e);
            }
        }
    }, [postParams]);

    useEffect(() => {
        //setCurrentQs((typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '');
    }, []);

    const iFrameHeight = isMobile ? ' h-full ' : ' h-[calc(100vh-150px)] ';

    return (
        <ErrorBoundary>
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
                            <input key={key} type="hidden" name={value?.name ?? key } value={typeof (value?.value ?? value) === 'object' ? JSON.stringify(value) : String(value.value ?? value)} />
                        )
                    ))}
                </form>
            )}

            {iframeHrefs !== null && (
                <>
                    <div className={'absolute p-[5px] ml-[10px] mt-[10px] text-white cursor-pointer opacity-100 bg-pink-600 rounded-lg'}>
                        <button onClick={recargarIframe}>
                            <FontAwesomeIcon icon={faSyncAlt} className={isLoading ? 'animate-spin ' : ''} />
                        </button>
                    </div>
                    <iframe
                        onLoad={()=>{
                            setIsLoading(false);
                            setCurrentQs('');
                        }}
                        ref={iframeRef}
                        name="legacy_iframe"
                        src={(function(){
                            const baseUrl = iframeHrefs.url;
                            const currentQs = ''; //(typeof window !== 'undefined' && window.location && window.location.search) ? window.location.search : '';
                            const separator = baseUrl?.includes('?') ? (currentQs ? '&' : '') : (currentQs ? '?' : '');
                            const url = `${baseUrl}${separator}${currentQs ? currentQs.replace(/^\?/, '') : ''}`;

                            if(iframeHrefs.getData && iframeHrefs.getData.length > 0) {
                                const auxSeparator = url?.includes('?') ? '&' :'?';

                                return url + auxSeparator + iframeHrefs.getData.reduce((acum, data) => data.name + '=' + data.value + '&' + acum, '');
                            }
                            return `${baseUrl}${separator}${currentQs ? currentQs.replace(/^\?/, '') : ''}`;
                        })()}
                        width="100%"
                        className={iFrameHeight + (isLoading ? ' hidden' : '')}
                        title="Contenido Externo"
                    >
                    </iframe>
                </>
            )}
        </ErrorBoundary>
    );
}
