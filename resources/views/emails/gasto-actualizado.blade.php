<x-mail::message>
# Gasto Actualizado #{{ $gasto->id }}

Se ha actualizado un gasto. A continuación se detalla el último cambio realizado:

@foreach($historial as $audit)
<x-mail::panel>
**Evento:** {{ ucfirst($audit->event) }} <br />
**Usuario:** {{ $audit->user->nombre ?? 'N/A' }} {{ $audit->user->apellido ?? '' }} <br />
**Fecha:** {{ $audit->created_at->format('d/m/Y H:i') }} <br />

**Cambios:**
@php
    $old = $audit->old_values ?? [];
    $new = $audit->new_values ?? [];
    $metadata = $audit->metadata ?? [];
@endphp

@foreach($new as $key => $value)
- **{{ ucfirst(str_replace(['id_', 'id'], ['', ''], str_replace('_', ' ', $key))) }}:**
@if(isset($metadata[$key . '_old']) || isset($metadata[$key . '_new']))
  {{ $metadata[$key . '_old']['nombre'] ?? ($metadata[$key . '_old']['descripcion'] ?? ($old[$key] ?? 'N/A')) }} -> **{{ $metadata[$key . '_new']['nombre'] ?? ($metadata[$key . '_new']['descripcion'] ?? $value) }}**
@else
  {{ $old[$key] ?? 'N/A' }} -> **{{ $value }}**
@endif
@endforeach
</x-mail::panel>
@endforeach

Gracias,<br>
{{ config('app.name') }}
</x-mail::message>
