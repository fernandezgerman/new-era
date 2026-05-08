# Integración de Artículos - Documentación de API

Esta documentación describe cómo consumir los endpoints de integración de artículos.

## Autenticación

Todos los endpoints de integración requieren un token de seguridad que debe ser enviado en cada petición. El token se puede enviar de dos formas:

1.  **Header:** `X-INTEGRACIONES-TOKEN`
2.  **Query Parameter:** `token`

El valor del token es el configurado en la variable de entorno `INTEGRACIONES_ARTICULOS_TOKEN`.

---

## Endpoints

### 1. Obtener artículo por código
Retorna la información detallada de un artículo que coincide exactamente con el código proporcionado. Se excluyen artículos pertenecientes a rubros de gastos.

*   **URL:** `/api/integraciones/articulo/{codigo}`
*   **Método:** `GET`
*   **Filtros Aplicados:** Solo artículos activos y cuyo rubro asociado no sea de gastos (`esrubrogastos <> 1`).
*   **Respuesta Exitosa (200 OK):** Retorna el objeto del artículo.
*   **Respuesta No Encontrada (404 Not Found):** Si el código no existe, el artículo no está activo, o pertenece a un rubro de gastos.

#### Ejemplo de petición (cURL)
```bash
curl -X GET "http://tu-dominio.com/api/integraciones/articulo/12345" \
     -H "X-INTEGRACIONES-TOKEN: tu_token_aqui" \
     -H "Accept: application/json"
```

#### Ejemplo de respuesta (200 OK)
```json
{
    "id": 1,
    "idrubro": 10,
    "codigo": "12345",
    "nombre": "Articulo de Ejemplo",
    "descripcion": "Descripción detallada del artículo de ejemplo",
    "aplicapminutilidad": 1,
    "activo": 1,
    "fechamodificacion": "2024-05-08T10:00:00.000000Z",
    "fechacreacion": "2024-01-01T08:00:00.000000Z",
    "costo": "1500.500",
    "escompuesto": false,
    "idmarca": 5,
    "idcompradetalle": null,
    "activohasta": "2025-12-31",
    "disponibilidadespecial": false
}
```

#### Ejemplo de respuesta (404 Not Found)
```json
{
    "message": "Artículo no encontrado"
}
```

---

### 2. Buscar artículos por descripción
Busca artículos cuya descripción contenga el texto proporcionado. La búsqueda se realiza convirtiendo el texto a mayúsculas. Los resultados están paginados y excluyen artículos pertenecientes a rubros de gastos.

*   **URL:** `/api/integraciones/articulo/buscar/{descripcion}`
*   **Método:** `GET`
*   **Validación:** La búsqueda debe tener al menos 3 caracteres.
*   **Paginación:** 20 resultados por página. Para ver otras páginas usar el query param `?page=X`.
*   **Filtros Aplicados:** Solo artículos activos y cuyo rubro asociado no sea de gastos (`esrubrogastos <> 1`).
*   **Respuesta Exitosa (200 OK):** Retorna un objeto de paginación de Laravel.
*   **Error de Validación (422 Unprocessable Entity):** Si la búsqueda tiene menos de 3 caracteres.

#### Ejemplo de petición (cURL)
```bash
curl -X GET "http://tu-dominio.com/api/integraciones/articulo/buscar/COCACOLA?page=1" \
     -H "X-INTEGRACIONES-TOKEN: tu_token_aqui" \
     -H "Accept: application/json"
```

#### Ejemplo de respuesta (200 OK)
```json
{
    "current_page": 1,
    "data": [
        {
            "id": 10,
            "idrubro": 2,
            "codigo": "7790001",
            "nombre": "Coca Cola 500ml",
            "descripcion": "Gaseosa Coca Cola 500ml",
            "activo": 1,
            "costo": "800.000",
            "...": "..."
        },
        {
            "id": 11,
            "idrubro": 2,
            "codigo": "7790002",
            "nombre": "Coca Cola 1.5L",
            "descripcion": "Gaseosa Coca Cola 1.5L",
            "activo": 1,
            "costo": "1500.000",
            "...": "..."
        }
    ],
    "first_page_url": "http://tu-dominio.com/api/integraciones/articulo/buscar/cocacola?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": "http://tu-dominio.com/api/integraciones/articulo/buscar/cocacola?page=5",
    "next_page_url": "http://tu-dominio.com/api/integraciones/articulo/buscar/cocacola?page=2",
    "path": "http://tu-dominio.com/api/integraciones/articulo/buscar/cocacola",
    "per_page": 20,
    "prev_page_url": null,
    "to": 20,
    "total": 100
}
```

#### Ejemplo de respuesta (422 Unprocessable Entity)
```json
{
    "message": "La búsqueda debe tener al menos 3 caracteres"
}
```

#### Ejemplo de respuesta (401 Unauthorized)
```json
{
    "message": "No autorizado. Token de integraciones inválido."
}
```
