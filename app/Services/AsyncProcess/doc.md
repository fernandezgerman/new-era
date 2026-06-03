# Servicio de Procesos Asíncronos (AsyncProcess)

Este servicio permite delegar tareas pesadas o de larga duración a una cola de ejecución asíncrona (usando Laravel Jobs) de manera estructurada y tipada.

## Estructura de Componentes

Para implementar un nuevo proceso asíncrono, se deben seguir estos pasos:

### 1. Definir el Enumerado (Enum)
Añade un nuevo caso al enum `AvailableAsyncProcess` en `app/Services/AsyncProcess/Enums/AvailableAsyncProcess.php`.

```php
enum AvailableAsyncProcess: string
{
    // ... casos existentes
    case MI_NUEVO_PROCESO = 'MI_NUEVO_PROCESO';
}
```

### 2. Crear el DTO del Proceso
Crea una clase en `app/Services/AsyncProcess/DTOs/` que implemente `AsyncProcessDTOInterface`. Esta clase contendrá los datos necesarios para ejecutar el proceso.

```php
namespace App\Services\AsyncProcess\DTOs;

use App\Services\AsyncProcess\Enums\AvailableAsyncProcess;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;

class MiNuevoProcesoDTO implements AsyncProcessDTOInterface
{
    public function __construct(public int $idEntidad, public string $mensaje) {}

    public function toArray(): array
    {
        return [
            'idEntidad' => $this->idEntidad,
            'mensaje'   => $this->mensaje,
        ];
    }

    public function getAsyncProcessName(): AvailableAsyncProcess
    {
        return AvailableAsyncProcess::MI_NUEVO_PROCESO;
    }
}
```

### 3. Registrar en la Factoría (Factory)
Modifica `app/Services/AsyncProcess/Factories/JobDTOFactory.php` para mapear tu nuevo proceso al servicio y método correspondiente que debe ejecutarse en segundo plano.

```php
public static function make(AsyncProcessDTOInterface $asyncProcessDTO): JobDTO
{
    $service = match ($asyncProcessDTO->getAsyncProcessName()->value) {
        // ...
        AvailableAsyncProcess::MI_NUEVO_PROCESO->value => MiServicioNegocio::class,
    };

    $method = match ($asyncProcessDTO->getAsyncProcessName()->value) {
        // ...
        AvailableAsyncProcess::MI_NUEVO_PROCESO->value => 'metodoAAjecutar',
    };

    return new JobDTO(
        service: $service,
        method: $method,
        parameters: $asyncProcessDTO->toArray()
    );
}
```

## Cómo usar el servicio

Una vez configurado, puedes disparar el proceso desde cualquier parte de la aplicación (Controladores, otros Servicios, etc.) usando el `AsyncProcessManager`:

```php
use App\Services\AsyncProcess\AsyncProcessManager;
use App\Services\AsyncProcess\DTOs\MiNuevoProcesoDTO;

$dto = new MiNuevoProcesoDTO($entidad->id, "Hola Mundo");
AsyncProcessManager::handle($dto);
```

## Detalles de Implementación

- **Cola:** Por defecto, los procesos se envían a la cola `legacy`.
- **Conexión:** Se utiliza la conexión `database`.
- **Logs:** El servicio utiliza el trait `LoggeableJob` para registrar automáticamente el inicio, éxito o fallo del proceso en la base de datos (tabla `job_logs`).
- **Manejo de Errores:** Si el proceso falla, se registra el error en los logs de Laravel y se marca el log del job como error.
