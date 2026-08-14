<?php

declare(strict_types=1);

namespace App\Http\Requests\Management\Tenants;

use App\Models\Branch;
use App\Models\Role;
use App\Models\Staff;
use App\Models\Tenant;
use App\Models\User;
use App\Rules\ValidEmail;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreTenantAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->is_support === true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Tenant $tenant */
        $tenant = $this->route('tenant');

        return [
            'branch_id' => [
                'required',
                'uuid',
                Rule::exists((new Branch)->getTable(), 'id')
                    ->where('tenant_id', $tenant->id)
                    ->where('status', 'active'),
            ],
            'staff_number' => [
                'required',
                'string',
                'max:60',
                Rule::unique((new Staff)->getTable(), 'staff_number')
                    ->where('tenant_id', $tenant->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                new ValidEmail,
                Rule::unique((new Staff)->getTable(), 'email'),
                Rule::unique((new User)->getTable(), 'email'),
            ],
            'phone' => ['nullable', 'string', 'max:60'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
            'role' => [
                'required',
                'string',
                Rule::exists((new Role)->getTable(), 'name')->where('guard_name', 'web'),
            ],
            'is_director' => ['boolean'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'staff_number' => mb_strtoupper((string) $this->input('staff_number')),
            'is_director' => $this->boolean('is_director'),
        ]);
    }
}
