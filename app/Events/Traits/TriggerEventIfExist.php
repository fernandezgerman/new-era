<?php

namespace App\Events\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;

trait TriggerEventIfExist
{
    private function triggerEventIfExists(string $entity, string $action, Model $model): void
    {
        $entityName = Str::studly(Str::singular($entity));
        $eventClass = "App\\Events\\Events\\{$entityName}\\{$entityName}{$action}Event";

        if (class_exists($eventClass)) {
            Event::dispatch(new $eventClass($model));
            return;
        }

        // Try alternative: Insert -> Inserted, Update -> Updated if $action was different,
        // but here we are using Inserted, Updated, Deleted as requested.
        // Let's check for the "Insert" vs "Inserted" inconsistency found.
        if ($action === 'Inserted') {
            $altEventClass = "App\\Events\\Events\\{$entityName}\\{$entityName}InsertEvent";
            if (class_exists($altEventClass)) {
                Event::dispatch(new $altEventClass($model));
                return;
            }
        }

        if ($action === 'Updated') {
            $altEventClass = "App\\Events\\Events\\{$entityName}\\{$entityName}UpdateEvent";
            if (class_exists($altEventClass)) {
                Event::dispatch(new $altEventClass($model));
                return;
            }
        }
    }
}
