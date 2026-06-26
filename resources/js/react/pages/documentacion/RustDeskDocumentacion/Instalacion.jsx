import {A} from "@/components/A.jsx";
import Instalacion00101 from "../../../../../img/documentacion/rust-desk/001-01.png";

export const Instalacion = () => {
    return (<div className={'px-6 pt-3'}>
        <h4 className={'mt-5'}>Paso 1: Instalacion de  <b>Rust Desk</b></h4>
        <div className={'mt-3'}>
            1 - Descargar desde el sitio new era, descargas o del siguiente link
            <A className={'ml-2'} href="https://new-era-instaladores.s3.us-west-2.amazonaws.com/rustdesk-1.4.7-x86_64.msi">Descargar Rust Desk</A>
            <br />
            <br />
            2 - Buscar en descargas y ejecutar el instalador. La siguiente ventana deberia abrirse:
            <img alt={'Instalador, pagina 1'} src={Instalacion00101} className={'w-[30] ml-5'} />
            <br />
            <br />
            3 - Presione siguiente para todos los casos, la instalacion es sencilla. Al finalizar se abrira el progrma.
        </div>

    </div>);
};
