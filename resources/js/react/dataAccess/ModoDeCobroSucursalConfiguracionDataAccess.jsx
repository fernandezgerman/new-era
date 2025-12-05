import ModosDeCobro from "@/resources/ModosDeCobro.jsx";
import Resource from "@/resources/Resource.jsx";

const includes = [
    [
        'sucursalCajaDestino',
        'usuarioCajaDestino',
        'usuarioCajaDestino',
        'localQRLink',
        'webHookLink'
    ]
];
const getModoDeCobroSucursalConfiguracion = ({sucursalId, modoDeCobroId}) => {
    const resource = new Resource();
    return resource.getEntities(
        'MedioDeCobroSucursalConfiguracion',
        includes,
        {idsucursal: sucursalId, idmododecobro: modoDeCobroId});
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
        includes);
}

const updateModoDeCobroSucursalConfiguracion = async ({data}) => {
    const resource = new Resource();
    return resource.updateEntity(
        'MedioDeCobroSucursalConfiguracion',
        data?.id,
        data,
        includes);
}

export {
    getModoDeCobroSucursalConfiguracion,
    testToken,
    insertModoDeCobroSucursalConfiguracion,
    updateModoDeCobroSucursalConfiguracion
};
