import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider } from '@/src/providers/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';

type Props = {
    children: React.ReactNode;
    params: { locale: string };
};

export default async function LocaleLayout({ children }: Props) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning>
            <body>
                <SessionProvider>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            {children}
                            <ToastContainer theme="colored" autoClose={3000} hideProgressBar />
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}