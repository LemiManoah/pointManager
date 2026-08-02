<?php

declare(strict_types=1);

namespace App\Actions\Management\Tenants;

use App\Models\Tenant;

final readonly class ToggleTenantStatus
{
    public function handle(Tenant $tenant): Tenant
    {
        $tenant->update([
            'status' => $tenant->status === 'active' ? 'inactive' : 'active',
        ]);

        return $tenant;
    }
}
