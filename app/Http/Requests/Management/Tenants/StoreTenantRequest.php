<?php

declare(strict_types=1);

namespace App\Http\Requests\Management\Tenants;

use App\Models\Currency;
use App\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:160'],
            'code' => ['required', 'string', 'max:40', Rule::unique((new Tenant)->getTable(), 'code')],
            'default_currency_code' => ['required', 'string', 'size:3', Rule::exists((new Currency)->getTable(), 'code')->where('is_active', true)],
            'is_multibranch' => ['required', 'boolean'],
            'multi_currency_enabled' => ['required', 'boolean'],
            'timezone' => ['required', 'string', 'max:80'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => mb_strtoupper((string) $this->input('code')),
            'default_currency_code' => mb_strtoupper((string) $this->input('default_currency_code')),
            'is_multibranch' => $this->boolean('is_multibranch'),
            'multi_currency_enabled' => $this->boolean('multi_currency_enabled'),
        ]);
    }
}
