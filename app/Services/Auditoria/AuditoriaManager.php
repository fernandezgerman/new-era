<?php

namespace App\Services\Auditoria;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use OwenIt\Auditing\Facades\Auditor;
use Throwable;

require_once config('legacy.legacy_base_directory') . 'clsIndicePaginas.php';

class AuditoriaManager
{
    private $except = [
    ];
    public function auditarLegacyRequest(string $codigo = null)
    {
        try {
            $pag = new \clsIndicePaginas();

            $pagina = Request()->get("pagina") ?? $codigo;

            $url = $pagina ? $pag->getPagina($pagina) : '';

            $aux = Request()->url();

            if(str_replace('.php', '', $aux) !== $aux && !$pagina)
            {
                $pagina = request()->path();
                $url = $pagina;
            }

            $info = Request()->all();
            $info['clave'] = null;

            if(!$pagina) return;

            if(in_array($pagina, $this->except)) return;

            DB::connection('audits')->table('audits')->insert([
                'user_id' => Auth::user()?->id,
                'event' => $pagina ,
                'auditable_type' => $url ?? Request()->url(),
                'auditable_id' => (int)(Request()->get("id") ?? Request()->get("p_id") ?? 0),
                'old_values' => json_encode([]),
                'new_values' => json_encode($info),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'url' => request()->fullUrl(),
                'created_at' => now(),
                'updated_at' => now(),
                'user_type' => 'App\Models\User',
                // tus custom fields
            ]);
        }catch (Throwable $exception){
            Log::error($exception);
        }
    }
}
