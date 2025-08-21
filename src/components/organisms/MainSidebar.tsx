"use client";

import { Home, Clapperboard, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { Separator } from "../ui/separator";
import { FaFilm } from "react-icons/fa";

export function MainSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const t = useTranslations('Navigation');

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b h-16">
                <Link href="/" className="flex items-center gap-2 p-2">
                    <FaFilm className="h-6 w-6" />
                    <span className="text-lg font-bold sm:inline-block">{t('shopName')}</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/">
                                <Home />
                                <span>Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/products">
                                <Clapperboard />
                                <span>All Movies</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <Separator className="my-2" />
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/contact">
                                <Phone />
                                <span>Contact Us</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}