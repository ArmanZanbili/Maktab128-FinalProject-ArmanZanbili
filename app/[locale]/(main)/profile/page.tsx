import { ProfilePageTemplate } from "@/src/components/templates/ProfilePageTemplate";
import { auth } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    return <ProfilePageTemplate />;
}