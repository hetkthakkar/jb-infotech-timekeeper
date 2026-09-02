import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import type { AttendanceRecord } from "@/services/api";
import { cn } from "@/lib/utils";

export type WeeklyAttendanceOverviewProps = {
  records?: AttendanceRecord[] | undefined;
  loading?: boolean | undefined;
};

export function WeeklyAttendanceOverview({ records = [], loading }: WeeklyAttendanceOverviewProps) {
  if (loading) {
    return (
      <Card className="border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-3.5 w-36 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-28 bg-muted/60 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate weekly summary metrics from backend records
  let totalHours = 0;
  let presentCount = 0;
  let lateCount = 0;

  for (const r of records) {
    if (r.totalHours) {
      const num =
        typeof r.totalHours === "number"
          ? r.totalHours
          : parseFloat(String(r.totalHours).replace(/[^0-9.]/g, ""));
      if (!isNaN(num)) totalHours += num;
    }
    const status = (r.status || "").toLowerCase();
    if (status.includes("present") || (r.firstIn && r.firstIn !== "—")) presentCount++;
    if (r.isLate || status.includes("late")) lateCount++;
  }

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("present") || s.includes("on time")) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 text-[10px] px-1.5 py-0 font-medium">
          Present
        </Badge>
      );
    }
    if (s.includes("late")) {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 text-[10px] px-1.5 py-0 font-medium">
          Late
        </Badge>
      );
    }
    if (s.includes("half")) {
      return (
        <Badge className="bg-orange-500/15 text-orange-700 hover:bg-orange-500/20 text-[10px] px-1.5 py-0 font-medium">
          Half Day
        </Badge>
      );
    }
    if (s.includes("leave")) {
      return (
        <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/20 text-[10px] px-1.5 py-0 font-medium">
          Leave
        </Badge>
      );
    }
    if (s.includes("holiday")) {
      return (
        <Badge className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/20 text-[10px] px-1.5 py-0 font-medium">
          Holiday
        </Badge>
      );
    }
    if (s.includes("off") || s.includes("weekend")) {
      return (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground"
        >
          Off
        </Badge>
      );
    }
    if (s.includes("absent")) {
      return (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-medium">
          Absent
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
        {status || "—"}
      </Badge>
    );
  };

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            Weekly Attendance Overview
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Current week attendance breakdown and logged work hours
          </CardDescription>
        </div>

        {/* Weekly Quick Metrics */}
        {records.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-primary font-medium">
              <Clock className="h-3.5 w-3.5" />
              <span>{totalHours.toFixed(1)} hrs total</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-emerald-700 font-medium">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{presentCount} Days Present</span>
            </div>
            {lateCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-amber-700 font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{lateCount} Late</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-1">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border/70 rounded-lg bg-muted/10 px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-2.5">
              <CalendarDays className="h-5 w-5 opacity-60" />
            </div>
            <p className="text-sm font-medium text-foreground">No weekly records available</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-xs">
              Attendance records for the current period will automatically appear here once punches
              are processed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {records.map((rec, index) => {
              const hasHours = Boolean(rec.totalHours && rec.totalHours !== "—");
              return (
                <div
                  key={rec.id || rec.date || index}
                  className="rounded-lg border border-border/70 bg-card p-3 flex flex-col justify-between space-y-2 hover:border-border transition-colors shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-foreground truncate">{rec.date}</p>
                    {getStatusBadge(rec.status)}
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between text-muted-foreground">
                      <span>IN:</span>
                      <span className="font-mono font-medium text-foreground">
                        {rec.firstIn || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>OUT:</span>
                      <span className="font-mono font-medium text-foreground">
                        {rec.lastOut || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-muted-foreground">Hours:</span>
                    <span
                      className={cn(
                        "font-semibold font-mono",
                        hasHours ? "text-primary font-bold" : "text-muted-foreground",
                      )}
                    >
                      {typeof rec.totalHours === "number"
                        ? `${rec.totalHours.toFixed(1)}h`
                        : rec.totalHours || "—"}
                    </span>
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
