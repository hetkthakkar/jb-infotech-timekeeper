import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/shifts")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Shifts — JB InfoTech" },
      { name: "description", content: "Shift schedules and assignments for JB InfoTech teams." },
      { property: "og:title", content: "Shifts — JB InfoTech" },
      {
        property: "og:description",
        content: "Shift schedules and assignments for JB InfoTech teams.",
      },
    ],
  }),
  component: ShiftsPage,
});

function ShiftsPage() {
  return (
    <AppShell title="Shifts">
      <PageHeader title="Shifts" description="Shift definitions, timings and assignments." />
      <ModulePlaceholder module="Shifts" />
    </AppShell>
  );
}
