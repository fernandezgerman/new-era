import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Expose Pusher for Laravel Echo Reverb driver
window.Pusher = Pusher;

// Helpers to normalize env coming from Vite / .env
const stripQuotes = (v) => typeof v === 'string' ? v.trim().replace(/^['"]|['"]$/g, '') : v;
const invalidHosts = [undefined, null, '', '0.0.0.0', '::', '::1', '[::]'];

const rawHost = import.meta.env.VITE_REVERB_HOST;
const envHost = stripQuotes(rawHost);
const computedHost = invalidHosts.includes(envHost) ? window.location.hostname : envHost;

const rawScheme = import.meta.env.VITE_REVERB_SCHEME ?? (window.location.protocol === 'https:' ? 'https' : 'http');
const scheme = stripQuotes(rawScheme) || 'https';
const rawPort = import.meta.env.VITE_REVERB_PORT;
const computedDefaultPort = scheme === 'https' ? 443 : 80;
const port = Number(stripQuotes(rawPort)) || computedDefaultPort;

// Initialize Echo once and keep global reference
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: computedHost,
  wsPort: port,
  wssPort: port,
  forceTLS: scheme === 'https',
  enabledTransports: ['ws', 'wss'],
});

// UI logic migrated from inline <script> in ws-test.blade.php, adapted to Echo/Pusher
(function () {
  const statusEl = document.getElementById('status');
  const logEl = document.getElementById('log');
  const connectBtn = document.getElementById('connectBtn');
  const disconnectBtn = document.getElementById('disconnectBtn');
  const pingBtn = document.getElementById('pingBtn');

  let pusher = null;

  function log(msg, cls) {
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = `[${time}] ${msg}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function setStatus(text, cls) {
    statusEl.textContent = text;
    statusEl.className = 'pill ' + (cls || '');
  }

  function bindConnectionHandlers() {
    if (!pusher) return;
    const cn = pusher.connection;
    cn.bind('state_change', function (states) {
      log(`state_change: ${states.previous} -> ${states.current}`);
      setStatus(
        states.current,
        states.current === 'connected' ? 'ok' :
        (states.current === 'failed' || states.current === 'unavailable' ? 'err' : 'muted')
      );
      if (states.current === 'connected') {
        disconnectBtn.disabled = false;
        pingBtn.disabled = false;
        connectBtn.disabled = true;
      } else if (states.current === 'initialized' || states.current === 'connecting') {
        connectBtn.disabled = true;
      } else if (states.current === 'disconnected') {
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
        pingBtn.disabled = true;
      }
    });

    cn.bind('error', function (err) {
      log('connection error: ' + JSON.stringify(err), 'err');
    });
  }

  function subscribeTestChannel() {
    if (!pusher) return;
    const ch = pusher.subscribe('public-ws-test');
    ch.bind('pusher:subscription_succeeded', function(){
      log('Subscribed to channel public-ws-test', 'ok');
    });
    ch.bind('client-ws-test-ping', function(data){
      log('Received client event: client-ws-test-ping ' + JSON.stringify(data), 'ok');
    });
  }

  function connect() {
    if (pusher) { log('Already connected or connecting', 'warn'); return; }

    // Access underlying Pusher instance from Echo
    pusher = window.Echo.connector && window.Echo.connector.pusher ? window.Echo.connector.pusher : null;
    if (!pusher) {
      log('Echo connector not ready', 'err');
      return;
    }

    // If for some reason it's disconnected, try to connect
    try {
      pusher.connect();
    } catch (e) {
      // ignore if already connecting/connected
    }

    // Wire handlers and subscribe
    bindConnectionHandlers();
    subscribeTestChannel();
  }

  function disconnect() {
    if (!pusher) { return; }
    log('Disconnect requested');
    try { pusher.disconnect(); } catch {}
    pusher = null;
    setStatus('disconnected', 'muted');
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    pingBtn.disabled = true;
  }

  function ping() {
    if (!pusher) { log('Not connected', 'warn'); return; }
    // Pusher client only allows client events on private/presence channels — here we just log
    log('Sending ping (note: client events require private/presence channels, so this is a noop here).', 'muted');
  }

  if (connectBtn) connectBtn.addEventListener('click', connect);
  if (disconnectBtn) disconnectBtn.addEventListener('click', disconnect);
  if (pingBtn) pingBtn.addEventListener('click', ping);

  // Auto-connect on load
  document.addEventListener('DOMContentLoaded', connect);
})();
