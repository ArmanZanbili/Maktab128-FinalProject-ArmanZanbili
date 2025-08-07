import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/src/components/ui/button';


export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="w-dvw flex flex-1 items-center">
      <section className="w-full flex justify-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">

            <h1 className="text-4xl text-black font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {t('title')}
            </h1>

            <p className="max-w-[600px]  text-gray-800 md:text-xl">
              Discover our curated selection of high-quality products, designed to bring joy and utility to your life.
            </p>

            <Button asChild size="lg" className="mt-4">
              <Link href="/products">{t('cta')}</Link>
            </Button>

          </div>
        </div>
      </section>
    </div>
  );
}