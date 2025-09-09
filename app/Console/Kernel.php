<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
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
        $schedule->call(function () {
            include base_path('mtihweb/cronDiario.php');
        })->dailyAt('00:03')->appendOutputTo(storage_path('logs/crondiario.log'));

        // Every hour at minute 55 - cronPorHora.php
        $schedule->call(function () {
            include base_path('mtihweb/cronPorHora.php');
        })->hourlyAt(55)->appendOutputTo(storage_path('logs/cronporhora.log'));

        // Every 15 minutes - cron15min.php
        $schedule->call(function () {
            Log::info('Cron 15 min');
            include base_path('mtihweb/cron15min.php');
        })->everyFifteenMinutes()->appendOutputTo(storage_path('logs/cron15min.log'));

        // 07:00 daily - cron7AM.php
        $schedule->call(function () {
            include base_path('mtihweb/cron7AM.php');
        })->dailyAt('07:00')->appendOutputTo(storage_path('logs/cron7AM.log'));

        // 02:00 daily - cron2AM.php
        $schedule->call(function () {
            include base_path('mtihweb/cron2AM.php');
        })->dailyAt('02:00')->appendOutputTo(storage_path('logs/cron2AM.log'));

        // Monday 08:00 - cronLunes8AM.php
        $schedule->call(function () {
            include base_path('mtihweb/cronLunes8AM.php');
        })->weeklyOn(1, '08:00')->appendOutputTo(storage_path('logs/cronLunes8AM.log'));

        // Monday 07:00 - cronLunes7AM.php
        $schedule->call(function () {
            include base_path('mtihweb/cronLunes7AM.php');
        })->weeklyOn(1, '07:00')->appendOutputTo(storage_path('logs/cronLunes7AM.log'));

        // 10 past at 9,13,17,21 - cronNotificacionesGanancias.php
        $schedule->call(function () {
            include base_path('mtihweb/cronNotificacionesGanancias.php');
        })->cron('10 9,13,17,21 * * *')->appendOutputTo(storage_path('logs/cron8-12-16-20.log'));
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
