import React from 'react';

export const ProcesamientoDeCostosDocumentacion = () => {

    return <>
        <h2>Procesamientos de costo</h2>
        <h3>Al realizar una <i>COMPRA</i> </h3>
        <p>
            Al realizar una compra el sistema va a establecer el costo en el articulo si y solo si el precio unitario con impuestos de la nueva compra es MAYOR al del articulo.
            <br />
            Importante: SI la compra es dudosa y  <b>No fue auditada</b>, el sistema la considerará como bien cargada hasta q sea auditada.
        </p>

        <br/>
        <h3>Al auditar una compra dudosa</h3>
        <br/>
        <p>
            Si una compra que determina el costo del articulo y es dudosa es auditada con los siguientes valores:
            <br />
            1 - Precio Excepcional<br />
            2 - Mal Cargada<br />
            Se hara un recalculo de costo como se hace al anular una compra (vease más abajo)

        </p>
        <h3>Al anular una compra</h3>
        <br/>
        <p>
            Se hara un recalculo de costo (vease más abajo)
        </p>
        <h2>Recalculo de costos</h2>
        <p>
            Este proceso se realiza sobre los articulos que tienen sus compras anuladas, mal cargadas o con precio exepcional y dan costo a algun articulo.
            Es como hacer una marcha atrás a un costo establecido. <br />
            En este caso, el sistema toma los siguientes criterios para establecer una compra nueva como costo:
            <br />
            1 - Toma del historial del articulo el costo inmediatamente anterior.<br />
            2 - Si no existe el historial o fueron anuladas / dudosas, toma la primer compra para el mismo proveedor.<br />
            3 - Si no hya compras al mismo proveedro, toma la ultima comnpra de toda la cadena<br />
            4 - Por ultimo, si no existe compras para ninguno de los puntos anteriores deja el costo tal cual esta.<br />
        </p>
    </>
}
