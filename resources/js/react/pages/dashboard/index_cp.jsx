import React from 'react';

const legacyFrame = ({iframeHrefs}) => {

    return iframeHrefs !== null && (<iframe
        src={iframeHrefs}
        width="100%"
        height="100%"
        title="Contenido Externo"
        // Consider adding sandbox attributes for security
        // sandbox="allow-scripts allow-same-origin"
    >
    </iframe>);
}
export const Dashboard = () => {

    const [iframeHrefs, setIframeHrefs] = React.useState(null);
    return (<div>
            <div className="m-0 font-sans antialiased font-normal text-left leading-default text-base dark:bg-slate-950 bg-gray-50 text-slate-500 dark:text-white">
            <aside mini="false" className="fixed inset-y-0 left-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto transition-all duration-200 -translate-x-full bg-white border-0 shadow-none xl:ml-4 dark:bg-gray-950 ease-soft-in-out z-990 max-w-64 rounded-2xl xl:translate-x-0 xl:bg-transparent" id="sidenav-main">

                <div className="h-20">
                    <span className="ml-1 font-semibold transition-all duration-200 ease-soft-in-out">New era</span>
                </div>


                <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />

                <div className="items-center block w-full h-auto grow basis-full" id="sidenav-collapse-main">
                    <ul className="flex flex-col pl-0 mb-0 list-none">

                        <li className="mt-0.5 w-full">
                            <a active_primary collapse_trigger="primary" href="javascript:;" className="after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:rotate-180 after:font-bold after:text-slate-800 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] dark:text-white dark:opacity-80" aria-expanded="true">
                                <div className="stroke-none shadow-soft-sm bg-gradient-to-tl from-purple-700 to-pink-500 mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">

                                    <svg width="12px" height="12px" viewBox="0 0 45 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <title>shop</title>
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g transform="translate(-1716.000000, -439.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                <g transform="translate(1716.000000, 291.000000)">
                                                    <g transform="translate(0.000000, 148.000000)">
                                                        <path
                                                            className=""
                                                            d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"
                                                            opacity="0.598981585"
                                                        ></path>
                                                        <path
                                                            className=""
                                                            d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                                                        ></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>

                                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft text-slate-700">Inicio</span>
                            </a>
                        </li>

                        <li className="w-full mt-4">
                            <h6 className="pl-6 ml-2 font-bold leading-tight uppercase text-xs opacity-60 dark:text-white">Paginas</h6>
                        </li>

                        <li className="mt-0.5 w-full">
                            <a collapse_trigger="primary" className="ease-soft-in-out text-sm py-2.7 active after:ease-soft-in-out after:font-awesome-5-free my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium text-slate-500 shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:text-slate-800/50 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] dark:text-white dark:opacity-80 dark:after:text-white/50 dark:after:text-white" aria-controls="pagesExamples" role="button" aria-expanded="false">
                                <div className="stroke-none shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
                                    <svg width="12px" height="12px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                                        <title>office</title>
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g transform="translate(-1869.000000, -293.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                <g transform="translate(1716.000000, 291.000000)">
                                                    <g id="office" transform="translate(153.000000, 2.000000)">
                                                        <path className="fill-slate-800" d="M12.25,17.5 L8.75,17.5 L8.75,1.75 C8.75,0.78225 9.53225,0 10.5,0 L31.5,0 C32.46775,0 33.25,0.78225 33.25,1.75 L33.25,12.25 L29.75,12.25 L29.75,3.5 L12.25,3.5 L12.25,17.5 Z" opacity="0.6"></path>
                                                        <path className="fill-slate-800" d="M40.25,14 L24.5,14 C23.53225,14 22.75,14.78225 22.75,15.75 L22.75,38.5 L19.25,38.5 L19.25,22.75 C19.25,21.78225 18.46775,21 17.5,21 L1.75,21 C0.78225,21 0,21.78225 0,22.75 L0,40.25 C0,41.21775 0.78225,42 1.75,42 L40.25,42 C41.21775,42 42,41.21775 42,40.25 L42,15.75 C42,14.78225 41.21775,14 40.25,14 Z M12.25,36.75 L7,36.75 L7,33.25 L12.25,33.25 L12.25,36.75 Z M12.25,29.75 L7,29.75 L7,26.25 L12.25,26.25 L12.25,29.75 Z M35,36.75 L29.75,36.75 L29.75,33.25 L35,33.25 L35,36.75 Z M35,29.75 L29.75,29.75 L29.75,26.25 L35,26.25 L35,29.75 Z M35,22.75 L29.75,22.75 L29.75,19.25 L35,19.25 L35,22.75 Z"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Accesos</span>
                            </a>


                            <div className="h-auto overflow-hidden transition-all duration-200 ease-soft-in-out max-h-0" id="pagesExamples">
                                <ul className="flex flex-wrap pl-4 mb-0 ml-6 list-none transition-all duration-200 ease-soft-in-out">
                                    <li className="w-full">
                                        <a collapse_trigger="secondary" className="after:ease-soft-in-out after:font-awesome-5-free ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] after:ml-auto after:inline-block after:font-bold after:text-slate-800/50 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] dark:text-white dark:opacity-60 dark:before:bg-white dark:before:opacity-80 dark:after:text-white/50 dark:after:text-white" aria-expanded="false" href="javascript:;">
                                            <span className="w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> P </span>
                                            <span className="transition-all duration-100 pointer-events-none ease-soft"> Profile <b className="caret"></b></span>
                                        </a>

                                        <div className="h-auto overflow-hidden transition-all duration-200 ease-soft-in-out max-h-0" id="profileExample">
                                            <ul className="flex flex-col flex-wrap pl-0 mb-0 list-none transition-all duration-200 ease-soft-in-out">
                                                <li className="w-full">
                                                    <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-3.4 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors dark:text-white dark:opacity-60" href="../../pages/pages/profile/overview.html">
                                                        <span className="w-0 leading-tight text-center transition-all duration-200 opacity-0 pointer-events-none text-xs ease-soft-in-out"> P </span>
                                                        <span className="transition-all duration-100 pointer-events-none ease-soft"> Profile Overview </span>
                                                    </a>
                                                </li>

                                                <li className="w-full">
                                                    <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-3.4 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors dark:text-white dark:opacity-60" href="../../pages/pages/profile/teams.html">
                                                        <span className="w-0 leading-tight text-center transition-all duration-200 opacity-0 pointer-events-none text-xs ease-soft-in-out"> T </span>
                                                        <span className="transition-all duration-100 pointer-events-none ease-soft"> Teams </span>
                                                    </a>
                                                </li>

                                                <li className="w-full">
                                                    <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-3.4 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors dark:text-white dark:opacity-60" href="../../pages/pages/profile/projects.html">
                                                        <span className="w-0 leading-tight text-center transition-all duration-200 opacity-0 pointer-events-none text-xs ease-soft-in-out"> A </span>
                                                        <span className="transition-all duration-100 pointer-events-none ease-soft"> All Projects </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>


                        <li className="mt-0.5 w-full">
                            <a collapse_trigger="primary" href="javascript:;" className="ease-soft-in-out text-sm py-2.7 active after:ease-soft-in-out after:font-awesome-5-free my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium text-slate-500 shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:text-slate-800/50 after:antialiased after:transition-all after:duration-200 after:content-['\f107'] dark:text-white dark:opacity-80 dark:after:text-white/50 dark:after:text-white" aria-controls="applicationsExamples" role="button" aria-expanded="false">
                                <div className="stroke-none shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
                                    <svg width="12px" height="12px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                                        <title>settings</title>
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g transform="translate(-2020.000000, -442.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                <g transform="translate(1716.000000, 291.000000)">
                                                    <g transform="translate(304.000000, 151.000000)">
                                                        <polygon className="fill-slate-800" opacity="0.596981957" points="18.0883333 15.7316667 11.1783333 8.82166667 13.3333333 6.66666667 6.66666667 0 0 6.66666667 6.66666667 13.3333333 8.82166667 11.1783333 15.315 17.6716667"></polygon>
                                                        <path className="fill-slate-800" d="M31.5666667,23.2333333 C31.0516667,23.2933333 30.53,23.3333333 30,23.3333333 C29.4916667,23.3333333 28.9866667,23.3033333 28.48,23.245 L22.4116667,30.7433333 L29.9416667,38.2733333 C32.2433333,40.575 35.9733333,40.575 38.275,38.2733333 L38.275,38.2733333 C40.5766667,35.9716667 40.5766667,32.2416667 38.275,29.94 L31.5666667,23.2333333 Z" opacity="0.596981957"></path>
                                                        <path className="fill-slate-800" d="M33.785,11.285 L28.715,6.215 L34.0616667,0.868333333 C32.82,0.315 31.4483333,0 30,0 C24.4766667,0 20,4.47666667 20,10 C20,10.99 20.1483333,11.9433333 20.4166667,12.8466667 L2.435,27.3966667 C0.95,28.7083333 0.0633333333,30.595 0.00333333333,32.5733333 C-0.0583333333,34.5533333 0.71,36.4916667 2.11,37.89 C3.47,39.2516667 5.27833333,40 7.20166667,40 C9.26666667,40 11.2366667,39.1133333 12.6033333,37.565 L27.1533333,19.5833333 C28.0566667,19.8516667 29.01,20 30,20 C35.5233333,20 40,15.5233333 40,10 C40,8.55166667 39.685,7.18 39.1316667,5.93666667 L33.785,11.285 Z"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </div>

                                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Applications</span>
                            </a>
                            <div className="h-auto overflow-hidden transition-all duration-200 ease-soft-in-out max-h-0" id="applicationsExamples">
                                <ul className="flex flex-wrap pl-4 mb-0 ml-6 list-none transition-all duration-200 ease-soft-in-out">
                                    <li className="w-full">
                                        <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] dark:text-white dark:opacity-60 dark:before:bg-white dark:before:opacity-80" href="../../pages/applications/kanban.html">
                                            <span className="w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> K </span>
                                            <span className="transition-all duration-100 pointer-events-none ease-soft"> Kanban </span>
                                        </a>
                                    </li>
                                    <li className="w-full">
                                        <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] dark:text-white dark:opacity-60 dark:before:bg-white dark:before:opacity-80" href="../../pages/applications/wizard.html">
                                            <span className="w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> W </span>
                                            <span className="transition-all duration-100 pointer-events-none ease-soft"> Wizard </span>
                                        </a>
                                    </li>
                                    <li className="w-full">
                                        <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] dark:text-white dark:opacity-60 dark:before:bg-white dark:before:opacity-80" href="../../pages/applications/datatables.html">
                                            <span className="w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> D </span>
                                            <span className="transition-all duration-100 pointer-events-none ease-soft"> DataTables </span>
                                        </a>
                                    </li>
                                    <li className="w-full">
                                        <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] dark:text-white dark:opacity-60 dark:before:bg-white dark:before:opacity-80" href="../../pages/applications/calendar.html">
                                            <span className="w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> C </span>
                                            <span className="transition-all duration-100 pointer-events-none ease-soft"> Calendar </span>
                                        </a>
                                    </li>
                                    <li className="w-full">
                                        <a className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm before:-left-4.5 before:h-1.25 before:w-1.25 relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-3xl before:bg-slate-800/50 before:content-[''] dark:text-white dark:opacity-60 dark:before:bg-white dark:before:opacity-80" href="../../pages/applications/analytics.html">
                                            <span className="w-0 text-center transition-all duration-200 opacity-0 pointer-events-none ease-soft-in-out"> A </span>
                                            <span className="transition-all duration-100 pointer-events-none ease-soft"> Analytics </span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>


                    </ul>
                </div>
            </aside>
        </div>

    <main className="relative h-full max-h-screen transition-all duration-200 ease-soft-in-out xl:ml-68 rounded-xl">
        <nav navbar-main className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 mt-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start" navbar-scroll="true">
            <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
                <nav>
                    <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
                        <li className="leading-normal text-sm breadcrumb-item">
                            <a className="text-slate-700 opacity-30 dark:text-white" href="javascript:;">
                                <svg width="12px" height="12px" className="mb-1" viewBox="0 0 45 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <title>shop</title>
                                    <g className="dark:fill-white" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g className="dark:fill-white" transform="translate(-1716.000000, -439.000000)" fill="#252f40" fill-rule="nonzero">
                                            <g className="dark:fill-white" transform="translate(1716.000000, 291.000000)">
                                                <g className="dark:fill-white" transform="translate(0.000000, 148.000000)">
                                                    <path d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"></path>
                                                    <path
                                                        d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"
                                                    ></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </a>
                        </li>
                        <li className="text-sm pl-2 leading-normal before:float-left before:pr-2 before:text-gray-600 before:content-['/']">
                            <a className="opacity-50 text-slate-700 dark:text-white" href="javascript:;">Pages</a>
                        </li>
                        <li className="text-sm pl-2 capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/'] dark:text-white dark:before:text-white" aria-current="page">Default</li>
                    </ol>
                    <h6 className="mb-0 font-bold capitalize dark:text-white">Default</h6>
                </nav>

                <div className="flex items-center">
                    <a mini-sidenav-burger href="javascript:;" className="hidden p-0 transition-all ease-nav-brand text-sm text-slate-500 xl:block" aria-expanded="false">
                        <div className="w-4.5 overflow-hidden">
                            <i className="ease-soft mb-0.75 relative block h-0.5 translate-x-[5px] rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                            <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                            <i className="ease-soft relative block h-0.5 translate-x-[5px] rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                        </div>
                    </a>
                </div>

                <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto" id="navbar">
                    <div className="flex items-center md:ml-auto md:pr-4">
                        <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft">
                <span className="text-sm ease-soft leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                  <i className="fas fa-search" aria-hidden="true"></i>
                </span>
                            <input type="text" className="pl-9 text-sm focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 ease-soft w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none focus:transition-shadow" placeholder="Type here..." />
                        </div>
                    </div>
                    <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
                        <a className="inline-block px-8 py-2 mb-0 mr-4 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro border-fuchsia-500 ease-soft-in text-xs hover:scale-102 active:shadow-soft-xs text-fuchsia-500 hover:border-fuchsia-500 active:bg-fuchsia-500 active:hover:text-fuchsia-500 hover:text-fuchsia-500 tracking-tight-soft hover:bg-transparent hover:opacity-75 hover:shadow-none active:text-white active:hover:bg-transparent" target="_blank" href="https://www.creative-tim.com/builder/soft-ui?ref=navbar-dashboard&amp;_ga=2.76518741.1192788655.1647724933-1242940210.1644448053">Online Builder</a>
                        <li className="flex items-center">
                            <a href="../../pages/authentication/signin/illustration.html" className="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm text-slate-500 dark:text-white">
                                <i className="fa fa-user sm:mr-1" aria-hidden="true"></i>
                                <span className="hidden sm:inline">Sign In</span>
                            </a>
                        </li>
                        <li className="flex items-center pl-4 xl:hidden">
                            <a sidenav-trigger className="block p-0 transition-all ease-nav-brand text-sm text-slate-500 dark:text-white" href="javascript:;" aria-expanded="false">
                                <div className="w-4.5 overflow-hidden">
                                    <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                                    <i className="ease-soft mb-0.75 relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                                    <i className="ease-soft relative block h-0.5 rounded-sm bg-slate-500 transition-all dark:bg-white"></i>
                                </div>
                            </a>
                        </li>
                        <li className="flex items-center px-4">
                            <a href="javascript:;" className="p-0 transition-all text-sm ease-nav-brand text-slate-500 dark:text-white">
                                <i fixed-plugin-button-nav className="cursor-pointer fa fa-cog" aria-hidden="true"></i>
                            </a>
                        </li>

                        <li className="relative flex items-center pr-2">
                            <p className="hidden transform-dropdown-show"></p>
                            <a dropdown-trigger href="javascript:;" className="block p-0 transition-all text-sm ease-nav-brand text-slate-500 dark:text-white" aria-expanded="false">
                                <i className="cursor-pointer fa fa-bell" aria-hidden="true"></i>
                            </a>

                            <ul dropdown-menu className="text-sm transform-dropdown before:font-awesome before:leading-default before:duration-350 before:ease-soft lg:shadow-soft-3xl duration-250 min-w-44 before:sm:right-7 before:text-5.5 dark:bg-gray-950 pointer-events-none absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 opacity-0 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8'] sm:-mr-6 lg:absolute lg:right-0 lg:left-auto lg:mt-2 lg:block lg:cursor-pointer">
                                <li className="relative mb-2">
                                    <a className="group ease-soft py-1.2 clear-both block w-full whitespace-nowrap rounded-lg bg-transparent px-4 duration-300 hover:bg-gray-200 hover:text-slate-700 dark:hover:bg-gray-200/80 lg:transition-colors" href="javascript:;">
                                        <div className="flex py-1">
                                            <div className="my-auto">
                                                <img src="../../assets/img/team-2.jpg" className="inline-flex items-center justify-center mr-4 text-white text-sm h-9 w-9 max-w-none rounded-xl" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h6 className="mb-1 font-normal leading-normal text-sm group-hover:text-slate-700 dark:text-white"><span className="font-semibold">New message</span> from Laur</h6>
                                                <p className="mb-0 leading-tight text-xs text-slate-400 group-hover:text-slate-700 dark:text-white dark:opacity-80">
                                                    <i className="mr-1 fa fa-clock" aria-hidden="true"></i>
                                                    13 minutes ago
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>

                                <li className="relative mb-2">
                                    <a className="group ease-soft py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 transition-colors duration-300 hover:bg-gray-200 hover:text-slate-700 dark:hover:bg-gray-200/80" href="javascript:;">
                                        <div className="flex py-1">
                                            <div className="my-auto">
                                                <img src="../../assets/img/small-logos/logo-spotify.svg" className="inline-flex items-center justify-center mr-4 text-white text-sm bg-gradient-to-tl from-gray-900 to-slate-800 dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 h-9 w-9 max-w-none rounded-xl" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h6 className="mb-1 font-normal leading-normal text-sm group-hover:text-slate-700 dark:text-white"><span className="font-semibold">New album</span> by Travis Scott</h6>
                                                <p className="mb-0 leading-tight text-xs text-slate-400 group-hover:text-slate-700 dark:text-white dark:opacity-80">
                                                    <i className="mr-1 fa fa-clock" aria-hidden="true"></i>
                                                    1 day
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>

                                <li className="relative">
                                    <a className="group ease-soft py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 transition-colors duration-300 hover:bg-gray-200 hover:text-slate-700 dark:hover:bg-gray-200/80" href="javascript:;">
                                        <div className="flex py-1">
                                            <div className="inline-flex items-center justify-center my-auto mr-4 text-white transition-all duration-200 ease-nav-brand text-sm bg-gradient-to-tl from-slate-600 to-slate-300 h-9 w-9 rounded-xl">
                                                <svg width="12px" height="12px" viewBox="0 0 43 36" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                                                    <title>credit-card</title>
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <g transform="translate(-2169.000000, -745.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                            <g transform="translate(1716.000000, 291.000000)">
                                                                <g transform="translate(453.000000, 454.000000)">
                                                                    <path className="color-background" d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z" opacity="0.593633743"></path>
                                                                    <path className="color-background" d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h6 className="mb-1 font-normal leading-normal text-sm group-hover:text-slate-700 dark:text-white">Payment successfully completed</h6>
                                                <p className="mb-0 leading-tight text-xs text-slate-400 group-hover:text-slate-700 dark:text-white dark:opacity-80">
                                                    <i className="mr-1 fa fa-clock" aria-hidden="true"></i>
                                                    2 days
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </main>
</div>
);
}
