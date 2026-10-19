<?php

declare(strict_types=1);

use App\Actions\Management\Branches\SaveBranch;
use App\Models\Tenant;
use Database\Seeders\ManagementReferenceSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

it('creates a main store with a new branch even when multi-store is disabled', function (): void {
    $this->seed(ManagementReferenceSeeder::class);
    $tenant = Tenant::query()->create([
        'name' => 'Test client',
        'code' => 'TEST-CLIENT',
        'default_currency_code' => 'UGX',
        'is_multibranch' => false,
        'multi_currency_enabled' => false,
        'multi_store_enabled' => false,
        'timezone' => 'Africa/Kampala',
        'status' => 'active',
    ]);
    Schema::create('inventory_stores', function (Blueprint $table): void {
        $table->uuid('id')->primary();
        $table->uuid('tenant_id');
        $table->uuid('branch_id');
        $table->string('code');
        $table->string('name');
        $table->string('type');
        $table->boolean('is_default_for_site');
        $table->boolean('is_active');
        $table->timestamps();
    });

    $branch = resolve(SaveBranch::class)->handle([
        'tenant_id' => $tenant->id,
        'name' => 'Kampala Head Office',
        'code' => 'KLA-HQ',
        'country_code' => 'UG',
        'default_currency_code' => 'UGX',
        'status' => 'active',
    ]);

    expect(DB::table('inventory_stores')->where('branch_id', $branch->id)->first())
        ->code->toBe('KLA-HQ-MAIN')
        ->type->toBe('depot')
        ->is_active->toBe(1);
});
