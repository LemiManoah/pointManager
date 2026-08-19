<?php

declare(strict_types=1);

namespace App\Actions\Management\Countries;

use App\Models\Country;

final readonly class SaveCountry
{
    /**
     * @param  array{code: string, name: string, iso3_code: string, default_currency_code: string, is_active: bool}  $data
     */
    public function handle(array $data, ?Country $country = null): Country
    {
        if ($country instanceof Country) {
            $country->update([
                'name' => $data['name'],
                'iso3_code' => mb_strtoupper($data['iso3_code']),
                'default_currency_code' => mb_strtoupper($data['default_currency_code']),
                'is_active' => $data['is_active'],
            ]);

            return $country;
        }

        return Country::query()->create([
            'code' => mb_strtoupper($data['code']),
            'name' => $data['name'],
            'iso3_code' => mb_strtoupper($data['iso3_code']),
            'default_currency_code' => mb_strtoupper($data['default_currency_code']),
            'is_active' => $data['is_active'],
        ]);
    }
}
