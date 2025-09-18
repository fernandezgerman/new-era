<?php

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

if (! function_exists('query_builder_to_raw_sql')) {
    /**
     * Shows the SQL built using the query builder with bound parameter values inlined.
     * The difference with Builder->toSql() is this result includes the parameters values quoted as needed.
     *
     * @param EloquentBuilder|QueryBuilder $query
     * @return string
     */
    function query_builder_to_raw_sql(EloquentBuilder|QueryBuilder $query): string
    {
        // If it's an Eloquent Builder, get the underlying Query Builder
        if ($query instanceof EloquentBuilder) {
            $query = $query->getQuery();
        }

        $sql = $query->toSql();
        $bindings = $query->getBindings();
        $pdo = $query->getConnection()->getPdo(); // Get PDO instance for proper quoting

        foreach ($bindings as $binding) {
            // Quote bindings correctly based on type
            if (is_string($binding)) {
                $binding = $pdo->quote($binding);
            } elseif (is_bool($binding)) {
                $binding = $binding ? '1' : '0'; // Adjust for your DB if needed (e.g., TRUE/FALSE)
            } elseif (is_null($binding)) {
                $binding = 'NULL';
            } elseif (is_array($binding)) {
                // Flatten arrays (e.g., whereIn bindings) into comma-separated values
                $binding = implode(',', array_map(function ($val) use ($pdo) {
                    if (is_string($val)) return $pdo->quote($val);
                    if (is_bool($val)) return $val ? '1' : '0';
                    if (is_null($val)) return 'NULL';
                    return (string)$val;
                }, $binding));
            } else {
                // Numbers (int/float) usually don't need quoting
                $binding = (string) $binding;
            }

            // Find the first occurrence of '?' and replace it
            $pos = strpos($sql, '?');
            if ($pos !== false) {
                $sql = substr_replace($sql, $binding, $pos, 1);
            }
        }

        return $sql;
    }
}
