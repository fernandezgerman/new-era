import React from 'react';
import { camelCaseToSpace } from '@/utils/general.js';
import {
  pickDetalleValuesSinId,
  ProcesarColumnaPrecioTemporal,
  renderDetalleGrid,
} from './columnProcessors.jsx';

export function HistoricoDePrecioArticuloPrecioTemporal({ detalle }) {
  const detallesFiltrados = pickDetalleValuesSinId(detalle);

  return (
    <>
      <span className={'text-md text-yellow-200'}>
        <b>{camelCaseToSpace(detalle.accion)}</b> un PRECIO TEMPORAL
      </span>
      <br />
      {renderDetalleGrid({
        detallesFiltrados,
        renderValue: ({ indice, value }) => (
          <ProcesarColumnaPrecioTemporal detalle={detalle} nombre={indice} value={value} />
        ),
      })}
    </>
  );
}

