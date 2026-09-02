import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/manual-punch")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Manual Punch — JB InfoTech" },
      { name: "description", content: "Record and approve manual punch corrections." },
      { property: "og:title", content: "Manual Punch — JB InfoTech" },
      { property: "og:description", content: "Record and approve manual punch corrections." },
    ],
  }),
  component: ManualPunchPage,
});

function ManualPunchPage() {
  return (
    <AppShell title="Manual Punch">
      <PageHeader
        title="Manual Punch"
        description="Corrections and manual entries with audit trail."
      />
      <ModulePlaceholder module="Manual Punch" />
    </AppShell>
  );
}
