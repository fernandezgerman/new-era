import React from 'react';
import {Input} from "../../../components/Input.jsx";
import {DivCenterContentHyV} from "../../../components/Containers/DivCenterContentHyV.jsx";
import {ButtonSuccess} from "../../../components/Buttons.jsx";

import darkLogo from '../../../../../img/dark-logo.png';
import lightLogo from '../../../../../img/light-logo.png';
import useSystemTheme from "../../../utils/useSystemTheme.jsx";
import Authentication from "../../../resources/Authentication.jsx";
import { Select } from "../../../components/Select.jsx";
import {useUsuarioSucursales} from "../../../dataHooks/useUsuarioSucursale.jsx";

const SelectUserAndPassword = ({ setAuthUser }) => {
    const [usuario, setUsuario] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!usuario || !password) {
            setError('Por favor complete usuario y clave.');
            return;
        }
        try {
            setLoading(true);
            const authenticationResource = new Authentication();
            const user = await authenticationResource.login(usuario, password);
            setAuthUser(user);
            setLoading(false);

        } catch (err) {
            // On validation/auth failure Laravel returns 422 or 302 with errors
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-6 pb-0 mb-0">
                <h4 className="font-bold">Ingrese usuario y clave.</h4>
            </div>

            <div className="flex-auto p-6">
                <form role="form" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input type={'text'} placeHolder="Usuario" value={usuario} setValue={setUsuario}/>
                    </div>
                    <div className="mb-4">
                        <Input type={'password'} placeHolder="Clave" value={password} setValue={setPassword}/>
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm mb-4">{error}</div>
                    )}
                    <div className="text-center">
                        <ButtonSuccess type="submit"
                                       disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</ButtonSuccess>
                    </div>
                </form>
            </div>
        </>
    );
}

const SelectSucursal = ({ authUser }) => {

    const [sucursal, setSucursal] = React.useState(null);
    const handleSubmit = () =>
    {

    }
    const error = '';

    const {data , loading} = useUsuarioSucursales({usuarioId: authUser.id});

    console.log('data', data);

    return (
        <>
            <div className="p-6 pb-0 mb-0">
                <h4 className="font-bold">Bienvenido {authUser.nombre}, seleccione la sucursal en la que va a trabajar</h4>
            </div>

            <div className="flex-auto p-6">
                <form role="form" onSubmit={handleSubmit}>

                    <div className="mb-4">
                        <Select
                            isLoading={loading}
                            options={data?.map((sucursal) => ({value: sucursal.id, label: sucursal.nombre}))}
                            value={sucursal}
                            setValue={setSucursal}
                            placeholder="Seleccione una sucursal"
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm mb-4">{error}</div>
                    )}
                    <div className="text-center">
                        <ButtonSuccess type="submit"
                                       disabled={loading}>{loading ? 'Aguarde...' : 'Continuar'}</ButtonSuccess>
                    </div>
                </form>
            </div>
        </>
    );
}

export const Login = () => {
    const darkMode = useSystemTheme();

    const [authUser, setAuthUser] = React.useState(null);

    return (<>
            <DivCenterContentHyV className="md:items-center">
                <div
                    className="relative flex flex-col break-words bg-transparent border-0 shadow-none lg:py4 rounded-2xl bg-clip-border max-w-400px w-[400px]">
                    <img src={darkMode ? darkLogo : lightLogo} className={'p-6'} alt="Logo"/>

                    {authUser === null && <SelectUserAndPassword setAuthUser={setAuthUser}/>}
                    {authUser !== null && <SelectSucursal authUser={authUser}/>}
                </div>
            </DivCenterContentHyV>
        </>
    );
}
