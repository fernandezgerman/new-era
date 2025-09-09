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

    return (<>
        <DivCenterContentHyV className="md:items-center">
            <div className="relative flex flex-col break-words bg-transparent border-0 shadow-none lg:py4 rounded-2xl bg-clip-border max-w-400px w-[400px]">
                <img src={darkMode ? darkLogo : lightLogo} className={'p-6'} alt="Logo" />
                <div className="p-6 pb-0 mb-0">
                    <h4 className="font-bold">Ingrese usuario y clave.</h4>
                </div>

                <div className="flex-auto p-6">
                    <form role="form">
                        <div className="mb-4">
                            <Input type={'text'} placeHolder="Usuario" value={usuario} setValue={setUsuario} />
                        </div>
                        <div className="mb-4">
                            <Input type={'password'} placeHolder="Clave" value={password} setValue={setPassword} />
                        </div>
                        {/*
                        <div className="min-h-6 mb-0.5 block pl-12 text-left">
                            <input id="rememberMe"
                                   className="mt-0.5 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.3 h-5 relative float-left -ml-12 w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                                   type="checkbox"/>


                            <label className="mb-2 ml-1 font-normal cursor-pointer select-none text-sm"
                                htmlFor="rememberMe">Remember me</label>
                        </div>
                    */}
                        <div className="text-center">
                            <ButtonSuccess>Ingresar</ButtonSuccess>
                        </div>
                    </form>
                </div>

            </div>
        </DivCenterContentHyV>
        </>
    );
}
