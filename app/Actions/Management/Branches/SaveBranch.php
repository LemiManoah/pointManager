<?php

declare(strict_types=1);

namespace App\Actions\Management\Branches;

use App\Models\Branch;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

final readonly class SaveBranch
{
    /**
     * @param  array{tenant_id: string, name: string, code: string, country_code: string, default_currency_code: string, status: string}  $data
     */
    public function handle(array $data, ?Branch $branch = null): Branch
    {
        $attributes = [
            'tenant_id' => $data['tenant_id'],
            'name' => $data['name'],
            'code' => mb_strtoupper($data['code']),
            'country_code' => mb_strtoupper($data['country_code']),
            'default_currency_code' => mb_strtoupper($data['default_currency_code']),
            'status' => $data['status'],
        ];

        if ($branch instanceof Branch) {
            $branch->update($attributes);

            return $branch;
        }

        return DB::transaction(function () use ($attributes): Branch {
            $created = Branch::query()->create($attributes);

            if (Schema::hasTable('inventory_stores')) {
                DB::table('inventory_stores')->insert([
                    'id' => (string) Str::uuid(),
                    'tenant_id' => $created->tenant_id,
                    'branch_id' => $created->id,
                    'code' => $created->code.'-MAIN',
                    'name' => $created->name.' Main Store',
                    'type' => 'depot',
                    'is_default_for_site' => false,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return $created;
        });
    }
}
