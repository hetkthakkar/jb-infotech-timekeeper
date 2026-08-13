import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlarmClock,
  CalendarDays,
  ClipboardCheck,
  Fingerprint,
  LayoutDashboard,
  ShieldAlert,
  Users,
  Wallet,
} from "lucide-react";
import { APP_NAME, APP_SUBTITLE } from "@/config";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { title: "Dashboard", to: "/", icon: LayoutDashboard },
  { title: "Employees", to: "/employees", icon: Users },
  { title: "Attendance", to: "/attendance", icon: ClipboardCheck },
  { title: "Shifts", to: "/shifts", icon: AlarmClock },
  { title: "Manual Punch", to: "/manual-punch", icon: Fingerprint },
  { title: "Leave", to: "/leave", icon: CalendarDays },
  { title: "Warnings", to: "/warnings", icon: ShieldAlert },
  { title: "Payroll", to: "/payroll", icon: Wallet },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          JB
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-sidebar-foreground">{APP_NAME}</p>
          <p className="text-xs text-muted-foreground">{APP_SUBTITLE}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-3">
        <p className="text-[11px] text-muted-foreground">Connected to Google Sheets backend</p>
      </div>
    </div>
  );
}
