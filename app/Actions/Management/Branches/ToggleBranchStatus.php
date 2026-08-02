<?php

declare(strict_types=1);

namespace App\Actions\Management\Branches;

use App\Models\Branch;

final readonly class ToggleBranchStatus
{
    public function handle(Branch $branch): Branch
    {
        $branch->update([
            'status' => $branch->status === 'active' ? 'inactive' : 'active',
        ]);

        return $branch;
    }
}
