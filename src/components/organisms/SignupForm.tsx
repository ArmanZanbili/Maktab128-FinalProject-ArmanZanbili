'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { signupSchema } from '@/src/validations/auth-validation';
import { signupUser } from '@/src/services/authService';

type SignupFormInputs = z.infer<typeof signupSchema>;

export function SignupForm() {
    const t = useTranslations('SignupPage');
    const formT = useTranslations('Form');
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormInputs>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormInputs) => {
        try {
            await signupUser(data);
            toast.success(t('success'));
            router.push('/login');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                toast.error(t('conflictError'));
            } else {
                toast.error(t('error'));
            }
        }
    };

    return (
        <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="firstname">{t('firstname')}</Label>
                        <Input id="firstname" {...register('firstname')} />
                        {errors.firstname && <p className="text-sm text-red-500">{formT(errors.firstname.message as any)}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lastname">{t('lastname')}</Label>
                        <Input id="lastname" {...register('lastname')} />
                        {errors.lastname && <p className="text-sm text-red-500">{formT(errors.lastname.message as any)}</p>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input id="username" {...register('username')} />
                    {errors.username && <p className="text-sm text-red-500">{formT(errors.username.message as any)}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" {...register('password')} />
                    {errors.password && <p className="text-sm text-red-500">{formT(errors.password.message as any)}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                    <Input id="phoneNumber" type="tel" {...register('phoneNumber')} />
                    {errors.phoneNumber && <p className="text-sm text-red-500">{formT(errors.phoneNumber.message as any)}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">{t('address')}</Label>
                    <Input id="address" {...register('address')} />
                    {errors.address && <p className="text-sm text-red-500">{formT(errors.address.message as any)}</p>}
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
                {t('loginPrompt')}{' '}
                <Link href="/login" className="underline">{t('loginLink')}</Link>
            </div>
        </div>
    );
}