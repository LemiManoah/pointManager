<?php

declare(strict_types=1);

namespace App\Http\Controllers\Management;

use App\Actions\Management\Branches\SaveBranch;
use App\Actions\Management\Branches\ToggleBranchStatus;
use App\Http\Requests\Management\Branches\StoreBranchRequest;
use App\Http\Requests\Management\Branches\UpdateBranchRequest;
use App\Models\Branch;
use App\Models\Country;
use App\Models\Currency;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class BranchController
{
    public function index(): Response
    {
        return Inertia::render('management/branches/index', [
            'branches' => Branch::query()
                ->with('tenant')
                ->orderBy('name')
                ->get()
                ->map(fn (Branch $branch): array => [
                    'id' => $branch->id,
                    'tenant_id' => $branch->tenant_id,
                    'tenant_name' => $branch->tenant?->name,
                    'name' => $branch->name,
                    'code' => $branch->code,
                    'country_code' => $branch->country_code,
                    'default_currency_code' => $branch->default_currency_code,
                    'status' => $branch->status,
                ]),
            'tenants' => Tenant::query()
                ->where('status', 'active')
                ->orderBy('name')
                ->get(['id', 'name', 'code'])
                ->map(fn (Tenant $tenant): array => [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'code' => $tenant->code,
                ]),
            'countries' => Country::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['code', 'name'])
                ->map(fn (Country $country): array => [
                    'code' => $country->code,
                    'name' => $country->name,
                ]),
            'currencies' => Currency::query()
                ->where('is_active', true)
                ->orderBy('code')
                ->get(['code', 'name'])
                ->map(fn (Currency $currency): array => [
                    'code' => $currency->code,
                    'name' => $currency->name,
                ]),
        ]);
    }

    public function store(StoreBranchRequest $request, SaveBranch $action): RedirectResponse
    {
        /** @var array{tenant_id: string, name: string, code: string, country_code: string, default_currency_code: string, status: string} $data */
        $data = $request->validated();

        $action->handle($data);

        return to_route('management.branches.index');
    }

    public function update(UpdateBranchRequest $request, Branch $branch, SaveBranch $action): RedirectResponse
    {
        /** @var array{tenant_id: string, name: string, code: string, country_code: string, default_currency_code: string, status: string} $data */
        $data = $request->validated();

        $action->handle($data, $branch);

        return to_route('management.branches.index');
    }

    public function destroy(Branch $branch, ToggleBranchStatus $action): RedirectResponse
    {
        $action->handle($branch);

        return back();
    }
}
