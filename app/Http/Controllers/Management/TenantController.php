<?php

declare(strict_types=1);

namespace App\Http\Controllers\Management;

use App\Actions\Management\Tenants\SaveTenant;
use App\Actions\Management\Tenants\ToggleTenantStatus;
use App\Http\Requests\Management\Tenants\StoreTenantRequest;
use App\Http\Requests\Management\Tenants\UpdateTenantRequest;
use App\Models\Branch;
use App\Models\Currency;
use App\Models\Country;
use App\Models\Role;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class TenantController
{
    public function logo(Tenant $tenant): StreamedResponse
    {
        abort_unless($tenant->status === 'active' && $tenant->logo_path && Storage::disk('local')->exists($tenant->logo_path), 404);

        return Storage::disk('local')->response($tenant->logo_path, null, [
            'Cache-Control' => 'no-cache',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
    public function index(): Response
    {
        abort_unless(auth()->user()?->is_support === true, 403);
        return Inertia::render('management/tenants/index', [
            'tenants' => Tenant::query()
                ->withCount('branches')
                ->withCount(['users as client_users_count' => fn ($query) => $query->where('is_support', false)])
                ->orderBy('name')
                ->get()
                ->map(fn (Tenant $tenant): array => [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'logo_url' => $tenant->logo_url,
                    'code' => $tenant->code,
                    'default_currency_code' => $tenant->default_currency_code,
                    'is_multibranch' => $tenant->is_multibranch,
                    'multi_currency_enabled' => $tenant->multi_currency_enabled,
                    'multi_store_enabled' => $tenant->multi_store_enabled,
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
            'countries' => Country::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['code', 'name'])
                ->map(fn (Country $country): array => ['code' => $country->code, 'name' => $country->name]),
            'roles' => Role::query()
                ->where('guard_name', 'web')
                ->orderBy('name')
                ->pluck('name')
                ->values(),
        ]);
    }

    public function store(StoreTenantRequest $request, SaveTenant $action): RedirectResponse
    {
        /** @var array{name: string, code: string, default_currency_code: string, initial_branch_name: string, initial_branch_code: string, initial_branch_country_code: string, is_multibranch: bool, multi_currency_enabled: bool, multi_store_enabled: bool, timezone: string, status: string} $data */
        $data = $request->validated();

        $action->handle($data);

        return to_route('management.tenants.index');
    }

    public function update(UpdateTenantRequest $request, Tenant $tenant, SaveTenant $action): RedirectResponse
    {
        /** @var array{name: string, code: string, default_currency_code: string, is_multibranch: bool, multi_currency_enabled: bool, multi_store_enabled: bool, timezone: string, status: string} $data */
        $data = $request->validated();

        $action->handle($data, $tenant);

        return to_route('management.tenants.index');
    }

    public function destroy(Tenant $tenant, ToggleTenantStatus $action): RedirectResponse
    {
        abort_unless(auth()->user()?->is_support === true, 403);
        try {
            $action->handle($tenant);
        } catch (ValidationException $validationException) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $validationException->errors()['tenant'][0] ?? $validationException->getMessage(),
            ]);

            return back();
        }

        return back();
    }
}
