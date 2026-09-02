import { Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  IdCard,
  LogOut,
  Mail,
  Menu,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "@/components/layout/app-sidebar";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AppHeader({ title }: { title?: string }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDateStr(formatted);
  }, []);

  const employeeName = user?.name || user?.email?.split("@")[0] || "Employee";
  const employeeId = user?.employeeId || user?.id || "JBIT-EMP";
  const role = (user?.role as string) || "Staff";

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    void navigate({ to: "/login", replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-md lg:px-6 shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
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

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-semibold text-foreground tracking-tight">
              {title ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0 text-primary/70" />
            <span className="font-medium text-foreground/80">{currentDateStr || "Today"}</span>
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-muted/70 focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-left"
                aria-label="User profile menu"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 shadow-2xs">
                  {employeeName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden text-left md:block min-w-0 max-w-44">
                  <p className="truncate text-xs font-semibold text-foreground leading-snug">
                    {employeeName}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground leading-tight">
                    <span className="font-mono text-[10px] text-primary/90 font-medium">
                      #{employeeId}
                    </span>
                    <span>•</span>
                    <span className="capitalize text-muted-foreground">{role}</span>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 shadow-lg">
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {employeeName}
                  </p>
                  <div className="flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground">
                    <IdCard className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="font-mono text-xs">{employeeId}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                      <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1">
                    <Shield className="h-3 w-3 text-primary shrink-0" />
                    <span className="text-[11px] uppercase font-semibold text-primary tracking-wide px-1.5 py-0.5 rounded bg-primary/10">
                      {role}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/attendance" className="cursor-pointer flex items-center gap-2 text-xs">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>My Attendance Log</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick direct logout button on desktop */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
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
