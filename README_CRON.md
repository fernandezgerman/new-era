Laravel Scheduler (cron) setup

To run the scheduled tasks defined in app/Console/Kernel.php, you must ensure that the Laravel scheduler is executed every minute by your system's cron (or via a process manager like Supervisor).

Option A: System cron (recommended)
----------------------------------
1) Determine PHP path:
   which php
   Example: /usr/bin/php

2) Edit the crontab for the web user (e.g., www-data) or the user that owns the project:
   crontab -e

3) Add this line (adjust paths accordingly):
   * * * * * cd /home/german/code/new-era/server && /usr/bin/php artisan schedule:run >> /home/german/code/new-era/server/storage/logs/scheduler.log 2>&1

This runs the scheduler every minute. Check storage/logs/scheduler.log for output.

Option B: schedule:work (long-running)
-------------------------------------
You can alternatively run a long-lived worker:
   php artisan schedule:work --run-output-file=storage/logs/scheduler.log
Use Supervisor or systemd to keep it alive.

Troubleshooting
---------------
- Timezone: Ensure APP_TIMEZONE in config/app.php (or .env via APP_TIMEZONE) matches your server timezone. Scheduler respects configured timezone per task if you call ->timezone(...).
- Permissions: Ensure the cron user can read the project and write to storage/logs.
- PHP version: The cron PHP binary should match the project's PHP version used by your web server.
- Logs: Add simple log markers inside scheduled closures to verify execution (e.g., Log::info('scheduler tick')). Note: appendOutputTo/sendOutputTo capture only stdout/stderr (echo/print), not Log::info(). If you expect content in a file defined by appendOutputTo(), make sure your task echoes a line.
- PHP extensions: The scheduler (artisan) requires mbstring and other extensions. If you see "Call to undefined function mb_split()", install/enable mbstring for the CLI PHP (e.g., sudo apt-get install php-mbstring; then restart and ensure the cron user's php has mbstring enabled: php -m | grep mbstring).
- Overlapping: Use ->withoutOverlapping() for tasks that must not run concurrently.

Example minimal verification task
---------------------------------
You can add this to app/Console/Kernel.php temporarily to verify the scheduler is running:

$schedule->call(fn() => \Log::channel('single')->info('scheduler heartbeat'))
    ->everyMinute()
    ->appendOutputTo(storage_path('logs/scheduler-heartbeat.log'));

Remove it after confirming scheduler execution.
