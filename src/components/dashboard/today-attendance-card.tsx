import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import type { AttendanceRecord } from "@/services/api";
import { cn } from "@/lib/utils";

export type TodayAttendanceCardProps = {
  record?: AttendanceRecord | null | undefined;
  shiftName?: string | undefined;
  shiftTime?: string | undefined;
  loading?: boolean | undefined;
};

export function TodayAttendanceCard({
  record,
  shiftName = "General Shift",
  shiftTime = "09:30 AM - 06:30 PM",
  loading,
}: TodayAttendanceCardProps) {
  if (loading) {
    return (
      <Card className="h-full border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-3.5 w-28 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-16 bg-muted/60 rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 bg-muted/60 rounded-lg" />
            <div className="h-14 bg-muted/60 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasFirstIn = Boolean(record?.firstIn && record.firstIn !== "—");
  const hasLastOut = Boolean(record?.lastOut && record.lastOut !== "—");
  const status = record?.status || (hasFirstIn ? "Present" : "Not Punched In");
  const totalHours =
    record?.totalHours !== undefined && record.totalHours !== ""
      ? record.totalHours
      : hasFirstIn
        ? "In Progress"
        : "0 hrs";

  const getStatusBadge = (st: string) => {
    const s = st.toLowerCase();
    if (s.includes("present") || s.includes("on time")) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 flex items-center gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3" />
          {st}
        </Badge>
      );
    }
    if (s.includes("late") || s.includes("half day")) {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          {st}
        </Badge>
      );
    }
    if (s.includes("leave") || s.includes("absent")) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          {st}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-xs">
        {st}
      </Badge>
    );
  };

  return (
    <Card className="h-full border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Today's Attendance Summary
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Shift: {record?.shiftName || shiftName} (
                {record?.shiftStart && record?.shiftEnd
                  ? `${record.shiftStart} - ${record.shiftEnd}`
                  : shiftTime}
                )
              </span>
            </CardDescription>
          </div>
          {getStatusBadge(status)}
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* Main Working Hours Banner */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Working Hours</p>
                <p className="text-lg font-bold text-foreground">
                  {typeof totalHours === "number" ? `${totalHours.toFixed(1)} hrs` : totalHours}
                </p>
              </div>
            </div>
            {record?.punchCount ? (
              <div className="text-right">
                <span className="text-[11px] font-medium text-muted-foreground">Punches</span>
                <p className="text-sm font-semibold text-foreground">{record.punchCount} records</p>
              </div>
            ) : null}
          </div>

          {/* First In & Last Out Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/70 bg-card p-3 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <LogIn className="h-3.5 w-3.5 text-emerald-600" />
                <span>First IN</span>
              </div>
              <p
                className={cn(
                  "text-base font-semibold",
                  hasFirstIn ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {record?.firstIn || "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {hasFirstIn ? (record?.isLate ? "Late arrival" : "On time") : "No punch recorded"}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-3 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <LogOut className="h-3.5 w-3.5 text-blue-600" />
                <span>Last OUT</span>
              </div>
              <p
                className={cn(
                  "text-base font-semibold",
                  hasLastOut ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {record?.lastOut || "—"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {hasLastOut ? "Recorded" : hasFirstIn ? "Shift in progress" : "Awaiting punch"}
              </p>
            </div>
          </div>
        </CardContent>
      </div>

      {record?.remarks ? (
        <div className="px-6 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/50 bg-muted/20">
          <span className="font-medium text-foreground">Remarks: </span>
          {record.remarks}
        </div>
      ) : null}
    </Card>
  );
}
