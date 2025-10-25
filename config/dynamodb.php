<?php

return [
    'default' => [
        'region' => env('AWS_DEFAULT_REGION', 'us-west-1'),
        'version' => 'latest',
        'endpoint' => env('DYNAMODB_ENDPOINT'),
        'credentials' => [
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
        ],
    ],
];
