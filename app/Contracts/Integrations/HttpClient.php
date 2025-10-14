<?php

namespace App\Contracts\Integrations;

interface HttpClient
{
    public function delete(string $uri, array $data) :IntegrationResponse;

    public function get(string $uri, array $data = []):IntegrationResponse;

    public function post(string $uri, array $data, array $queryParameters = []):IntegrationResponse;

    public function put(string $uri, array $data):IntegrationResponse;
}
