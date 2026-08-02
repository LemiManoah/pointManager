import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { TenantDialog, type Tenant } from '../partials/tenant-dialog';

type CurrencyOption = {
    code: string;
    name: string;
};

type Props = {
    tenants: Tenant[];
    currencies: CurrencyOption[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tenants', href: '/management/tenants' },
];

export default function TenantsIndex({ tenants, currencies }: Props) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('active');
    const debouncedSearch = useDebouncedValue(search);

    const filteredTenants = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();

        return tenants.filter((tenant) => {
            const matchesStatus = tenant.status === status;
            const matchesSearch =
                !term ||
                [tenant.name, tenant.code, tenant.default_currency_code]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [debouncedSearch, status, tenants]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tenants" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="grid gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Tenants
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Support-team management for ERP customer
                                companies.
                            </p>
                        </div>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search tenants"
                                className="w-full pl-9 sm:w-72"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:ml-auto lg:items-end">
                        <Tabs value={status} onValueChange={setStatus}>
                            <TabsList>
                                <TabsTrigger value="active">Active</TabsTrigger>
                                <TabsTrigger value="inactive">
                                    Inactive
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <TenantDialog currencies={currencies} />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer tenants</CardTitle>
                        <CardDescription>
                            Tenant records created here are consumed by
                            PointERP.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="py-3 pr-4 font-medium">
                                            Tenant
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Currency
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Branches
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Status
                                        </th>
                                        <th className="py-3 text-right font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTenants.map((tenant) => (
                                        <tr
                                            key={tenant.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 pr-4">
                                                <div className="font-medium">
                                                    {tenant.name}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {tenant.code}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4">
                                                {tenant.default_currency_code}
                                            </td>
                                            <td className="py-3 pr-4">
                                                {tenant.branches_count}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Badge
                                                    variant={
                                                        tenant.status ===
                                                        'active'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {tenant.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex justify-end gap-2">
                                                    <TenantDialog
                                                        tenant={tenant}
                                                        currencies={currencies}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            tenant.status ===
                                                            'active'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                        }
                                                        onClick={() =>
                                                            router.delete(
                                                                `/management/tenants/${tenant.id}`,
                                                                {
                                                                    preserveScroll:
                                                                        true,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        {tenant.status ===
                                                        'active'
                                                            ? 'Deactivate'
                                                            : 'Activate'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredTenants.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                No tenants match the current
                                                filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
