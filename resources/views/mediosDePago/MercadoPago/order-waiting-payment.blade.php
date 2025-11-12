@php use Illuminate\Support\Arr; @endphp
    <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
    <link rel="apple-touch-icon" sizes="76x76" href="../../assets/img/apple-icon.png"/>
    <link rel="icon" type="image/png" href="../../assets/img/icons/new-era/favicon-32x32.png"/>
    <title>New Era</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!--     Fonts and icons     -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet"/>
    <!-- Nucleo Icons -->
    <link href="../../assets/css/nucleo-icons.css" rel="stylesheet"/>
    <link href="../../assets/css/nucleo-svg.css" rel="stylesheet"/>
    <!-- Font Awesome Icons -->
    <!-- Main Styling -->
    <link href="../../assets/css/soft-ui-dashboard-tailwind.css?v=1.0.1" rel="stylesheet"/>

    @vite('resources/css/app.css')
    @vite('resources/js/modosDeCobroApp.js')
</head>

<body class="m-0 font-sans antialiased font-normal text-left leading-default text-base ne-body  text-slate-500">
<div class="min-h-screen w-full flex items-center justify-center bg-slate-50  p-4">
    <!-- Constrained area: max 250x400 -->
    <div id="body-div"
        class="w-[500px] p-6 h-[800px] max-w-[800px] max-h-[800px] shadow rounded-lg border border-slate-200 overflow-hidden">
        <!-- Header 250x150 with logos left/right -->
        <input type="hidden" id="ventasucursalCobroId" value="{{$ventaSucursalCobro->id}}">
        <div class="w-[210px] h-[120px] ml-[30px]  px-3 py-2">
            <div class="w-[200px] h-full items-center ">
                <img id="new-era-logo" src="{{ asset('img/light-logo.png') }}" alt="New Era"
                     class="h-auto  max-h-full w-auto object-contain"/>
            </div>
        </div>

        <!-- Body (remaining space) -->
        <div id="waiting-payment" class="h-[500px] text-center ">
            <div class="mb-6 p-1 w-full text-center bg-black! text-white">
                <h4 class="text-white">ESCANEAR QR</h4>
            </div>
            <img  src="{{ asset('img/mercado-pago-iso.png') }}" alt="New Era"
                  class="h-auto w-[100px] object-contain"/>
            <!-- Placeholder for order details -->


        </div>

        <div id="payment-success" class="h-[500px] bg-green-800 hidden">
            <div class="mb-6 p-1 w-full text-center text-white">
                <h4 class="text-white"></h4>
                <img  src="{{ asset('img/mercado-pago-iso.png') }}" alt="New Era"
                      class="h-auto w-[100px] object-contain"/>
            </div>
            <!-- Placeholder for order details -->

            <div class=" text-white w-full h-full items-center text-center">
                <h1 class="text-white m-auto">PAGO REALIZADO!</h1>
            </div>
        </div>

        <div id="payment-rejected" class="h-[500px] bg-red-800 hidden ">
            <div class="mb-6 p-1 w-full text-center text-white">
                <h4 class="text-white"></h4>
                <img  src="{{ asset('img/mercado-pago-iso.png') }}" alt="New Era"
                      class="h-auto w-[100px] object-contain"/>
            </div>
            <!-- Placeholder for order details -->

            <div class=" text-white w-full h-full items-center text-center">
                <h1 class="text-white m-auto">PAGO RECHAZADO!</h1>
            </div>
        </div>

        <div id="payment-expired" class="h-[500px] bg-blue-800 hidden ">
            <div class="mb-6 p-1 w-full text-center text-white">
                <h4 class="text-white"></h4>
                <img  src="{{ asset('img/mercado-pago-iso.png') }}" alt="New Era"
                      class="h-auto w-[100px] object-contain"/>
            </div>
            <!-- Placeholder for order details -->

            <div class=" text-white w-full h-full items-center text-center">
                <h1 class="text-white m-auto">PAGO VENCIDO</h1>
            </div>
        </div>

        <div>
            <div class="mt-[20px] text-right border-t-2 border-solid border-gray-300">
                <h3 id="total-a-cobrar">Total a cobrar
                    $ {{ number_format((float)($ventaSucursalCobro->importe ?? 0), 2, ',', '.') }}</h3></div>
        </div>
    </div>
</div>
</body>
<script type="application/javascript">
    var ventasCobroSucursal = @php echo json_encode($ventaSucursalCobro); @endphp;
</script>
<script src="../../assets/js/plugins/chartjs.min.js"></script>
<script src="../../assets/js/plugins/threejs.js"></script>
<script src="../../assets/js/plugins/orbit-controls.js"></script>
<script src="../../assets/js/plugins/perfect-scrollbar.min.js"></script>
<!-- main script file  -->
<script src="../../assets/js/soft-ui-dashboard-pro-tailwind.js?v=1.0.1"></script>
</html>
