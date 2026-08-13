import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/leave")({
  head: () => ({
    meta: [
      { title: "Leave — JB InfoTech" },
      { name: "description", content: "Leave requests, balances and approvals." },
      { property: "og:title", content: "Leave — JB InfoTech" },
      { property: "og:description", content: "Leave requests, balances and approvals." },
    ],
  }),
  component: LeavePage,
});

function LeavePage() {
  return (
    <AppShell title="Leave">
      <PageHeader title="Leave" description="Requests, balances and approval workflow." />
      <ModulePlaceholder module="Leave" />
    </AppShell>
  );
}
