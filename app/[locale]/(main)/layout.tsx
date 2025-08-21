import { Header } from '@/src/components/organisms/Header';
import { Footer } from '@/src/components/organisms/Footer';
import { MainSidebar } from '@/src/components/organisms/MainSidebar';
import { SidebarProvider, SidebarInset } from '@/src/components/ui/sidebar';
import { getCategories } from '@/src/services/categoryService';
import { getSubcategories } from '@/src/services/subcategoryService';
import { auth } from '@/src/lib/auth';

type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  const session = await auth();
  const token = session?.user.accessToken ?? null;

  const categoriesData = await getCategories(token, { limit: 100 });
  const subcategoriesData = await getSubcategories(token, { limit: 1000 });

  const categories = categoriesData?.data?.categories || [];
  const subcategories = subcategoriesData?.data?.subcategories || [];

  return (
    <SidebarProvider defaultOpen={false}>
      <MainSidebar categories={categories} subcategories={subcategories} />
      <SidebarInset className="relative flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 mt-4">
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}