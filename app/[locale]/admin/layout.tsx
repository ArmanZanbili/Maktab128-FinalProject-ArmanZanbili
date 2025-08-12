import { auth } from "@/src/lib/auth"
import { redirect } from "next/navigation"
import { getLocale } from "next-intl/server"
import { Sidebar } from "@/src/components/organisms/Sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        const locale = await getLocale();
        redirect(`/${locale}/login`)
    }

    return (
        <div className="min-h-screen w-full bg-muted/40">
            <Sidebar />
            <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6 sm:ml-72 rtl:sm:mr-72 rtl:sm:ml-0">
                {children}
            </main>
        </div>
    )
}