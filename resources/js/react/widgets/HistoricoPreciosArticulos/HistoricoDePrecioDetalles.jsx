import React from 'react';
import { HistoricoDePrecioArticuloLista } from './HistoricoDePrecioArticuloLista.jsx';
import { HistoricoDePrecioArticuloPromocion } from './HistoricoDePrecioArticuloPromocion.jsx';
import { HistoricoDePrecioArticuloPrecioTemporal } from './HistoricoDePrecioArticuloPrecioTemporal.jsx';

export function HistoricoDePrecioDetalles({ detalles }) {
  return detalles.map((detalle, idx) => {
    return (
      <div key={idx} className={'text-gray-300'}>
        {detalle.tipo === 'Lista Principal' && (
          <HistoricoDePrecioArticuloLista detalleListaPrincipal={detalle} extraText={'(PRINCIPAL)'} />
        )}
        {detalle.tipo === 'Lista Dependiente' && (
          <HistoricoDePrecioArticuloLista detalleListaPrincipal={detalle} />
        )}
        {detalle.tipo === 'Promocion' && <HistoricoDePrecioArticuloPromocion detalle={detalle} />}
        {detalle.tipo === 'Precio Temporal' && (
          <HistoricoDePrecioArticuloPrecioTemporal detalle={detalle} />
        )}
      </div>
    );
  });
}

