<?php

namespace App\Services\QueryResolvers\Contracts;

use App\Collections\DTOCollection;
use App\Models\RendicionStock;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

abstract class QueryResolverAbstractClass implements QueryResolverInterface
{

    abstract protected function getBuilder(): Builder;

    abstract protected function applyFilters(Builder $query): Builder;

    abstract protected function applyOrder(Builder $query): Builder;

    abstract protected function decorateResult($item);

    private function decoratePagination(\Illuminate\Pagination\LengthAwarePaginator $paginator): \Illuminate\Pagination\LengthAwarePaginator
    {
        $selfInstance = $this;

        $paginator->getCollection()->each(function ($item)use ($selfInstance) {
            $item = $selfInstance->decorateResult($item);
        });

        return $paginator;
    }
    public function getPaginatedData(int $perPage = 50): LengthAwarePaginator
    {
        $builder = $this->getBuilder();
        $builder = $this->applyFilters($builder);
        $builder = $this->applyOrder($builder);

        return $this->decoratePagination(
            $builder->paginate($perPage)
        );
    }

    public function getData(): Collection
    {
        $builder = $this->getBuilder();
        $builder = $this->applyFilters($builder);
        $builder = $this->applyOrder($builder);

        $selfInstance = $this;
        $result = $builder->get();
        return $result->map(function($item) use ($selfInstance) {
            return $selfInstance->decorateResult($item);

        });

    }
}
