import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/reports")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Reports — JB InfoTech" },
      { name: "description", content: "Attendance, leave, and overtime reporting." },
      { property: "og:title", content: "Reports — JB InfoTech" },
      { property: "og:description", content: "Attendance, leave, and overtime reporting." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AppShell title="Reports">
      <PageHeader
        title="Reports"
        description="Comprehensive company attendance, leave, and analytics reports."
      />
      <ModulePlaceholder module="Reports" />
    </AppShell>
  );
}
