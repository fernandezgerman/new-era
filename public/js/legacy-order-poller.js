(function () {
    // Simple helpers compatible with old IE
    function byId(id) { return document.getElementById(id); }
    function setText(el, text) {
        if (!el) return;
        if (typeof el.innerText !== 'undefined') el.innerText = text;
        else el.textContent = text;
    }
    function toLower(s) {
        return (s || '').toString().toLowerCase();
    }

    function mapColor(estado) {
        estado = toLower(estado);
        if (estado === 'pendiente') return '#2C5DA2'; // blue
        if (estado === 'nueva') return '#808080'; // gray

        document.getElementById('qr-image').style.display = "none";
        if (estado === 'expiro') return '#F88E15'; // orange
        if (estado === 'aprobado') return '#185A2C'; // green
        if (estado === 'rechazado') return '#F50002'; // red
        if (estado === 'error') return '#F50002'; // red
        if (estado === 'reembolsado') return '#8c00ff'; // violet
        if (estado === 'procesando_reembolso') return '#c9ae44'; // violet
        return '#000000';
    }

    function makeRequest() {
        if (window.XMLHttpRequest) return new XMLHttpRequest();
        // Old IE ActiveX fallback
        try { return new ActiveXObject('MSXML2.XMLHTTP'); } catch (e) {}
        try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e2) {}
        return null;
    }

    function parseJson(text) {
        if (window.JSON && typeof JSON.parse === 'function') {
            try { return JSON.parse(text); } catch (e) { /* fallthrough */ }
        }
        // Very old IE fallback
        try { return eval('(' + text + ')'); } catch (e2) { return null; }
    }

    // Read a query parameter from the current page URL (old-browser friendly)
    function getQueryParam(name) {
        var search = window.location ? (window.location.search || '') : '';
        if (!search || search.length < 2) return null;
        // Remove leading '?'
        var qs = search.substring(1).split('&');
        for (var i = 0; i < qs.length; i++) {
            var part = qs[i] || '';
            var eqIdx = part.indexOf('=');
            var key = eqIdx >= 0 ? part.substring(0, eqIdx) : part;
            if (key === name) {
                var val = eqIdx >= 0 ? part.substring(eqIdx + 1) : '';
                try { return decodeURIComponent(val.replace(/\+/g, ' ')); } catch (e) { return val; }
            }
        }
        return null;
    }

    function init() {
        var content = document.getElementById('content');
        if (!content) return;

        var pollUrl = content.getAttribute('data-poll-url');
        var httpProtocol = content.getAttribute('data-http-protocol');
        // Ensure HTTPS is used for polling
        if (pollUrl) {
            // If URL is protocol-relative (e.g., //example.com/path), prefix with https:
            if (pollUrl.indexOf('//') === 0) {
                pollUrl = 'https:' + pollUrl; // -> https://...
            }
            // If URL explicitly uses http, upgrade to https
            if (pollUrl.indexOf('http://') === 0) {
                pollUrl = 'https://' + pollUrl.substring(7);
            }
        }
        if(httpProtocol)
        {
            pollUrl = pollUrl.replace('https://', 'http://');
        }
        var currentEstado = toLower(content.getAttribute('data-initial-estado'));
        var statusBox = byId('content');
        var statusText = byId('status-text');
        var errorBox = byId('error-box');
        var inFlight = false;
        // Token comes from main page; prefer data attribute, then URL query param
        var token = content.getAttribute('data-token') || getQueryParam('token');

        function showError(msg) {
            if (!errorBox) return;
            setText(errorBox, msg);
            errorBox.style.display = 'block';
        }
        function hideError() {
            if (!errorBox) return;
            errorBox.style.display = 'none';
            setText(errorBox, '');
        }
        function updateUI(estado) {
            if (!statusBox || !statusText) return;

            statusBox.style.backgroundColor = mapColor(estado);

            if(estado === "procesando_reembolso")
            {
                setText(statusText, "PROCESANDO REEMBOLSO");
            }else {
                setText(statusText, estado);
            }

        }

        // Set initial UI states (in case CSS/HTML not covering)
        updateUI(currentEstado);

        function tick() {
            // Only poll when estado is pendiente and no overlapping requests
            if ((currentEstado !== 'pendiente' && currentEstado !== 'nueva' && currentEstado !== 'procesando_reembolso') || inFlight) return;
            if (!pollUrl) return;

            var xhr = makeRequest();
            if (!xhr) {
                showError('No es posible crear la solicitud AJAX en este navegador.');
                return;
            }
            inFlight = true;
            hideError();
            var sep = (pollUrl.indexOf('?') === -1 ? '?' : '&');
            var url = pollUrl + sep + '_ts=' + new Date().getTime();
            if (token) {
                // append token param from main page
                url += '&token=' + encodeURIComponent(token);
            }
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;
                inFlight = false;
                if (xhr.status === 200) {
                    var data = parseJson(xhr.responseText);
                    if (data && typeof data.estado !== 'undefined') {
                        var nuevo = toLower(data.estado);
                        if (nuevo !== currentEstado) {
                            currentEstado = nuevo;
                            updateUI(currentEstado);
                        }
                    } else {
                        showError('Respuesta inválida del servidor.');
                    }
                } else {
                    showError('Error AJAX ' + xhr.status + ': ' + (xhr.statusText || 'desconocido'));
                }
            };
            try {
                xhr.send(null);
            } catch (e) {
                inFlight = false;
                showError('Excepción AJAX: ' + (e.message || e));
            }
        }

        // Run every 3 seconds
        setInterval(tick, 3000);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Delay to allow DOM
        setTimeout(init, 0);
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', init, false);
    } else {
        // Old IE fallback
        window.attachEvent('onload', init);
    }
})();
