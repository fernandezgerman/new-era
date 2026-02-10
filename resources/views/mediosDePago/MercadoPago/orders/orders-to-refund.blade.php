@php use Laravel\Sanctum\PersonalAccessToken; @endphp

<x-aplicativo.layout
    :css="['assets/css/aplicativo/mediosDePago/orders/orders.css']">

    <?php
        // Calculate seconds left before the provided token expires
        $secondsLeft = "EXPIRO";

            $encoded = request()->query('token');

            if ($encoded) {
                $decoded = base64_decode($encoded, true);
                if ($decoded !== false && $decoded !== '') {
                    // Sanctum stores tokens hashed (sha256) in personal_access_tokens.token
                    $pat = PersonalAccessToken::findToken($decoded);

                    if ($pat && (isset($pat->expires_at))) {
                        $now = \Illuminate\Support\Carbon::now();
                        $rawExpiry = $pat->expires_at; // support either column name
                        $expiresAt = \Illuminate\Support\Carbon::parse($rawExpiry);
                        $diff = $expiresAt->diffInSeconds($now, false);
                        // diffInSeconds returns negative if expiresAt is in the future when using (now, false)
                        $secondsLeft = max(0, -$diff);
                    }
                }
            }

    ?>

    <x-slot:titulo>
        Listado de cobros
    </x-slot:titulo>
    <x-slot:tituloEspecifico>ORDENES DISPONIBLES PARA ANULAR</x-slot:tituloEspecifico>

    <x-slot>
        <?php if ($secondsLeft !== null): ?>
        <small id="token-expiry-label" style="font-weight: normal; font-size: 12px; margin-left:8px;    ">
            Pagina expira en <span id="token-seconds-left" data-seconds="<?= (int) $secondsLeft ?>"><?= (int) $secondsLeft ?></span> segundos
        </small>
        <?php endif; ?>


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
                                    new \App\View\Components\Aplicativo\Types\TableColumn(optional($cobro->modoDeCobro)->nombre.' ('.$cobro?->tipo.')'),
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
<script>
    (function(){
        var el = document.getElementById('token-seconds-left');
        if(!el) return;
        var label = document.getElementById('token-expiry-label');
        var secs = parseInt(el.getAttribute('data-seconds') || '0', 10);

        function expireNow(){
            el.textContent = '0';
            if(label){
                label.textContent = 'PAGINA EXPIRADA: Cierre esta ventana y vuelva a abrirla desde el aplicativo';
                document.getElementById('table-description').style.visibility = "hidden";
            }
            try { document.body.style.backgroundColor = '#7c0202'; } catch(e) {}
        }

        function tick(){
            if(secs <= 0){
                expireNow();
                clearInterval(iv);
                return;
            }
            secs -= 1;
            el.textContent = String(secs);
            if(secs === 0){
                expireNow();
            }
        }

        // Initialize display just in case
        if(secs <= 0){
            expireNow();
        } else {
            el.textContent = String(secs);
        }
        var iv = setInterval(tick, 1000);
    })();
</script>
