<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutIncrementing;
use Illuminate\Database\Eloquent\Model;

#[WithoutIncrementing]
#[Fillable(['code', 'name', 'iso3_code', 'default_currency_code', 'is_active'])]
final class Country extends Model
{
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
}
