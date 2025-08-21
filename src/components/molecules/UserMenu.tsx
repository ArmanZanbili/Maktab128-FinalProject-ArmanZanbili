'use client';

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';
import { FaUser, FaRightFromBracket, FaCartShopping } from 'react-icons/fa6';
import { useCartStore } from '@/src/stores/cart-store';
import { Badge } from '../ui/badge';

export function UserMenu({ username }: { username?: string | null }) {
    const t = useTranslations('Navigation');
    const tHeader = useTranslations('Header');
    const cartItems = useCartStore((state) => state.items);
    const validItems = cartItems.filter(item => item && item.movie && typeof item.quantity === 'number');
    const totalItems = validItems.reduce((total, item) => total + item.quantity, 0);


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <FaUser className="h-5 w-5" />
                    <span className="sr-only">User Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{username || tHeader('userMenuLabel')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <FaUser className="mr-2 h-4 w-4" />
                        <span>{tHeader('profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/cart" className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <FaCartShopping className="mr-2 h-4 w-4" />
                            <span>{t('basket')}</span>
                        </div>
                        {totalItems > 0 && (
                            <Badge variant="destructive" className="ml-2">{totalItems}</Badge>
                        )}
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