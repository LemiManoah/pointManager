<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;

it('keeps shared ERP schema migrations out of the manager production path', function (): void {
    $names = [
        '2026_07_31_114931_create_permission_tables.php',
        '2026_07_31_115002_create_activity_log_table.php',
        '2026_08_02_000000_create_management_tables.php',
    ];

    foreach ($names as $name) {
        expect(file_exists(database_path('migrations/'.$name)))->toBeFalse();
        expect(file_exists(base_path('tests/Fixtures/migrations/'.$name)))->toBeTrue();
    }

    $permissionMigration = require base_path('tests/Fixtures/migrations/'.$names[0]);
    $activityMigration = require base_path('tests/Fixtures/migrations/'.$names[1]);
    $managementMigration = require base_path('tests/Fixtures/migrations/'.$names[2]);

    $permissionMigration->up();
    $activityMigration->up();
    $managementMigration->up();

    expect(Schema::hasTable('permissions'))->toBeTrue()
        ->and(Schema::hasColumn('model_has_roles', 'model_uuid'))->toBeTrue()
        ->and(Schema::hasTable('activity_log'))->toBeTrue()
        ->and(Schema::hasTable('tenants'))->toBeTrue();

    $permissionMigration->down();
    $activityMigration->down();
    $managementMigration->down();

    expect(Schema::hasTable('permissions'))->toBeTrue()
        ->and(Schema::hasTable('activity_log'))->toBeTrue()
        ->and(Schema::hasTable('tenants'))->toBeTrue();
});
