<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Currency;
use Illuminate\Database\Seeder;

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
    }
}
