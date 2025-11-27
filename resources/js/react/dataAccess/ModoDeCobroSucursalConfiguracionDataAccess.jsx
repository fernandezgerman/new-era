import ModosDeCobro from "@/resources/ModosDeCobro.jsx";
import Resource from "@/resources/Resource.jsx";

const getModoDeCobroSucursalConfiguracion = ({sucursalId, modoDeCobroId}) => {
    const resource = new Resource();
    return resource.getEntities(
        'MedioDeCobroSucursalConfiguracion',
        ['sucursalCajaDestino', 'usuarioCajaDestino'],
        {idsucursal: sucursalId, idmododecobro: modoDeCobroId});
    ;
}

const testToken = (configuracionId) => {
    const repository = new ModosDeCobro();
    return repository.testConnection(configuracionId)
}

const insertModoDeCobroSucursalConfiguracion = async ({data}) => {
    const resource = new Resource();
    return resource.insertEntity(
        'MedioDeCobroSucursalConfiguracion',
        data,
        ['sucursalCajaDestino', 'usuarioCajaDestino']);
}

const updateModoDeCobroSucursalConfiguracion = async ({data}) => {
    const resource = new Resource();
    return resource.updateEntity(
        'MedioDeCobroSucursalConfiguracion',
        data?.id,
        data,
        ['sucursalCajaDestino', 'usuarioCajaDestino']);
}

export {getModoDeCobroSucursalConfiguracion, testToken, insertModoDeCobroSucursalConfiguracion, updateModoDeCobroSucursalConfiguracion};
