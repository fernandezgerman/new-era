import React from 'react';

export const Menu = () => {
    const las = 3;
    return (
        <div className="items-center block w-full h-auto grow basis-full max-w-[200px]" id="sidenav-collapse-main">
            <ul className="flex flex-col pl-0 mb-0 list-none">
                <li className="w-full mt-4">
                    <h6 className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60 dark:text-white">Paginas</h6>
                </li>
            </ul>
        </div>);
}
export const Inicio = () => {
    const las = 3;
    return (
        <div className="items-center block w-full h-auto grow basis-full max-w-[200px]" id="sidenav-collapse-main">
            <ul className="flex flex-col pl-0 mb-0 list-none">
                <li className="mt-0.5 w-full">
                    <a active_primary={true} collapse_trigger="primary"  className="after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] dark:text-white dark:opacity-80" aria-expanded="true">
                        <div className="stroke-none shadow-soft-sm bg-gradient-to-tl from-purple-700 to-pink-500 mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
                            sdf asdf
                        </div>
                        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft text-slate-700">Inicio</span>
                    </a>
                </li>
            </ul>
        </div>);
}
