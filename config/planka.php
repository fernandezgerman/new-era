<?php

return [
    'db' => [
        'database' => env('PLANKA_DB_DATABASE'),
        'username' => env('PLANKA_DB_USERNAME'),
        'password' => env('PLANKA_DB_PASSWORD'),
        'port'     => env('PLANKA_DB_PORT', '5432'),
        'host'     => env('PLANKA_DB_HOST', 'planka-db'),
    ],
    'default_project' => env('PLANKA_DEFAULT_PROJECT'),
    'default_board'   => env('PLANKA_DEFAULT_BOARD'),
    'default_landing' => env('PLANKA_BASE_URL').'/boards/'.env('PLANKA_DEFAULT_BOARD'),
    'card_view' => env('PLANKA_BASE_URL').'/cards/',
    'home_url'   => env('PLANKA_BASE_URL'),
    'estados' => [
        'pendiente' => env('PLANKA_ESTADO_PENDIENTE'),
        'bloqueado' => env('PLANKA_ESTADO_BLOQUEADO'),
        'en_proceso' => env('PLANKA_ESTADO_EN_PROCESO'),
        'terminado' => env('PLANKA_ESTADO_TERMINADO'),
    ],
];
