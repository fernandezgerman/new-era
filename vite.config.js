import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
           // input: ['resources/css/app.css', 'resources/js/app.js'],
            input: ['resources/css/app.css', 'resources/template/src/App.js'],
            refresh: true,
        }),
        tailwindcss(),
        react({
            jsxRuntime: 'automatic',
            babel: {
                plugins: [
                    ['@babel/plugin-transform-react-jsx']
                ]
            }
        }),
    ],
});
