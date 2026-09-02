import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, LogIn, LogOut, Laptop, Smartphone, MapPin } from "lucide-react";
import type { PunchRecord } from "@/services/api";
import { cn } from "@/lib/utils";

export type PunchTimelineProps = {
  punches?: PunchRecord[];
  loading?: boolean;
};

export function PunchTimeline({ punches = [], loading }: PunchTimelineProps) {
  if (loading) {
    return (
      <Card className="h-full border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-3.5 w-24 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-10 bg-muted/60 rounded" />
          <div className="h-10 bg-muted/60 rounded" />
          <div className="h-10 bg-muted/60 rounded" />
        </CardContent>
      </Card>
    );
  }

  const getSourceIcon = (source?: string) => {
    const s = (source || "").toLowerCase();
    if (s.includes("mobile") || s.includes("app")) return <Smartphone className="h-3 w-3" />;
    if (s.includes("web")) return <Laptop className="h-3 w-3" />;
    return <Fingerprint className="h-3 w-3" />;
  };

  return (
    <Card className="h-full border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Punch Timeline</CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {punches.length} {punches.length === 1 ? "punch" : "punches"}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Chronological punch sequence recorded today
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-1">
          {punches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/70 rounded-lg bg-muted/10 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2.5">
                <Fingerprint className="h-5 w-5 opacity-60" />
              </div>
              <p className="text-sm font-medium text-foreground">No punches recorded today</p>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
                Punch in using the terminal or biometric system to log your attendance.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {punches.map((punch, idx) => {
                const isIN = punch.type?.toUpperCase() === "IN";
                return (
                  <div key={punch.id || idx} className="relative flex items-start gap-3 text-xs">
                    {/* Timeline bullet */}
                    <span
                      className={cn(
                        "absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-card",
                        isIN
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-600 text-white"
                      )}
                    >
                      {isIN ? <LogIn className="h-2.5 w-2.5" /> : <LogOut className="h-2.5 w-2.5" />}
                    </span>

                    <div className="flex-1 rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs hover:border-border transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            "font-semibold text-xs px-2 py-0.5 rounded",
                            isIN
                              ? "bg-emerald-500/15 text-emerald-700 font-bold"
                              : "bg-blue-500/15 text-blue-700 font-bold"
                          )}
                        >
                          PUNCH {punch.type?.toUpperCase()}
                        </span>
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {punch.timestamp}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {punch.source ? (
                          <span className="flex items-center gap-1">
                            {getSourceIcon(punch.source)}
                            <span>{punch.source}</span>
                          </span>
                        ) : null}

                        {punch.location ? (
                          <span className="flex items-center gap-1 truncate max-w-40">
                            <MapPin className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                            <span className="truncate">{punch.location}</span>
                          </span>
                        ) : null}

                        {punch.remarks ? (
                          <span className="italic text-foreground/70">
                            "{punch.remarks}"
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
