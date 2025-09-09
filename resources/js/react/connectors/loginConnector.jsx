import ReactDOM from 'react-dom/client';
import React from 'react';
import {Test} from "../components/test.jsx";
import {Login} from "../widgets/auth/login.jsx";

export const NODE_TO_INYECT = document.getElementById(
    'react-login-container',
);

export default () =>
{
    if (!NODE_TO_INYECT) return;
    const NODE = ReactDOM.createRoot(NODE_TO_INYECT);

    NODE.render(
        <Login />
    );
};
