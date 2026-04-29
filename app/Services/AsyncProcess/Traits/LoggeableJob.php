<?php

namespace App\Services\AsyncProcess\Traits;

use App\Models\JobLog;

trait LoggeableJob
{
    const STATUS_PENDING = 'pending';
    const STATUS_ERROR = 'error';
    const STATUS_SUCCESS = 'success';
    private int $jobId;
    public function setId(int $jobId): void
    {
        $this->jobId = $jobId;
    }

    public function getId(): int
    {
        return $this->jobId;
    }

    public function LogNewJob(
        string $service, string $method, array $parameters
    ): JobLog
    {
        $jobLog = new JobLog();

        $jobLog->method = $method;
        $jobLog->service = $service;
        $jobLog->status = self::STATUS_PENDING;
        $jobLog->parametters = $parameters;

        $jobLog->save();

        return $jobLog;
    }

    public function setLogAsSuccess(int $logId): void
    {
        $entity = get_entity_or_fail('JobLog', $logId);
        $entity->status = self::STATUS_SUCCESS;
        $entity->save();
    }

    public function setLogAsError(int $logId, string $errorMessage): void
    {
        $entity = get_entity_or_fail('JobLog', $logId);
        $entity->status = self::STATUS_ERROR;
        $entity->description = mb_substr($errorMessage, 0, 200);
        $entity->save();
    }

}
