'use client';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { FaUserShield, FaChartLine, FaUser, FaRightFromBracket } from 'react-icons/fa6';

export function AdminMenu() {
    const t = useTranslations('Navigation');
    const tHeader = useTranslations('Header');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <FaUserShield className="h-5 w-5" />
                    <span className="sr-only">Admin Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{tHeader('adminMenuLabel')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin">
                        <FaChartLine className="mr-2 h-4 w-4" />
                        <span>{tHeader('dashboard')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <FaUser className="mr-2 h-4 w-4" />
                        <span>{tHeader('profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                    <FaRightFromBracket className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}