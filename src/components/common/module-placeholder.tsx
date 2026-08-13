import { Construction } from "lucide-react";
import { SectionCard } from "@/components/common/section-card";

export function ModulePlaceholder({ module }: { module: string }) {
  return (
    <SectionCard
      title={`${module} module`}
      description="Foundation ready — this screen will be wired to the Apps Script backend next."
    >
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Construction className="h-5 w-5" />
        </span>
        <p className="max-w-md text-sm text-muted-foreground">
          The app shell, routing, API service layer, and shared UI primitives are in place. No
          business data is mocked here — {module.toLowerCase()} records will be loaded live from the
          Google Sheets backend.
        </p>
      </div>
    </SectionCard>
  );
}
