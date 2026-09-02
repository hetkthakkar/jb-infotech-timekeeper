import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, ClipboardCheck, ShieldAlert, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { SectionCard, StatCard } from "@/components/common/section-card";
import { EmptyState } from "@/components/common/states";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Dashboard — JB InfoTech Attendance" },
      {
        name: "description",
        content:
          "Attendance overview for JB InfoTech: headcount, punches, leave and warnings in one place.",
      },
      { property: "og:title", content: "Dashboard — JB InfoTech Attendance" },
      {
        property: "og:description",
        content: "Attendance overview for JB InfoTech: headcount, punches, leave and warnings.",
      },
    ],
  }),
  component: Dashboard,
});

const STAT_TILES = [
  { label: "Employees", icon: <Users className="h-4 w-4" /> },
  { label: "Present today", icon: <ClipboardCheck className="h-4 w-4" /> },
  { label: "On leave", icon: <CalendarDays className="h-4 w-4" /> },
  { label: "Open warnings", icon: <ShieldAlert className="h-4 w-4" /> },
];

function Dashboard() {
  const { user, isAuthenticated } = useAuth();

  return (
    <AppShell title="Dashboard">
      <PageHeader
        title={isAuthenticated ? `Welcome back, ${user?.name ?? user?.email ?? "there"}` : "Dashboard"}
        description="Live overview of attendance across JB InfoTech."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_TILES.map((tile) => (
          <StatCard key={tile.label} label={tile.label} value="—" hint="Awaiting backend data" icon={tile.icon} />
        ))}
      </div>

      <SectionCard
        title="Today's activity"
        description="Punch events streamed from the Google Sheets backend."
      >
        <EmptyState
          title="No data loaded yet"
          message="Dashboard widgets are wired to the shared API service and will populate once the reporting endpoints are connected."
        />
      </SectionCard>
    </AppShell>
  );
}
