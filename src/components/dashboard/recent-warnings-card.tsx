import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { WarningRecord } from "@/services/api";
import { cn } from "@/lib/utils";

export type RecentWarningsCardProps = {
  warnings?: WarningRecord[];
  loading?: boolean;
};

export function RecentWarningsCard({ warnings = [], loading }: RecentWarningsCardProps) {
  if (loading) {
    return (
      <Card className="h-full border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-36 bg-muted rounded" />
          <div className="h-3.5 w-24 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-16 bg-muted/60 rounded-lg" />
          <div className="h-16 bg-muted/60 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const getSeverityBadge = (severity?: string) => {
    const s = (severity || "").toLowerCase();
    if (s.includes("high") || s.includes("critical")) {
      return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">High</Badge>;
    }
    if (s.includes("medium")) {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 text-[10px] px-1.5 py-0 font-medium">
          Medium
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
        Low
      </Badge>
    );
  };

  return (
    <Card className="h-full border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Recent Warnings</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Attendance and policy compliance notices
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs text-primary gap-1">
            <Link to="/warnings">
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="pt-1">
          {warnings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-border/70 rounded-lg bg-emerald-500/5 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">Clean Record</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
                You have 0 active attendance warnings or compliance notices. Keep up the great work!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {warnings.slice(0, 3).map((warning, i) => (
                <div
                  key={warning.id || i}
                  className="rounded-lg border border-border/70 bg-card p-3 text-xs shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-foreground truncate">{warning.category || warning.subject}</span>
                    </div>
                    {getSeverityBadge(warning.severity)}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {warning.description || warning.subject}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                    <span>Issued: {warning.date}</span>
                    <span className="font-medium text-foreground">{warning.status || "Active"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
