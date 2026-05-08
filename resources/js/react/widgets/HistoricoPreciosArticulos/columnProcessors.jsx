import React from 'react';
import { pickBy } from 'lodash';
import { useLista } from '@/dataHooks/useListas.jsx';
import { useSucursal } from '@/dataHooks/useSucursales.jsx';
import { camelCaseToSpace } from '@/utils/general.js';
import { processNumber } from '@/utils/numbers.jsx';

export function ColumnaSucursal({ sucursalId }) {
  const { data } = useSucursal(sucursalId);
  return data?.nombre;
}

export function ColumnaLista({ listaId }) {
  const { data } = useLista(listaId);
  return data?.nombre;
}

export function ProcesarLaColumnaBasadaEnTipo({ nombre, valor }) {
  if (nombre.toLowerCase() === 'porcentaje') {
    if (parseInt(valor) === 0 && !valor) {
      return 'No aplica';
    }
    return `${valor}%`;
  }

  if (nombre.toLowerCase() === 'aplicaminimodeutilidad') {
    return valor ? 'Si' : 'No';
  }

  if (nombre.toLowerCase() === 'idsucursal' || nombre.toLowerCase() === 'sucursal') {
    if (valor) {
      return <ColumnaSucursal sucursalId={valor} />;
    }
    return <span className={'italic'}>Todas</span>;
  }

  if (nombre.toLowerCase() === 'idlistaprecio' || nombre.toLowerCase() === 'listaprecio') {
    if (valor) {
      return <ColumnaLista listaId={valor} />;
    }
    return <span className={'italic'}>Todas</span>;
  }

  if (nombre.toLowerCase() === 'activo' || nombre.toLowerCase() === 'activo') {
    return parseInt(valor) === 1 ? 'Si' : 'No';
  }

  if (nombre.toLowerCase() === 'cantidad' || nombre.toLowerCase() === 'cantidadmaxima') {
    if (!valor) {
      return 'No aplica';
    }
    return processNumber(valor, 0, false, '#');
  }

  if (nombre.toLowerCase() === 'precioexcepcion' || nombre.toLowerCase() === 'porcentajeexcepcion') {
    if (parseFloat(valor) === 0.0 || !parseFloat(valor) || !valor) {
      return <span className={'italic'}>Calculo automatico</span>;
    }

    return processNumber(valor, 2, false, '$');
  }

  if (nombre.toLowerCase() === 'fechacaducidad') {
    if (!valor) {
      return <span className={'italic'}>Todas</span>;
    }
    return valor;
  }

  return processNumber(valor, 2, false, '$');
}

export function ProcesarColumnaPromocion({ nombre, value, detalle }) {
  const nombreLower = nombre.toLowerCase();
  const oldValue = detalle.oldvalues[nombre];
  const mostrarValorAnterior = oldValue && oldValue !== value;

  const color = detalle.accion === 'Agrego' || mostrarValorAnterior ? 'text-green-300' : '';

  if (nombreLower === 'promocion') {
    if (detalle.accion === 'Agrego') {
      return <span className={'text-green-300'}>{detalle.nuevaPromocion.descripcion}</span>;
    }

    if (detalle.nuevaPromocion?.id !== detalle.viejaPromocion?.id) {
      return (
        <>
          <span className={'line-through text-red-500'}>{detalle.viejaPromocion?.descripcion}</span> =>{' '}
          <span className={'text-green-300'}>{detalle.nuevaPromocion?.descripcion}</span>
        </>
      );
    }

    return detalle.nuevaPromocion?.descripcion;
  }

  return (
    <>
      {mostrarValorAnterior && (
        <>
          <span className={'line-through text-red-500'}>
            <ProcesarLaColumnaBasadaEnTipo nombre={nombre} valor={oldValue} />
          </span>{' '}
          =>
        </>
      )}{' '}
      <span className={color}>
        <ProcesarLaColumnaBasadaEnTipo nombre={nombre} valor={value} />
      </span>
    </>
  );
}

export function ProcesarColumnaPrecioTemporal({ nombre, value, detalle }) {
  const oldValue = detalle.oldvalues[nombre];
  const mostrarValorAnterior =
    (oldValue || nombre === 'sucursal' || nombre === 'listaprecio') && oldValue !== value;

  const mostrarOldVacio =
    nombre.toLowerCase() === 'fechacaducidad' && detalle.accion !== 'Agrego' && oldValue !== value;

  const color =
    detalle.accion === 'Agrego' || mostrarValorAnterior || mostrarOldVacio ? 'text-green-300' : '';

  return (
    <>
      {(mostrarValorAnterior || mostrarOldVacio) && detalle.accion !== 'Agrego' && (
        <>
          <span className={'line-through text-red-500'}>
            <ProcesarLaColumnaBasadaEnTipo nombre={nombre} valor={oldValue} />
          </span>{' '}
          =>
        </>
      )}{' '}
      <span className={color}>
        <ProcesarLaColumnaBasadaEnTipo nombre={nombre} valor={value} />
      </span>
    </>
  );
}

export function pickDetalleValuesSinId(detalle) {
  return pickBy(detalle?.newvalues, (value, indice) => indice.toLowerCase() !== 'id');
}

export function renderDetalleGrid({ detallesFiltrados, renderValue }) {
  return Object.entries(detallesFiltrados ?? {}).map(([indice, value]) => {
    return (
      <div key={indice} className={'ml-2 grid grid-cols-3'}>
        <div>{camelCaseToSpace(indice)}:</div>
        <div className={'col-span-2'}>{renderValue({ indice, value })}</div>
      </div>
    );
  });
}

