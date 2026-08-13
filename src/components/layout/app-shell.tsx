import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarNav } from "@/components/layout/app-sidebar";

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader {...(title ? { title } : {})} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
