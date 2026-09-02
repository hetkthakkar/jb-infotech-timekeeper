import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarNav } from "@/components/layout/app-sidebar";
import { LoadingState } from "@/components/common/states";
import { useAuth } from "@/lib/auth";

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      void navigate({ to: "/login", replace: true });
    }
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Restoring session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingState label="Redirecting to sign in…" />
      </div>
    );
  }

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
