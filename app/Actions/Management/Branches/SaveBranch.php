<?php

declare(strict_types=1);

namespace App\Actions\Management\Branches;

use App\Models\Branch;

final readonly class SaveBranch
{
    /**
     * @param  array{tenant_id: string, name: string, code: string, country_code: string, default_currency_code: string, status: string}  $data
     */
    public function handle(array $data, ?Branch $branch = null): Branch
    {
        $attributes = [
            'tenant_id' => $data['tenant_id'],
            'name' => $data['name'],
            'code' => mb_strtoupper($data['code']),
            'country_code' => mb_strtoupper($data['country_code']),
            'default_currency_code' => mb_strtoupper($data['default_currency_code']),
            'status' => $data['status'],
        ];

        if ($branch instanceof Branch) {
            $branch->update($attributes);

            return $branch;
        }

        return Branch::query()->create($attributes);
    }
}
