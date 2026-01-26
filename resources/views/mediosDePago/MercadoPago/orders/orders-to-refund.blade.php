
<x-aplicativo.layout
    :css="['assets/css/aplicativo/mediosDePago/orders/orders.css']">

    <x-slot:titulo>Reembolso</x-slot:titulo>
    <x-slot:tituloEspecifico>ORDENES DISPONIBLES PARA ANULAR</x-slot:tituloEspecifico>
    <x-slot>
        <x-aplicativo.table
            :headers="new \App\View\Components\Aplicativo\Types\TableRow([
                new \App\View\Components\Aplicativo\Types\TableColumn('Usuario'),
                new \App\View\Components\Aplicativo\Types\TableColumn('Sucursal'),
                new \App\View\Components\Aplicativo\Types\TableColumn('Modo de Cobro'),
                new \App\View\Components\Aplicativo\Types\TableColumn('Estado'),
                new \App\View\Components\Aplicativo\Types\TableColumn('Importe'),
                new \App\View\Components\Aplicativo\Types\TableColumn(),
            ])"
            :table-data="new \App\View\Components\Aplicativo\Types\RowCollection(
                            collect($ventaSucursalCobros)->reduce(function($acum, $cobro){
                                $mostrarBoton = $cobro->estado === 'aprobado'
                                    && $cobro->created_at
                                    && ($cobro->created_at->copy()->addMinutes(15)->gt(now()));
                                $aux = '<a href='.get_comillas().route('medios-de-pago.sucursal.get-order-to-refund', ['orderId' => $cobro->id]).'?token='.request()->token.get_comillas().'><button class='.get_comillas().'button'.get_comillas().' style='.get_comillas().'display: '.($mostrarBoton ? 'block' : 'none').get_comillas().'>Reembolsar</button></a>';
                                $acum[] = new \App\View\Components\Aplicativo\Types\TableRow([
                                    new \App\View\Components\Aplicativo\Types\TableColumn(optional($cobro->usuario)->nombre.' '.optional($cobro->usuario)->apellido),
                                    new \App\View\Components\Aplicativo\Types\TableColumn(optional($cobro->sucursal)->nombre),
                                    new \App\View\Components\Aplicativo\Types\TableColumn(optional($cobro->modoDeCobro)->nombre),
                                    new \App\View\Components\Aplicativo\Types\TableColumn($cobro->estado, '', 1, ' estado '.$cobro->estado),
                                    new \App\View\Components\Aplicativo\Types\TableColumn('$'.number_format((float) $cobro->importe, 2, ',', '.')),
                                    new \App\View\Components\Aplicativo\Types\TableColumn($aux),
                                    ]);


                                foreach($cobro->articulos as $articulo){
                                    $acum[] = new \App\View\Components\Aplicativo\Types\TableRow([
                                        new \App\View\Components\Aplicativo\Types\TableColumn(''),
                                        new \App\View\Components\Aplicativo\Types\TableColumn(
                                            optional($articulo->articulo)->codigo.' - '.optional($articulo->articulo)->nombre,
                                            'text-align: left;padding-left:30px;width: 450px; font-size: 12px',
                                            2),
                                        new \App\View\Components\Aplicativo\Types\TableColumn(
                                            'x'.(int)$articulo->cantidad,
                                            ' text-align: right; font-size: 12px',
                                            1),
                                        new \App\View\Components\Aplicativo\Types\TableColumn(
                                            '$'.number_format((float) $articulo->importe, 2, ',', '.'),
                                            ' text-align: right; font-size: 12px',
                                            1),
                                        ]);
                                }

                                return $acum;
                            }, [])
                            )"
            :table-style="'margin-left:auto;margin-right:auto; border-collapse: collapse;'"
        />
    </x-slot>
</x-aplicativo.layout>
