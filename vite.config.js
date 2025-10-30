import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the 'path' module
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js/react'), // Alias '@components' to 'src/components'
        },
    },
    plugins: [
        laravel({
           // input: ['resources/css/app.css', 'resources/js/app.js'],
            input: ['resources/css/app.css', 'resources/js/app.js', 'resources/js/modosDeCobroApp.js'],
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
