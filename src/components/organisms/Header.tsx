import { auth } from '@/src/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { AdminMenu } from '../molecules/AdminMenu';
import { UserMenu } from '../molecules/UserMenu';
import { FaFilm, FaArrowRightToBracket, FaCartShopping } from 'react-icons/fa6';

export async function Header() {
    const session = await auth();
    const t = await getTranslations('Navigation');

    const renderAuthComponent = () => {
        if (!session?.user) {
            return (
                <Button asChild>
                    <Link href="/login">
                        <FaArrowRightToBracket className="mr-2 h-4 w-4" />
                        {t('login')}
                    </Link>
                </Button>
            );
        }
        if (session.user.role === 'ADMIN') {
            return <AdminMenu />;
        }
        return <UserMenu username={session.user.name} />;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-header-background">
            <div className="flex h-16 items-center px-8">
                <Link href="/" className="flex items-center gap-2">
                    <FaFilm className="h-6 w-6" />
                    <span className="font-bold sm:inline-block">{t('shopName')}</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    {renderAuthComponent()}
                    <Button asChild variant="ghost" size="icon" aria-label={t('basket')}>
                        <Link href="/cart">
                            <FaCartShopping className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}