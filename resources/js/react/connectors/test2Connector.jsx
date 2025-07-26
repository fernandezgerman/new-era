import ReactDOM from 'react-dom/client';
import React from 'react';
import {Test2} from "../components/test2.jsx";

export const NODE_TO_INYECT = document.getElementById(
    'test2-container',
);

export default () =>
{
    if (!NODE_TO_INYECT) return;
    const NODE = ReactDOM.createRoot(NODE_TO_INYECT);

    NODE.render(
        <Test2 />
    );
};
