import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBell,
    faBoxArchive, faBug, faCashRegister,
    faCode,
    faCopy, faFile, faFileLines, faGears,
    faHome,
    faInfinity, faLayerGroup, faMagnifyingGlass, faMoneyBill, faMoneyBillWave,
    faMoneyCheck, faReceipt,
    faServer,
    faSuitcase
} from "@fortawesome/free-solid-svg-icons";

import {useLeftMenu} from "../../dataHooks/dashboard/useLeftMenu.jsx";
import {get} from 'lodash';
import darkLogo from "../../../../img/dark-logo.png";
import lightLogo from "../../../../img/light-logo.png";
import useSystemTheme from "../../utils/useSystemTheme.jsx";

const icons = {
    server: faServer,
    suitcase: faSuitcase,
    infinity: faInfinity,
    'money-check': faMoneyCheck,
    code: faCode,
    'layer-group': faLayerGroup,
    file: faFile,
    'box-archive': faBoxArchive,
    bug: faBug,
    'file-lines': faFileLines,
    'magnifying-glass': faMagnifyingGlass,
    'money-bill-wave': faMoneyBillWave,
    gears: faGears,
    receipt: faReceipt,
    bell: faBell,
    'cash-register': faCashRegister,
    'money-bill': faMoneyBill
};
const Modulo = ({modulo, isOpen}) => {
    return (
        <div
            className={`ease-soft-in-out text-left w-full text-sm py-2.5 after:ease-soft-in-out after:font-awesome-5-free my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 ${isOpen ? 'after:rotate-180 text-slate-700 dark:text-white' : 'text-slate-500 dark:text-white/80'} after:content-['\f107']`}
            aria-controls={`mod-${modulo.id ?? modulo.descripcion}`}
            role="button"
            aria-expanded={isOpen}
        >
            <div
                className="dark:ne-dark-body stroke-none shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current p-2.5 text-center">
                <FontAwesomeIcon icon={get(icons, modulo.icon, faCopy)} className=""/>
            </div>
            <span
                className="dark:ne-dark-body ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{modulo.descripcion}</span>
        </div>
    );
}

const Funcion = ({funcion, onMenuSelected}) => {
    return (
        <a collapse_trigger="secondary"
           onClick={() => onMenuSelected(funcion.codigo)}
           className=" after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] after:ml-auto after:inline-block after:font-bold after:text-slate-800/50 after:antialiased after:transition-all after:duration-200  dark:text-white dark:opacity-60 cursor-pointer dark:after:text-white"
           aria-expanded="false">
                                <span
                                    className="dark:ne-dark-body w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> P </span>
            <span
                className="dark:ne-dark-body transition-all duration-100 pointer-events-none ease-soft">{funcion.nombre}<b
                className="caret"></b></span>
        </a>
    );
}
export const Menu = ({onMenuSelected}) => {
    const {data: menues, isLoading, refetch, isRefetching} = useLeftMenu();
    const [hoveredId, setHoveredId] = React.useState(null);

    if (isLoading || isRefetching) return null;

    return (
        <div>
            {menues.map((menu, idx) => {
                const idKey = menu.id ?? menu.descripcion ?? idx;
                const isOpen = hoveredId === idKey;
                return (
                    <div
                        key={idKey}
                        className="mt-0.5 w-full"
                        onMouseEnter={() => setHoveredId(idKey)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Modulo modulo={menu} isOpen={isOpen}/>
                        {/* start FUNCTION */}
                        <div
                            id={`mod-${idKey}`}
                            className={`dark:ne-dark-body overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <ul className="flex flex-col pl-4 mb-0 ml-6 list-none py-1 dark:ne-dark-body">
                                {menu.funciones?.map((funcion, fidx) => (
                                    <li key={funcion.id ?? funcion.nombre ?? fidx}>
                                        <Funcion funcion={funcion} onMenuSelected={onMenuSelected}/>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* end FUNCTION */}
                    </div>
                );
            })}
        </div>
    );
}
export const Inicio = ({onMenuSelected}) => {
    const las = 3;
    return (
        <>
            <ul className="flex flex-col pl-0 mb-0 list-none">
                <li className="mt-0.5 w-full">
                    <a collapse_trigger="primary"
                       onClick={() => onMenuSelected('inicio')}
                       className="cursor-pointer dark:ne-dark-body after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] "
                       aria-expanded="true">
                        <div
                            className="dark:ne-dark-body stroke-none shadow-soft-sm bg-gradient-to-tl from-gray-700 to-black-500 mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
                            <FontAwesomeIcon icon={faHome} className=""/>
                        </div>
                        <span
                            className="dark:ne-dark-body ml-1 duration-300 opacity-100 pointer-events-none ease-soft ">Inicio</span>
                    </a>
                </li>
            </ul>
        </>);
}

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
export const Logo = () => {
    const darkMode = useSystemTheme();

    return (
        <div>
            <img src={darkMode ? darkLogo : lightLogo} className={'p-6 w-full'} alt="Logo"/>
        </div>);
}
export const LeftMenuBar = ({onMenuSelected}) => {

    return (
        <div className="block h-auto shrink-0 w-full max-w-[250px] ml-[20px] mt-[20px]"
             id="sidenav-collapse-main">
            <Logo/>
            <Inicio onMenuSelected={onMenuSelected}/>
            <Menu onMenuSelected={onMenuSelected}/>
        </div>);
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

    const onMenuSelected = (codigo) => {
        setIframeHrefs('principal_iframe.php?f='+flag+'&pagina=' + codigo);
        setFlag(flag+1);
    }
    useEffect(() => {
        console.log('iframeHrefs', iframeHrefs);
    }, []);
    return (
        <div className="flex flex-row w-full h-[calc(100vh-0px)]">
            <LeftMenuBar onMenuSelected={onMenuSelected}/>
            <div className="flex-1 min-w-0 max-w-[990px] h-full overflow-hidden">
                <Header/>
                <LegacyFrame iframeHrefs={iframeHrefs}/>
            </div>
        </div>);
}

const Header = () => {
    return (
        <div
            className="relative flex flex-col flex-auto min-w-0 p-4 mt-[25px] overflow-hidden break-words border-0 ">
            <div className="flex flex-wrap -mx-3">
                <div className="flex-none w-auto max-w-full px-3 my-auto">
                    <div className="h-full mb-[20px]">
                        <h5 className="mb-1"><span
                            className={'dark:ne-dark-body dark:ne-dark-color'}>Fernandez German</span></h5>
                        <p className="mb-0 font-semibold leading-normal text-sm dark:text-white dark:opacity-60">Programador
                            / Desarrollador</p>
                    </div>
                    <nav className={'mt-15px'}>
                        <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16 ">
                            <li className="leading-normal text-sm breadcrumb-item">
                                <a className="opacity-30 dark:text-white ne-color">
                                    <svg width="12px" height="12px" className="mb-1" viewBox="0 0 45 40" version="1.1"
                                         xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <title>shop</title>
                                        <g className="fill-white" stroke="none" strokeWidth="1" fill="none"
                                           fillRule="evenodd">
                                            <g className="fill-white" transform="translate(-1716.000000, -439.000000)"
                                               fill="#252f40" fillRule="nonzero">
                                                <g className="fill-white" transform="translate(1716.000000, 291.000000)">
                                                    <g className="fill-white" transform="translate(0.000000, 148.000000)">
                                                        <path
                                                            d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"></path>
                                                        <path
                                                            d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                                                        ></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            </li>
                            <li className="text-sm pl-2 leading-normal before:float-left before:pr-2  before:content-['/']">
                                <a> <span className="opacity-50 ne-color dark:text-white">Pages</span></a>
                            </li>
                            <li className="text-sm pl-2 capitalize dark:ne-color leading-normal before:float-left before:pr-2  before:content-['/'] dark:text-white "
                                aria-current="page">Default
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    )
}
