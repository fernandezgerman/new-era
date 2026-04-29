<?php

namespace App\Services\AsyncProcess\Jobs;

use App\Models\JobLog;
use App\Services\AsyncProcess\DTOs\JobDTO;
use App\Services\AsyncProcess\Factories\JobDTOFactory;
use App\Services\AsyncProcess\Interfaces\AsyncProcessDTOInterface;
use App\Services\AsyncProcess\Traits\LoggeableJob;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class DynamicServiceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, LoggeableJob;

    protected JobLog $newLogJob;
    public function __construct(protected AsyncProcessDTOInterface $asyncProcessDTO) {

        $jobDTO = JobDTOFactory::make($this->asyncProcessDTO);
        $this->newLogJob = $this->LogNewJob(
            service: $jobDTO->service,
            method: $jobDTO->method,
            parameters: $jobDTO->parameters,
        );
    }

    public function handle()
    {

        $jobDTO = JobDTOFactory::make($this->asyncProcessDTO);

        try {

            $instance = app($jobDTO->service);
            $result = $instance->{$jobDTO->method}(...$jobDTO->parameters);


            $this->setLogAsSuccess($this->newLogJob->id);

        } catch (\Throwable $e) {

            Log::error("DynamicServiceJob falló", [
                'process' => $this->asyncProcessDTO->getAsyncProcessName()->value,
                'error'   => $e->getMessage(),
                'signature' => [
                    'service' => $jobDTO->service,
                    'method' => $jobDTO->method,
                    'parameters' => $jobDTO->parameters,
                ],
                'trace' => $e->getTraceAsString()
            ]);

            $this->fail($e);

            $this->setLogAsError($this->newLogJob->id,  $e->getMessage());
        }
    }
}
