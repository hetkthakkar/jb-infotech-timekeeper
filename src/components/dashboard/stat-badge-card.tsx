import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatBadgeCardProps = {
  label: string;
  value: string | number | ReactNode;
  hint?: string;
  icon?: ReactNode;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
  accentColor?: "primary" | "emerald" | "amber" | "rose" | "blue" | "violet";
  className?: string;
};

const ACCENT_STYLES = {
  primary: "text-primary bg-primary/10 border-primary/20",
  emerald: "text-emerald-700 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-700 bg-amber-500/10 border-amber-500/20",
  rose: "text-rose-700 bg-rose-500/10 border-rose-500/20",
  blue: "text-blue-700 bg-blue-500/10 border-blue-500/20",
  violet: "text-violet-700 bg-violet-500/10 border-violet-500/20",
};

export function StatBadgeCard({
  label,
  value,
  hint,
  icon,
  badgeText,
  badgeVariant = "secondary",
  accentColor = "primary",
  className,
}: StatBadgeCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-border/80 shadow-xs transition-all hover:shadow-sm", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
          {icon ? (
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", ACCENT_STYLES[accentColor])}>
              {icon}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-2">
          <div className="text-xl font-bold tracking-tight text-foreground truncate">
            {value ?? "—"}
          </div>
          {badgeText ? (
            <Badge
              variant={badgeVariant === "success" || badgeVariant === "warning" ? "secondary" : badgeVariant}
              className={cn(
                "shrink-0 font-medium text-[11px] px-2 py-0.5",
                badgeVariant === "success" && "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20",
                badgeVariant === "warning" && "bg-amber-500/15 text-amber-700 hover:bg-amber-500/20",
              )}
            >
              {badgeText}
            </Badge>
          ) : null}
        </div>

        {hint ? <p className="mt-1.5 text-[11px] text-muted-foreground truncate">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
