import { auth } from '@/src/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ThemeSwitcher } from '../molecules/ThemeSwitcher';
import { AdminMenu } from '../molecules/AdminMenu';
import { UserMenu } from '../molecules/UserMenu';
import { SidebarTrigger } from '../ui/sidebar';
import { Search } from 'lucide-react';
import { FaArrowRightToBracket } from 'react-icons/fa6';


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
        return session.user.role === 'ADMIN'
            ? <AdminMenu />
            : <UserMenu username={session.user.name} />;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-muted/95 backdrop-blur-sm">
            <div className="flex h-16 items-center px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold sm:inline-block">{t('shopName')}</span>
                    </Link>
                </div>

                <div className="hidden flex-1 justify-center px-4 lg:flex">
                    <div className="relative w-full max-w-md">
                        <Input
                            type="search"
                            placeholder="Search movies..."
                            className="w-full rounded-full pl-10 bg-card"
                        />
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    {renderAuthComponent()}
                </div>
            </div>
        </header>
    );
}