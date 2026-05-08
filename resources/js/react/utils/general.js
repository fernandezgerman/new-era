import {isArray, reduce} from "lodash";

export const arrayIsEmpty = (arreglo) => arreglo === undefined || arreglo === null || !isArray(arreglo) || arreglo.length === 0;

export const objectIsEmpty = (objeto) => objeto === undefined ||
    objeto === null ||
    reduce(objeto, (acum, value) => value === null ? acum : false, true)
;

export const camelCaseToSpace = (text) => {
    if (!text) return text;
    const spaced = text.replace(/([A-Z])/g, ' $1').replace(/\s+/g, ' ').trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};
