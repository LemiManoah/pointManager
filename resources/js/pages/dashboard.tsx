import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    GitBranch,
    Globe2,
    LifeBuoy,
    ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatNumber } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type Props = {
    metrics: {
        tenants: number;
        activeTenants: number;
        branches: number;
        activeBranches: number;
        countries: number;
        currencies: number;
        supportUsers: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manager', href: '/dashboard' },
];

export default function Dashboard({ metrics }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Manager workspace
                    </h1>
                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                        Support-team setup for tenant companies and branches
                        before client teams start using PointERP.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <ManagerCard
                        title="Tenants"
                        value={metrics.activeTenants}
                        description={`${formatNumber(metrics.tenants)} total customer companies`}
                        href="/management/tenants"
                        icon={Building2}
                    />
                    <ManagerCard
                        title="Branches"
                        value={metrics.activeBranches}
                        description={`${formatNumber(metrics.branches)} total tenant branches`}
                        href="/management/branches"
                        icon={GitBranch}
                    />
                    <ManagerCard
                        title="Reference data"
                        value={metrics.countries + metrics.currencies}
                        description={`${formatNumber(metrics.countries)} countries, ${formatNumber(metrics.currencies)} currencies`}
                        href="/management/tenants"
                        icon={Globe2}
                    />
                    <ManagerCard
                        title="Support users"
                        value={metrics.supportUsers}
                        description="Manager app access is restricted to support users"
                        href="#"
                        icon={LifeBuoy}
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client onboarding flow</CardTitle>
                            <CardDescription>
                                What the support team should do before handing
                                over to the client ERP users.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm">
                            <ChecklistItem text="Create the tenant company with base currency and timezone." />
                            <ChecklistItem text="Create active branches for each office or project region." />
                            <ChecklistItem text="Confirm countries and currencies needed by the client exist." />
                            <ChecklistItem text="Hand over to ERP admin for staff, roles, users and project setup." />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Readiness</CardTitle>
                            <CardDescription>
                                Current support-app scope for onboarding.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 text-sm">
                            <ReadinessRow
                                label="Tenant CRUD"
                                status="Ready"
                            />
                            <ReadinessRow
                                label="Branch CRUD"
                                status="Ready"
                            />
                            <ReadinessRow
                                label="Support-only login"
                                status="Ready"
                            />
                            <ReadinessRow
                                label="Client staff and roles"
                                status="Handled in ERP"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function ManagerCard({
    title,
    value,
    description,
    href,
    icon: Icon,
}: {
    title: string;
    value: number;
    description: string;
    href: string;
    icon: LucideIcon;
}) {
    const disabled = href === '#';

    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <CardDescription>{title}</CardDescription>
                        <CardTitle className="mt-2 text-3xl">
                            {formatNumber(value)}
                        </CardTitle>
                    </div>
                    <Icon className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    variant={disabled ? 'secondary' : 'default'}
                    disabled={disabled}
                    asChild={!disabled}
                >
                    {disabled ? <span>Restricted</span> : <Link href={href}>Open</Link>}
                </Button>
            </CardContent>
        </Card>
    );
}

function ChecklistItem({ text }: { text: string }) {
    return (
        <div className="flex gap-2 rounded-md border px-3 py-2">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-600" />
            <span>{text}</span>
        </div>
    );
}

function ReadinessRow({ label, status }: { label: string; status: string }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
            <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span>{label}</span>
            </div>
            <span className="font-medium">{status}</span>
        </div>
    );
}
