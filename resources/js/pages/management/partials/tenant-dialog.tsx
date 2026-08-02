import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
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

export type Tenant = {
    id: string;
    code: string;
    name: string;
    default_currency_code: string;
    branches_count: number;
    status: 'active' | 'inactive';
    is_multibranch: boolean;
    multi_currency_enabled: boolean;
    timezone: string;
};

type CurrencyOption = {
    code: string;
    name: string;
};

type TenantFormData = Record<string, string | boolean> & {
    name: string;
    code: string;
    default_currency_code: string;
    is_multibranch: boolean;
    multi_currency_enabled: boolean;
    timezone: string;
    status: 'active' | 'inactive';
};

type Props = {
    tenant?: Tenant;
    currencies?: CurrencyOption[];
};

export function TenantDialog({ tenant, currencies = [] }: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = Boolean(tenant);
    const form = useForm<TenantFormData>({
        name: tenant?.name ?? '',
        code: tenant?.code ?? '',
        default_currency_code:
            tenant?.default_currency_code ?? currencies[0]?.code ?? 'USD',
        is_multibranch: tenant?.is_multibranch ?? true,
        multi_currency_enabled: tenant?.multi_currency_enabled ?? true,
        timezone: tenant?.timezone ?? 'Africa/Kampala',
        status: tenant?.status ?? 'active',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (tenant) {
            form.put(`/management/tenants/${tenant.id}`, {
                onSuccess: () => setOpen(false),
            });

            return;
        }

        form.post('/management/tenants', {
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
                    {isEditing ? 'Edit' : 'New tenant'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Edit ${tenant?.code}` : 'New tenant'}
                    </DialogTitle>
                    <DialogDescription>
                        Configure customer identity and base operating settings.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="tenant-name">Tenant name</Label>
                            <Input
                                id="tenant-name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData('name', event.target.value)
                                }
                                placeholder="Point Investment Co. Ltd"
                            />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tenant-code">Code</Label>
                            <Input
                                id="tenant-code"
                                value={form.data.code}
                                onChange={(event) =>
                                    form.setData(
                                        'code',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="POINT"
                            />
                            <InputError message={form.errors.code} />
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="tenant-currency">
                                Default currency
                            </Label>
                            <NativeSelect
                                id="tenant-currency"
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
                        <div className="grid gap-2">
                            <Label htmlFor="tenant-timezone">Timezone</Label>
                            <Input
                                id="tenant-timezone"
                                value={form.data.timezone}
                                onChange={(event) =>
                                    form.setData('timezone', event.target.value)
                                }
                            />
                            <InputError message={form.errors.timezone} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-3 text-sm">
                            <Checkbox
                                checked={form.data.is_multibranch}
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        'is_multibranch',
                                        checked === true,
                                    )
                                }
                            />
                            Multi-branch
                        </label>
                        <label className="flex items-center gap-3 text-sm">
                            <Checkbox
                                checked={form.data.multi_currency_enabled}
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        'multi_currency_enabled',
                                        checked === true,
                                    )
                                }
                            />
                            Multi-currency
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
                        <Button type="submit" disabled={form.processing}>
                            {form.processing && <Spinner />}
                            Save tenant
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
