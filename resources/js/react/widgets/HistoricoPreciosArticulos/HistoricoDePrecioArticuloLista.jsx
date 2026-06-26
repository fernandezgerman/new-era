import React from 'react';
import { map } from 'lodash';
import { camelCaseToSpace } from '@/utils/general.js';
import { ProcesarLaColumnaBasadaEnTipo } from './columnProcessors.jsx';

export function HistoricoDePrecioArticuloLista({ detalleListaPrincipal, extraText = '' }) {
  const detalles = detalleListaPrincipal?.newvalues;

  return (
    <>
      <span className={'text-md text-yellow-200'}>
        {camelCaseToSpace(detalleListaPrincipal.lista.nombre)} {extraText}
      </span>
      <br />
      {map(detalles, (value, indice) => {
        const oldValue = detalleListaPrincipal.oldvalues[indice];
        return (
          <div key={indice} className={'ml-2 grid grid-cols-3'}>
            <div>{camelCaseToSpace(indice)}:</div>
            <div className={'col-span-2'}>
              <span className={'line-through text-red-500'}>
                <ProcesarLaColumnaBasadaEnTipo nombre={indice} valor={oldValue} />
              </span>{' '}
              = {' '}
              <span className={'text-green-300'}>
                <ProcesarLaColumnaBasadaEnTipo nombre={indice} valor={value} />
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

