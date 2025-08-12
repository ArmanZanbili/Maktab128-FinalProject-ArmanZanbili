import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { AdminTemplate } from "@/src/components/templates/AdminTemplate";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        const locale = await getLocale();
        redirect(`/${locale}/login`);
    }

    return (
        <AdminTemplate>
            {children}
        </AdminTemplate>
    );
}