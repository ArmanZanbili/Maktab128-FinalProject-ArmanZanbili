'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/src/lib/utils';
import { FaFilm, FaChartLine, FaBoxOpen, FaUsers, FaShapes, FaObjectUngroup, FaUser, FaRightFromBracket } from 'react-icons/fa6';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/src/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';

const mainNavLinks = [
    { href: '/admin', label: 'dashboard', icon: FaChartLine },
    { href: '/admin/movies', label: 'movies', icon: FaBoxOpen },
    { href: '/admin/categories', label: 'categories', icon: FaShapes },
    { href: '/admin/subcategories', label: 'subcategories', icon: FaObjectUngroup },
    { href: '/admin/users', label: 'users', icon: FaUsers },
];

type SidebarProps = {
    isCollapsed: boolean;
    onToggle: () => void;
};

const NavLink = ({ link, pathname, t, isRtl }: { link: any, pathname: string, t: any, isRtl: boolean }) => (
    <TooltipProvider delayDuration={0}>
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={link.href}
                    className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary',
                        // FIX 1: Consistent active link styling
                        { 'bg-muted text-primary': pathname === link.href }
                    )}
                >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{t(link.label)}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side={isRtl ? 'left' : 'right'}>
                {t(link.label)}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const t = useTranslations('AdminSidebar');
    const tHeader = useTranslations('Header');
    const pathname = usePathname();
    const { data: session } = useSession();
    const locale = useLocale();
    const isRtl = locale === 'fa';

    const CollapseIcon = isRtl ? ChevronRight : ChevronLeft;
    const ExpandIcon = isRtl ? ChevronLeft : ChevronRight;

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 ease-in-out sm:flex rtl:right-0 rtl:left-auto rtl:border-r-0 rtl:border-l",
                isCollapsed ? "w-16" : "w-72"
            )}
        >
            <div className="flex h-16 items-center justify-between border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <FaFilm className="h-6 w-6 text-primary" />
                    <span className={cn("transition-opacity", isCollapsed && "w-0 opacity-0")}>{t('shopName')}</span>
                </Link>
                <div className={cn("flex items-center gap-1", isCollapsed && "w-0 opacity-0")}>
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
            </div>

            <nav className="flex flex-1 flex-col items-center gap-1 px-2 py-4">
                {mainNavLinks.map((link) => (
                    isCollapsed ? (
                        <NavLink key={link.href} link={link} pathname={pathname} t={t} isRtl={isRtl} />
                    ) : (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary',
                                { 'bg-muted text-primary': pathname === link.href }
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {t(link.label)}
                        </Link>
                    )
                ))}
            </nav>

            <div className="mt-auto border-t p-2">
                <div className={cn("flex w-full items-center", isCollapsed && "flex-col gap-2")}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className={cn("flex items-center justify-center w-full", isCollapsed ? 'h-9 w-9 p-0' : 'gap-2 justify-start p-2 h-auto')}>
                                <Image src="/posters/avatar-placeholder.jpg" alt="User" width={32} height={32} className="rounded-full" />
                                <div className={cn("flex-1 text-left transition-all", isCollapsed && "hidden")}>
                                    <p className="text-sm font-semibold truncate">{session?.user?.name ?? 'Admin'}</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side={isRtl ? 'left' : 'right'} align="end" className="w-56">
                            <DropdownMenuLabel>{tHeader('userMenuLabel')}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile"><FaUser className="mr-2 h-4 w-4" />{tHeader('profile')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>
                                <FaRightFromBracket className="mr-2 h-4 w-4" />{tHeader('logout')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={onToggle} size="icon" variant="outline" className="h-8 w-8 shrink-0">
                        {isCollapsed ? <ExpandIcon className="h-4 w-4" /> : <CollapseIcon className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </aside>
    );
}