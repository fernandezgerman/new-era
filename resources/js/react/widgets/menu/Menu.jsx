import React, {useEffect, useState} from 'react';
import useSystemTheme from "@/utils/useSystemTheme.jsx";
import darkLogo from "../../../../img/dark-logo.png";
import lightLogo from "../../../../img/light-logo.png";
import heartLogo from "../../../../img/heart.png";
import {
    faBell,
    faBoxArchive, faBug, faBuilding, faCashRegister,
    faCode,
    faCopy, faFile, faFileLines, faGears,
    faHome,
    faInfinity, faLayerGroup, faMagnifyingGlass, faMoneyBill, faMoneyBillWave,
    faMoneyCheck, faReceipt,
    faServer,
    faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
import {useLeftMenu} from "@/dataHooks/dashboard/useLeftMenu.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {get} from "lodash";
import {useAuthUsuario} from "@/dataHooks/useAuthUsuario.jsx";
import {useSucursalActual} from "@/dataHooks/useSucursalActual.jsx";
import {useUsuarioSucursalesCaja} from "@/dataHooks/useUsuarioHooks.jsx";
import {Select} from "@/components/Select.jsx";
import Authentication from "@/resources/Authentication.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";

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

const Modulo = ({modulo, isOpen, onClick}) => {
    return (
        <div
            className={`ease-soft-in-out text-left w-full text-sm py-2.5 after:ease-soft-in-out after:font-awesome-5-free my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 ${isOpen ? 'after:rotate-180 text-slate-700 dark:text-white' : 'text-slate-500 dark:text-white/80'} after:content-['\f107']`}
            aria-controls={`mod-${modulo.id ?? modulo.descripcion}`}
            role="button"
            onClick={onClick}
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

const Funcion = ({funcion, onMenuSelected, modulo, openFuncion, setOpenFuncion}) => {

    const onClickFunction = () =>
    {
        setOpenFuncion(funcion.codigo);
        onMenuSelected(funcion.codigo, modulo.descripcion, funcion.nombre);
    }

    return (
        <a collapse_trigger="secondary"
           onClick={onClickFunction}
           className={" after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] after:ml-auto after:inline-block after:font-bold after:text-slate-800/50 after:antialiased after:transition-all after:duration-200  dark:text-white dark:opacity-60 cursor-pointer dark:after:text-white"
               + (openFuncion === funcion.codigo ? ' dark:!ne-light-input !ne-dark-input rounded-lg ' : ' ')}
           aria-expanded="false">
                                <span
                                    className="dark:ne-dark-body w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> P </span>
            <span
                className={"dark:ne-dark-body transition-all duration-100 pointer-events-none ease-soft " + (openFuncion === funcion.codigo ? ' dark:!ne-light-input !ne-dark-input dark:!text-black font-bold' : ' ')}>{funcion.nombre}<b
                className="caret"></b></span>
        </a>
    );
}

const Menu = ({onMenuSelected}) => {
    const {data: menues, isLoading, refetch, isRefetching} = useLeftMenu();
    const [hoveredId, setHoveredId] = React.useState(null);
    const [openFuncion, setOpenFuncion] = React.useState(null);

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
                    >
                        <Modulo modulo={menu} isOpen={isOpen} onClick={() => setHoveredId(idKey === hoveredId ? null : idKey)}/>
                        {/* start FUNCTION */}
                        <div
                            id={`mod-${idKey}`}
                            className={`dark:ne-dark-body overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? ' opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <ul className="flex flex-col pl-4 mb-0 ml-6 list-none py-1 dark:ne-dark-body">
                                {menu.funciones?.map((funcion, fidx) => (
                                    <li key={funcion.id ?? funcion.nombre ?? fidx}>
                                        <Funcion setOpenFuncion={setOpenFuncion} openFuncion={openFuncion} funcion={funcion} onMenuSelected={onMenuSelected} modulo={menu}/>
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
                       onClick={() => onMenuSelected('inicio', 'Inicio')}
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

export const Logo = ({openMenu}) => {
    const darkMode = useSystemTheme();

    return (
        <div className={''}>
            <img src={darkMode ? darkLogo : lightLogo}
                 className={'p-6 w-full ' + (!openMenu ? ' hidden ' : ' block ') + ' nexl:!block '} alt="Logo"/>
            {!openMenu && (<img src={heartLogo} className={'p-6 w-[90px] nexl:!hidden block '} alt="Logo"/>)}

        </div>);
}

const SucursalActual = ({openMenu}) => {

    const {data: authUser} = useAuthUsuario();
    const {data: sucursal, refetch: refetchSucursalActual} = useSucursalActual();
    const {data: sucursales} = useUsuarioSucursalesCaja({usuarioId: authUser?.id});
    const [loadingSucursal, setLoadingSucursal] = useState(false);
    const [error, setError] = React.useState('');

    const saveSelectedSucursal = async (sucursalId) => {
        if (!sucursalId) {
            return;
        }
        setError('');

        try {
            setLoadingSucursal(true);
            const authenticationResource = new Authentication();
            await authenticationResource.establecerSucursalActual(sucursalId);

            await refetchSucursalActual();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingSucursal(false);
        }
    };


    return (
        <>
            <div className="ml-5 mt-11 mb-4 mr-2">
                {sucursal && sucursales && (
                    <ErrorBoundary>
                        <span
                            className={openMenu ? ' ' : ' max-nexl:hidden ' + ' nexl:!visible dark:ne-dark-body dark:ne-dark-color'}>
                            <Select
                                options={sucursales?.map((sucursal) => ({value: sucursal.id, label: sucursal.nombre}))}
                                value={sucursal.id}
                                className={'z-10'}
                                setValue={saveSelectedSucursal}
                                isLoading={loadingSucursal}
                                placeholder="Seleccione una sucursal"
                            />
                        </span>
                        {error && (
                            <div className="text-red-600 text-sm mb-4">{error}</div>
                        )}
                    </ErrorBoundary>
                )}
            </div>
            {!openMenu && (
                <>
                    <ul className="nexl:!hidden flex flex-col pl-0 mb-0 list-none">
                        <li className="mt-0.5 w-full">
                            <a className="cursor-pointer dark:ne-dark-body after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] "
                               aria-expanded="true">
                                <div
                                    className="dark:ne-dark-body stroke-none shadow-soft-sm bg-gradient-to-tl from-gray-700 to-black-500 mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
                                    <FontAwesomeIcon icon={faBuilding} className=""/>
                                </div>
                            </a>
                        </li>
                    </ul>
                </>

            )}
        </>
    );
}
export const LeftMenuBar = ({onMenuSelected}) => {

    const [openMenu, setOpenMenu] = React.useState(false);

    return (
        /* overflow-hidden fixed io max-w-[60px]  */
        <div
            onMouseEnter={() => setOpenMenu(true)}
            onMouseLeave={() => setOpenMenu(false)}
            className={"fixed " + (openMenu === true ? "max-w-[250px]" : "max-w-[75px]") + " ne-body dark:ne-dark-body block overflow-scroll shrink-0 w-full nexl:!relative nexl:max-w-[250px] h-[calc(100vh)] overflow-x-clip scrollbar-hidden ne-body dark:ne-dark-bg z-[999]"}
            id="sidenav-collapse-main">
            <Logo openMenu={openMenu}/>
            <SucursalActual openMenu={openMenu}/>
            <Inicio onMenuSelected={onMenuSelected}/>
            <Menu onMenuSelected={onMenuSelected} />
        </div>
    );
}
