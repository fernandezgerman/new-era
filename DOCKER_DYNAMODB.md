DynamoDB Local via Docker

This project includes a local DynamoDB container for development and testing.

Service details
- Image: amazon/dynamodb-local:latest
- Service name: dynamodb
- Port: 8000 (forwarded to host via FORWARD_DYNAMODB_PORT, default 8000)
- Network: sail
- Volume: sail-dynamodb (persists data if container is not run in memory)

Compose usage
- Start: docker compose up -d dynamodb dynamodb-admin
- Or start all: docker compose up -d
- Check health: the service has a healthcheck; you can also open http://localhost:8000/shell/ to access the DynamoDB Local web shell.
- Admin UI: open http://localhost:${FORWARD_DYNAMODB_ADMIN_PORT:-8001} to access dynamodb-admin.

Environment variables
- DYNAMODB_ENDPOINT=http://dynamodb:8000
- AWS_ACCESS_KEY_ID=local
- AWS_SECRET_ACCESS_KEY=local
- AWS_DEFAULT_REGION=us-east-1
- AWS_USE_PATH_STYLE_ENDPOINT=true

Laravel integration notes
- If using AWS SDK or Laravel packages that support DynamoDB, point them to ${DYNAMODB_ENDPOINT}.
- Example PHP SDK client config:
  $client = new Aws\DynamoDb\DynamoDbClient([
      'version' => 'latest',
      'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
      'endpoint' => env('DYNAMODB_ENDPOINT', 'http://localhost:8000'),
      'credentials' => [
          'key' => env('AWS_ACCESS_KEY_ID', 'local'),
          'secret' => env('AWS_SECRET_ACCESS_KEY', 'local'),
      ],
  ]);

Notes
- The compose file currently runs DynamoDB Local in memory (-inMemory -sharedDb). Data will not persist across container restarts. Remove -inMemory in docker-compose.yml if you want persistence to sail-dynamodb volume.
