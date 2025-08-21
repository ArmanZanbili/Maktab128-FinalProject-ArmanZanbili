"use client";

import * as React from 'react';
import { Home, Clapperboard, Phone, ChevronRight } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Category, Subcategory } from '@/types/movie';
import { Button } from '../ui/button';

interface MainSidebarProps extends React.ComponentProps<typeof Sidebar> {
    categories: Category[];
    subcategories: Subcategory[];
}

export function MainSidebar({ categories, subcategories, ...props }: MainSidebarProps) {
    const t = useTranslations('Navigation');

    return (
        <Sidebar {...props}>
            <SidebarHeader className="border-b h-16">
                <Link href="/" className="flex items-center gap-2 p-2">
                    <span className="text-lg font-bold sm-inline-block">{t('shopName')}</span>
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

                    <Separator className="my-2" />

                    {categories.map(category => {
                        const relevantSubcategories = subcategories.filter(sub => {
                            const parentId = typeof sub.category === 'string' ? sub.category : sub.category._id;
                            return parentId === category._id;
                        });
                        return (
                            <Collapsible key={category._id} asChild>
                                <SidebarMenuItem>
                                    <div className="flex w-full items-center">
                                        <SidebarMenuButton asChild className="flex-1">
                                            <Link href={`/category/${category.slugname}`}>
                                                <Clapperboard />
                                                <span>{category.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {relevantSubcategories.length > 0 && (
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                    <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        )}
                                    </div>
                                    {relevantSubcategories.length > 0 && (
                                        <CollapsibleContent>
                                            <div className="pl-8 pt-1">
                                                {relevantSubcategories.map(sub => (
                                                    <SidebarMenuButton asChild key={sub._id} className="h-8 w-full justify-start">
                                                        <Link href={`/category/${category.slugname}/${sub.slugname}`}>{sub.name}</Link>
                                                    </SidebarMenuButton>
                                                ))}
                                            </div>
                                        </CollapsibleContent>
                                    )}
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    })}

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