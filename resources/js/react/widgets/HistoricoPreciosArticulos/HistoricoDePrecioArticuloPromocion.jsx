import React from 'react';
import { camelCaseToSpace } from '@/utils/general.js';
import {
  pickDetalleValuesSinId,
  ProcesarColumnaPromocion,
  renderDetalleGrid,
} from './columnProcessors.jsx';

export function HistoricoDePrecioArticuloPromocion({ detalle }) {
  const detallesFiltrados = pickDetalleValuesSinId(detalle);

  return (
    <>
      <span className={'text-md text-yellow-200'}>
        <b>{camelCaseToSpace(detalle.accion)}</b> una promocion
      </span>
      <br />
      {renderDetalleGrid({
        detallesFiltrados,
        renderValue: ({ indice, value }) => (
          <ProcesarColumnaPromocion detalle={detalle} nombre={indice} value={value} />
        ),
      })}
    </>
  );
}

