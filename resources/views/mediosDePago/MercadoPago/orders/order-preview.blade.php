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
            <form method="POST" action="{{ route('medios-de-pago.order-generate') }}">
                <div class="p-3 h-[450px] overflow-auto text-sm text-slate-700">
                    @csrf
                    <div class="mb-6 p-1 w-full text-center bg-black! text-white"><h4 class="text-white">COBRO ELECTRONICO</h4></div>
                    <label>Medio de Cobro: </label>
                    <select name="idmododecobro" class="w-[280px] border border-slate-200 p-2">
                        @foreach ($data['modosDeCobro'] as $value)
                            <option value="{{ $value->id }}">{{ $value->nombre }}</option>
                        @endforeach
                    </select>
                    <input type="hidden" name="usuario" value="{{ Arr::get($data, 'data.usuario') }}" />
                    <input type="hidden" name="clave" value="{{ Arr::get($data, 'data.clave') }}" />
                    <input type="hidden" name="idventassucursalcobro" value="{{ $data['ventaSucursalCobro']->id  }}" />

                    <!-- Reenviar todos los parámetros del POST original -->
                    @php
                        $original = Arr::get($data, 'data', []);
                    @endphp
                    <!-- Placeholder for order details -->
                    <div class="text-slate-600 w-full mt-4 border-t-2 border-solid border-gray-300">
                        <table class="w-full" >
                            <thead >
                                <tr>
                                    <th>CODIGO</th>
                                    <th>ARTICULO</th>
                                    <th class="w-[40px] p-1">CANT</th>
                                    <th class="text-right p-1">PRECIO</th>
                                </tr>
                            </thead>
                            <tbody>
                                @php
                                    $totalFinal = 0;
                                @endphp
                                @foreach (Arr::get($data, 'data.items', []) as $value)
                                    @php
                                        $totalFinal = $totalFinal + (int)Arr::get($value,'importe');
                                    @endphp
                                    <tr>
                                        <td class="p-1">{{Arr::get($value,'codigo')}}</td>
                                        <td class="p-1">{{Arr::get($value,'descripcion')}}</td>
                                        <td class="text-right p-2">{{Arr::get($value,'cantidad')}}</td>
                                        <td class="text-right p-1">${{(int)Arr::get($value,'importe')}}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="mt-[20px] text-right border-t-2 border-solid border-gray-300"><h3>Total:
                        ${{$totalFinal}}</h3></div>
                <button type="submit"
                        class="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle border-0 rounded-lg cursor-pointer  bg-pink-500! leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25 "
                >Solicitar cobro
                </button>
            </form>
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
