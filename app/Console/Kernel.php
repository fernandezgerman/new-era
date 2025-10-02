<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Get the timezone that should be used by default for scheduled events.
     */
    protected function scheduleTimezone()
    {
        return config('app.timezone');
    }

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {

        // MTIH legacy cron migrations to Laravel Scheduler

        // 03:00 daily - realizar_copia_web.sh (bash backup + S3)
        /*
        $schedule->exec('sh '.base_path('mtihweb/realizar_copia_web.sh'))
            ->dailyAt('03:00')
            ->appendOutputTo(storage_path('logs/realizar_copia_web.log'));
*/
        // 00:03 daily - cronDiario.php

        $schedule->exec('echo "Hello from scheduler!"')
            ->everyMinute()
            ->appendOutputTo(storage_path('logs/scheduler-test.log'));


        $schedule->call(function () {
            echo 'Esto va a al log por minuto';
            Log::info('Esto va al log general: '.storage_path('logs/crondiario.log'));
        })->everyMinute()->appendOutputTo(storage_path('logs/crondiario.log'))->name('cronTest')->withoutOverlapping();



        $schedule->call(function () {
            try {
                include base_path('mtihweb/cronDiario.php');
                Log::info('mtihweb/cronDiario.php');
            } catch (\Throwable $e) {
                Log::error('cronDiario failed: ' . $e->getMessage());
            }
        })->dailyAt('00:03')->appendOutputTo(storage_path('logs/crondiario.log'))->name('cronDiario')->withoutOverlapping();

        // Every hour at minute 55 - cronPorHora.php
        $schedule->call(function () {
            try {
                include base_path('mtihweb/cronPorHora.php');
                Log::info('mtihweb/cronPorHora.php');
            } catch (\Throwable $e) {
                Log::error('cronPorHora failed: ' . $e->getMessage());
            }
        })->hourlyAt(55)->appendOutputTo(storage_path('logs/cronporhora.log'))->name('cronPorHora')->withoutOverlapping();

        // Every 15 minutes - cron15min.php
        $schedule->call(function () {
            Log::info('Cron 15 min');
            try {
                include base_path('mtihweb/cron15min.php');
                Log::info('mtihweb/cron15min.php');
            } catch (\Throwable $e) {
                Log::error('cron15min failed: ' . $e->getMessage());
            }
        })->everyFifteenMinutes()->appendOutputTo(storage_path('logs/cron15min.log'))->name('cron15min')->withoutOverlapping();

        // 07:00 daily - cron7AM.php
        $schedule->call(function () {
            try {
                include base_path('mtihweb/cron7AM.php');
                Log::info('mtihweb/cron7AM.php');
            } catch (\Throwable $e) {
                Log::error('cron7AM failed: ' . $e->getMessage());
            }
        })->dailyAt('07:00')->appendOutputTo(storage_path('logs/cron7AM.log'))->name('cron7AM')->withoutOverlapping();

        // 02:00 daily - cron2AM.php
        $schedule->call(function () {
            try {
                include base_path('mtihweb/cron2AM.php');
                Log::info('mtihweb/cron2AM.php');
            } catch (\Throwable $e) {
                Log::error('cron2AM failed: ' . $e->getMessage());
            }
        })->dailyAt('02:00')->appendOutputTo(storage_path('logs/cron2AM.log'))->name('cron2AM')->withoutOverlapping();

        // Monday 08:00 - cronLunes8AM.php
        $schedule->call(function () {
            try {
                include base_path('mtihweb/cronLunes8AM.php');
                Log::info('mtihweb/cronLunes8AM.php');
            } catch (\Throwable $e) {
                Log::error('cronLunes8AM failed: ' . $e->getMessage());
            }
        })->weeklyOn(1, '08:00')->appendOutputTo(storage_path('logs/cronLunes8AM.log'))->name('cronLunes8AM')->withoutOverlapping();

        // Monday 07:00 - cronLunes7AM.php
        $schedule->call(function () {
            try {
                include base_path('mtihweb/cronLunes7AM.php');
                Log::info('mtihweb/cronLunes7AM.php');
            } catch (\Throwable $e) {
                Log::error('cronLunes7AM failed: ' . $e->getMessage());
            }
        })->weeklyOn(1, '07:00')->appendOutputTo(storage_path('logs/cronLunes7AM.log'))->name('cronLunes7AM')->withoutOverlapping();

        // 10 past at 9,13,17,21 - cronNotificacionesGanancias.php
        $schedule->call(function () {
            try {
                include base_path('mtihweb/cronNotificacionesGanancias.php');
                Log::info('mtihweb/cronNotificacionesGanancias.php');
            } catch (\Throwable $e) {
                Log::error('cronNotificacionesGanancias failed: ' . $e->getMessage());
            }
        })->cron('10 9,13,17,21 * * *')->appendOutputTo(storage_path('logs/cron8-12-16-20.log'))->name('cronNotificacionesGanancias')->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
