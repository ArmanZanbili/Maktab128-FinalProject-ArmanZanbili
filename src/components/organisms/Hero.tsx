'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/src/components/ui/button';

const slides = [
    {
        id: 1,
        bgImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920')",
        titleKey: "heroTitle",
        subtitleKey: "heroSubtitle",
    },
    {
        id: 2,
        bgImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920')",
        titleKey: "heroTitle1",
        subtitleKey: "heroSubtitle1",
    },
];

export function Hero() {
    const t = useTranslations('HomePage');
    const activeSlide = slides[0];

    return (
        <section
            className="relative h-[75vh] w-full overflow-hidden rounded-lg bg-cover bg-center text-white"
        >
            <div
                className="h-full w-full"
                style={{ backgroundImage: activeSlide.bgImage }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-shadow-lg">{t(activeSlide.titleKey as any)}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-200 md:text-xl text-shadow">{t(activeSlide.subtitleKey as any)}</p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/products">{t('heroCta')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}