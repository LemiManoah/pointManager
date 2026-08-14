<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read string $id
 * @property-read string $name
 * @property-read string $code
 * @property-read string $default_currency_code
 * @property-read bool $is_multibranch
 * @property-read bool $multi_currency_enabled
 * @property-read string $timezone
 * @property-read string $status
 */
#[Fillable(['name', 'code', 'default_currency_code', 'is_multibranch', 'multi_currency_enabled', 'timezone', 'status'])]
final class Tenant extends Model
{
    use HasUuids;
    use SoftDeletes;

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'id' => 'string',
            'is_multibranch' => 'boolean',
            'multi_currency_enabled' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<Branch, $this>
     */
    public function branches(): HasMany
    {
        return $this->hasMany(Branch::class);
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
