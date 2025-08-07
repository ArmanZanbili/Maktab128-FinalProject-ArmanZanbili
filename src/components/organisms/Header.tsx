import { auth, signOut } from '@/src/lib/auth';
import { Link } from '@/i18n/navigation';
import { Button } from '@/src/components/ui/button';
import { LanguageSwitcher } from '../molecules/LanguageSwitcher';
import { ShoppingBag } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

function SignOutButton({ logoutText }: { logoutText: string }) {
    return (<form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}><Button type="submit" variant="secondary">{logoutText}</Button></form>);
}

export async function Header() {
    const session = await auth();
    const t = await getTranslations('Navigation');
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2 rtl:space-x-reverse"><ShoppingBag className="h-6 w-6" /><span className="font-bold sm:inline-block">{t('shopName')}</span></Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <LanguageSwitcher />
                    {session?.user ? (<SignOutButton logoutText={t('logout')} />) : (<Button asChild><Link href="/login">{t('login')}</Link></Button>)}
                </div>
            </div>
        </header>
    );
}