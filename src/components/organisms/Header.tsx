import { auth } from '@/src/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ShoppingBag } from 'lucide-react';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { AdminMenu } from '../molecules/AdminMenu';
import { UserMenu } from '../molecules/UserMenu';

export async function Header() {
    const session = await auth();
    const t = await getTranslations('Navigation');

    const renderAuthComponent = () => {
        if (!session?.user) {
            return <Button asChild><Link href="/login">{t('login')}</Link></Button>;
        }
        if (session.user.role === 'ADMIN') {
            return <AdminMenu />;
        }
        return <UserMenu username={session.user.name} />;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-header-background">
            <div className="flex px-10 h-16 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2 rtl:space-x-reverse">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="font-bold sm:inline-block">{t('shopName')}</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    {renderAuthComponent()}
                </div>
            </div>
        </header>
    );
}