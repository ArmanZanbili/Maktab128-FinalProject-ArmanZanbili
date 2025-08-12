import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/src/providers/ThemeProvider';
import { Bounce, ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import { Inter, Vazirmatn } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const vazirmatn = Vazirmatn({
    subsets: ['arabic'],
    display: 'swap',
    variable: '--font-vazirmatn',
});

const sahel = localFont({
    src: '../../public/fonts/Sahel/Sahel.woff2',
    display: 'swap',
    variable: '--font-sahel',
});

const bon = localFont({
    src: '../../public/fonts/Bon/Webfonts/Woff2/bon-Medium.woff2',
    display: 'swap',
    variable: '--font-bon',
});

type Props = {
    children: React.ReactNode;
    params: { locale: string };
};

export default async function LocaleLayout({ children }: Props) {

    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir={locale === 'fa' ? 'rtl' : 'ltr'}
            className={`${inter.variable} ${sahel.variable} ${bon.variable}`}
            suppressHydrationWarning
        >
            <body className={locale === 'fa' ? 'font-sahel' : 'font-sans'}>
                <SessionProvider>
                    <NextIntlClientProvider locale={locale} messages={messages}>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            {children}
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeButton={false}
                                closeOnClick={true}
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="colored"
                                transition={Bounce}
                            />
                        </ThemeProvider>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}