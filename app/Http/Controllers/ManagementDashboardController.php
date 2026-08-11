<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Country;
use App\Models\Currency;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

final class ManagementDashboardController
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'metrics' => [
                'tenants' => Tenant::query()->count(),
                'activeTenants' => Tenant::query()->where('status', 'active')->count(),
                'branches' => Branch::query()->count(),
                'activeBranches' => Branch::query()->where('status', 'active')->count(),
                'countries' => Country::query()->where('is_active', true)->count(),
                'currencies' => Currency::query()->where('is_active', true)->count(),
                'supportUsers' => User::query()->where('is_support', true)->where('is_active', true)->count(),
            ],
        ]);
    }
}
