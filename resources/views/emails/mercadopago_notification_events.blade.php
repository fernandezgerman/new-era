<!DOCTYPE html>
<html>
<head>
    <title>Mercado Pago Notification Events Report</title>
</head>
<body>
    <h1>Mercado Pago Notification Events Report</h1>
    <p>The following inconsistent Mercado Pago QR orders were found (max 100):</p>

    <table border="1" cellpadding="5" cellspacing="0">
        <thead>
            <tr>
                <th>MP Order ID</th>
                <th>Venta Sucursal Cobro ID</th>
                <th>Estado</th>
                <th>Sucursal ID</th>
                <th>Movimiento Caja Venta ID</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($records as $record)
                <tr>
                    <td>{{ $record->id }}</td>
                    <td>{{ $record->vsc_id }}</td>
                    <td>{{ $record->estado }}</td>
                    <td>{{ $record->idsucursal }}</td>
                    <td>{{ $record->mcv_id }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p>This is an automated report.</p>
</body>
</html>
