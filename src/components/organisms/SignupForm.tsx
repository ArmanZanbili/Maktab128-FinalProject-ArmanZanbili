'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Link, useRouter } from '@/i18n/navigation'; // Import the router

export function SignupForm() {
    const t = useTranslations('SignupPage');
    const formT = useTranslations('Form');
    const router = useRouter();

    return (
        <div className="w-full max-w-sm">
            <form className="grid gap-4">

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2"><Label htmlFor="firstname">{t('firstname')}</Label><Input id="firstname" placeholder="John" type="text" /></div>
                    <div className="grid gap-2"><Label htmlFor="lastname">{t('lastname')}</Label><Input id="lastname" placeholder="Doe" type="text" /></div>
                </div>
                <div className="grid gap-2"><Label htmlFor="username">{t('username')}</Label><Input id="username" placeholder="your-username" type="text" /></div>
                <div className="grid gap-2"><Label htmlFor="password">{t('password')}</Label><Input id="password" type="password" /></div>
                <div className="grid gap-2"><Label htmlFor="phoneNumber">{t('phoneNumber')}</Label><Input id="phoneNumber" placeholder="09123456789" type="tel" /></div>
                <div className="grid gap-2"><Label htmlFor="address">{t('address')}</Label><Input id="address" placeholder="123 Main St" type="text" /></div>

                <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" className="w-full">
                        {t('submit')}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                        {formT('back')}
                    </Button>
                </div>
            </form>
            <div className="mt-4 text-center text-sm">
                {t('loginPrompt')}{' '}
                <Link href="/login" className="underline">
                    {t('loginLink')}
                </Link>
            </div>
        </div>
    );
}