import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — JB InfoTech" },
      { name: "description", content: "Daily attendance and punch records for JB InfoTech staff." },
      { property: "og:title", content: "Attendance — JB InfoTech" },
      {
        property: "og:description",
        content: "Daily attendance and punch records for JB InfoTech staff.",
      },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  return (
    <AppShell title="Attendance">
      <PageHeader title="Attendance" description="Daily punch in/out logs and worked hours." />
      <ModulePlaceholder module="Attendance" />
    </AppShell>
  );
}
