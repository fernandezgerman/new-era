@php use Illuminate\Support\Arr; @endphp
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

</head>

<body class="m-0 font-sans antialiased font-normal text-left leading-default text-base ne-body text-slate-500">
    <div class="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
        <!-- Constrained area: max 250x400 -->
        <div class="w-[500px] p-6 h-[800px] max-w-[800px] max-h-[800px] bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
            <!-- Header 250x150 with logos left/right -->
            <div class="w-[210px] h-[120px] ml-[30px] bg-white px-3 py-2">
                <div class="w-[200px] h-full items-center ">
                    <img src="{{ asset('img/light-logo.png') }}" alt="New Era" class="h-auto   max-h-full w-auto object-contain" />
                </div>
            </div>
            <!-- Body (remaining space) -->
            <div class="p-3 h-[450px] overflow-auto text-sm text-slate-700">
                <div class="mb-6 p-1 w-full text-center bg-black! text-white"><h4 class="text-white">COBRO ELECTRONICO</h4></div>
                <!-- Placeholder for order details -->
                <div class="text-slate-600 w-full mt-4 border-t-2 border-solid border-gray-300">
                    <div class="pt-4 space-y-3">
                        <h5 class="font-semibold text-slate-800">Datos del cobro</h5>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div class="text-slate-500">ID</div>
                            <div class="text-slate-700">#{{ $ventaSucursalCobro->id ?? '' }}</div>
                            <div class="text-slate-500">Estado</div>
                            <div class="text-slate-700">{{ $ventaSucursalCobro->estado ?? '' }}</div>
                            <div class="text-slate-500">Sucursal</div>
                            <div class="text-slate-700">{{ $ventaSucursalCobro->sucursal->nombre }}</div>
                            <div class="text-slate-500">Modo de cobro</div>
                            <div class="text-slate-700">{{ $ventaSucursalCobro->modoDeCobro->descripcion }}</div>
                        </div>

                        <div class="mt-4">
                            <h6 class="font-semibold text-slate-800 mb-2">Artículos</h6>
                            @php
                                $articulos = $ventaSucursalCobro->articulos ?? collect();
                            @endphp
                            @if($articulos && $articulos->count())
                                <div class="overflow-x-auto">
                                    <table class="min-w-full text-left border border-slate-200 rounded">
                                        <thead class="bg-slate-100 text-slate-600">
                                            <tr>
                                                <th class="px-3 py-2 border-b border-slate-200">#</th>
                                                <th class="px-3 py-2 border-b border-slate-200">Artículo</th>
                                                <th class="px-3 py-2 border-b border-slate-200 text-right">Cantidad</th>
                                                <th class="px-3 py-2 border-b border-slate-200 text-right">Importe</th>
                                            </tr>
                                        </thead>
                                        <tbody class="text-slate-700">
                                            @foreach($articulos as $i => $det)
                                                <tr class="odd:bg-white even:bg-slate-50">
                                                    <td class="px-3 py-2 border-b border-slate-100">{{ $i + 1 }}</td>
                                                    <td class="px-3 py-2 border-b border-slate-100">
                                                        {{ optional($det->articulo)->descripcion ?? optional($det->articulo)->nombre ?? ('ID '.$det->idarticulo) }}
                                                    </td>
                                                    <td class="px-3 py-2 border-b border-slate-100 text-right">{{ number_format((float)($det->cantidad ?? 0), 2, ',', '.') }}</td>
                                                    <td class="px-3 py-2 border-b border-slate-100 text-right">$ {{ number_format((float)($det->importe ?? 0), 2, ',', '.') }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            @else
                                <div class="text-slate-500">Sin artículos cargados.</div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="mt-[20px] text-right border-t-2 border-solid border-gray-300"><h3>Total a cobrar
                        $ {{ number_format((float)($ventaSucursalCobro->importe ?? 0), 2, ',', '.') }}</h3></div>
            </div>
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
