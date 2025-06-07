<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SucursalSelectionController extends Controller
{
    /**
     * Show the sucursal selection page.
     *
     * @return \Illuminate\View\View
     */
    public function showSelectionForm()
    {
        $userId = Auth::id();

        // Get sucursales where activo=1 and exists in usuariossucursales for the current user
        $sucursales = DB::table('sucursales')
            ->select('sucursales.id', 'sucursales.nombre')
            ->join('usuariossucursales', 'sucursales.id', '=', 'usuariossucursales.idsucursal')
            ->where('sucursales.activo', 1)
            ->where('usuariossucursales.idusuario', $userId)
            ->get();

        return view('sucursal.selection', ['sucursales' => $sucursales]);
    }

    /**
     * Handle the sucursal selection.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function selectSucursal(Request $request)
    {
        $request->validate([
            'sucursal' => ['required', 'exists:sucursales,id'],
        ]);

        // Store the selected sucursal in the session
        session(['idSucursalActual' => $request->sucursal]);

        // Redirect to the main page
        return redirect('/');
    }
}
