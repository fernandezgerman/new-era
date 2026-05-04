<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;
use clsEnvioEmail;

class MonitorJobsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'monitor:jobs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor jobs_log and failed_jobs tables and notify systems of any issues.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting jobs monitoring...');

        try {
            $issues = [];

            // 1. Check jobs_log for records with status 'error'
            $errorJobs = DB::table('jobs_log')
                ->where('status', 'error')
                ->get();

            if ($errorJobs->isNotEmpty()) {
                $issues['Jobs with status Error'] = $errorJobs;
            }

            // 2. Check jobs_log for records with status 'pending' and older than 10 minutes
            $pendingThreshold = Carbon::now()->subMinutes(10);
            $pendingJobs = DB::table('jobs_log')
                ->where('status', 'pending')
                ->where('created_at', '<', $pendingThreshold)
                ->get();

            if ($pendingJobs->isNotEmpty()) {
                $issues['Jobs pending for more than 10 minutes'] = $pendingJobs;
            }

            // 3. Check failed_jobs table
            $failedJobs = DB::table('failed_jobs')->get();

            if ($failedJobs->isNotEmpty()) {
                $issues['Records in failed_jobs table'] = $failedJobs;
            }

            if (empty($issues)) {
                $this->info('No issues found.');
                return 0;
            }

            $this->info('Issues found. Preparing email...');
            $this->sendNotification($issues);

        } catch (Exception $e) {
            $this->error('Error during monitoring: ' . $e->getMessage());
            Log::error('MonitorJobsCommand Error: ' . $e->getMessage());
            return 1;
        }

        $this->info('Monitoring finished.');
        return 0;
    }

    /**
     * Send email notification with the found issues.
     *
     * @param array $issues
     * @return void
     */
    private function sendNotification(array $issues)
    {
        $destEmail = config('mail.emails.sistemas.email');
        $destName = config('mail.emails.sistemas.name');

        if (!$destEmail) {
            Log::error('MonitorJobsCommand: sistemas email not configured.');
            return;
        }

        require_once(config('legacy.legacy_base_directory') . 'clases/log/clsEnvioEmail.php');
        $objEmail = new clsEnvioEmail();
        $objEmail->agregarDestinatario($destEmail, $destName);

        $asunto = "Alert: Job System Issues Detected - " . date('Y-m-d H:i');
        $cuerpo = "<h2>Job System Monitoring Report</h2>";
        $cuerpo .= "<p>The following issues were detected at " . date('Y-m-d H:i:s') . ":</p>";

        foreach ($issues as $title => $records) {
            $cuerpo .= "<h3>$title</h3>";
            foreach ($records as $record) {
                $cuerpo .= "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse; margin-bottom: 20px; width: 100%;'>";
                foreach ((array)$record as $column => $value) {
                    $cuerpo .= "<tr>";
                    $cuerpo .= "<th align='left' style='background-color: #f2f2f2; width: 30%;'>$column</th>";
                    $cuerpo .= "<td>" . (is_null($value) ? '<em>null</em>' : htmlspecialchars($value)) . "</td>";
                    $cuerpo .= "</tr>";
                }
                $cuerpo .= "</table>";
            }
        }

        if ($objEmail->enviarEmail($asunto, $cuerpo)) {
            $this->info('Notification email sent to ' . $destEmail);
        } else {
            $this->error('Failed to send notification email.');
        }
    }
}
