import ReactDOM from 'react-dom/client';
import React from 'react';
import {Login} from "../widgets/auth/login/login.jsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Dashboard} from "../pages/dashboard/index.jsx";
import {LeavingPage} from "../widgets/utils/LeavingPage.jsx";

const queryClient = new QueryClient();

export const NODE_TO_INYECT = document.getElementById(
    'widget-detect-leaving-page-container',
);

export default () =>
{
    if (!NODE_TO_INYECT) return;
    const NODE = ReactDOM.createRoot(NODE_TO_INYECT);


    NODE.render(
        <LeavingPage />
    );
};
