import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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

export type Branch = {
    id: string;
    tenant_id: string;
    tenant_name: string | null;
    code: string;
    name: string;
    country_code: string;
    default_currency_code: string;
    status: 'active' | 'inactive';
};

export type Option = {
    id?: string;
    code: string;
    name: string;
};

type BranchFormData = Record<string, string> & {
    tenant_id: string;
    name: string;
    code: string;
    country_code: string;
    default_currency_code: string;
    status: 'active' | 'inactive';
};

type Props = {
    branch?: Branch;
    tenants?: Required<Pick<Option, 'id' | 'code' | 'name'>>[];
    countries?: Option[];
    currencies?: Option[];
};

export function BranchDialog({
    branch,
    tenants = [],
    countries = [],
    currencies = [],
}: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = Boolean(branch);
    const form = useForm<BranchFormData>({
        tenant_id: branch?.tenant_id ?? tenants[0]?.id ?? '',
        name: branch?.name ?? '',
        code: branch?.code ?? '',
        country_code: branch?.country_code ?? countries[0]?.code ?? 'UG',
        default_currency_code:
            branch?.default_currency_code ?? currencies[0]?.code ?? 'USD',
        status: branch?.status ?? 'active',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (branch) {
            form.put(`/management/branches/${branch.id}`, {
                onSuccess: () => setOpen(false),
            });

            return;
        }

        form.post('/management/branches', {
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
                    variant={isEditing ? 'outline' : 'default'}
                    size={isEditing ? 'sm' : 'default'}
                >
                    {isEditing ? <Pencil /> : <Plus />}
                    {isEditing ? 'Edit' : 'New branch'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Edit ${branch?.code}` : 'New branch'}
                    </DialogTitle>
                    <DialogDescription>
                        Create or update a tenant branch for ERP consumption.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="branch-tenant">Tenant</Label>
                        <NativeSelect
                            id="branch-tenant"
                            value={form.data.tenant_id}
                            onChange={(event) =>
                                form.setData('tenant_id', event.target.value)
                            }
                            className="w-full"
                        >
                            {tenants.map((tenant) => (
                                <NativeSelectOption
                                    key={tenant.id}
                                    value={tenant.id}
                                >
                                    {tenant.name} ({tenant.code})
                                </NativeSelectOption>
                            ))}
                        </NativeSelect>
                        <InputError message={form.errors.tenant_id} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="branch-name">Branch name</Label>
                            <Input
                                id="branch-name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                placeholder="Kampala Head Office"
                            />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="branch-code">Code</Label>
                            <Input
                                id="branch-code"
                                value={form.data.code}
                                onChange={(event) =>
                                    form.setData(
                                        'code',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="KLA-HQ"
                            />
                            <InputError message={form.errors.code} />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="branch-country">Country</Label>
                            <NativeSelect
                                id="branch-country"
                                value={form.data.country_code}
                                onChange={(event) =>
                                    form.setData(
                                        'country_code',
                                        event.target.value,
                                    )
                                }
                                className="w-full"
                            >
                                {countries.map((country) => (
                                    <NativeSelectOption
                                        key={country.code}
                                        value={country.code}
                                    >
                                        {country.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <InputError message={form.errors.country_code} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="branch-currency">
                                Base currency
                            </Label>
                            <NativeSelect
                                id="branch-currency"
                                value={form.data.default_currency_code}
                                onChange={(event) =>
                                    form.setData(
                                        'default_currency_code',
                                        event.target.value,
                                    )
                                }
                                className="w-full"
                            >
                                {currencies.map((currency) => (
                                    <NativeSelectOption
                                        key={currency.code}
                                        value={currency.code}
                                    >
                                        {currency.code} - {currency.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <InputError
                                message={form.errors.default_currency_code}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing && <Spinner />}
                            Save branch
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
