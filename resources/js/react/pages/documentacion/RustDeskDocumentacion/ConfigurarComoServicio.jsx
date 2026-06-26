import Configuracion00301 from "../../../../../img/documentacion/rust-desk/003-01.png";
import Configuracion00302 from "../../../../../img/documentacion/rust-desk/003-02.png";
import Configuracion00303 from "../../../../../img/documentacion/rust-desk/003-03.png";
import Configuracion00304 from "../../../../../img/documentacion/rust-desk/003-04.png";
import Configuracion00305 from "../../../../../img/documentacion/rust-desk/003-05.png";

export const ConfigurarComoServicio = () => {
    return (<div className={'px-6 pt-3'}>
        <h4 className={'mt-5'}>Paso 3 y final: Configuracion <b>Rust Desk</b> como servicio de windows</h4>
        <p>Este paso es clave para permitir a cualquier con la clave de acceso y el id acceder a la PC en cualquier momento.</p>
        <div className={'mt-3'}>
            1 - Dirigirse a Inicio y buscar "cmd" o abrir la consola de windows.
            <img alt={'configuracion'} src={Configuracion00301} className={'w-[700px] ml-5 mb-3'} />
            <br />
            2 - Copiar y pegar el siguiente texto en la consola: <i><b>"C:\Program Files\RustDesk\rustdesk.exe" --install-service</b></i>
            <img alt={'configuracion'} src={Configuracion00302} className={'w-[700px] ml-5 mb-3'} />
            <br />
            3 - Finalmente, si todo esta ok dirigirse a INICIO y buscar "Servicios". Abrir la aplicacion
            <img alt={'configuracion'} src={Configuracion00303} className={'w-[700px] ml-5 mb-3'} />
            <br />
            4 - En la lista de servicios, ubicar el servicio "RustDesk" y asegurarse que este activo.
            <img alt={'configuracion'} src={Configuracion00304} className={'w-[700px] ml-5 mb-3'} />
            <br />
            5 - Finalmente, abrir <b>Rust Desk</b> tomar nota del ID y pasarlo a sistemas, detallando el nombre de sucursal.
            <img alt={'configuracion'} src={Configuracion00305} className={'w-[700px] ml-5 mb-3'} />
            <br />
        </div>
    </div>);
};
