'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/lib/utils';
import { FaFilm, FaChartLine, FaBoxOpen, FaUsers, FaFlag, FaFolderOpen, FaRegLifeRing, FaGear } from 'react-icons/fa6';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/src/components/ui/collapsible';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';

const mainNavLinks = [
    { href: '/admin', label: 'dashboard', icon: FaChartLine },
    { href: '/admin/products', label: 'products', icon: FaBoxOpen },
];

const projectLinks = [
    { href: '/admin/projects/reporting', label: 'reporting', icon: FaFlag },
    { href: '/admin/projects/users', label: 'users', icon: FaUsers },
];

const footerLinks = [
    { href: '/admin/support', label: 'support', icon: FaRegLifeRing },
    { href: '/admin/settings', label: 'settings', icon: FaGear },
];

export function Sidebar() {
    const t = useTranslations('AdminSidebar');
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-72 flex-col border-r bg-card text-card-foreground sm:flex rtl:right-0 rtl:left-auto rtl:border-r-0 rtl:border-l">
            <div className="flex h-16 items-center justify-between border-b px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <FaFilm className="h-6 w-6 text-primary" />
                    <span>{t('shopName')}</span>
                </Link>
                <div className="flex items-center gap-1">
                    <LanguageSwitcher />
                    <ThemeSwitcher />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
                    <Input type="search" placeholder={t('search')} className="pl-8 rtl:pr-8 rtl:pl-3" />
                </div>

                <nav className="flex-1">
                    <ul className="grid items-start text-sm font-medium">
                        {mainNavLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary', { 'bg-muted text-primary': pathname === link.href })}>
                                    <link.icon className="h-4 w-4" />
                                    {t(link.label)}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Collapsible defaultOpen className="mt-2">
                        <CollapsibleTrigger className="group flex w-full items-center">
                            <div className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary')}>
                                <FaFolderOpen className="h-4 w-4" />
                                {t('projects')}
                                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180 rtl:mr-auto rtl:ml-0" />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="py-1 pl-8 rtl:pr-8 rtl:pl-0">
                            <ul className="grid gap-1">
                                {projectLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary', { 'bg-muted text-primary': pathname === link.href })}>
                                            <link.icon className="h-4 w-4" />
                                            {t(link.label)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CollapsibleContent>
                    </Collapsible>
                </nav>

                <div className="mt-auto">
                    <ul className="grid items-start text-sm font-medium">
                        {footerLinks.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-muted hover:text-primary', { 'bg-muted text-primary': pathname === link.href })}>
                                    <link.icon className="h-4 w-4" />
                                    {t(link.label)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 border-t pt-4">
                    <div className="flex items-center gap-3">
                        <Image src="/posters/avatar-placeholder.jpg" alt="User" width={40} height={40} className="rounded-full" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold">{session?.user?.name ?? 'Admin'}</p>
                            <p className="text-xs text-muted-foreground">{session?.user?.email ?? ''}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => signOut()}><FaRightFromBracket className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

import { FaRightFromBracket } from 'react-icons/fa6';