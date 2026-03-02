export const processNumber = (number, decimals = 2) => {
    const formateador = new Intl.NumberFormat('es-ES', {
        style: 'decimal', // 'currency' para monedas
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    return formateador.format(number);
}

export const esPar = (n) => n % 2 === 0;
