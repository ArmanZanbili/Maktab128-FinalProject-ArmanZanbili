'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { loginSchema } from '@/src/validations/auth-validation';

type LoginFormInputs = z.infer<typeof loginSchema>;

export function LoginForm() {
    const t = useTranslations('LoginPage');
    const formT = useTranslations('Form');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const result = await signIn('credentials', { redirect: false, username: data.username, password: data.password });
            if (result?.error) { toast.error(t('error')); }
            else if (result?.ok) { toast.success(t('success')); router.push('/'); router.refresh(); }
        } catch (error) { toast.error('An unexpected error occurred.'); }
    };

    return (
        <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="mt-8 grid gap-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input id="username" {...register('username')} />
                    {/* This line will now work correctly */}
                    {errors.username && <p className="text-sm text-red-500">{formT(errors.username.message as any)}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {/* This line will now work correctly */}
                    {errors.password && <p className="text-sm text-red-500">{formT(errors.password.message as any)}</p>}
                </div>
                <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>{formT('back')}</Button>
                </div>
            </form>
            <div className="mt-4 text-center text-sm">
                {t('signupPrompt')}{' '}
                <Link href="/signup" className="underline">{t('signupLink')}</Link>
            </div>
        </div>
    );
}