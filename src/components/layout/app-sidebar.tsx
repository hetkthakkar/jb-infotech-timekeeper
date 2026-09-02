import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlarmClock,
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  Fingerprint,
  HandMetal,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Users,
  Wallet,
} from "lucide-react";
import { APP_NAME, APP_SUBTITLE } from "@/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export type NavItem = {
  title: string;
  to: string;
  icon: typeof LayoutDashboard;
  /** Allowed roles; if undefined, available to all authenticated employees */
  roles?: string[];
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "My Attendance", to: "/attendance", icon: ClipboardCheck },
  { title: "Punch", to: "/punch", icon: HandMetal },
  { title: "Manual Punch", to: "/manual-punch", icon: Fingerprint },
  { title: "Leave", to: "/leave", icon: CalendarDays },
  { title: "Warnings", to: "/warnings", icon: ShieldAlert },
  { title: "Employees", to: "/employees", icon: Users, roles: ["admin", "hr", "superadmin"] },
  { title: "Shifts", to: "/shifts", icon: AlarmClock, roles: ["admin", "hr", "manager", "superadmin"] },
  { title: "Payroll", to: "/payroll", icon: Wallet, roles: ["admin", "hr", "superadmin"] },
  { title: "Reports", to: "/reports", icon: BarChart3, roles: ["admin", "hr", "manager", "superadmin"] },
  { title: "Settings", to: "/settings", icon: Settings, roles: ["admin", "hr", "superadmin"] },
];

export function isAuthorized(itemRoles?: string[], userRole?: string): boolean {
  if (!itemRoles || itemRoles.length === 0) return true;
  if (!userRole) return false;
  const normalized = userRole.toLowerCase().trim();
  if (normalized === "admin" || normalized === "superadmin") return true;
  return itemRoles.map((r) => r.toLowerCase()).includes(normalized);
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const userRole = user?.role as string | undefined;

  const visibleItems = NAV_ITEMS.filter((item) => isAuthorized(item.roles, userRole));

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-xs">
          JB
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">{APP_NAME}</p>
          <p className="truncate text-xs text-muted-foreground">{APP_SUBTITLE}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold shadow-xs"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3 bg-sidebar/50">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Backend
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted/60 text-foreground/70">
            {userRole ?? "Staff"}
          </span>
        </div>
      </div>
    </div>
  );
}

