<?php

declare(strict_types=1);

namespace App\Http\Controllers\Management;

use App\Actions\Management\Countries\SaveCountry;
use App\Actions\Management\Countries\ToggleCountryStatus;
use App\Http\Requests\Management\Countries\StoreCountryRequest;
use App\Http\Requests\Management\Countries\UpdateCountryRequest;
use App\Models\Country;
use App\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class CountryController
{
    public function index(): Response
    {
        return Inertia::render('management/countries/index', [
            'countries' => Country::query()
                ->with('defaultCurrency')
                ->orderBy('name')
                ->get()
                ->map(fn (Country $country): array => [
                    'code' => $country->code,
                    'name' => $country->name,
                    'iso3_code' => $country->iso3_code,
                    'default_currency_code' => $country->default_currency_code,
                    'default_currency_name' => $country->defaultCurrency->name,
                    'is_active' => $country->is_active,
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

    public function store(StoreCountryRequest $request, SaveCountry $action): RedirectResponse
    {
        /** @var array{code: string, name: string, iso3_code: string, default_currency_code: string, is_active: bool} $data */
        $data = $request->validated();

        $action->handle($data);

        return to_route('management.countries.index');
    }

    public function update(UpdateCountryRequest $request, Country $country, SaveCountry $action): RedirectResponse
    {
        /** @var array{name: string, iso3_code: string, default_currency_code: string, is_active: bool} $data */
        $data = $request->validated();

        $action->handle([...$data, 'code' => $country->code], $country);

        return to_route('management.countries.index');
    }

    public function destroy(Country $country, ToggleCountryStatus $action): RedirectResponse
    {
        $action->handle($country);

        return back();
    }
}
