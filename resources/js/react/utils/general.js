import {isArray, reduce} from "lodash";

export const arrayIsEmpty = (arreglo) => arreglo === undefined || arreglo === null || !isArray(arreglo) || arreglo.length === 0;

export const objectIsEmpty = (objeto) => objeto === undefined ||
    objeto === null ||
    reduce(objeto, (acum, value) => value === null ? acum : false, true)
