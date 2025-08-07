'use client';
import { Button } from '@/src/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
    const pathname = usePathname();
    const router = useRouter();
    const handleLanguageChange = (newLocale: 'en' | 'fa') => {
        router.replace(pathname, { locale: newLocale, scroll: false });
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon"><Globe className="h-[1.2rem] w-[1.2rem]" /><span className="sr-only">Change language</span></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('fa')}>فارسی</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}