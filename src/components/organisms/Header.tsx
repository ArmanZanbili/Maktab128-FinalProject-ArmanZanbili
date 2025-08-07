import { auth } from '@/src/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '../ui/button';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ShoppingBag } from 'lucide-react';
import { signOutAction } from '@/src/actions/authActions';

function SignOutButton({ logoutText }: { logoutText: string }) {
    return (
        <form action={signOutAction}>
            <Button type="submit" variant="secondary">{logoutText}</Button>
        </form>
    );
}

export async function Header() {
    const session = await auth();
    const t = await getTranslations('Navigation');
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-black">
            <div className="flex px-10 h-16 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2 rtl:space-x-reverse">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="font-bold sm:inline-block">{t('shopName')}</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <LanguageSwitcher />

                    {session?.user ? (
                        <SignOutButton logoutText={t('logout')} />
                    ) : (
                        <Button asChild>
                            <Link href="/login">{t('login')}</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}