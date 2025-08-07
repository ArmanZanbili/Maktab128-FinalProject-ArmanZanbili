import { LoginForm } from "@/src/components/organisms/LoginForm";
import { getTranslations } from "next-intl/server";
import { ShoppingBag } from "lucide-react";

export default async function LoginPage() {
    const t = await getTranslations('LoginPage');
    return (
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
            <div className="flex w-full max-w-md flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
                <ShoppingBag className="h-12 w-12 mb-2" />
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <LoginForm />
            </div>
        </div>
    );
}