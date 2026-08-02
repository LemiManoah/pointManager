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
import {
    BranchDialog,
    type Branch,
    type Option,
} from '../partials/branch-dialog';

type TenantOption = Required<Pick<Option, 'id' | 'code' | 'name'>>;

type Props = {
    branches: Branch[];
    tenants: TenantOption[];
    countries: Option[];
    currencies: Option[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Branches', href: '/management/branches' },
];

export default function BranchesIndex({
    branches,
    tenants,
    countries,
    currencies,
}: Props) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('active');
    const debouncedSearch = useDebouncedValue(search);

    const filteredBranches = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();

        return branches.filter((branch) => {
            const matchesStatus = branch.status === status;
            const matchesSearch =
                !term ||
                [
                    branch.name,
                    branch.code,
                    branch.tenant_name ?? '',
                    branch.country_code,
                    branch.default_currency_code,
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [branches, debouncedSearch, status]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Branches" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="grid gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Branches
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Support-team setup for tenant offices consumed
                                by PointERP.
                            </p>
                        </div>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search branches"
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
                        <BranchDialog
                            tenants={tenants}
                            countries={countries}
                            currencies={currencies}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tenant branches</CardTitle>
                        <CardDescription>
                            Deactivation removes branches from active ERP
                            selection without deleting history.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="py-3 pr-4 font-medium">
                                            Branch
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Tenant
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Country
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Base currency
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
                                    {filteredBranches.map((branch) => (
                                        <tr
                                            key={branch.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 pr-4">
                                                <div className="font-medium">
                                                    {branch.name}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {branch.code}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4">
                                                {branch.tenant_name ?? '-'}
                                            </td>
                                            <td className="py-3 pr-4">
                                                {branch.country_code}
                                            </td>
                                            <td className="py-3 pr-4">
                                                {branch.default_currency_code}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <Badge
                                                    variant={
                                                        branch.status ===
                                                        'active'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {branch.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex justify-end gap-2">
                                                    <BranchDialog
                                                        branch={branch}
                                                        tenants={tenants}
                                                        countries={countries}
                                                        currencies={currencies}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            branch.status ===
                                                            'active'
                                                                ? 'destructive'
                                                                : 'secondary'
                                                        }
                                                        onClick={() =>
                                                            router.delete(
                                                                `/management/branches/${branch.id}`,
                                                                {
                                                                    preserveScroll:
                                                                        true,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        {branch.status ===
                                                        'active'
                                                            ? 'Deactivate'
                                                            : 'Activate'}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredBranches.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-8 text-center text-muted-foreground"
                                            >
                                                No branches match the current
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
