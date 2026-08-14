<?php

declare(strict_types=1);

namespace App\Http\Requests\Management\Branches;

use App\Models\Branch;
use App\Models\Country;
use App\Models\Currency;
use App\Models\Tenant;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

final class UpdateBranchRequest extends FormRequest
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
        /** @var Branch $branch */
        $branch = $this->route('branch');

        return [
            'tenant_id' => ['required', 'uuid', Rule::exists((new Tenant)->getTable(), 'id')->where('status', 'active')],
            'name' => ['required', 'string', 'max:160'],
            'code' => ['required', 'string', 'max:40', Rule::unique((new Branch)->getTable(), 'code')->where('tenant_id', $this->input('tenant_id'))->ignore($branch)],
            'country_code' => ['required', 'string', 'size:2', Rule::exists((new Country)->getTable(), 'code')->where('is_active', true)],
            'default_currency_code' => ['required', 'string', 'size:3', Rule::exists((new Currency)->getTable(), 'code')->where('is_active', true)],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => mb_strtoupper((string) $this->input('code')),
            'country_code' => mb_strtoupper((string) $this->input('country_code')),
            'default_currency_code' => mb_strtoupper((string) $this->input('default_currency_code')),
        ]);
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var Branch $branch */
                $branch = $this->route('branch');
                /** @var Tenant|null $tenant */
                $tenant = Tenant::query()->find($this->input('tenant_id'));

                if (! $tenant instanceof Tenant || $tenant->is_multibranch) {
                    return;
                }

                $hasOtherBranch = Branch::query()
                    ->where('tenant_id', $tenant->id)
                    ->whereKeyNot($branch->id)
                    ->exists();

                if ($hasOtherBranch) {
                    $validator->errors()->add('tenant_id', 'This tenant is configured as single-branch and already has another branch.');
                }
            },
        ];
    }
}
