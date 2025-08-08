import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Twitter, Github, Instagram } from 'lucide-react';

export function Footer() {
    const t = useTranslations('Navigation');
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
                <Link href="/" className="flex items-center gap-2 rtl:space-x-reverse">
                    <ShoppingBag className="h-6 w-6" />
                    <span className="text-lg font-bold">{t('shopName')}</span>
                </Link>
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} {t('shopName')}. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}