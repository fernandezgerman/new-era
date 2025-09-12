<?php

namespace App\Http\Controllers\Dashboard;

use App\DataAccessor\UsuarioDataAccessor;
use App\Http\Controllers\Controller;
use App\Repositories\Legacy\PermisosRepository;
use Illuminate\Http\Request;
use App\Http\Requests\Api\LoginRequest;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Show the login form.
     *
     * @return \Illuminate\View\View
     */
    public function index()
    {
        return view('dashboard.default');
    }

}
