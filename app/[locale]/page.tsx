import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/src/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const navT = await getTranslations('Navigation');
  return (
    <div className="container relative h-[calc(100vh-4rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium"><ShoppingBag className="mr-2 h-6 w-6" />{navT('shopName')}</div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center sm:w-[350px]">
          <h1 className="text-4xl font-extrabold tracking-tighter">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
          <Button asChild size="lg" className="mt-4"><Link href="/products">{t('cta')}</Link></Button>
        </div>
      </div>
    </div>
  );
}