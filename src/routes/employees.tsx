import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/employees")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Employees — JB InfoTech Attendance" },
      { name: "description", content: "Employee directory for JB InfoTech's attendance system." },
      { property: "og:title", content: "Employees — JB InfoTech Attendance" },
      {
        property: "og:description",
        content: "Employee directory for JB InfoTech's attendance system.",
      },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <AppShell title="Employees">
      <PageHeader title="Employees" description="Directory of all staff records in the system." />
      <ModulePlaceholder module="Employees" />
    </AppShell>
  );
}
