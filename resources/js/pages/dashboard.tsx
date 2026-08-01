import { Head } from '@inertiajs/react';
import {
    Building2,
    GitBranch,
    Search,
    ShieldCheck,
    Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import {
    BranchDialog,
    type Branch,
} from './management/partials/branch-dialog';
import {
    TenantDialog,
    type Tenant,
} from './management/partials/tenant-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manager', href: '/dashboard' },
];

const tenants: Tenant[] = [
    {
        code: 'POINT',
        name: 'Point Investment',
        country: 'Uganda',
        currency: 'UGX',
        branches: 3,
        status: 'active',
        isMultibranch: true,
    },
    {
        code: 'POINT-SS',
        name: 'Point South Sudan',
        country: 'South Sudan',
        currency: 'SSP',
        branches: 1,
        status: 'active',
        isMultibranch: false,
    },
    {
        code: 'POINT-CD',
        name: 'Point DR Congo',
        country: 'DR Congo',
        currency: 'CDF',
        branches: 0,
        status: 'inactive',
        isMultibranch: true,
    },
];

const branches: Branch[] = [
    {
        code: 'KLA-HQ',
        name: 'Kampala Head Office',
        tenant: 'Point Investment',
        country: 'Uganda',
        currency: 'UGX',
        status: 'active',
    },
    {
        code: 'GUL-SITE',
        name: 'Gulu Project Office',
        tenant: 'Point Investment',
        country: 'Uganda',
        currency: 'UGX',
        status: 'active',
    },
    {
        code: 'JUB-HQ',
        name: 'Juba Office',
        tenant: 'Point South Sudan',
        country: 'South Sudan',
        currency: 'SSP',
        status: 'active',
    },
    {
        code: 'KIS-MOB',
        name: 'Kisangani Mobilization',
        tenant: 'Point DR Congo',
        country: 'DR Congo',
        currency: 'CDF',
        status: 'inactive',
    },
];

export default function Dashboard() {
    const [tenantSearch, setTenantSearch] = useState('');
    const [branchSearch, setBranchSearch] = useState('');
    const [tenantStatus, setTenantStatus] = useState('all');
    const [branchStatus, setBranchStatus] = useState('all');
    const debouncedTenantSearch = useDebouncedValue(tenantSearch);
    const debouncedBranchSearch = useDebouncedValue(branchSearch);

    const filteredTenants = useMemo(() => {
        const term = debouncedTenantSearch.trim().toLowerCase();

        return tenants.filter((tenant) => {
            const matchesStatus =
                tenantStatus === 'all' || tenant.status === tenantStatus;
            const matchesSearch =
                !term ||
                [tenant.code, tenant.name, tenant.country, tenant.currency]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [debouncedTenantSearch, tenantStatus]);

    const filteredBranches = useMemo(() => {
        const term = debouncedBranchSearch.trim().toLowerCase();

        return branches.filter((branch) => {
            const matchesStatus =
                branchStatus === 'all' || branch.status === branchStatus;
            const matchesSearch =
                !term ||
                [
                    branch.code,
                    branch.name,
                    branch.tenant,
                    branch.country,
                    branch.currency,
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            return matchesStatus && matchesSearch;
        });
    }, [branchStatus, debouncedBranchSearch]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manager" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Tenant management
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Create tenants and branches here, then PointERP
                            consumes that context.
                        </p>
                    </div>
                    <TenantDialog />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <SummaryCard
                        title="Tenants"
                        value={tenants.length}
                        icon={Building2}
                    />
                    <SummaryCard
                        title="Branches"
                        value={branches.length}
                        icon={GitBranch}
                    />
                    <SummaryCard title="Users" value={18} icon={Users} />
                    <SummaryCard
                        title="Roles"
                        value={6}
                        icon={ShieldCheck}
                    />
                </div>

                <Tabs defaultValue="tenants" className="w-full">
                    <TabsList>
                        <TabsTrigger value="tenants">Tenants</TabsTrigger>
                        <TabsTrigger value="branches">Branches</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tenants" className="mt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <CardTitle>Tenants</CardTitle>
                                        <CardDescription>
                                            Tenant identity, country defaults,
                                            and ERP activation status.
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <SearchInput
                                            value={tenantSearch}
                                            onChange={setTenantSearch}
                                            placeholder="Search tenants"
                                        />
                                        <StatusSelect
                                            value={tenantStatus}
                                            onChange={setTenantStatus}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="py-3 pr-4 font-medium">
                                                    Code
                                                </th>
                                                <th className="py-3 pr-4 font-medium">
                                                    Tenant
                                                </th>
                                                <th className="py-3 pr-4 font-medium">
                                                    Country
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
                                                    key={tenant.code}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="py-3 pr-4 font-medium">
                                                        {tenant.code}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {tenant.name}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {tenant.country}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {tenant.currency}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {tenant.branches}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <StatusBadge
                                                            status={
                                                                tenant.status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex justify-end">
                                                            <TenantDialog
                                                                tenant={tenant}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="branches" className="mt-4">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <CardTitle>Branches</CardTitle>
                                        <CardDescription>
                                            Tenant branch records that PointERP
                                            users will operate inside.
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <SearchInput
                                            value={branchSearch}
                                            onChange={setBranchSearch}
                                            placeholder="Search branches"
                                        />
                                        <StatusSelect
                                            value={branchStatus}
                                            onChange={setBranchStatus}
                                        />
                                        <BranchDialog />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left text-muted-foreground">
                                                <th className="py-3 pr-4 font-medium">
                                                    Code
                                                </th>
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
                                                    Currency
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
                                                    key={branch.code}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="py-3 pr-4 font-medium">
                                                        {branch.code}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {branch.name}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {branch.tenant}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {branch.country}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {branch.currency}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <StatusBadge
                                                            status={
                                                                branch.status
                                                            }
                                                        />
                                                    </td>
                                                    <td className="py-3">
                                                        <div className="flex justify-end">
                                                            <BranchDialog
                                                                branch={branch}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

function SummaryCard({
    title,
    value,
    icon: Icon,
}: {
    title: string;
    value: number;
    icon: ComponentType<{ className?: string }>;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-semibold">{value}</div>
            </CardContent>
        </Card>
    );
}

function SearchInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 sm:w-64"
            />
        </div>
    );
}

function StatusSelect({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full sm:w-36">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
        </Select>
    );
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
    return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
    );
}
