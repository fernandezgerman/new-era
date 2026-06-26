import Configuracion00201 from "../../../../../img/documentacion/rust-desk/002-01.png";
import Configuracion00202 from "../../../../../img/documentacion/rust-desk/002-02.png";
import Configuracion00203 from "../../../../../img/documentacion/rust-desk/002-03.png";
import Configuracion00204 from "../../../../../img/documentacion/rust-desk/002-04.png";


export const ConfigurarClaveDeAcceso = () => {
    return (<div className={'px-6 pt-3'}>
        <h4 className={'mt-5'}>Paso 2: Configuracion general de <b>Rust Desk</b></h4>
        <div className={'mt-3'}>
            1 - Dirigirse al boton "hamburger" que se muestra en la imagen
            <img alt={'configuracion'} src={Configuracion00201} className={'w-[700px] ml-5 mb-3'} />
            <br />
            2 - Luego, dirigirse a <i>seguridad</i> y presionar el boton <i>Desbloquear ajustes de seguridad</i>
            <img alt={'configuracion'} src={Configuracion00202} className={'w-[800] ml-5 mb-3'} />
            <br />
            3 - Una vez en configuracion, buscar el apartado de <i>Contraseña</i>. Ahi selecionar <i>Usar contraseña permanente</i>. Luego, presionar el boton Establecer contraseña e ingresar la utilizada para todas las PCs.
            <br/>
            <br/> <b>IMPORTANTE! :</b> Recuerde que la contraseña debe pedirl a sistemas.
            <br/>
            <br/>
            <img alt={'configuracion'} src={Configuracion00203} className={'w-[800] ml-5 mb-3'} />
            <br/>
            <img alt={'configuracion'} src={Configuracion00204} className={'w-[800] ml-5 '} />
            <br /><i>Comunicarse con sistemas para obtener la clave</i>
        </div>
    </div>);
};
