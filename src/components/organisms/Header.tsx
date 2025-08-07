import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ShoppingBag } from 'lucide-react';

import { useTranslations } from 'next-intl';


export function Header() {
    const t = useTranslations('Navigation');
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-black flex justify-center">
            <div className="container flex h-16 items-center px-4 md:px-6">

                <Link href="/" className="mr-6 flex items-center space-x-2 rtl:space-x-reverse">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="font-bold sm:inline-block">
                        {t('shopName')}
                    </span>
                </Link>

                <div className="mr-auto rtl:ml-auto rtl:mr-0" />

                <div className="flex items-center gap-x-3">
                    <LanguageSwitcher />
                </div>

            </div>
        </header>
    );
}