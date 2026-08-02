import { Head, Link } from '@inertiajs/react';
import { Building2, GitBranch, ShieldCheck, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manager', href: '/dashboard' },
];

const cards = [
    {
        title: 'Tenants',
        description: 'Create and manage ERP customer companies.',
        href: '/management/tenants',
        icon: Building2,
    },
    {
        title: 'Branches',
        description: 'Create and manage tenant offices consumed by PointERP.',
        href: '/management/branches',
        icon: GitBranch,
    },
    {
        title: 'Users',
        description: 'Support-team user management will be added next.',
        href: '#',
        icon: Users,
    },
    {
        title: 'Roles',
        description: 'Support-team role management will be added next.',
        href: '#',
        icon: ShieldCheck,
    },
] as const;

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Manager
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Support-team setup for tenants and branches used by
                        PointERP.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <ManagerCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}

function ManagerCard({
    title,
    description,
    href,
    icon: Icon,
}: {
    title: string;
    description: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
}) {
    const disabled = href === '#';

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-3">
                    <CardTitle>{title}</CardTitle>
                    <Icon className="size-5 text-muted-foreground" />
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant={disabled ? 'secondary' : 'default'} disabled={disabled} asChild={!disabled}>
                    {disabled ? <span>Next</span> : <Link href={href}>Open</Link>}
                </Button>
            </CardContent>
        </Card>
    );
}
