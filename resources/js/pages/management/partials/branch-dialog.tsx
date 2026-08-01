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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';

export type Branch = {
    code: string;
    name: string;
    tenant: string;
    country: string;
    currency: string;
    status: 'active' | 'inactive';
};

type Props = {
    branch?: Branch;
};

export function BranchDialog({ branch }: Props) {
    const isEditing = Boolean(branch);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={isEditing ? 'outline' : 'default'}
                    size={isEditing ? 'sm' : 'default'}
                >
                    {isEditing ? <Pencil /> : <Plus />}
                    {isEditing ? 'Edit' : 'New branch'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? `Edit ${branch?.code}` : 'New branch'}
                    </DialogTitle>
                    <DialogDescription>
                        Assign a tenant branch, operating country, and base
                        currency for ERP access.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="branch-tenant">Tenant</Label>
                        <NativeSelect
                            id="branch-tenant"
                            defaultValue={branch?.tenant ?? 'Point Investment'}
                            className="w-full"
                        >
                            <NativeSelectOption value="Point Investment">
                                Point Investment
                            </NativeSelectOption>
                            <NativeSelectOption value="Point South Sudan">
                                Point South Sudan
                            </NativeSelectOption>
                        </NativeSelect>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="branch-name">Branch name</Label>
                        <Input
                            id="branch-name"
                            defaultValue={branch?.name}
                            placeholder="Kampala Head Office"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="branch-code">Code</Label>
                        <Input
                            id="branch-code"
                            defaultValue={branch?.code}
                            placeholder="KLA-HQ"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="branch-currency">Base currency</Label>
                        <NativeSelect
                            id="branch-currency"
                            defaultValue={branch?.currency ?? 'UGX'}
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
                        </NativeSelect>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button type="button">Save branch</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
