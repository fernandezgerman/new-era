# Docker to Host MySQL Connection Guide

## Current Configuration

The Laravel application in the Docker container is now configured to connect to the MySQL database on your host machine using `docker.for.mac.localhost` as the hostname. This is a special DNS name provided by Docker for Mac that resolves to the host machine.

## Troubleshooting Steps

If you still encounter connection issues, please try the following steps:

### 1. Ensure MySQL on your host is configured to accept remote connections

```sql
-- Connect to MySQL on your host machine
mysql -u root -p

-- Check the bind-address in MySQL configuration
SHOW VARIABLES LIKE 'bind_address';
```

If it shows `127.0.0.1` or `localhost`, you need to modify your MySQL configuration to listen on all interfaces:

Edit your MySQL configuration file (usually `/etc/mysql/my.cnf` or `/etc/mysql/mysql.conf.d/mysqld.cnf`):

```
bind-address = 0.0.0.0
```

Then restart MySQL:

```
sudo service mysql restart
```

### 2. Ensure the MySQL user has proper permissions

```sql
-- Connect to MySQL on your host machine
mysql -u root -p

-- Grant privileges to the user from any host
CREATE USER 'root'@'%' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 3. Try alternative hostnames if `docker.for.mac.localhost` doesn't work

Edit your `.env` file and try one of these alternatives:

```
# Option 1: Use the Docker bridge network IP (may vary)
DB_HOST=172.17.0.1

# Option 2: Use host.docker.internal (with proper Docker configuration)
DB_HOST=host.docker.internal
```

### 4. Test the connection from inside the container

```bash
# Enter the Docker container
docker exec -it mtih-laravel.test-1 bash

# Install MySQL client if needed
apt-get update && apt-get install -y mysql-client

# Test connection to host MySQL
mysql -h docker.for.mac.localhost -u root -p
```

## Firewall Considerations

Ensure that your host firewall allows connections to MySQL port (3306) from Docker containers. On macOS, you might need to check your firewall settings.

## Docker Network Configuration

The Docker Compose file already includes the necessary `extra_hosts` configuration to enable hostname resolution. If you're still having issues, you might need to check your Docker network settings or try using a different network mode.
