<?php

namespace App\Console;


use App\Logging\SaveIncludeDataIntoFile;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

        /*$schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cronTest.php')))
            ->everyMinute()->name('cronTest')->withoutOverlapping();*/

        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cronDiario.php')))
            ->dailyAt('00:03')->name('cronDiario')->withoutOverlapping();

        // Every hour at minute 55 - cronPorHora.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cronPorHora.php')))
            ->hourlyAt(55)->name('cronPorHora')->withoutOverlapping();

        // Every 15 minutes - cron15min.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cron15min.php')))
            ->everyFifteenMinutes()->name('cron15min')->withoutOverlapping();

        // 07:00 daily - cron7AM.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cron7AM.php')))
            ->dailyAt('07:00')->name('cron7AM')->withoutOverlapping();

        // 02:00 daily - cron2AM.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cron2AM.php')))
            ->dailyAt('02:00')->name('cron2AM')->withoutOverlapping();

        // Monday 08:00 - cronLunes8AM.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cronLunes8AM.php')))
            ->weeklyOn(1, '08:00')->name('cronLunes8AM')->withoutOverlapping();

        // Monday 07:00 - cronLunes7AM.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cronLunes7AM.php')))
            ->weeklyOn(1, '07:00')->name('cronLunes7AM')->withoutOverlapping();

        // 10 past at 9,13,17,21 - cronNotificacionesGanancias.php
        $schedule->call(new SaveIncludeDataIntoFile(base_path('mtihweb/cronNotificacionesGanancias.php')))
            ->cron('10 9,13,17,21 * * *')->name('cronNotificacionesGanancias')->withoutOverlapping();

        // Daily: delete .log files in storage/logs not modified for one week
        $schedule->call(function () {
            $logsPath = storage_path('logs');
            $threshold = Carbon::now()->subWeek();
            if (!is_dir($logsPath)) {
                return;
            }
            $deleted = 0;
            foreach (glob($logsPath . DIRECTORY_SEPARATOR . '*.log') as $file) {
                $mtime = @filemtime($file);
                if ($mtime === false) {
                    continue;
                }
                if (Carbon::createFromTimestamp($mtime)->lessThan($threshold)) {
                    @unlink($file);
                    $deleted++;
                }
            }
            Log::info('Old log cleanup executed', ['deleted' => $deleted]);
        })->dailyAt('03:10')->name('cleanupOldLogs')->withoutOverlapping();
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
