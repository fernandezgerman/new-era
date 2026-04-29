# Reintentar TODOS los jobs fallidos
php artisan queue:retry all

# Reintentar jobs específicos por ID
php artisan queue:retry 123 456 789

# Reintentar todos los jobs de una cola específica
php artisan queue:retry --queue=alta-prioridad

# Reintentar solo los jobs fallidos en las últimas X horas
php artisan queue:retry --hours=24 all

# Ver primero la lista de jobs fallidos
php artisan queue:failed

# Reintentar y luego borrar los que se logren
php artisan queue:retry all --now

# Reintentar solo los que tengan un cierto UUID o tag (Laravel 10+)
php artisan queue:retry --uuid=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
