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
        bgImage: "url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1920')",
        titleKey: "heroTitle",
        subtitleKey: "heroSubtitle",
    },
];


export function Hero() {
    const t = useTranslations('HomePage');

    const activeSlide = slides[0];

    return (
        <section
            className="relative mt-4 h-[60vh] overflow-hidden rounded-lg bg-cover bg-center text-white shadow-lg "
        >
            <div
                className="h-full w-full"
                style={{ backgroundImage: activeSlide.bgImage }}
            >
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">{t(activeSlide.titleKey as any)}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">{t(activeSlide.subtitleKey as any)}</p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/products">{t('heroCta')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}