<?php

declare(strict_types=1);

namespace App\Actions\Management\Branches;

use App\Models\Branch;
use Illuminate\Validation\ValidationException;

final readonly class ToggleBranchStatus
{
    public function handle(Branch $branch): Branch
    {
        if ($branch->status !== 'active' && $branch->tenant?->is_multibranch === false) {
            $hasOtherActiveBranch = Branch::query()
                ->where('tenant_id', $branch->tenant_id)
                ->where('status', 'active')
                ->whereKeyNot($branch->id)
                ->exists();

            if ($hasOtherActiveBranch) {
                throw ValidationException::withMessages([
                    'branch' => 'This tenant is configured as single-branch and already has an active branch.',
                ]);
            }
        }

        $branch->update([
            'status' => $branch->status === 'active' ? 'inactive' : 'active',
        ]);

        return $branch;
    }
}
