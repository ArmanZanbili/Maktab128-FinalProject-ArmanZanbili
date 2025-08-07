'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Link, useRouter } from '@/i18n/navigation';

export function LoginForm() {
    const t = useTranslations('LoginPage');
    const formT = useTranslations('Form');
    const router = useRouter();

    return (
        <div className="w-full max-w-sm">
            <form className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input id="username" placeholder="your-username" type="text" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" />
                </div>

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
                {t('signupPrompt')}{' '}
                <Link href="/signup" className="underline">
                    {t('signupLink')}
                </Link>
            </div>
        </div>
    );
}