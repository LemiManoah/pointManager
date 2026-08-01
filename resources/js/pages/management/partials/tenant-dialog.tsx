import { Pencil, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';

export type Tenant = {
    code: string;
    name: string;
    country: string;
    currency: string;
    branches: number;
    status: 'active' | 'inactive';
    isMultibranch: boolean;
};

type Props = {
    tenant?: Tenant;
};

export function TenantDialog({ tenant }: Props) {
    const isEditing = Boolean(tenant);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={isEditing ? 'outline' : 'default'}
                    size={isEditing ? 'sm' : 'default'}
                >
                    {isEditing ? <Pencil /> : <Plus />}
                    {isEditing ? 'Edit' : 'New tenant'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Edit ${tenant?.code}` : 'New tenant'}
                    </DialogTitle>
                    <DialogDescription>
                        Configure tenant identity, default country, and default
                        currency before branches are added.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="tenant-name">Tenant name</Label>
                        <Input
                            id="tenant-name"
                            defaultValue={tenant?.name}
                            placeholder="Point Investment Co. Ltd"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tenant-code">Code</Label>
                        <Input
                            id="tenant-code"
                            defaultValue={tenant?.code}
                            placeholder="POINT"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tenant-country">Country</Label>
                        <NativeSelect
                            id="tenant-country"
                            defaultValue={tenant?.country ?? 'Uganda'}
                            className="w-full"
                        >
                            <NativeSelectOption value="Uganda">
                                Uganda
                            </NativeSelectOption>
                            <NativeSelectOption value="South Sudan">
                                South Sudan
                            </NativeSelectOption>
                            <NativeSelectOption value="DR Congo">
                                DR Congo
                            </NativeSelectOption>
                        </NativeSelect>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="tenant-currency">
                            Default currency
                        </Label>
                        <NativeSelect
                            id="tenant-currency"
                            defaultValue={tenant?.currency ?? 'UGX'}
                            className="w-full"
                        >
                            <NativeSelectOption value="UGX">
                                UGX
                            </NativeSelectOption>
                            <NativeSelectOption value="USD">
                                USD
                            </NativeSelectOption>
                            <NativeSelectOption value="SSP">
                                SSP
                            </NativeSelectOption>
                            <NativeSelectOption value="CDF">
                                CDF
                            </NativeSelectOption>
                        </NativeSelect>
                    </div>
                    <label className="flex items-center gap-3 text-sm">
                        <Checkbox defaultChecked={tenant?.isMultibranch ?? true} />
                        Multi-branch tenant
                    </label>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button type="button">Save tenant</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
