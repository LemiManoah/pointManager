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

export type Country = {
    code: string;
    name: string;
    iso3_code: string;
    default_currency_code: string;
    default_currency_name: string;
    is_active: boolean;
};

export type CurrencyOption = {
    code: string;
    name: string;
};

type CountryFormData = Record<string, string | boolean> & {
    code: string;
    name: string;
    iso3_code: string;
    default_currency_code: string;
    is_active: boolean;
};

type Props = {
    country?: Country;
    currencies?: CurrencyOption[];
};

export function CountryDialog({ country, currencies = [] }: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = Boolean(country);
    const form = useForm<CountryFormData>({
        code: country?.code ?? '',
        name: country?.name ?? '',
        iso3_code: country?.iso3_code ?? '',
        default_currency_code:
            country?.default_currency_code ?? currencies[0]?.code ?? 'USD',
        is_active: country?.is_active ?? true,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (country) {
            form.put(`/management/countries/${country.code}`, {
                onSuccess: () => setOpen(false),
            });

            return;
        }

        form.post('/management/countries', {
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
                    {isEditing ? 'Edit' : 'New country'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Edit ${country?.code}` : 'New country'}
                    </DialogTitle>
                    <DialogDescription>
                        Create or update a country reference and its default
                        currency for ERP consumption.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="country-code">Code</Label>
                            <Input
                                id="country-code"
                                value={form.data.code}
                                maxLength={2}
                                disabled={isEditing}
                                onChange={(event) =>
                                    form.setData(
                                        'code',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="UG"
                            />
                            <InputError message={form.errors.code} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country-iso3">ISO3 code</Label>
                            <Input
                                id="country-iso3"
                                value={form.data.iso3_code}
                                maxLength={3}
                                onChange={(event) =>
                                    form.setData(
                                        'iso3_code',
                                        event.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="UGA"
                            />
                            <InputError message={form.errors.iso3_code} />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country-name">Country name</Label>
                        <Input
                            id="country-name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            placeholder="Uganda"
                        />
                        <InputError message={form.errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="country-currency">
                            Default currency
                        </Label>
                        <NativeSelect
                            id="country-currency"
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
                    <label className="flex items-center gap-3 text-sm">
                        <Checkbox
                            checked={form.data.is_active}
                            onCheckedChange={(checked) =>
                                form.setData('is_active', checked === true)
                            }
                        />
                        Active
                    </label>
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
                            Save country
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
