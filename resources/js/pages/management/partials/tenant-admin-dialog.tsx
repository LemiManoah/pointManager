import { useForm } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { Spinner } from '@/components/ui/spinner';
import type { Tenant } from './tenant-dialog';

export type BranchOption = {
    id: string;
    tenant_id: string;
    name: string;
    code: string;
};

type TenantAdminFormData = Record<string, string | boolean> & {
    branch_id: string;
    staff_number: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    is_director: boolean;
};

type Props = {
    tenant: Tenant;
    branches: BranchOption[];
    roles: string[];
};

export function TenantAdminDialog({ tenant, branches, roles }: Props) {
    const tenantBranches = useMemo(
        () => branches.filter((branch) => branch.tenant_id === tenant.id),
        [branches, tenant.id],
    );
    const defaultRole = roles.includes('Administrator')
        ? 'Administrator'
        : (roles[0] ?? '');
    const [open, setOpen] = useState(false);
    const form = useForm<TenantAdminFormData>({
        branch_id: tenantBranches[0]?.id ?? '',
        staff_number: `${tenant.code}-ADMIN-001`,
        name: '',
        email: '',
        phone: '',
        password: 'password',
        role: defaultRole,
        is_director: true,
    });
    const canCreate =
        tenant.status === 'active' && tenantBranches.length > 0 && roles.length > 0;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post(`/management/tenants/${tenant.id}/admins`, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={!canCreate}
                    title={
                        canCreate
                            ? 'Create the first ERP admin for this tenant'
                            : 'Create an active branch and seed ERP roles before adding an admin'
                    }
                >
                    <KeyRound />
                    Create admin
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create tenant admin</DialogTitle>
                    <DialogDescription>
                        This creates the first ERP login for {tenant.name}.
                        Further staff and user management should happen inside
                        PointERP.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-branch-${tenant.id}`}>
                                Default branch
                            </Label>
                            <NativeSelect
                                id={`admin-branch-${tenant.id}`}
                                value={form.data.branch_id}
                                onChange={(event) =>
                                    form.setData(
                                        'branch_id',
                                        event.target.value,
                                    )
                                }
                                className="w-full"
                            >
                                {tenantBranches.map((branch) => (
                                    <NativeSelectOption
                                        key={branch.id}
                                        value={branch.id}
                                    >
                                        {branch.code} - {branch.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <InputError message={form.errors.branch_id} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-role-${tenant.id}`}>
                                Role
                            </Label>
                            <NativeSelect
                                id={`admin-role-${tenant.id}`}
                                value={form.data.role}
                                onChange={(event) =>
                                    form.setData('role', event.target.value)
                                }
                                className="w-full"
                            >
                                {roles.map((role) => (
                                    <NativeSelectOption
                                        key={role}
                                        value={role}
                                    >
                                        {role}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <InputError message={form.errors.role} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-staff-${tenant.id}`}>
                                Staff number
                            </Label>
                            <Input
                                id={`admin-staff-${tenant.id}`}
                                value={form.data.staff_number}
                                onChange={(event) =>
                                    form.setData(
                                        'staff_number',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                            />
                            <InputError message={form.errors.staff_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-name-${tenant.id}`}>
                                Full name
                            </Label>
                            <Input
                                id={`admin-name-${tenant.id}`}
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                placeholder="Manoah Trade Admin"
                            />
                            <InputError message={form.errors.name} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-email-${tenant.id}`}>
                                Email
                            </Label>
                            <Input
                                id={`admin-email-${tenant.id}`}
                                type="email"
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                placeholder="admin@manoahtrade.test"
                            />
                            <InputError message={form.errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-phone-${tenant.id}`}>
                                Phone
                            </Label>
                            <Input
                                id={`admin-phone-${tenant.id}`}
                                value={form.data.phone}
                                onChange={(event) =>
                                    form.setData('phone', event.target.value)
                                }
                            />
                            <InputError message={form.errors.phone} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor={`admin-password-${tenant.id}`}>
                                Temporary password
                            </Label>
                            <Input
                                id={`admin-password-${tenant.id}`}
                                type="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData('password', event.target.value)
                                }
                            />
                            <InputError message={form.errors.password} />
                        </div>
                        <label className="flex items-center gap-3 pt-7 text-sm">
                            <Checkbox
                                checked={form.data.is_director}
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        'is_director',
                                        checked === true,
                                    )
                                }
                            />
                            Director-level user
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || !canCreate}
                        >
                            {form.processing && <Spinner />}
                            Create admin
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
