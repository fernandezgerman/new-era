export const Inicio = () => {
    return (<div className={'px-6 pt-3'}>
        <p>
            Rust desk es una aplicacion de escritorio para controlar de forma remota cada computadora de la cadena.
            <br/>
            El siguiente tutorial está orientado a instalar y configurar Rust desk para poder ingresar en cualquier
            momento que el usuario con permisos (que conozca la clave) lo requiera.
            <br/>
        </p>


        <h4 className={'mt-5'}>El tutorial se compone por las siguientes etapas:<br/></h4>
        <div className={'mt-3'}>
            1 - Descarga e instalación de Rust desk.<br/>
            2 - Configuracion de la clave de acceso y acceso remoto.<br/>
            3 - Rust desk como servicio de windows parasss que inicie automaticamente al prender la PC<br/>
        </div>

    </div>);
};
