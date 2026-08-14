<?php

declare(strict_types=1);

namespace App\Http\Controllers\Management;

use App\Actions\Management\Tenants\SaveTenant;
use App\Actions\Management\Tenants\ToggleTenantStatus;
use App\Http\Requests\Management\Tenants\StoreTenantRequest;
use App\Http\Requests\Management\Tenants\UpdateTenantRequest;
use App\Models\Branch;
use App\Models\Currency;
use App\Models\Role;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class TenantController
{
    public function index(): Response
    {
        return Inertia::render('management/tenants/index', [
            'tenants' => Tenant::query()
                ->withCount('branches')
                ->withCount(['users as client_users_count' => fn ($query) => $query->where('is_support', false)])
                ->orderBy('name')
                ->get()
                ->map(fn (Tenant $tenant): array => [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'code' => $tenant->code,
                    'default_currency_code' => $tenant->default_currency_code,
                    'is_multibranch' => $tenant->is_multibranch,
                    'multi_currency_enabled' => $tenant->multi_currency_enabled,
                    'timezone' => $tenant->timezone,
                    'status' => $tenant->status,
                    'branches_count' => (int) $tenant->getAttribute('branches_count'),
                    'client_users_count' => (int) $tenant->getAttribute('client_users_count'),
                ]),
            'branches' => Branch::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'tenant_id', 'name', 'code'])
                ->map(fn (Branch $branch): array => [
                    'id' => $branch->id,
                    'tenant_id' => $branch->tenant_id,
                    'name' => $branch->name,
                    'code' => $branch->code,
                ]),
            'currencies' => Currency::query()
                ->where('is_active', true)
                ->orderBy('code')
                ->get(['code', 'name'])
                ->map(fn (Currency $currency): array => [
                    'code' => $currency->code,
                    'name' => $currency->name,
                ]),
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->pluck('name')
                ->values(),
        ]);
    }

    public function store(StoreTenantRequest $request, SaveTenant $action): RedirectResponse
    {
        /** @var array{name: string, code: string, default_currency_code: string, is_multibranch: bool, multi_currency_enabled: bool, timezone: string, status: string} $data */
        $data = $request->validated();

        $action->handle($data);

        return to_route('management.tenants.index');
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant, SaveTenant $action): RedirectResponse
    {
        /** @var array{name: string, code: string, default_currency_code: string, is_multibranch: bool, multi_currency_enabled: bool, timezone: string, status: string} $data */
        $data = $request->validated();

        $action->handle($data, $tenant);

        return to_route('management.tenants.index');
    }

    public function destroy(Tenant $tenant, ToggleTenantStatus $action): RedirectResponse
    {
        $action->handle($tenant);

        return back();
    }
}
