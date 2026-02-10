import React from 'react';
import mp1A from "../../../../img/documentacion/mercado-pago-configuracion/MP-A.png";
import mp1B from "../../../../img/documentacion/mercado-pago-configuracion/MP-B.png";
import mp1C from "../../../../img/documentacion/mercado-pago-configuracion/MP-C.png";
import mp1D from "../../../../img/documentacion/mercado-pago-configuracion/MP-D.png";
import mp1E from "../../../../img/documentacion/mercado-pago-configuracion/MP-E.png";

import mp3A from "../../../../img/documentacion/mercado-pago-configuracion/MP-3-A.png";
import mp3B from "../../../../img/documentacion/mercado-pago-configuracion/MP-3-B.png";
import mp3C from "../../../../img/documentacion/mercado-pago-configuracion/MP-3-C.png";

import mp4B from "../../../../img/documentacion/mercado-pago-configuracion/MP-4-B.png";
import mp5A from "../../../../img/documentacion/mercado-pago-configuracion/MP-5-A.png";


import mp6A from "../../../../img/documentacion/mercado-pago-configuracion/MP-6-A.png";
import mp6B from "../../../../img/documentacion/mercado-pago-configuracion/MP-6-B.png";
import mp6C from "../../../../img/documentacion/mercado-pago-configuracion/MP-6-C.png";
import mp6D from "../../../../img/documentacion/mercado-pago-configuracion/MP-6-D.png";

import mp7A from "../../../../img/documentacion/mercado-pago-configuracion/MP-7-A.png";

import mp8A from "../../../../img/documentacion/mercado-pago-configuracion/MP-8-A.png";

import mp9A from "../../../../img/documentacion/mercado-pago-configuracion/MP-9-A.png";
import mp9B from "../../../../img/documentacion/mercado-pago-configuracion/MP-9-B.png";
import mp10A from "../../../../img/documentacion/mercado-pago-configuracion/MP-10-A.png";
import mp11A from "../../../../img/documentacion/mercado-pago-configuracion/MP-11-A.png";
import mp11B from "../../../../img/documentacion/mercado-pago-configuracion/MP-11-B.png";
import {A} from "@/components/A.jsx";


export const MercadoPagoDocumentacion = () => {

    return <>
        <h2>Configuracion de mercado pago para POSNET</h2>
        <p>
            La siguiente configuracion servirá para cobros con tarjeta y QR usando el lector POINT. Los elementos
            necesarios, previos para realizar esta configuracion son:
        </p>
        <div className={'ml-4'}>
            1 - Una cuenta de mercado pago<br/>
            2 - Un celular con la cuenta de MERCADO PAGO abierta<br/>
            3 - Usuario de NEW ERA con acceso a configuracion de sucursales<br/>
            4 - Lector POINT de Mercado Pago<br/>
            5 - APP de ventas NEW ERA con version 2.3.2 o superior instalada<br/>
        </div>

        <br/>
        <h3>Crear aplicacion en mercado pago</h3>
        <br/>
        <p>Abrir MERCADO PAGO en el browser (preferiblemente chrome). <br/>
            Ir a la seccion de desarrolladores de mercado pago <A target={'_blank'}
                                                                  href={'https://www.mercadopago.com.ar/developers/panel/app'}>https://www.mercadopago.com.ar/developers/panel/app</A> y
            hacer click en <b>"Crear Aplicacion"</b>.
        </p>
        <div className={'ml-4 mb-4 mt-4'}>
            <img src={mp1A} alt={'panel app'} className={'w-[800px] '}/><br/>
            <i>Hacer click en Crear aplicacion. Cada Cuenta de mercado pago que se utilice debe tener su aplicacion
                creada.</i> <b/>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp1B} alt={'Nombre de APP'} className={'w-[800px] '}/><br/>
            <i>Ingresar el siguiente nombre para darle a la aplicacion</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp1C} alt={'Tipo de APP'} className={'w-[800px] '}/><br/>
            <i>Seleccione "Pagos Presenciales" como tipo de pago a integrar.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp1D} alt={'Tipo POINT'} className={'w-[800px] '}/><br/>
            <i>Seleccione tipo POINT, ya que con el elctor se pueden realizar pagos con QR y tarjetas.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp1E} alt={'Tipo POINT'} className={'w-[800px] '}/><br/>
            <i>Tildar el checkbox y confirmar. En este punto ya tendremos nuestra APP creada.</i>
        </div>

        <br/>
        <h3>Conectar la aplicacion de MERCADO PAGO con la sucursal de NEW ERA</h3> <br/>
        <p>
            En este paso, veremos de dpnde tomar la informacion de la APP de MERCADO PAGO para conectarla con la
            respectiva sucursal en NEW ERA. Además, veremos como especificarle a MERCADO PAGo como notificar a NEW ERA
            sobre pagos, rembolsos o cancelaciones.
        </p>

        <div className={'ml-4 mb-4'}>
            <img src={mp3A} alt={'Obtener User ID'} className={'w-[800px] '}/><br/>
            <i>Dirigirse a "Informacion General" y copiar el "User Id". Tenerlo a mano ya que lo utilizaremos luego.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp3B} alt={'Habilitar credenciales de PROD'} className={'w-[800px] '}/><br/>
            <i>Dirigirse a "Credenciales de producción", seleccionar el RUBRO y avanzar.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp3C} alt={'Token de prod'} className={'w-[800px] '}/><br/>
            <i>Una vez habilitadas las credenciales, copiar el "ACCESS TOKEN" y guardarlo junto al User Id.</i>
        </div>

        <p>Hasta acá, tenemos User Id & Access token, que es lo necesario para conectar la sucursal en NEW ERA con la
            APP en emrcado pago. A continuacion veremos como usar estos valores en NEW ERA.</p>

        <div className={'ml-4 mb-4'}>
            <img src={mp4B} alt={'Configuracion de sucursal'} className={'w-[400px] '}/><br/>
            <i>En el sitio de NEW ERA, ir a la sucursal en cuestion (En el ejemplo Cordoba 1201) y habilitar mercado
                pago. Colocar en "App token" el access token y en Collector Id( user id) el User id, ambos valores que
                teniamos guardados del paso previo.<br/>
                A su vez, configuraremos a que sucursal y en que caja deben cargarse los montos cobraods (en la figura,
                puntos C y D). Una vez terminado darle a guardar, vera el siguiente error:
            </i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp5A} alt={'Configuracion de sucursal'} className={'w-[400px] '}/><br/>
            <i>Este error es normal, porque aún no configuramos el posnet en la correspondiente sucursal de MERCADO
                PAGO. Esta sucursal se creo en MERCADO PAGO luego que le dimos guardar, antes de esto no existia. NO
                CERRAR ESTA VENTANA, y continuar con el siguiente punto en otra.
            </i>
        </div>

        <h3>Configurar el POSNET o LECTOR en la caja de la sucursal de MERCADO PAGO</h3> <br/>

        <div className={'ml-4 mb-4'}>
            <img src={mp6A} alt={'Configuracion de sucursal'} className={'w-[400px] '}/><br/>
            <i>En MERCADO PAGO ir a "Tu cuenta", editar datos personales.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp6B} alt={'Configuracion de sucursal'} className={'w-[800px] '}/><br/>
            <i>Ir al tab "Negocio" y una vez dentro seleccionar "Locales y Cajas". Entrar en la sucursal creada</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp6C} alt={'Configuracion de sucursal'} className={'w-[600px] '}/><br/>
            <i>Dentro de la sucursal, seleccionar <b>"Lectores"</b> y dar click em <b>"Ir a tus lectores Point"</b></i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp6D} alt={'Configuracion de sucursal'} className={'w-[600px] '}/><br/>
            <i>Luego, en el link<b>"¿Como activo mi lector?"</b> y sigo las instrucciones para hacerlo. Lo que se
                procederá a hacer es configurar el lector desde la APP de MERCADO PAGO en el celular, siguiendo las
                instrucciones es todo bastante sencillo.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp7A} alt={'Configuracion de sucursal'} className={'w-[600px] '}/><br/>
            <i>Una vez terminada la configuracion hecha con el celular, si refrescamos la pantalla veremos que el lector
                ya está asociada conla caja en al sucursal. Es importante que la sucursal diga la direccion (Cordoba
                1201 en el ejemplo) y el lector diga "Caja Cordoba 1201". Tambien es importante no crear las sucursales
                / Cajas manualmente en MERCADO PAGO. El sistema NEW ERA se va a encargar de crearla en el paso anterior
                que dimos al boton "GUARDAR"</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp8A} alt={'Configuracion de sucursal'} className={'w-[400px] '}/><br/>
            <i>Volvemos a la pagina que dejamos abierta en NEW ERA y si le damos al boton "Checkear configuracion" ya
                deberia mostrarnos un cartel verde con una URL. Dicha URL la vamos a copiar y a guardar para usar en el
                siguiente paso.</i>
        </div>

        <h3>Configurar lso WEBHOOKS en MERCADO PAGO</h3> <br/>

        <div className={'ml-4 mb-4'}>
            <img src={mp9A} alt={'Configuracion de sucursal'} className={'w-[800px] '}/><br/>
            <i>Dirigirse a mercado pago dev <A target={'_blank'}
                                               href={'https://www.mercadopago.com.ar/developers/panel/app'}>https://www.mercadopago.com.ar/developers/panel/app</A> y
                entrar a la aplicacion que creamos.</i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp9B} alt={'Configuracion de sucursal'} className={'w-[800px] '}/><br/>
            <i>Ahi dentro, vamos a <b>webhooks</b> y hacemos click en el boton <b>"Configurar notificaciones"</b> </i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp10A} alt={'Configuracion de sucursal'} className={'w-[600px] '}/><br/>
            <i>Una vez dentro seleccionar el tab <b>Modo Productivo</b>. Ahi copiar la URL que sacamos del cuadro verde
                en NEW ERA. Además tildar las opciones como estan recuadradas en la imagen. Luego darle al boton <b>Guardar
                    Configuracion</b></i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp11A} alt={'Configuracion de sucursal'} className={'w-[800px] '}/><br/>
            <i>Una vez guardado, vamos a procede a checkear si MERCADO PAGO puede conectarse con NEW ERA. Hacer cick
                en <b>Simular Notificacion</b>, completar los datos e la izquierda como están en la imagen y rpesionar
                el boton <b>Enviar prueba</b></i>
        </div>

        <div className={'ml-4 mb-4'}>
            <img src={mp11B} alt={'Configuracion de sucursal'} className={'w-[500px] '}/><br/>
            <i>Si todo salio bien, deberiamos ver esta imagen enmarcada en verde. Si sale en rojo es que hubo algun
                error en la configuracion</i>
        </div>

        <p>
            En este punto ya estamos listos para trabajar en la sucursal vendiendo con el POSNET (tanto QR como
            tarjetas). Es importante que si algun paso no sale como se detalla o aparece algun error se comuniquen con
            soporte técnico.
            <br/>
            Para temrinar de checkear la cnfiguracion es recomendable instalar la version <b>2.3.2</b> de la APP de
            ventas o superior en al sucursal, ingresar a una caja y realizar un cobro con POINT. La misma se peude
            reembolsar.
        </p>
    </>
}
