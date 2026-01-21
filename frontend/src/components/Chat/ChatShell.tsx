"use client";

import React, { Suspense } from "react";
import AppSidebar from "./AppSidebar";
import Navbar from "@/components/Navbar/index";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ChatShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[var(--bg-main)]">
        {/* Full height sidebar from top to bottom */}
        <Suspense fallback={<div className="w-64 bg-muted animate-pulse" />}>
          <AppSidebar />
        </Suspense>

        <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Navbar shifts automatically when sidebar expands/reduces */}
          <Navbar />
          <main className="flex-1 overflow-hidden relative">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
