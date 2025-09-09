import React from 'react';
import {Input} from "../../components/Input.jsx";
import {DivCenterContentHyV} from "../../components/Containers/DivCenterContentHyV.jsx";
import {ButtonSuccess} from "../../components/Buttons.jsx";
import imageBackgroundFlower from '../../../../img/flower-background-without-logo.png';

import darkLogo from '../../../../img/dark-logo.png';
import lightLogo from '../../../../img/light-logo.png';
import useSystemTheme from "../../utils/useSystemTheme.jsx";

export const Login = () =>
{
    const darkMode = useSystemTheme();
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
            // Laravel expects fields: usuario, clave (see AuthController::login)
            const response = await window.axios.post('/login', {
                usuario: usuario,
                clave: password,
            });
            // If login succeeds, backend redirects to sucursal.selection.
            // In SPA context, follow redirect by reloading to let Laravel route handle it.
            if (response && (response.status === 200 || response.status === 204)) {
                window.location.href = '/select-sucursal';
            } else {
                // Some Laravel setups respond with 302; let browser follow
                window.location.reload();
            }
        } catch (err) {
            // On validation/auth failure Laravel returns 422 or 302 with errors
            setError('Credenciales inválidas. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (<>
        <DivCenterContentHyV className="md:items-center">
            <div className="relative flex flex-col break-words bg-transparent border-0 shadow-none lg:py4 rounded-2xl bg-clip-border max-w-400px w-[400px]">
                <img src={darkMode ? darkLogo : lightLogo} className={'p-6'} alt="Logo" />
                <div className="p-6 pb-0 mb-0">
                    <h4 className="font-bold">Ingrese usuario y clave.</h4>
                </div>

                <div className="flex-auto p-6">
                    <form role="form" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Input type={'text'} placeHolder="Usuario" value={usuario} setValue={setUsuario} />
                        </div>
                        <div className="mb-4">
                            <Input type={'password'} placeHolder="Clave" value={password} setValue={setPassword} />
                        </div>
                        {error && (
                            <div className="text-red-600 text-sm mb-4">{error}</div>
                        )}
                        <div className="text-center">
                            <ButtonSuccess type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</ButtonSuccess>
                        </div>
                    </form>
                </div>

            </div>
        </DivCenterContentHyV>
        </>
    );
}
