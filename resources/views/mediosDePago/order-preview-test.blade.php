<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <link rel="apple-touch-icon" sizes="76x76" href="../../assets/img/apple-icon.png" />
    <link rel="icon" type="image/png" href="../../assets/img/icons/new-era/favicon-32x32.png" />
    <title>New Era</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!--     Fonts and icons     -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
    <!-- Nucleo Icons -->
    <link href="../../assets/css/nucleo-icons.css" rel="stylesheet" />
    <link href="../../assets/css/nucleo-svg.css" rel="stylesheet" />
    <!-- Font Awesome Icons -->
    <!-- Main Styling -->
    <link href="../../assets/css/soft-ui-dashboard-tailwind.css?v=1.0.1" rel="stylesheet" />

    @vite('resources/css/app.css')
    @viteReactRefresh
    @vite(['resources/js/app.js'])

</head>

<body class="m-0 font-sans antialiased font-normal text-left leading-default text-base ne-body dark:ne-dark-body text-slate-500 ">
    <div class="p-6">
        <h1 class="text-xl font-bold mb-4">Testeador: Order Preview</h1>
        <p class="mb-2 text-sm text-slate-600">Presione el botón para enviar el JSON requerido mediante un formulario HTML.</p>

        <form id="orderPreviewForm" class="space-y-2" method="POST" action="/medios-de-pago/order-preview">
            <!-- Laravel requires CSRF for web group, but this route is under custom.auth group (no CSRF). We still include it in case. -->
            <input type="hidden" name="usuario" value="sistemas">
            <input type="hidden" name="clave" value="7f019d20f53f13734184d0f0cafd314c">
            <input type="hidden" name="idsucursal" value="12">
            <input type="hidden" name="type" value="qr">

            <!-- Represent items[] as repeated field groups -->
            <input type="hidden" name="items[0][idunicoventa]" value="ALSADLASLAS4445">
            <input type="hidden" name="items[0][descripcion]" value="Torpedo de limon">
            <input type="hidden" name="items[0][cantidad]" value="2">
            <input type="hidden" name="items[0][importe]" value="1200">

            <input type="hidden" name="items[1][idunicoventa]" value="ALSADLASLAS4445">
            <input type="hidden" name="items[1][descripcion]" value="Torpedo de limon">
            <input type="hidden" name="items[1][cantidad]" value="2">
            <input type="hidden" name="items[1][importe]" value="1200">

            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Enviar POST a /medios-de-pago/order-preview</button>
        </form>

        <div class="mt-4 p-3 bg-slate-100 rounded text-sm">
            Esta acción enviará application/x-www-form-urlencoded (o multipart/form-data) con los campos equivalentes al JSON solicitado.
        </div>
    </div>
</body>
<script src="../../assets/js/plugins/chartjs.min.js"></script>
<script src="../../assets/js/plugins/threejs.js"></script>
<script src="../../assets/js/plugins/orbit-controls.js"></script>
<script src="../../assets/js/plugins/perfect-scrollbar.min.js"></script>
<!-- main script file  -->
<script src="../../assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1"></script>
</html>
