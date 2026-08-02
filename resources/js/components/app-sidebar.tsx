import { Link } from '@inertiajs/react';
import { Building2, GitBranch, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import type { ComponentProps } from 'react';
import AppLogo from '@/components/app-logo';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';

const items = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        status: 'ready',
    },
    {
        title: 'Tenants',
        href: '/management/tenants',
        icon: Building2,
        status: 'ready',
    },
    {
        title: 'Branches',
        href: '/management/branches',
        icon: GitBranch,
        status: 'ready',
    },
    {
        title: 'Users',
        href: '#',
        icon: Users,
        status: 'next',
    },
    {
        title: 'Roles',
        href: '#',
        icon: ShieldCheck,
        status: 'next',
    },
] as const;

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const Icon = item.icon;
                                const disabled = item.href === '#';

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild={!disabled}
                                            disabled={disabled}
                                            isActive={
                                                !disabled &&
                                                isCurrentUrl(item.href)
                                            }
                                            tooltip={{ children: item.title }}
                                        >
                                            {disabled ? (
                                                <>
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                    <span className="ml-auto text-[10px] text-sidebar-foreground/50 uppercase">
                                                        Next
                                                    </span>
                                                </>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    prefetch
                                                >
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="group-data-[collapsible=icon]:hidden">
                <div className="rounded-md bg-sidebar-accent/50 px-3 py-2 text-xs text-sidebar-foreground/70">
                    Tenants and branches are created here, then consumed by
                    PointERP.
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
