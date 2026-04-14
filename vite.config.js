import { defineConfig , loadEnv} from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    // Binding host inside container (0.0.0.0) and external HMR host on your LAN
    const bindHost = env.VITE_HOST || '0.0.0.0';
    const port = Number(env.VITE_PORT || 5173);
    const hmrHost = env.VITE_HMR_HOST || env.VITE_DEV_HOST || 'localhost';

    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './resources/js/react'),
            },
        },
        server: {
            host: bindHost, // allow access from LAN/Docker
            port,
            strictPort: true,
            cors: true,
            hmr: {
                host: hmrHost,
                port,
                protocol: 'ws',
                overlay: false,
            },
            watch: {
                ignored: ['**/*.php'], // Ignore all PHP files
                usePolling: true,
                interval: 200
            },
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/modosDeCobroApp.js'],
            }),
            tailwindcss(),
            react({
                jsxRuntime: 'automatic',
                babel: {
                    plugins: [['@babel/plugin-transform-react-jsx']],
                },
            }),
            flowbiteReact(),
        ],
        optimizeDeps: {
            include: [
                '@emotion/react',      // ← agregamos
                '@emotion/styled',     // ← esto es lo que está fallando
                '@mui/material',       // si usás muchos componentes MUI
                '@mui/styled-engine'
            ],
        },
        watch: {
            usePolling: true,     // útil en algunos entornos de red / VM / Laravel
        },
    };
});
