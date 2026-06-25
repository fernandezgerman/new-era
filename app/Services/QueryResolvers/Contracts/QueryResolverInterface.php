<?php
namespace App\Services\QueryResolvers\Contracts;

use App\Collections\DTOCollection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface QueryResolverInterface
{
    public function getPaginatedData( int $perPage = 50): LengthAwarePaginator;
}
