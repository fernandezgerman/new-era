import React from 'react';
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
import { get } from 'lodash';
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
const Modulo = ({modulo, isOpen}) =>
{
    return (
        <div
                className={`ease-soft-in-out text-left w-full text-sm py-2.5 after:ease-soft-in-out after:font-awesome-5-free my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 ${isOpen ? 'after:rotate-180 text-slate-700 dark:text-white' : 'text-slate-500 dark:text-white/80'} after:content-['\f107']`}
                aria-controls={`mod-${modulo.id ?? modulo.descripcion}`}
                role="button"
                aria-expanded={isOpen}
        >
            <div
                className="dark:ne-dark-body stroke-none shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current p-2.5 text-center">
                <FontAwesomeIcon icon={get(icons, modulo.icon , faCopy)} className=""/>
            </div>
            <span className="dark:ne-dark-body ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{modulo.descripcion}</span>
        </div>
    );
}

const Funcion = ({funcion}) =>
{
    return (
        <a collapse_trigger="secondary"
           className=" after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] after:ml-auto after:inline-block after:font-bold after:text-slate-800/50 after:antialiased after:transition-all after:duration-200  dark:text-white dark:opacity-60 cursor-pointer dark:after:text-white"
           aria-expanded="false">
                                <span
                                    className="dark:ne-dark-body w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> P </span>
            <span className="dark:ne-dark-body transition-all duration-100 pointer-events-none ease-soft">{funcion.nombre}<b
                className="caret"></b></span>
        </a>
    );
}
export const Menu = () => {
    const { data: menues, isLoading, refetch, isRefetching} = useLeftMenu();
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
                        <Modulo modulo={menu} isOpen={isOpen} />
                        {/* start FUNCTION */}
                        <div
                            id={`mod-${idKey}`}
                            className={`dark:ne-dark-body overflow-hidden transition-all duration-300 ease-in-out ${isOpen? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <ul className="flex flex-col pl-4 mb-0 ml-6 list-none py-1 dark:ne-dark-body">
                                {menu.funciones?.map((funcion, fidx) => (
                                    <li key={funcion.id ?? funcion.nombre ?? fidx}>
                                        <Funcion funcion={funcion} />
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
export const Inicio = () => {
    const las = 3;
    return (
        <>
            <ul className="flex flex-col pl-0 mb-0 list-none">
                <li className="mt-0.5 w-full">
                    <a active_primary={true} collapse_trigger="primary"
                       className="dark:ne-dark-body after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] "
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

const legacyFrame = ({iframeHrefs}) => {

    return iframeHrefs !== null && (<iframe
        src={iframeHrefs}
        width="100%"
        height="100%"
        title="Contenido Externo"
        // Consider adding sandbox attributes for security
        // sandbox="allow-scripts allow-same-origin"
    >
    </iframe>);
}
export const Logo = () => {
    const darkMode = useSystemTheme();

    return (
        <div>
            <img src={darkMode ? darkLogo : lightLogo} className={'p-6'} alt="Logo"/>
        </div>);
}
export const LeftMenuBar = () => {

    return (
        <div className="items-center block w-full h-auto grow basis-full max-w-[300px] ml-[20px] mt-[20px]" id="sidenav-collapse-main">
            <Logo />
            <Inicio/>
            <Menu/>
        </div>);
}
export const Dashboard = () => {

    const [iframeHrefs, setIframeHrefs] = React.useState(null);
    return (
        <>
            <LeftMenuBar/>
        </>);
}
