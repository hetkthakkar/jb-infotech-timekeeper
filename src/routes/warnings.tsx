import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/warnings")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Warnings — JB InfoTech" },
      { name: "description", content: "Attendance warnings and disciplinary notices." },
      { property: "og:title", content: "Warnings — JB InfoTech" },
      { property: "og:description", content: "Attendance warnings and disciplinary notices." },
    ],
  }),
  component: WarningsPage,
});

function WarningsPage() {
  return (
    <AppShell title="Warnings">
      <PageHeader title="Warnings" description="Issued warnings and escalation history." />
      <ModulePlaceholder module="Warnings" />
    </AppShell>
  );
}
