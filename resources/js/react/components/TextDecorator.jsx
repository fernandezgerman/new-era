import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

export const TextDecorator = ({children, className, copy = false, documentationLink }) => {
    const textRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleCopy = async () => {
        try {
            // Prefer DOM text to support non-string children
            const text = textRef.current ? textRef.current.innerText : (typeof children === 'string' ? children : '');
            if (!text) return;

            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            console.error('Failed to copy text:', e);
        }
    };

    return (
        <div className={className}>
            <span ref={textRef}>{children}</span>
            <span
                className="relative inline-flex ml-2"
                role="button"
                tabIndex={0}
                aria-label="Copiar al portapapeles"
                onClick={handleCopy}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCopy();
                    }
                }}
            >
                {copy && (
                    <>
                        <FontAwesomeIcon className={'cursor-pointer'} icon={faCopy}/>
                    {copied && (
                        <div role="tooltip" aria-live="polite"
                             className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow z-50 whitespace-nowrap opacity-100 transition-opacity duration-200">
                            Copiado!
                            <span
                                className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-black"></span>
                        </div>
                    )}
                    </>)
                }
                </span>
        </div>
    );
}
