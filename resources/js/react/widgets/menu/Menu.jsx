import React, {useEffect, useState} from 'react';
import {isMenuColapsable} from "@/utils/deviceDetect.jsx";
import useSystemTheme from "@/utils/useSystemTheme.jsx";
import darkLogo from "../../../../img/dark-logo.png";
import lightLogo from "../../../../img/light-logo.png";
import heartLogo from "../../../../img/heart.png";
import {useLeftMenu} from "@/dataHooks/dashboard/useLeftMenu.jsx";
import {useAuthUsuario} from "@/dataHooks/useAuthUsuario.jsx";
import {useSucursalActual} from "@/dataHooks/useSucursalActual.jsx";
import {useUsuarioSucursalesCaja} from "@/dataHooks/useUsuarioHooks.jsx";
import {Select} from "@/components/Select.jsx";
import Authentication from "@/resources/Authentication.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import {MenuGroup, MenuItem} from "@/components/Menu/MenuItem.jsx";
import {isMobile} from 'react-device-detect';
import {UserAndBreadcrumb} from "@/widgets/menu/UserAndBreadcrum.jsx";
import {faBars, faCog} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alertas, AlertasMobile} from "@/widgets/menu/Alertas.jsx";


const Menu = ({onMenuSelected, onModuloSelected, leftMenuIsOpen}) => {
    const {data: menues, isLoading, refetch, isRefetching} = useLeftMenu();
    const [hoveredId, setHoveredId] = React.useState(null);
    const [openFuncion, setOpenFuncion] = React.useState(null);

    const isColapsable = isMenuColapsable();

    const loading = (isLoading || isRefetching);

    const onMenuGroupValuesClick = (idKey) => {
        setHoveredId(idKey === hoveredId ? null : idKey);
        onModuloSelected();
    }


    return (loading ? <div className={'ml-[40px]'}>Loading...</div> :
        (
            <div>
                {menues.map((menu, idx) => {
                    const idKey = menu.id ?? menu.descripcion ?? idx;
                    const isOpen = hoveredId === idKey;
                    return (
                        <MenuItem
                            menuGroupValues={menu}
                            isOpen={isOpen && (leftMenuIsOpen || !isColapsable)}
                            onMenuGroupValuesClick={() => onMenuGroupValuesClick(idKey)}
                            subMenues={menu.funciones}
                            setOpenFuncion={setOpenFuncion}
                            openFuncion={openFuncion}
                            onMenuSelected={onMenuSelected}
                            key={idKey}
                        />
                    );
                })}
            </div>)
    );
}

export const MobileLogo = ({openMenu, onClick}) => {
    const darkMode = useSystemTheme();

    return (<div className={'w-[250px] block  h-[80px] mt-4'}>
            <div className={'w-[250px] block  h-[100px]  dark:ne-dark-body dark:ne-dark-color z-99 fixed'}>
                <img onClick={onClick}
                     src={darkMode ? darkLogo : lightLogo}
                     className={'p-6 w-[220px] ' + (!openMenu ? ' hidden ' : ' block ') + ' nexl:!block '} alt="Logo"/>
            </div>
        </div>

    );
}
export const WebLogo = ({openMenu, onClick}) => {
    const darkMode = useSystemTheme();

    return (
        <div className={''}>
            <img onClick={onClick}
                 src={darkMode ? darkLogo : lightLogo}
                 className={'p-6 w-full ' + (!openMenu ? ' hidden ' : ' block ') + ' nexl:!block '} alt="Logo"/>
            {!openMenu && (
                <img onClick={onClick} src={heartLogo} className={'p-6 w-[90px] nexl:!hidden block '} alt="Logo"/>)}

        </div>);
}

const SucursalActual = ({openMenu, onIconClick}) => {

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
                    <div className="nexl:!hidden flex flex-col pl-0 mb-0 list-none">
                        <MenuGroup
                            menuGroupValues={{
                                id: 'sucursal',
                                descripcion: 'Sucursal',
                                icon: 'building'
                            }}
                            onClick={onIconClick}
                            isOpen={false}
                            withoutSubMenu={true}
                        />
                    </div>
                </>

            )}
        </>
    );
}
const MenuGeneral = ({openMenu, onMenuSelected, setOpenMenu} ) =>
{

    /* overflow-hidden fixed io max-w-[60px]  */

    const _onMenuSelected = (param1, param2, param3, param4, param5) => {
        onMenuSelected(param1, param2, param3, param4, param5);
        setOpenMenu(false);
    }

    const maxCloseWidth = isMobile ? "max-w-[40px]" : "max-w-[75px]";
    const maxOpenWidth = isMobile ? "max-w-[200px]" : "max-w-[250px]";
    const maxCloseHeight = isMobile ? " hidden " : " h-[calc(100vh)] ";

    return (
    <div
        onMouseEnter={() => setOpenMenu(true)}
        onMouseLeave={() => setOpenMenu(isMobile)}
        className={"fixed " + (openMenu === true ? "max-w-[250px] h-[calc(100vh)] " : (maxCloseWidth + maxCloseHeight)) + " ne-body dark:ne-dark-body block overflow-y-scroll overflow-x-hidden shrink-0 w-full nexl:!relative nexl:max-w-[250px] overflow-x-clip scrollbar-hidden ne-body dark:ne-dark-bg z-[999]"}
    >

        {!isMobile && <WebLogo openMenu={openMenu} onClick={() => setOpenMenu(!openMenu)}/>}
        {isMobile && <MobileLogo openMenu={openMenu || isMobile} onClick={() => setOpenMenu(!openMenu)}/>}

        <SucursalActual openMenu={openMenu || isMobile} onIconClick={() => setOpenMenu(true)}/>
        <MenuGroup
            menuGroupValues={{
                id: 'inicio',
                descripcion: 'Inicio',
                icon: 'home'
            }}
            onClick={() => _onMenuSelected('inicio', 'Inicio')}
            isOpen={false}
            withoutSubMenu={true}
        />
        <a href={'cerrar-session'}>
            <MenuGroup
                menuGroupValues={{
                    id: 'cerrar-sesion',
                    descripcion: 'Cerrar Sesion',
                    icon: 'key'
                }}
                onClick={() => _onMenuSelected('inicio', 'Inicio')}
                isOpen={openMenu}
                withoutSubMenu={true}
            />
        </a>
        <Menu leftMenuIsOpen={openMenu || isMobile} onMenuSelected={_onMenuSelected}
              onModuloSelected={() => setOpenMenu(true)}/>
    </div>);
}
export const MobileRightMenu = ({breadCrumbFirst, onMenuSelected, breadCrumbSecond}) => {
    const [openRightMenu, setOpenRightMenu] = React.useState(false);


    return (
        <ErrorBoundary>
            <div
                onClick={() => setOpenRightMenu(!openRightMenu)}
                className={'fixed right-0 pt-[5px] w-[40px] h-[40px] z-[9999] dark:bg-white rounded-md dark:text-black ne-dark-body ne-dark-bg'}>
                <FontAwesomeIcon icon={faCog} className={'fixed mt-1.5 right-2 cursor-pointer'} />
            </div>
            <div
                onMouseLeave={() => setOpenRightMenu(false)}
                className={"fixed " + (openRightMenu === true ? " p-2 right-0 max-w-[250px] h-[calc(100vh)] " : " max-w-[40px] hidden ") + " ne-body dark:ne-dark-body block overflow-y-scroll overflow-x-hidden shrink-0 w-full nexl:!relative nexl:max-w-[250px] overflow-x-clip scrollbar-hidden ne-body dark:ne-dark-bg z-[999]"}
            >
                <UserAndBreadcrumb breadCrumbFirst={breadCrumbFirst} breadCrumbSecond={breadCrumbSecond}
                                   onMenuSelected={onMenuSelected} showPopup={false}/>

                <AlertasMobile onMenuSelected={onMenuSelected}/>
            </div>
        </ErrorBoundary>
    );
}

const HamburgerMobile = ({openMenu, setOpenMenu}) => {
    return (
        <div
            onClick={() => setOpenMenu(!openMenu)}
            className={'fixed left-0 pt-[5px] w-[40px] h-[40px] z-[9999] dark:bg-white rounded-md dark:text-black ne-dark-body ne-dark-bg'}>
            <FontAwesomeIcon icon={faBars} className={'mt-1.5 ml-2 cursor-pointer'} />
        </div>);
}


const MobileMenu = ({openMenu, setOpenMenu, onMenuSelected}) => (
    <div>
        <HamburgerMobile openMenu={openMenu} setOpenMenu={setOpenMenu} />
        {openMenu && <MenuGeneral  openMenu={openMenu} onMenuSelected={ onMenuSelected}  setOpenMenu={setOpenMenu} />}
    </div>
);

export const LeftMenuBar = ({onMenuSelected}) => {

    const [openMenu, setOpenMenu] = React.useState(false);


    const LogoMenu = (
        <div className={'p-2 fixed rounded-md bg-white '}>
            <img onClick={() => setOpenMenu(true)} src={heartLogo} className={'w-[40px] w-[40px] block '} alt="Logo"/>
        </div>
    );


    return (<ErrorBoundary>
        {isMobile ? <MobileMenu  openMenu={openMenu} onMenuSelected={ onMenuSelected}  setOpenMenu={setOpenMenu} /> :
            <MenuGeneral  openMenu={openMenu} onMenuSelected={ onMenuSelected}  setOpenMenu={setOpenMenu} />
        }
    </ErrorBoundary>);

}
