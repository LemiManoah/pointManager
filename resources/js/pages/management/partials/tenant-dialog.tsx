import { useForm } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
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
import { store, update } from '@/routes/management/tenants';

export type Tenant = {
    logo_url: string | null;
    id: string;
    code: string;
    name: string;
    default_currency_code: string;
    branches_count: number;
    client_users_count: number;
    status: 'active' | 'inactive';
    is_multibranch: boolean;
    multi_currency_enabled: boolean;
    multi_store_enabled: boolean;
    timezone: string;
};

type CurrencyOption = {
    code: string;
    name: string;
};

type TenantFormData = Record<string, string | boolean | File | null> & {
    logo: File | null;
    remove_logo: boolean;
    name: string;
    code: string;
    default_currency_code: string;
    initial_branch_name: string;
    initial_branch_code: string;
    initial_branch_country_code: string;
    is_multibranch: boolean;
    multi_currency_enabled: boolean;
    multi_store_enabled: boolean;
    timezone: string;
    status: 'active' | 'inactive';
};

type Props = {
    tenant?: Tenant;
    currencies?: CurrencyOption[];
    countries?: { code: string; name: string }[];
};

export function TenantDialog({ tenant, currencies = [], countries = [] }: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = Boolean(tenant);
    const [preview, setPreview] = useState<string | null>(null);
    const form = useForm<TenantFormData>({
        logo: null,
        remove_logo: false,
        name: tenant?.name ?? '',
        code: tenant?.code ?? '',
        default_currency_code:
            tenant?.default_currency_code ?? currencies[0]?.code ?? 'USD',
        initial_branch_name: '',
        initial_branch_code: '',
        initial_branch_country_code: countries[0]?.code ?? '',
        is_multibranch: tenant?.is_multibranch ?? false,
        multi_currency_enabled: tenant?.multi_currency_enabled ?? false,
        multi_store_enabled: tenant?.multi_store_enabled ?? false,
        timezone: tenant?.timezone ?? 'Africa/Kampala',
        status: tenant?.status ?? 'active',
    });
    useEffect(() => {
        if (!form.data.logo) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(form.data.logo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [form.data.logo]);
    const logoPreview = preview ?? (!form.data.remove_logo ? tenant?.logo_url : null);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (tenant) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(update.url(tenant.id), {
                forceFormData: true,
                onSuccess: () => { form.setData('logo', null); form.setData('remove_logo', false); setOpen(false); },
            });

            return;
        }

        form.post(store.url(), {
            forceFormData: true,
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Edit ${tenant?.code}` : 'New tenant'}
                    </DialogTitle>
                    <DialogDescription>
                        Configure customer identity and base operating settings.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="tenant-logo">Company logo</Label>
                        {logoPreview && <div className="w-fit rounded-md border bg-white p-3"><img src={logoPreview} alt="Company logo preview" className="h-16 max-w-56 object-contain" /></div>}
                        <Input id="tenant-logo" type="file" accept="image/png,image/jpeg,image/webp"
                            onChange={(event) => { form.setData('logo', event.target.files?.[0] ?? null); form.setData('remove_logo', false); }} />
                        <p className="text-sm text-muted-foreground">PNG, JPEG or WebP, up to 2 MB. Used in the company’s ERP branding.</p>
                        <InputError message={form.errors.logo} />
                        {tenant?.logo_url && <div className="flex items-center gap-2">
                            <Checkbox id="remove-logo" checked={form.data.remove_logo}
                                onCheckedChange={(value) => { form.setData('remove_logo', value === true); if (value === true) form.setData('logo', null); }} />
                            <Label htmlFor="remove-logo">Remove current logo</Label>
                        </div>}
                    </div>
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
                    {!isEditing && <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="initial-branch-name">First branch</Label>
                            <Input id="initial-branch-name" value={form.data.initial_branch_name} onChange={(event) => form.setData('initial_branch_name', event.target.value)} placeholder="Kampala Head Office" />
                            <InputError message={form.errors.initial_branch_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="initial-branch-code">Branch code</Label>
                            <Input id="initial-branch-code" value={form.data.initial_branch_code} onChange={(event) => form.setData('initial_branch_code', event.target.value.toUpperCase())} placeholder="KLA-HQ" />
                            <InputError message={form.errors.initial_branch_code} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="initial-branch-country">Country</Label>
                            <NativeSelect id="initial-branch-country" value={form.data.initial_branch_country_code} onChange={(event) => form.setData('initial_branch_country_code', event.target.value)} className="w-full">
                                {countries.map((country) => <NativeSelectOption key={country.code} value={country.code}>{country.name}</NativeSelectOption>)}
                            </NativeSelect>
                            <InputError message={form.errors.initial_branch_country_code} />
                        </div>
                    </div>}
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
                        <label className="flex items-center gap-3 text-sm">
                            <Checkbox
                                checked={form.data.multi_store_enabled}
                                onCheckedChange={(checked) =>
                                    form.setData(
                                        'multi_store_enabled',
                                        checked === true,
                                    )
                                }
                            />
                            Multi-store
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
