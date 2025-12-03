<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebSocket Test</title>
    <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 24px; }
        .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; max-width: 800px; }
        .row { margin: 8px 0; }
        code { background: #f7fafc; padding: 2px 6px; border-radius: 4px; }
        .ok { color: #059669; }
        .warn { color: #b45309; }
        .err { color: #b91c1c; }
        .muted { color: #6b7280; }
        .log { background: #0b1020; color: #e5e7eb; padding: 12px; height: 240px; overflow: auto; font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; border-radius: 6px; }
        .kv { display: grid; grid-template-columns: 220px 1fr; gap: 8px; }
        .btn { display: inline-block; border: 1px solid #d1d5db; padding: 8px 12px; border-radius: 6px; cursor: pointer; background: #f9fafb; }
        .btn:disabled { opacity: .6; cursor: not-allowed; }
        .pill { display:inline-block; padding:2px 8px; border-radius:999px; background:#e5e7eb; }
    </style>
</head>
<body>
<div class="card">
    <h2>WebSocket Connection Test</h2>

    <div class="row muted">This page attempts to open a WebSocket connection to your Reverb (Pusher protocol) server.</div>

    <div class="row kv">
        <div>Protocol</div>
        <div><code>pusher</code></div>
        <div>App Key</div>
        <div><code id="appKey">{{ $appKey }}</code></div>
        <div>Host</div>
        <div><code id="host">{{ $host }}</code></div>
        <div>Port (ws/wss)</div>
        <div><code id="port">{{ $port }}</code></div>
        <div>TLS</div>
        <div><code id="tls">{{ $useTLS ? 'true' : 'false' }}</code></div>
    </div>

    <div class="row">
        Status: <span id="status" class="pill">idle</span>
    </div>

    <div class="row">
        <button id="connectBtn" class="btn">Connect</button>
        <button id="disconnectBtn" class="btn" disabled>Disconnect</button>
        <button id="pingBtn" class="btn" disabled>Send Ping</button>
    </div>

    <div class="row">
        <div class="log" id="log"></div>
    </div>
</div>

@vite('resources/js/ws-test.js')
</body>
</html>
