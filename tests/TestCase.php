<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function createApplication(): Application
    {
        $app = parent::createApplication();

        // Shared ERP tables are fixtures for Manager tests, not Manager migrations.
        $app['migrator']->path(__DIR__.'/Fixtures/migrations');

        return $app;
    }
}
