const simplifyNumber = (value, decimals = 1) => {
    if (value === null) return '';
    let text = value;

    if(value > 1000) {
        text = (value / 1000).toFixed(decimals) + ' K';
    }
    if(value > 1000000) {
        text = (value / 1000000).toFixed(decimals) + ' M';
    }
    return text;

};
export const processNumber = (number, decimals = 2, simplificado = false, simbolo = '') => {

    const signo = number < 0 ? '-' : '';
    let retorno = 0;

    retorno =  simplifyNumber(Math.abs(number), decimals);

    if(!simplificado){
        const formateador = new Intl.NumberFormat('es-ES', {
            style: 'decimal', // 'currency' para monedas
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });

        retorno = Math.abs(formateador.format(number));
    }

    return signo + simbolo + retorno;

}

export const esPar = (n) => n % 2 === 0;
