<?php

declare(strict_types=1);

use App\Models\Currency;
use App\Models\Country;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->withoutVite();
    Storage::fake('local');
    Currency::query()->create(['code' => 'UGX', 'name' => 'Ugandan Shilling', 'symbol' => 'UGX', 'decimal_places' => 0, 'is_active' => true]);
    Country::query()->create(['code' => 'UG', 'name' => 'Uganda', 'iso3_code' => 'UGA', 'default_currency_code' => 'UGX', 'is_active' => true]);
    $this->actingAs(User::factory()->withoutTwoFactor()->create(['is_support' => true]));
    $this->payload = ['name' => 'Logo company', 'code' => 'LOGO', 'default_currency_code' => 'UGX',
        'initial_branch_name' => 'Kampala Head Office', 'initial_branch_code' => 'KLA-HQ', 'initial_branch_country_code' => 'UG',
        'is_multibranch' => false, 'multi_currency_enabled' => false, 'multi_store_enabled' => false,
        'timezone' => 'Africa/Kampala', 'status' => 'active'];
});

it('uploads, preserves, replaces and removes a tenant logo through multipart requests', function (): void {
    $this->post(route('management.tenants.store'), [...$this->payload, 'logo' => UploadedFile::fake()->image('logo.png')])
        ->assertSessionHasNoErrors()->assertRedirect(route('management.tenants.index'));
    $tenant = Tenant::query()->where('code', 'LOGO')->firstOrFail();
    expect($tenant->branches()->where('code', 'KLA-HQ')->exists())->toBeTrue();
    $firstPath = $tenant->logo_path;
    Storage::disk('local')->assertExists($firstPath);
    expect($tenant->logo_url)->toStartWith(route('tenant-logo', $tenant));
    $this->get(route('tenant-logo', $tenant))->assertOk()->assertHeader('Content-Type', 'image/png');

    $url = route('management.tenants.update', $tenant);
    $this->post($url, [...$this->payload, '_method' => 'put'])->assertSessionHasNoErrors();
    expect($tenant->fresh()->logo_path)->toBe($firstPath);
    $this->post($url, [...$this->payload, '_method' => 'put', 'logo' => UploadedFile::fake()->image('replacement.png')])
        ->assertSessionHasNoErrors();
    $tenant->refresh();
    expect($tenant->logo_path)->not->toBe($firstPath);
    Storage::disk('local')->assertExists($tenant->logo_path);
    $this->post($url, [...$this->payload, '_method' => 'put', 'remove_logo' => true])->assertSessionHasNoErrors();
    expect($tenant->fresh()->logo_url)->toBeNull()->and($tenant->fresh()->logo_path)->toBeNull();
    $this->get(route('tenant-logo', $tenant))->assertNotFound();
});

it('rejects unsafe uploads and non-support tenant changes', function (): void {
    $this->post(route('management.tenants.store'), [...$this->payload,
        'logo' => UploadedFile::fake()->create('logo.svg', 10, 'image/svg+xml')])->assertSessionHasErrors('logo');
    $this->actingAs(User::factory()->withoutTwoFactor()->create(['is_support' => false]))
        ->post(route('management.tenants.store'), $this->payload)->assertForbidden();
    expect(Tenant::query()->count())->toBe(0);
});

it('serves public branding only for an active tenant', function (): void {
    $this->post(route('management.tenants.store'), [...$this->payload, 'logo' => UploadedFile::fake()->image('logo.png')])
        ->assertSessionHasNoErrors();
    $tenant = Tenant::query()->where('code', 'LOGO')->firstOrFail();
    auth()->logout();
    $this->get(route('tenant-logo', $tenant))->assertOk();
    $tenant->update(['status' => 'inactive']);
    $this->get(route('tenant-logo', $tenant))->assertNotFound();
});
