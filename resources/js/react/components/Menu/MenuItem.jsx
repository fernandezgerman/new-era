import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {get} from "lodash";
import {
    faBell,
    faBoxArchive, faBug, faCashRegister,
    faCode,
    faCopy, faFile, faFileLines, faGears,
    faInfinity,
    faLayerGroup, faMagnifyingGlass, faMoneyBill, faMoneyBillWave,
    faMoneyCheck, faReceipt,
    faServer,
    faSuitcase,
    faHome, faBuilding, faKey
} from "@fortawesome/free-solid-svg-icons";

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
    'money-bill': faMoneyBill,
    'home': faHome,
    'building': faBuilding,
    'key': faKey,
};
export const MenuGroup = ({
                       menuGroupValues = {
                           id: 0,
                           descripcion: 'N/A',
                           icon: 'bell'
                       }, onClick = () => {
                        },
                        isOpen = false,
                        className = '',
                        iconClassName = '',
                        withoutSubMenu = false,
                   }) => {

    const finalIconClassName = !withoutSubMenu ?
        "dark:ne-dark-body stroke-none shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current p-2.5 text-center" + iconClassName
        : "stroke-none shadow-soft-sm bg-gradient-to-tl from-gray-700 to-black-500 mr-2 flex items-center justify-center rounded-lg ne-dark-body dark:bg-white bg-center fill-current p-2.5 text-center dark:text-black dark:ne-dark-body stroke-none shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center fill-current p-2.5 text-center" + iconClassName;
    return (
        <div
            className={`ease-soft-in-out text-left w-full text-sm py-2.5 after:ease-soft-in-out after:font-awesome-5-free my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 ${isOpen ? 'after:rotate-180 text-slate-700 dark:text-white' : 'text-slate-500 dark:text-white/80'} after:content-['\f107'] ${className}`}
            aria-controls={`mod-${menuGroupValues.id ?? menuGroupValues.descripcion}`}
            role="button"
            onClick={onClick}
            aria-expanded={isOpen}
        >
            <div
                className={finalIconClassName}>
                <FontAwesomeIcon icon={get(icons, menuGroupValues.icon, faCopy)} className=""/>
            </div>
            <span
                className="dark:ne-dark-body ml-1 duration-300 opacity-100 pointer-events-none ease-soft">{menuGroupValues.descripcion}</span>
        </div>
    );
}

const SubMenu = ({funcion, onMenuSelected, modulo, openFuncion, setOpenFuncion}) => {

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

export const MenuItem = ({menuGroupValues, isOpen, onMenuGroupValuesClick, subMenues, setOpenFuncion, openFuncion, onMenuSelected, key}) => {
    return (
        <div
            key={key}
            className="mt-0.5 w-full"
        >
            <MenuGroup menuGroupValues={menuGroupValues} isOpen={isOpen} onClick={onMenuGroupValuesClick}/>
            <div
                id={`mod-${key}`}
                className={`dark:ne-dark-body overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? ' opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <ul className="flex flex-col pl-4 mb-0 ml-6 list-none py-1 dark:ne-dark-body">
                    {subMenues.map((funcion, fidx) => (
                        <li key={funcion.id ?? funcion.nombre ?? fidx}>
                            <SubMenu setOpenFuncion={setOpenFuncion} openFuncion={openFuncion} funcion={funcion}
                                     onMenuSelected={onMenuSelected} modulo={menuGroupValues}/>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

