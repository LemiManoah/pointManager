<?php

declare(strict_types=1);

namespace App\Actions\Management\Tenants;

use App\Models\Tenant;
use Illuminate\Validation\ValidationException;

final readonly class ToggleTenantStatus
{
    public function handle(Tenant $tenant): Tenant
    {
        if ($tenant->status === 'active' && ($tenant->branches()->exists() || $tenant->users()->exists())) {
            throw ValidationException::withMessages([
                'tenant' => 'This tenant is already in use and cannot be deactivated.',
            ]);
        }

        $tenant->update([
            'status' => $tenant->status === 'active' ? 'inactive' : 'active',
        ]);

        return $tenant;
    }
}
