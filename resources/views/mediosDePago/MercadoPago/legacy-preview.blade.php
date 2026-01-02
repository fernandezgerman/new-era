<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Estado del Cobro</title>
    <style type="text/css">
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        /* Center container absolutely for old IE */
        #center-wrapper {
            position: absolute;
            left: 0px;
            width: 100%;
            height: 100%;

        }

        #content {
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            border: 1px solid #ddd;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            color: #333;
        }

        #header-logo {
            width: 280px;
            margin: 10px;
        }

        #mp-iso {
            width: 50px;
        }

        #status-box {
            width: 250px;
            padding: 15px;
            margin: 0 auto; /* center horizontally */
            color: #ffffff; /* white text */
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            background-color: black;
        }

        #importe-box {
            margin-top: 20px;
            color: #ffffff; /* white text */
            font-weight: bold;
            text-transform: uppercase;
        }

        #error-box {
            position: absolute;
            bottom: 5px;
            left: 5px;
            right: 5px;
            font-size: 11px;
            padding: 6px;
            line-height: 1.2em;
            color: #fff;
            background-color: #c0392b; /* red */
            display: none; /* hidden by default */
        }
    </style>
</head>
<body>
<?php
// PHP-side color mapping for initial render
$estado = strtolower($ventaSucursalCobro->estado);
$color = '#000000';
if ($estado === 'pendiente') $color = '#2C5DA2';
else if ($estado === 'nueva') $color = '#808080';
else if ($estado === 'expiro') $color = '#F88E15';
else if ($estado === 'aprobado') $color = '#185A2C';
else if ($estado === 'rechazado') $color = '#F50002';
else if ($estado === 'error') $color = '#F50002';
?>
<div id="center-wrapper">
    <div id="content"
         style="background-color: <?php echo $color; ?>"
         data-initial-estado="{{ $ventaSucursalCobro->estado }}"
         data-poll-url="{{ route('medios-de-pago.get-order', ['idventasucursalcobro' => $ventaSucursalCobro->id]) }}"
         data-http-protocol="{{ env('APP_DEBUG') }}">
        <div style="height: 10px;"></div>
        <img id="header-logo" src="/img/dark-logo.png" alt="logo"/>
        <div style="height: 2px;"></div>
        <div id="status-box">
            <table id="table-description" align="center" style="margin-left:auto;margin-right:auto;">
                <tr>
                    <td>
                        <img id="mp-iso" src="/img/mercado-pago-iso.png" alt="Mercado Pago"/>
                    </td>
                    <td>
                        <div id="status-text">{{ $ventaSucursalCobro->estado }}</div>
                    </td>
                </tr>
            </table>
        </div>
        <img id="header-logo" src="{{$qr}}" alt="logo"/>
        <div style="height: 5px;"></div>
        <div id="importe-box">Importe: ${{ $ventaSucursalCobro->importe }}</div>
        <div id="error-box"></div>
    </div>
</div>
<script type="text/javascript" src="/js/legacy-order-poller.js"></script>
</body>
</html>
