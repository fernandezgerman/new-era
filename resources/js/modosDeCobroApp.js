
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Normalize and sanitize env vars coming from Vite / Laravel .env
const stripQuotes = (v) => typeof v === 'string' ? v.trim().replace(/^['"]|['"]$/g, '') : v;
const rawHost = import.meta.env.VITE_REVERB_HOST;
const envHost = stripQuotes(rawHost);
const invalidHosts = [undefined, null, '', '0.0.0.0', '::', '::1'];
const computedHost = invalidHosts.includes(envHost) ? window.location.hostname : envHost;

const rawScheme = import.meta.env.VITE_REVERB_SCHEME ?? 'https';
const scheme = stripQuotes(rawScheme) || 'https';
const rawPort = import.meta.env.VITE_REVERB_PORT;
const computedDefaultPort = scheme === 'https' ? 443 : 80;
const port = Number(stripQuotes(rawPort)) || computedDefaultPort;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: computedHost,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
});

console.log('ventasCobroSucursal', ventasCobroSucursal);
formatearPantalla(ventasCobroSucursal?.estado);

function formatearPantalla(estado)
{
    const status = {
        'rechazado': 'payment-rejected',
        'aprobado': 'payment-success',
        'expiro': 'payment-expired',
    };


    if (estado === 'aprobado' || estado === 'rechazado' || estado === 'expiro') {
        // Hide waiting screen
        const waiting = document.getElementById('waiting-payment');
        if (waiting) waiting.classList.add('hidden');

        // Ensure both result containers are hidden first
        const success = document.getElementById('payment-success');
        const rejected = document.getElementById('payment-rejected');
        const expired = document.getElementById('payment-expired');
        if (success) success.classList.add('hidden');
        if (rejected) rejected.classList.add('hidden');
        if (expired) expired.classList.add('hidden');

        // Show the one that matches current estado
        const targetId = status[estado];
        const targetEl = document.getElementById(targetId);
        if (targetEl) targetEl.classList.remove('hidden');

        // Update body background color
        const bodyDiv = document.getElementById('body-div');
        if (bodyDiv) {

            bodyDiv.classList.remove('bg-green-800', 'bg-red-800', 'bg-blue-800');

            let bg = (estado === 'aprobado' ? 'bg-green-800' : 'bg-red-800');
            bg = (estado === 'expiro' ? 'bg-blue-800' : bg);

            bodyDiv.classList.add(bg);

            document.getElementById('total-a-cobrar').classList.add('text-white');

        }

        // Swap logo to dark version
        const logo = document.getElementById('new-era-logo');
        if (logo) {
            // Replace only the filename to avoid path issues
            logo.src = (logo.src || '').replace('light-logo.png', 'dark-logo.png');
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {

    window.Echo.channel("Sucursal-12")
        .listen('Events\\MediosDeCobro\\MediosDeCobroStatusChangeEvent', (event) => {

            const estado = event?.ventaSucursalCobro?.estado;

            formatearPantalla(estado);

        });
    /*
    window.Echo.channel('Sucursal-12')
        .listenToAll((event, data) => {
            // do what you need to do based on the event name and data
            console.log(event, data)
        });*/

});
