import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/payroll")({
  head: () => ({
    meta: [
      { title: "Payroll — JB InfoTech" },
      { name: "description", content: "Payroll periods computed from attendance data." },
      { property: "og:title", content: "Payroll — JB InfoTech" },
      { property: "og:description", content: "Payroll periods computed from attendance data." },
    ],
  }),
  component: PayrollPage,
});

function PayrollPage() {
  return (
    <AppShell title="Payroll">
      <PageHeader title="Payroll" description="Payroll runs derived from attendance and leave." />
      <ModulePlaceholder module="Payroll" />
    </AppShell>
  );
}
