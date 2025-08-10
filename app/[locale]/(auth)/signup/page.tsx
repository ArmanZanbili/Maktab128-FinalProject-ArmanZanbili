import { SignupForm } from "@/src/components/organisms/SignupForm";
import { getTranslations } from "next-intl/server";
import { UserPlus } from "lucide-react";

export default async function SignupPage() {
    const t = await getTranslations('SignupPage');
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex w-full max-w-md flex-col items-center space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-lg">
                <UserPlus className="h-12 w-12 mb-2" />
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <SignupForm />
            </div>
        </div>
    );
}