<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutIncrementing;
use Illuminate\Database\Eloquent\Model;

#[WithoutIncrementing]
#[Fillable(['code', 'name', 'symbol', 'decimal_places', 'is_active'])]
final class Currency extends Model
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
            'symbol' => 'string',
            'decimal_places' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
