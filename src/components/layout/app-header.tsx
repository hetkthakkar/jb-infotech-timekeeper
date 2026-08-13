import { Link } from "@tanstack/react-router";
import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/app-sidebar";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { toast } from "sonner";

export function AppHeader({ title }: { title?: string }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur lg:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title ?? "Dashboard"}</p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          Internal HR &amp; attendance workspace
        </p>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user?.name ?? user?.email ?? "User"}</p>
            <p className="text-xs capitalize text-muted-foreground">{user?.role ?? "member"}</p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <User className="h-4 w-4" />
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              toast.success("Signed out");
            }}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      ) : (
        <Button asChild size="sm">
          <Link to="/login">Sign in</Link>
        </Button>
      )}
    </header>
  );
}
