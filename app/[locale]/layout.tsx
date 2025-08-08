import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/src/providers/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import { Header } from '@/src/components/organisms/Header';
import { Footer } from '@/src/components/organisms/Footer';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col gap-5">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ToastContainer theme="colored" autoClose={3000} hideProgressBar />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}