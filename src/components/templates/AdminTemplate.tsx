"use client";

import { useState } from "react";
import { Sidebar } from "@/src/components/organisms/Sidebar";
import { cn } from "@/src/lib/utils";

export function AdminTemplate({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen w-full bg-muted/40">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
            />
            <main
                className={cn(
                    "flex flex-1 flex-col gap-4 p-4 transition-all duration-300 ease-in-out sm:gap-6 sm:p-6",
                    isSidebarCollapsed ? "sm:ml-16" : "sm:ml-72",
                    "rtl:sm:ml-0",
                    isSidebarCollapsed ? "rtl:sm:mr-16" : "rtl:sm:mr-72"
                )}
            >
                {children}
            </main>
        </div>
    );
}