<?php

namespace App\Services\QueryResolvers\Contracts;

use App\Collections\DTOCollection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

abstract class QueryResolverAbstractClass implements QueryResolverInterface
{

    abstract protected function getBuilder(): Builder;

    abstract protected function applyFilters(Builder $query): Builder;

    abstract protected function applyOrder(Builder $query): Builder;

    abstract protected function decorateResult(LengthAwarePaginator $paginator): LengthAwarePaginator;

    public function getPaginatedData(int $perPage = 50): LengthAwarePaginator
    {
        $builder = $this->getBuilder();
        $builder = $this->applyFilters($builder);
        $builder = $this->applyOrder($builder);

        return $this->decorateResult(
            $builder->paginate($perPage)
        );
    }
}
