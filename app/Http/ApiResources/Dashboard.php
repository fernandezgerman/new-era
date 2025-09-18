<?php

namespace App\Http\ApiResources;

use App\Services\Alertas\Transformers\AlertaSummaryDTOTransformer;
use App\Services\Alertas\Transformers\AlertaDetalleDTOToLegacyResponseTransformer;
use Illuminate\Http\JsonResponse;

class Dashboard extends AbstractApiHandler
{
    public function getUserMenu(): JsonResponse
    {
        $user = auth()->user();

        $usuarioDataAccessor = app(\App\DataAccessor\UsuarioDataAccessor::class, ['user' => $user]);

        return $this->sendResponse($usuarioDataAccessor->getMenu()->toArray());
    }

    public function getAlertas(): JsonResponse
    {
        $user = auth()->user();

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
        if (config('alertas.solicitud_de_pago_alerta_id') !== $alertaId) {
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
}
