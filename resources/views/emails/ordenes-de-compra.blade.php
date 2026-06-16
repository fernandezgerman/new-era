<x-mail::message>
# Orden de Compra #{{ $orden->id }}

Hola,

Adjuntamos la orden de compra **#{{ $orden->id }}** generada el {{ $orden->fechahora->format('d/m/Y H:i') }}.

**Detalles:**
- **Proveedor:** {{ $orden->proveedor->nombre ?? 'N/A' }}
- **Sucursal de Entrega:** {{ $orden->sucursal->nombre ?? 'N/A' }}

Por favor, revise el documento PDF adjunto para ver el detalle de los artículos y cantidades.

Gracias,<br>
{{ config('app.name') }}
</x-mail::message>
