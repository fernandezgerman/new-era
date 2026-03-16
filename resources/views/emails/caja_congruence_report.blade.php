<!DOCTYPE html>
<html>
<head>
    <title>Caja Congruence Report</title>
</head>
<body>
    <h1>Caja Congruence Report</h1>
    <p>The following errors were detected during the congruence check for the period from <strong>{{ $dateFrom }}</strong> to <strong>{{ $dateTo }}</strong>:</p>

    <ul>
        @foreach ($messages as $message)
            <li>{{ $message }}</li>
        @endforeach
    </ul>

    <p>This is an automated report.</p>
</body>
</html>
