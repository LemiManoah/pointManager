<?php

declare(strict_types=1);

namespace App\Actions\Management\Tenants;

use App\Actions\Management\Branches\SaveBranch;
use App\Models\Tenant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

final readonly class SaveTenant
{
    public function __construct(private SaveBranch $saveBranch) {}

    /**
     * @param  array{name: string, code: string, default_currency_code: string, is_multibranch: bool, multi_currency_enabled: bool, multi_store_enabled: bool, timezone: string, status: string, initial_branch_name?: string, initial_branch_code?: string, initial_branch_country_code?: string, logo?: UploadedFile|null, remove_logo?: bool}  $data
     */
    public function handle(array $data, ?Tenant $tenant = null): Tenant
    {
        if ($tenant instanceof Tenant && ! $data['multi_store_enabled'] && Schema::hasTable('inventory_stores')) {
            $branchWithMultipleStores = DB::table('inventory_stores')
                ->where('tenant_id', $tenant->id)
                ->where('is_active', true)
                ->whereNull('deleted_at')
                ->groupBy('branch_id')
                ->havingRaw('COUNT(*) > 1')
                ->exists();

            if ($branchWithMultipleStores) {
                throw ValidationException::withMessages([
                    'multi_store_enabled' => 'Keep only one active store in each branch before turning off multi-store.',
                ]);
            }
        }

        $attributes = [
            'name' => $data['name'],
            'code' => mb_strtoupper($data['code']),
            'default_currency_code' => mb_strtoupper($data['default_currency_code']),
            'is_multibranch' => $data['is_multibranch'],
            'multi_currency_enabled' => $data['multi_currency_enabled'],
            'multi_store_enabled' => $data['multi_store_enabled'],
            'timezone' => $data['timezone'],
            'status' => $data['status'],
        ];

        $oldPath = $tenant?->logo_path;
        $newPath = null;
        try {
            $saved = DB::transaction(function () use ($tenant, $attributes, $data, &$newPath): Tenant {
                $saved = $tenant ?? new Tenant;
                $saved->fill($attributes)->save();
                if (! $tenant instanceof Tenant) {
                    $this->saveBranch->handle([
                        'tenant_id' => $saved->id,
                        'name' => $data['initial_branch_name'],
                        'code' => $data['initial_branch_code'],
                        'country_code' => $data['initial_branch_country_code'],
                        'default_currency_code' => $saved->default_currency_code,
                        'status' => 'active',
                    ]);
                }
                if (($data['logo'] ?? null) instanceof UploadedFile) {
                    $newPath = $data['logo']->store('tenant-logos/'.$saved->id, 'local');
                    if ($newPath === false) {
                        throw ValidationException::withMessages(['logo' => 'The logo could not be stored. Please try again.']);
                    }
                    $saved->update([
                        'logo_path' => $newPath,
                        'logo_url' => route('tenant-logo', ['tenant' => $saved->id, 'v' => hash('sha256', $newPath)]),
                    ]);
                } elseif ($data['remove_logo'] ?? false) {
                    $saved->update(['logo_path' => null, 'logo_url' => null]);
                }

                return $saved;
            });
        } catch (\Throwable $exception) {
            if (is_string($newPath)) {
                Storage::disk('local')->delete($newPath);
            }
            throw $exception;
        }
        if ($oldPath && $oldPath !== $saved->logo_path) {
            DB::afterCommit(fn () => Storage::disk('local')->delete($oldPath));
        }

        return $saved;
    }
}
