<!DOCTYPE html>
<html>
<head>
    <title>Rendicion Stock Duplicity Report</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Rendicion Stock Duplicity Report</h1>
    <p>The following duplicates were detected in <strong>rendicionstockdetalle</strong> table:</p>

    <table>
        <thead>
            <tr>
                <th>fechahora</th>
                <th>idrendicion</th>
                <th>idarticulo</th>
                <th>count</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($duplicates as $duplicate)
                <tr>
                    <td>{{ $duplicate->fechahora }}</td>
                    <td>{{ $duplicate->idrendicion }}</td>
                    <td>{{ $duplicate->idarticulo }}</td>
                    <td>{{ $duplicate->{'count(1)'} }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <p>This is an automated report.</p>
</body>
</html>
