import { Header } from '@/src/components/organisms/Header';
import { Footer } from '@/src/components/organisms/Footer';
import { MainSidebar } from '@/src/components/organisms/MainSidebar';
import { SidebarProvider, SidebarInset } from '@/src/components/ui/sidebar';

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen={false}>
      <MainSidebar />
      <SidebarInset className="relative flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 mt-5">
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}