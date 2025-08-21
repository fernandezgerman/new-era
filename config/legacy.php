<?php

return [
    'legacy_base_directory' => base_path().'/mtihweb/',
    'email_directory' => base_path().'/mtihweb/clases/emails/',

    // Functions from clsIni
    'get_dir' => base_path().'/mtihweb/',
    'get_api_web' => 'http://mtih.local/',
    'get_directorio' => base_path().'/mtihweb/',
    'get_directorio_emails' => base_path().'/mtihweb/clases/emails/',
    'get_directorio_publico' => base_path().'/mtihweb/paginas/',
    'get_directorio_abm' => base_path().'/mtihweb/clases/abm/',
    'get_directorio_coneccion' => base_path().'/mtihweb/clases/coneccion/',
    'get_directorio_envio_email' => base_path().'/mtihweb/PHPMailer/',
    'get_directorio_form' => base_path().'/mtihweb/clases/form/',
    'get_directorio_grilla' => base_path().'/mtihweb/paginas/grilla/',
    'get_directorio_utiles' => base_path().'/mtihweb/clases/utiles/',
    'get_directorio_service' => base_path().'/mtihweb/paginas/webservices/',
    'get_directorio_template_codigo' => base_path().'/mtihweb/paginas/codificacion/templates/',
    'get_directorio_action' => base_path().'/mtihweb/paginas/action/',
    'get_directorio_codificacion' => base_path().'/mtihweb/paginas/codificacion/',
    'get_directorio_css' => base_path().'/mtihweb/paginas/css/',
    'get_directorio_template' => base_path().'/mtihweb/template/',
    'get_report_error' => E_ERROR,
    'get_db_error' => E_ALL ^ E_NOTICE,
    'get_directorio_boot_strap' => base_path().'/mtihweb/paginas/bootstrap/',
    'get_report_error_web_services' => E_ERROR,
    'host_pagina' => 'http://localhost/',
    'get_archivo_log' => base_path().'/mtihweb/info/log/web.log',
    'get_archivo_log_apache' => '/Users/germanfernandez/mtih/mtihweb/paginas/error.log',
    'get_archivo_consultas_lentas' => base_path().'/mtihweb/info/log/consultas_lentas',
    'get_correo_destinatario_tecnico' => "fernandezgermandario@gmail.com",
    'get_event_bridge_configuration' => [
        'bridge' =>[
            'version' => 'latest',
            'region' => 'us-west-2',
            'credentials' => [
                'key' => null,
                'secret' => null,
            ],
        ],
        //Establecer en false para interrumpir el envio de eventos
        'send-events' => false,
        'default-entries' =>   [
            "EventBusName"=> 'MTIH-EVENT-BRIDGE',
            "Source" => "servidorsam",
            "resources" => "servidorsam",
        ],
        'detail-types'=> [
            'testing-event' => 'test',
            'venta-event' => 'venta',
        ]
    ],
];
