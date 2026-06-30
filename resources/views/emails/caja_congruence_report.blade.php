<!DOCTYPE html>
<html>
<head>
    <title>Caja Congruence Report</title>
</head>
<body>
    <h1>Caja Congruence Report</h1>
    <p>The following issues were detected and fixed during the congruence check for the period from <strong>{{ $dateFrom }}</strong> to <strong>{{ $dateTo }}</strong>:</p>

    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th>Sucursal</th>
                <th>Usuario</th>
                <th>Caja</th>
                <th>Fecha Apertura</th>
                <th>Total with Errors</th>
                <th>From Caja</th>
                <th>Calculated</th>
                <th>Difference</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($messages as $issue)
                <tr>
                    <td>{{ $issue['sucursal'] }}</td>
                    <td>{{ $issue['usuario'] }}</td>
                    <td>{{ $issue['caja_numero'] }}</td>
                    <td>{{ $issue['fecha_apertura'] }}</td>
                    <td>{{ $issue['field_label'] }}</td>
                    <td>{{ $issue['old_value'] }}</td>
                    <td>{{ $issue['new_value'] }}</td>
                    <td>{{ $issue['difference'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p>This is an automated report.</p>
</body>
</html>
