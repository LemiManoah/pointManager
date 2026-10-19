<?php

declare(strict_types=1);

namespace App\Http\Requests\Management\Tenants;

use App\Models\Currency;
use App\Models\Country;
use App\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_support === true;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048', 'dimensions:max_width=3000,max_height=3000'],
            'remove_logo' => ['sometimes', 'boolean'],
            'name' => ['required', 'string', 'max:160'],
            'code' => ['required', 'string', 'max:40', Rule::unique((new Tenant)->getTable(), 'code')],
            'default_currency_code' => ['required', 'string', 'size:3', Rule::exists((new Currency)->getTable(), 'code')->where('is_active', true)],
            'initial_branch_name' => ['required', 'string', 'max:160'],
            'initial_branch_code' => ['required', 'string', 'max:40'],
            'initial_branch_country_code' => ['required', 'string', 'size:2', Rule::exists((new Country)->getTable(), 'code')->where('is_active', true)],
            'is_multibranch' => ['required', 'boolean'],
            'multi_currency_enabled' => ['required', 'boolean'],
            'multi_store_enabled' => ['required', 'boolean'],
            'timezone' => ['required', 'string', 'max:80'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'remove_logo' => $this->boolean('remove_logo'),
            'code' => mb_strtoupper((string) $this->input('code')),
            'default_currency_code' => mb_strtoupper((string) $this->input('default_currency_code')),
            'initial_branch_code' => mb_strtoupper((string) $this->input('initial_branch_code')),
            'initial_branch_country_code' => mb_strtoupper((string) $this->input('initial_branch_country_code')),
            'is_multibranch' => $this->boolean('is_multibranch'),
            'multi_currency_enabled' => $this->boolean('multi_currency_enabled'),
            'multi_store_enabled' => $this->boolean('multi_store_enabled'),
        ]);
    }
}
