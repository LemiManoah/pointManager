<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutIncrementing;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read string $code
 * @property-read string $name
 * @property-read string $iso3_code
 * @property-read string $default_currency_code
 * @property-read bool $is_active
 * @property-read Currency $defaultCurrency
 */
#[WithoutIncrementing]
#[Fillable(['code', 'name', 'iso3_code', 'default_currency_code', 'is_active'])]
final class Country extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'code' => 'string',
            'name' => 'string',
            'iso3_code' => 'string',
            'default_currency_code' => 'string',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Currency, $this>
     */
    public function defaultCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'default_currency_code', 'code');
    }
}
