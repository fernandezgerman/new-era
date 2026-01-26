<x-aplicativo.layout
    :css="['assets/css/aplicativo/mediosDePago/orders/orders.css']">

    <x-slot:titulo>Reembolso</x-slot:titulo>
    <x-slot:tituloEspecifico>REEMBOLSAR ORDEN</x-slot:tituloEspecifico>
    <x-slot>
        <table style="margin-left: calc(50% - 150px); width: 400px">
            <tr>
                <td class="label">Fecha</td>
                <td>{{$ventaSucursalCobro->created_at->format('d/m/Y H:i') }}</td>
            </tr>
            <tr>
                <td class="label">Modo de cobro</td>
                <td>{{$ventaSucursalCobro->modoDeCobro->nombre }}</td>
            </tr>

            <tr>
                <td class="label">Usuario</td>
                <td>{{ $ventaSucursalCobro->usuario->nombre.' '.$ventaSucursalCobro->usuario->apellido  }}</td>
            </tr>
            <tr>
                <td class="label">Sucursal</td>
                <td>{{ $ventaSucursalCobro->sucursal->nombre }}</td>
            </tr>
            <tr>
                <td class="label">Estado</td>
                <td>
                    <div class="estado {{ $ventaSucursalCobro->estado }}">{{ $ventaSucursalCobro->estado }}</div>
                </td>
            </tr>
            <tr>
                <td class="label">Importe</td>
                <td>{{'$'.number_format((float) $ventaSucursalCobro->importe, 2, ',', '.')}}</td>
            </tr>
            <tr>
                <td class="label"></td>
                <td>{{'$'.number_format((float) $ventaSucursalCobro->importe, 2, ',', '.')}}</td>
            </tr>
        </table>

        <table style="margin-left: calc(50% - 300px); width: 600px; margin-top:20px">
            <tr>
                <td class="label"  style="padding:8px; border-bottom:1px solid #555;">Articulo</td>
                <td  class="label" style="text-align:right;padding:8px; border-bottom:1px solid #555;">Cantidad</td>
                <td  class="label" style="text-align:right;padding:8px; border-bottom:1px solid #555;">Importe total</td>
            </tr>
            @foreach($ventaSucursalCobro->articulos as $articulo)
                <tr>
                    <td >{{optional($articulo->articulo)->codigo.' - '.optional($articulo->articulo)->nombre}}</td>
                    <td style="text-align:right">{{'x'.(int)$articulo->cantidad}}</td>
                    <td style="text-align:right">{{'$'.number_format((float) $articulo->importe, 2, ',', '.'),}}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="3" style="text-align: center; padding-top:20px">
                    <form id="frm" method="post" action="{{ route('medios-de-pago.refund-order', ['orderId' => $ventaSucursalCobro->id]).'?token='.request()->token}}" >

                    </form>

                    <form id="frmVolver" method="get" action="{{ route('medios-de-pago.sucursal.get-orders-refund', ['idSucursal' => $ventaSucursalCobro->sucursal->id, 'idUsuario' => $ventaSucursalCobro->usuario->id]).'?token='.request()->token }}" >

                    </form>
                    <button onclick="document.getElementById('frmVolver').submit()" class="buttonXL ">VOLVER</button>
                    <button onclick="document.getElementById('frm').submit()" class="buttonXL">REEMBOLSAR</button>
                </td>
            </tr>
        </table>
    </x-slot>
</x-aplicativo.layout>


