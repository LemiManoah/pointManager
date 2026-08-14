<?php

declare(strict_types=1);

namespace App\Http\Controllers\Management;

use App\Http\Requests\Management\Tenants\StoreTenantAdminRequest;
use App\Models\Staff;
use App\Models\StaffPosition;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

final class TenantAdminController
{
    public function store(StoreTenantAdminRequest $request, Tenant $tenant): RedirectResponse
    {
        /** @var array{branch_id: string, staff_number: string, name: string, email: string, phone?: string|null, password: string, role: string, is_director?: bool} $data */
        $data = $request->validated();

        DB::transaction(function () use ($data, $tenant): void {
            $position = StaffPosition::query()->firstOrCreate(
                [
                    'tenant_id' => $tenant->id,
                    'code' => 'ADMINISTRATOR',
                ],
                [
                    'name' => 'Administrator',
                    'is_active' => true,
                ],
            );

            $staff = Staff::query()->create([
                'tenant_id' => $tenant->id,
                'branch_id' => $data['branch_id'],
                'staff_position_id' => $position->id,
                'staff_number' => $data['staff_number'],
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'status' => 'active',
            ]);

            $user = $this->createUser($tenant, $staff, $data);

            $user->syncRoles([$data['role']]);
            $user->branches()->sync([
                $data['branch_id'] => ['is_default' => true],
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Tenant admin user created.',
        ]);

        return back();
    }

    /**
     * @param  array{branch_id: string, staff_number: string, name: string, email: string, password: string, role: string, is_director?: bool}  $data
     */
    private function createUser(Tenant $tenant, Staff $staff, #[\SensitiveParameter] array $data): User
    {
        return User::query()->create([
            'tenant_id' => $tenant->id,
            'staff_id' => $staff->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'email_verified_at' => now(),
            'password' => $data['password'],
            'is_active' => true,
            'is_director' => (bool) ($data['is_director'] ?? true),
            'is_support' => false,
        ]);
    }
}
