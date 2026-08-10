<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Country;
use App\Models\Currency;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

final class ManagementReferenceSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['USD', 'United States Dollar', '$', 2],
            ['UGX', 'Ugandan Shilling', 'UGX', 0],
            ['SSP', 'South Sudanese Pound', 'SSP', 2],
            ['CDF', 'Congolese Franc', 'CDF', 2],
        ] as [$code, $name, $symbol, $decimalPlaces]) {
            Currency::query()->updateOrCreate(
                ['code' => $code],
                ['name' => $name, 'symbol' => $symbol, 'decimal_places' => $decimalPlaces, 'is_active' => true],
            );
        }

        foreach ([
            ['UG', 'Uganda', 'UGA', 'UGX'],
            ['SS', 'South Sudan', 'SSD', 'SSP'],
            ['CD', 'DRC', 'COD', 'CDF'],
        ] as [$code, $name, $iso3Code, $currencyCode]) {
            Country::query()->updateOrCreate(
                ['code' => $code],
                ['name' => $name, 'iso3_code' => $iso3Code, 'default_currency_code' => $currencyCode, 'is_active' => true],
            );
        }

        $tenant = Tenant::query()->updateOrCreate(
            ['code' => 'POINT'],
            [
                'name' => 'Point Investment Co. Ltd',
                'default_currency_code' => 'USD',
                'is_multibranch' => true,
                'multi_currency_enabled' => true,
                'timezone' => 'Africa/Kampala',
                'status' => 'active',
            ],
        );

        foreach ([
            ['KLA-HQ', 'Kampala Head Office', 'UG', 'UGX', 'active'],
            ['GUL-SITE', 'Gulu Project Office', 'UG', 'UGX', 'active'],
            ['JUB-HQ', 'Juba Office', 'SS', 'USD', 'active'],
            ['KIN-MOB', 'Kinshasa Mobilization Office', 'CD', 'CDF', 'inactive'],
        ] as [$code, $name, $countryCode, $currencyCode, $status]) {
            Branch::query()->updateOrCreate(
                ['tenant_id' => $tenant->id, 'code' => $code],
                [
                    'name' => $name,
                    'country_code' => $countryCode,
                    'default_currency_code' => $currencyCode,
                    'status' => $status,
                ],
            );
        }

        $supportUserAttributes = [
            'name' => 'Support Admin',
            'password' => 'password',
            'email_verified_at' => now(),
            'is_support' => true,
        ];

        if (Schema::hasColumn((new User)->getTable(), 'tenant_id')) {
            $supportUserAttributes['tenant_id'] = $tenant->id;
        }

        if (Schema::hasColumn((new User)->getTable(), 'is_active')) {
            $supportUserAttributes['is_active'] = true;
        }

        User::query()->updateOrCreate(
            ['email' => 'support@pointmanager.test'],
            $supportUserAttributes,
        );
    }
}
