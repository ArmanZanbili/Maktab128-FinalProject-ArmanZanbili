import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { PreferencesStoreProvider } from '@/src/stores/preferences-provider';
import { getPreference } from '@/src/server/server-actions';
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemePreset, type ThemeMode } from '@/types/theme';
import { Toaster } from '@/src/components/ui/sonner';
import { ThemeProvider } from '@/src/providers/ThemeProvider';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});
const sahel = localFont({
    src: '../../public/fonts/Sahel/Sahel.woff2',
    display: 'swap',
    variable: '--font-sahel',
});

type Props = {
    children: React.ReactNode;
    params: { locale: string };
};

export default async function LocaleLayout({ children }: Props) {
    const locale = await getLocale();
    const messages = await getMessages();

    const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "dark");
    const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

    return (
        <html
            lang={locale}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
            className={`${inter.variable} ${sahel.variable}`}
            suppressHydrationWarning
        >
            <body className={locale === 'fa' ? 'font-sahel' : 'font-sans'}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme={themeMode}
                    enableSystem
                    disableTransitionOnChange
                >
                    <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
                        <SessionProvider>
                            <NextIntlClientProvider locale={locale} messages={messages}>
                                {children}
                                <Toaster />
                            </NextIntlClientProvider>
                        </SessionProvider>
                    </PreferencesStoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}