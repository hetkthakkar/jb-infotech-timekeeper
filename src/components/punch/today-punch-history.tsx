import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, LogIn, LogOut, Laptop, Smartphone, MapPin, Tag } from "lucide-react";
import type { PunchRecord } from "@/services/api";
import { cn } from "@/lib/utils";

export type TodayPunchHistoryProps = {
  punches?: PunchRecord[];
  loading?: boolean;
};

export function TodayPunchHistory({ punches = [], loading }: TodayPunchHistoryProps) {
  if (loading) {
    return (
      <Card className="border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-3.5 w-28 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-12 bg-muted/60 rounded-lg" />
          <div className="h-12 bg-muted/60 rounded-lg" />
          <div className="h-12 bg-muted/60 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const getSourceIcon = (source?: string) => {
    const s = (source || "").toLowerCase();
    if (s.includes("app") || s.includes("mobile")) return <Smartphone className="h-3.5 w-3.5" />;
    if (s.includes("web")) return <Laptop className="h-3.5 w-3.5" />;
    return <Fingerprint className="h-3.5 w-3.5" />;
  };

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">Today's Punch History</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Complete sequential log of IN and OUT events recorded for today
          </CardDescription>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {punches.length} {punches.length === 1 ? "Event" : "Events"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-1">
        {punches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/70 rounded-xl bg-muted/10 px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <Fingerprint className="h-6 w-6 opacity-60" />
            </div>
            <p className="text-sm font-semibold text-foreground">No punches recorded today</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Use the action card above to punch IN and start tracking your work hours for today.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {punches.map((punch, idx) => {
              const punchType = (punch.type || punch.Type || "IN").toUpperCase();
              const isIN = punchType === "IN";
              const timeDisplay =
                punch.timestampIST ||
                punch.TimestampIST ||
                punch.timestamp ||
                (punch.date ? `${punch.date}` : "—");
              const sourceDisplay = punch.source || punch.Source || "App";
              const statusDisplay = punch.status || punch.Status || "Recorded";
              const remarksDisplay = punch.remarks || punch.Remarks;
              const lat = punch.latitude ?? punch.Latitude;
              const lng = punch.longitude ?? punch.Longitude;

              return (
                <div
                  key={punch.punchId || punch.PunchID || punch.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3.5 shadow-2xs hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-2xs",
                        isIN
                          ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                          : "bg-blue-500/15 text-blue-700 border border-blue-500/30"
                      )}
                    >
                      {isIN ? <LogIn className="h-4 w-4" /> : <LogOut className="h-4 w-4" />}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-bold text-xs px-2 py-0.5 rounded",
                            isIN
                              ? "bg-emerald-500/15 text-emerald-700"
                              : "bg-blue-500/15 text-blue-700"
                          )}
                        >
                          {punchType}
                        </span>
                        <span className="font-mono text-sm font-bold text-foreground">
                          {timeDisplay}
                        </span>
                      </div>

                      {remarksDisplay ? (
                        <p className="text-xs text-foreground/80 italic mt-1">
                          "{remarksDisplay}"
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs self-end sm:self-center">
                    <span className="flex items-center gap-1 text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/50">
                      {getSourceIcon(sourceDisplay)}
                      <span>{sourceDisplay}</span>
                    </span>

                    {lat && lng ? (
                      <span className="flex items-center gap-1 text-muted-foreground bg-muted/40 px-2 py-1 rounded-md border border-border/50 font-mono text-[11px]">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{typeof lat === "number" ? lat.toFixed(3) : lat}, {typeof lng === "number" ? lng.toFixed(3) : lng}</span>
                      </span>
                    ) : null}

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] font-medium",
                        statusDisplay.toLowerCase().includes("late") && "border-amber-500/40 text-amber-700 bg-amber-500/10",
                        statusDisplay.toLowerCase().includes("valid") && "border-emerald-500/40 text-emerald-700 bg-emerald-500/10"
                      )}
                    >
                      <Tag className="h-2.5 w-2.5 mr-1" />
                      {statusDisplay}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
