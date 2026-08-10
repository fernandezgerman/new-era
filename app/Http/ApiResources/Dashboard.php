<?php

namespace App\Http\ApiResources;

use App\Services\Alertas\AlertasManager;
use App\Services\Alertas\CacheHandlers\AlertaSucursalInicioLiquidacionCacheHandler;
use App\Services\Alertas\Transformers\AlertaSummaryDTOTransformer;
use App\Services\Alertas\Transformers\AlertaDetalleDTOToLegacyResponseTransformer;
use App\Services\TareasManager\DataAccessors\TareasDataAccessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class Dashboard extends AbstractApiHandler
{
    /**
     * Obtiene un resumen de las tareas creadas por el usuario autenticado.
     *
     * Documentación para Agentes de IA:
     *
     * Endpoint: GET /api/tareas/creados-por-mi/resumen
     *
     * Request Payload (Query Parameters / Body):
     * - Ninguno: Utiliza el ID del usuario autenticado.
     *
     * Example: GET /api/tareas/creados-por-mi/resumen
     *
     * Json Response:
     * {
     *     "referencias": {
     *         "red": "Bloqueado",
     *         "green": "Terminado",
     *         "blue": "En proceso",
     *         "gray": "Pendiente"
     *     },
     *     "data": [
     *         {
     *             "id": 1836471422872979000,
     *             "estado": "Pendiente",
     *             "name": "Tarea de german",
     *             "description": null,
     *             "updated_at": "2026-08-07 15:20:53",
     *             "creador": "sistemas",
     *             "usuario_creador": {
     *                 "id": 1,
     *                 "nombre": "Sistema",
     *                 "apellido": "informatico",
     *                 "nombre_completo": "Sistema informatico",
     *                 ...
     *             }
     *         }
     *     ]
     * }
     *
     * Reglas:
     * - Retorna tareas donde el usuario autenticado es el creador.
     * - Incluye tareas en estados: Pendiente, Bloqueado, En proceso.
     * - Incluye tareas en estado Terminado solo si fueron movidas a ese estado hoy.
     *
     * @return array
     */
    public function getTareasCreadosPorMiResumen()
    {
        $tareaDataAccessor = new TareasDataAccessor();

        return [
            "updated_at" => Carbon::now(),
            "referencias" => [
                'red' => config('planka.estados.bloqueado'),
                'green' => config('planka.estados.terminado'),
                'blue' => config('planka.estados.en_proceso'),
                'gray' => config('planka.estados.pendiente'),
            ],
            "data" => $tareaDataAccessor->getTareasPorCreador(auth()->user()->id)
        ];
    }
    public function getUserMenu(): JsonResponse
    {
        $user = auth()->user();

        $usuarioDataAccessor = app(\App\DataAccessor\UsuarioDataAccessor::class, ['user' => $user]);

        return $this->sendResponse($usuarioDataAccessor->getMenu()->toArray());
    }

    public function getAlertas(): JsonResponse
    {
        $user = auth()->user();

     /* $arr = session('permisos');
        if (Arr::get($arr,'alrtgral','PERMITIDO') ==="RESTRINGIDO")
        {
            return new JsonResponse([]);
        }*/
        $usuarioDataAccessor = app(\App\DataAccessor\UsuarioDataAccessor::class, ['user' => $user]);

        return $this->sendResponse(
            $usuarioDataAccessor->getAlertas()->toArray(),
            app(AlertaSummaryDTOTransformer::class)
        );
    }

    public function getAlertaDetalles(int $alertaId): JsonResponse
    {
        $user = auth()->user();

        // If the alert is not "solicitud de pago", return legacy ajax response
        if (config('alertas.solicitud_de_pago_alerta_id') !== $alertaId
            && config('alertas.tareas_alerta_id') !== $alertaId) {
            // Mimic legacy request parameters
            request()->merge([
                'IncluirVistas' => null,
                'inpUsuarioAlertasId' => null,
                'alertaTipoId' => $alertaId,
            ]);

            ob_start();
            include base_path('mtihweb/paginas/ajaxAlertasInicioDetalle.php');
            $output = ob_get_clean();
            $data = json_decode($output, true) ?? [];

            return $this->sendResponse($data);
        }

        $usuarioDataAccessor = app(\App\DataAccessor\UsuarioDataAccessor::class, ['user' => $user]);
        $alertaDetalles = $usuarioDataAccessor->getAlertaDetalles($alertaId);

        return $this->sendResponse(
            [
                "alertaDetalles" =>
                    $alertaDetalles->map(
                        fn($alertaDetalle) => app(AlertaDetalleDTOToLegacyResponseTransformer::class)
                            ->transform($alertaDetalle)
                    )->toArray()
            ]
        );
    }
    public function MarcarAlertasComoLeidas(int $alertaTipoId): JsonResponse
    {
        app(AlertasManager::class)->MarcarAlertasComoLeidas(auth()->user(), [$alertaTipoId]);
        return $this->sendResponse([]);
    }

    public function MarcarAlertaComoLeida(int $alertaId): JsonResponse
    {
        app(AlertasManager::class)->MarcarAlertasComoLeidas(auth()->user(), null, $alertaId);
        return $this->sendResponse([]);
    }

    public function MarcarAlertaComoNoLeida(int $alertaId): JsonResponse
    {
        app(AlertasManager::class)->MarcarAlertasComoLeidas(auth()->user(), null, $alertaId, false);
        return $this->sendResponse([]);
    }

    public function getAlertaInicioSucursalLiquidacion(int $sucursalId): JsonResponse
    {
        $sucursal = get_entity_or_fail('Sucursal', $sucursalId);

        $cacheHandler = new AlertaSucursalInicioLiquidacionCacheHandler($sucursal);

        return $this->sendResponse(
            $cacheHandler->getValue()->toArray()
        );
    }
}
