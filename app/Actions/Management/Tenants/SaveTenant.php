<?php

declare(strict_types=1);

namespace App\Actions\Management\Tenants;

use App\Models\Tenant;

final readonly class SaveTenant
{
    /**
     * @param  array{name: string, code: string, default_currency_code: string, is_multibranch: bool, multi_currency_enabled: bool, timezone: string, status: string}  $data
     */
    public function handle(array $data, ?Tenant $tenant = null): Tenant
    {
        $attributes = [
            'name' => $data['name'],
            'code' => mb_strtoupper($data['code']),
            'default_currency_code' => mb_strtoupper($data['default_currency_code']),
            'is_multibranch' => $data['is_multibranch'],
            'multi_currency_enabled' => $data['multi_currency_enabled'],
            'timezone' => $data['timezone'],
            'status' => $data['status'],
        ];

        if ($tenant instanceof Tenant) {
            $tenant->update($attributes);

            return $tenant;
        }

        return Tenant::query()->create($attributes);
    }
}
