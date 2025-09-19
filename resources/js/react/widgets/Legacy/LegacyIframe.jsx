import React, {useEffect, useState} from 'react';
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
export const LegacyFrame = ({iframeHrefs}) => {
    const iframeRef = React.useRef(null);
    const formRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Prepare POST params from server-injected global (set in Blade)
    const [postParams, setPostParams] = useState((typeof window !== 'undefined' && window.__POST__ && typeof window.__POST__ === 'object') ? window.__POST__ : null);
    const hasPost = !!(postParams && Object.keys(postParams).length > 0);

    useEffect(() => {
        console.log('setting iframe');
        setPostParams(iframeHrefs?.postData?.length > 0 ? iframeHrefs?.postData :(typeof window !== 'undefined' && window.__POST__ && typeof window.__POST__ === 'object') ? window.__POST__ : null);
    }, [iframeHrefs, hasPost]);

    useEffect(() => {
        if (hasPost && formRef.current) {
            // Update action to current iframe hrefs and submit the POST to the iframe target
            try {
                formRef.current.action = iframeHrefs.url || 'iframe-content.php';
                formRef.current.submit();
            } catch (e) {
                console.error('Failed to submit POST to iframe:', e);
            }
        }
    }, [postParams]);

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
                <iframe
                    onLoad={()=>setIsLoading(false)}
                    ref={iframeRef}
                    name="legacy_iframe"
                    src={iframeHrefs.url}
                    width="100%"
                    className={'h-[calc(100vh-150px)]'+(isLoading ? ' hidden' : '')}
                    title="Contenido Externo"
                >
                </iframe>
            )}
        </ErrorBoundary>
    );
}
