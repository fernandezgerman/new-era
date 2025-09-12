import ReactDOM from 'react-dom/client';
import React from 'react';
import {Login} from "../widgets/auth/login/login.jsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Dashboard} from "../pages/dashboard/index.jsx";

const queryClient = new QueryClient();

export const NODE_TO_INYECT = document.getElementById(
    'react-dashboard-container',
);

export default () =>
{
    if (!NODE_TO_INYECT) return;
    const NODE = ReactDOM.createRoot(NODE_TO_INYECT);


    NODE.render(
        <QueryClientProvider client={queryClient}>
            <Dashboard />
        </QueryClientProvider>
    );
};
