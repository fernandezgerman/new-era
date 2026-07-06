//mediodecobrosucursalconfiguraciones
import Resource from '@/resources/Resource.jsx';
import {useQuery} from '@tanstack/react-query';

export const useMedioDeCobroSucursalConfiguraciones = () => {
    return useQuery({
        queryKey: ['modo-de-cobro-configuracion-sucursal-todos'],
        queryFn: async () => {
            const resource = new Resource();
            return await resource.getEntities('MedioDeCobroSucursalConfiguracion', ['sucursalCajaDestino', 'usuarioCajaDestino', 'modoDeCobro'], {transferirmonto: true});
        },
        staleTime: 1000 * 60 * 60 * 1,
    });
};


export const useMedioDeCobroSucursalConfiguracion = (idsucursalcajadestino, idusuariocajadestino) => {
    const result = useMedioDeCobroSucursalConfiguraciones();

    console.log('result.data', idsucursalcajadestino, idusuariocajadestino, result.data,result.data?.find((item) => item.idsucursalcajadestino === idsucursalcajadestino && item.idusuariocajadestino === idusuariocajadestino))
    return {...result, data:  result.data?.find((item) => item.idsucursalcajadestino === idsucursalcajadestino && item.idusuariocajadestino === idusuariocajadestino) };
}
