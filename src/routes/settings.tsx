import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/settings")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Settings — JB InfoTech" },
      { name: "description", content: "System settings and company configuration." },
      { property: "og:title", content: "Settings — JB InfoTech" },
      { property: "og:description", content: "System settings and company configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings">
      <PageHeader
        title="Settings"
        description="Company attendance rules, shift policies, and system settings."
      />
      <ModulePlaceholder module="Settings" />
    </AppShell>
  );
}
