### ApiResources — Dynamic REST endpoints and helpers

This directory contains small controllers/handlers that expose dynamic REST-style endpoints and a few convenience helpers for returning JSON responses in a consistent way.

The main pieces are:

- `AbstractApiHandler`: Base helper with common JSON response methods.
- `ApiResourceBase`: A generic CRUD-style resource that operates on any Eloquent model based on a dynamic `entity` segment in the URL. Supports includes (relations and computed attributes), filters, ordering, partial updates (PATCH) with deep-merge for JSON/array attributes, and nested inserts.
- `Authentication`: Simple authentication endpoints (login, logout, select current branch/sucursal, and querying the current sucursal).


#### Routes overview

Routes are declared in `routes/api/resources.php` under the `/api/resources` prefix:

```
GET    /api/resources/{entity}          -> ApiResourceBase@index (list with filters, includes, order)
GET    /api/resources/{entity}/{id}     -> ApiResourceBase@index (fetch one by id)
POST   /api/resources/{entity}          -> ApiResourceBase@insertResource (create)
PATCH  /api/resources/{entity}/{id}     -> ApiResourceBase@updateResource (partial update)
DELETE /api/resources/{entity}/{id}     -> ApiResourceBase@deleteResource (delete)
```

`{entity}` determines the Eloquent model class via StudlyCase + singular conversion, i.e.:

- `clientes` -> `App\Models\Cliente`
- `cajas` -> `App\Models\Caja`

This resolution is implemented in `ApiResourceBase::resolveModelClass()` using `Str::studly(Str::singular($entity))`.


### AbstractApiHandler

File: `AbstractApiHandler.php`

Purpose: provide consistent JSON responses.

- `sendResponse(array|mixed $data = [], ?Transformer $transformer = null): JsonResponse`
  - Optional `Transformer` (see `App\Contracts\Transformer`) is applied per element when provided.
  - Returns `200 OK` with the (optionally transformed) payload.

- `sendResponsePageNotFound(): JsonResponse`
  - Returns `{ "message": "Not Found" }` with `404`.

- `sendResponseValidationError(string $message, ?array $extraData = null): JsonResponse`
  - Returns `{ message, extra }` with `400`.


### ApiResourceBase — dynamic CRUD controller

File: `ApiResourceBase.php`

Validates input via dedicated `FormRequest`s under `App\Http\Requests\Api\...`:

- `index(ApiResourceBaseGetEntity $request)` handles both list and single fetch.
- `insertResource(ApiResourceBaseInsert $request)` creates a new model (and optional nested relations).
- `updateResource(ApiResourceBasePatch $request)` performs a patch-like update with deep-merge for JSON/array attributes.
- `deleteResource(ApiResourceBaseDelete $request)` deletes a model by id.


#### 1) GET list/single: includes, filters, order

Endpoint examples:

- List: `GET /api/resources/clientes`
- Single: `GET /api/resources/clientes/123`

Supported query/body fields (depending on your `FormRequest` configuration):

- `includes` (array of strings)
  - If an item matches a relation method on the model, it is eager loaded via `$query->with($include)`.
  - If it matches a custom accessor `get{Include}Attribute`, its value is added to each item in the response.

- `filtros` (associative array)
  - Each `key => value` becomes `$query->where(key, value)`.

- `orden` (array)
  - Each item becomes `$query->orderBy(item)`.

Response

- When `id` is provided and found: returns a single model instance (with requested relations/custom attributes).
- When `id` is not provided: returns a collection of model instances.

Notes

- Model class is inferred via `resolveModelClass($entity)`.
- Custom attributes are only attached when their corresponding accessor method exists on the model.


#### 2) POST create: payload and nested relations

Endpoint: `POST /api/resources/{entity}`

Body example:

```json
{
  "entity": "clientes",
  "nombre": "Juan Perez",
  "email": "juan@example.com",
  "relations": [
    {
      "entity": "direcciones",
      "payload": {
        "calle": "Av. Siempre Viva",
        "numero": 123
      }
    }
  ]
}
```

Behavior:

- The base payload is extracted from the request excluding `entity`, `id`, and `relations`.
- The main model is created: `Model::create($payload)`.
- If `relations` are provided, each relation item must include:
  - `entity`: the related entity name (resolved to a model class).
  - `payload`: fields to create on the related model.
- For each nested relation, the foreign key back to the parent is auto-injected as `id{entityPadre}` (e.g., `idCliente`) with the parent model's id. This is handled by `processRelations()`.
- Nested relations can be recursive; `processRelations()` calls itself for deeper levels.


#### 3) PATCH update: deep-merge for JSON/array attributes

Endpoint: `PATCH /api/resources/{entity}/{id}`

- The controller loads the model, then builds a `mergedPayload` as follows:
  - For attributes where both current and incoming values are array-like, it performs a deep merge so unspecified keys are preserved.
  - For list (sequential) arrays, the new value replaces the old list completely.
  - For scalar attributes, it simply replaces the value.

Supporting methods:

- `toArrayIfJsonLike($value): ?array`
  - Converts arrays, `Arrayable`, or JSON strings to arrays; otherwise returns `null`.

- `deepMerge(array $base, array $override): array`
  - Recursively merges associative arrays; replaces sequential arrays.


#### 4) DELETE remove

Endpoint: `DELETE /api/resources/{entity}/{id}`

- Finds the model by id; returns `404` if not found.
- Deletes and returns `{ "deleted": true }`.


### Authentication handler

File: `Authentication.php`

Endpoints (wired elsewhere in routes):

- `login(LoginRequest $request)`
  - Delegates to `AuthenticationService::login($usuario, $clave)`.
  - On invalid credentials, returns a `400` with a localized message.

- `logout(Request $request)`
  - Calls `AuthenticationService::logout()` and returns empty success.

- `selectSucursal(SelectSucursalRequest $request)`
  - Saves the selected sucursal id in the session under `idSucursalActual`.

- `getSucursalActual()`
  - Looks up `Sucursal` by the session key and returns it.


### Validation layer (FormRequests)

The resource endpoints depend on `FormRequest` classes under `App\Http\Requests\Api\...` to validate inputs like `entity`, `id`, `includes`, `filtros`, and `orden`. Ensure those requests define the expected types and constraints for your use cases.


### Extending and best practices

- Add new model classes under `App\Models\...`. Ensure naming matches the resolver rule: singular StudlyCase of `{entity}`.
- To expose related data via `includes`:
  - Define relationship methods on the model (e.g., `public function pedidos() { return $this->hasMany(...); }`).
  - Or add custom accessors like `getSaldoAttribute()` to compute attributes on the fly, then include `"saldo"` in `includes`.
- For complex filters or sorting, consider extending `index()` to parse operators (e.g., `>`, `<`, `like`) or adopt a query filter pattern.
- When using PATCH with JSON columns, configure Eloquent casts appropriately (e.g., `$casts = [ 'config' => 'array' ];`) to benefit from deep-merge behavior.
- Transactions: For multi-level `relations` inserts, wrap `insertResource()` and `processRelations()` in a DB transaction if you need all-or-nothing behavior.
- Authorization: Apply policies/middleware as needed; the current base class focuses on validation and data shaping, not permissions.


### Example flows

1) Fetch clientes with pedidos and computed saldo, filtered and ordered:

```http
GET /api/resources/clientes?includes[]=pedidos&includes[]=saldo&filtros[activo]=1&orden[]=nombre
Accept: application/json
```

2) Create a cliente with one nested direccion:

```http
POST /api/resources/clientes
Content-Type: application/json

{
  "entity": "clientes",
  "nombre": "Ana",
  "email": "ana@example.com",
  "relations": [
    { "entity": "direcciones", "payload": { "calle": "Belgrano", "numero": 10 } }
  ]
}
```

3) Patch only part of a JSON attribute (deep-merge):

```http
PATCH /api/resources/configuraciones/5
Content-Type: application/json

{
  "entity": "configuraciones",
  "preferencias": { "tema": { "modo": "oscuro" } }
}
```

If the current value of `preferencias` is `{ "tema": { "modo": "claro", "tamano": "m" } }`, the result will be `{ "tema": { "modo": "oscuro", "tamano": "m" } }`.


### Notes and caveats

- The dynamic model resolver assumes conventional naming. If your model doesn’t follow it, you’ll need to override `resolveModelClass()` or add a mapping layer.
- Custom attribute inclusion relies on accessor methods existing on the model (`get{AttributeName}Attribute`).
- For data integrity when inserting multiple nested relations, consider database constraints and wrap creates in a transaction.
- Error handling: validation errors come from `FormRequest`s; not-found returns `404`; other exceptions bubble up to Laravel’s handler unless caught.


### Maintenance checklist

- When adding new endpoints or changing behavior, update this README.
- Keep `FormRequest`s in sync with allowed fields and shapes of `includes`, `filtros`, and `orden`.
- Add tests for deep-merge behavior and relation insertion logic where applicable.
