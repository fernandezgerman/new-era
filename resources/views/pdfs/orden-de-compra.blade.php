<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Orden de Compra #{{ $orden->id }}</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            width: 100%;
            margin-bottom: 20px;
        }
        .logo {
            width: 150px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            text-align: right;
            text-transform: uppercase;
        }
        .info-section {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .info-section td {
            vertical-align: top;
            padding: 5px;
        }
        .section-title {
            font-weight: bold;
            background-color: #f2f2f2;
            padding: 5px;
            border: 1px solid #ddd;
        }
        .section-content {
            border: 1px solid #ddd;
            padding: 10px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #f2f2f2;
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            font-style: italic;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td>
                @if($logo)
                    <img src="{{ $logo }}" class="logo" alt="Logo">
                @endif
            </td>
            <td class="title">
                Orden de Compra
            </td>
        </tr>
    </table>

    <table class="info-section">
        <tr>
            <td width="50%">
                <strong>Número:</strong> #{{ $orden->id }}<br>
                <strong>Fecha:</strong> {{ $orden->fechahora->format('d/m/Y H:i') }}
            </td>
            <td width="50%" class="text-right">
                <!-- Additional order info if needed -->
            </td>
        </tr>
    </table>

    <table class="info-section">
        <tr>
            <td width="50%">
                <div class="section-title">Proveedor</div>
                <div class="section-content">
                    {{ $orden->proveedor->nombre ?? 'N/A' }}
                </div>
            </td>
            <td width="50%">
                <div class="section-title">Sucursal de Entrega</div>
                <div class="section-content">
                    {{ $orden->sucursal->nombre ?? 'N/A' }}
                </div>
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
            <tr>
                <th>Código</th>
                <th>Artículo</th>
                <th class="text-right">Cantidad</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($orden->detalles as $detalle)
                <tr>
                    <td>{{ $detalle->articulo->codigo ?? '' }}</td>
                    <td>{{ $detalle->articulo->nombre ?? '' }}</td>
                    <td class="text-right">#{{ number_format($detalle->cantidad, 0) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if ($orden->observaciones)
        <div class="section-title">Observaciones</div>
        <div class="section-content">
            {{ $orden->observaciones }}
        </div>
    @endif

    <div class="footer">
        Generado por: {{ $orden->usuario->nombre_completo ?? 'Sistema' }} el {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>
