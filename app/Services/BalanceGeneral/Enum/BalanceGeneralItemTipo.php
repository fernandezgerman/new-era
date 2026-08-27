<?php

namespace App\Services\BalanceGeneral\Enum;

enum BalanceGeneralItemTipo: string
{
    case VENTAS = 'VENTAS';
    case COMPRAS = 'COMPRAS';
    case PAGOS = 'PAGOS';
    case TARA = 'TARA';
    case RETIROS = 'RETIROS_DE_DINERO';
    case APORTES = 'APORTES_DE_DINERO';
    case ARREGLOS = 'ARREGLOS_STOCK';
    case SOBRANTES = 'SOBRANTES_DE_CAJA';
    case GASTOS = 'GASTOS';
    case REVALORIZACIONES_DE_SUCURSALES = 'REVALORIZACIONES_DE_SUCURSALES';

    case GANANCIA = 'GANANCIA';
    case LIQUIDACION = 'LIQUIDACIONES';


}

