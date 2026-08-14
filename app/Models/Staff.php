<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'tenant_id',
    'branch_id',
    'staff_position_id',
    'staff_number',
    'name',
    'email',
    'phone',
    'status',
])]
#[Table(name: 'staff')]
final class Staff extends Model
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
            'tenant_id' => 'string',
            'branch_id' => 'string',
            'staff_position_id' => 'string',
            'deleted_at' => 'datetime',
        ];
    }
}
