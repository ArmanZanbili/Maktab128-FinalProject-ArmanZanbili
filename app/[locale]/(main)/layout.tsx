import { Header } from '@/src/components/organisms/Header';
import { Footer } from '@/src/components/organisms/Footer';

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col gap-5">
      <Header />
      <main className="flex-1 px-8">{children}</main>
      <Footer />
    </div>
  );
}