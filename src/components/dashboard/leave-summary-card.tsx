import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { LeaveBalance, LeaveRecord } from "@/services/api";

export type LeaveSummaryCardProps = {
  balances?: LeaveBalance | undefined;
  recentLeaves?: LeaveRecord[] | undefined;
  loading?: boolean | undefined;
};

export function LeaveSummaryCard({ balances, recentLeaves = [], loading }: LeaveSummaryCardProps) {
  if (loading) {
    return (
      <Card className="h-full border-border/80 shadow-xs animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 w-36 bg-muted rounded" />
          <div className="h-3.5 w-24 bg-muted rounded mt-1.5" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-muted/60 rounded-lg" />
            <div className="h-16 bg-muted/60 rounded-lg" />
            <div className="h-16 bg-muted/60 rounded-lg" />
          </div>
          <div className="h-20 bg-muted/60 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const clRemaining = balances?.casualLeave ?? 0;
  const slRemaining = balances?.sickLeave ?? 0;
  const elRemaining = balances?.earnedLeave ?? 0;

  const getLeaveStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("approved")) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 text-[10px] px-1.5 py-0 flex items-center gap-1 font-medium">
          <CheckCircle2 className="h-2.5 w-2.5" />
          Approved
        </Badge>
      );
    }
    if (s.includes("pending")) {
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 text-[10px] px-1.5 py-0 flex items-center gap-1 font-medium">
          <Clock className="h-2.5 w-2.5" />
          Pending
        </Badge>
      );
    }
    if (s.includes("rejected")) {
      return (
        <Badge
          variant="destructive"
          className="text-[10px] px-1.5 py-0 flex items-center gap-1 font-medium"
        >
          <XCircle className="h-2.5 w-2.5" />
          Rejected
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
        {status}
      </Badge>
    );
  };

  return (
    <Card className="h-full border-border/80 shadow-xs flex flex-col justify-between">
      <div>
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Leave Summary</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Available balances and recent leave requests
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 px-2 text-xs text-primary gap-1">
            <Link to="/leave">
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {/* 3 Leave Quota Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs">
              <p className="text-[11px] font-medium text-muted-foreground">Casual (CL)</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{clRemaining}</p>
              <p className="text-[10px] text-muted-foreground">Days Left</p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs">
              <p className="text-[11px] font-medium text-muted-foreground">Sick (SL)</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{slRemaining}</p>
              <p className="text-[10px] text-muted-foreground">Days Left</p>
            </div>

            <div className="rounded-lg border border-border/70 bg-card p-2.5 shadow-2xs">
              <p className="text-[11px] font-medium text-muted-foreground">Earned (EL)</p>
              <p className="text-lg font-bold text-foreground mt-0.5">{elRemaining}</p>
              <p className="text-[10px] text-muted-foreground">Days Left</p>
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Recent Requests</p>
            {recentLeaves.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 p-4 text-center bg-muted/10">
                <p className="text-xs text-muted-foreground">No recent leave applications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeaves.slice(0, 3).map((leave, i) => (
                  <div
                    key={leave.id || i}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-card p-2.5 text-xs shadow-2xs"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-foreground">{leave.leaveType}</span>
                        <span className="text-[11px] text-muted-foreground">
                          ({leave.days} {leave.days === 1 ? "day" : "days"})
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {leave.startDate}{" "}
                        {leave.endDate && leave.endDate !== leave.startDate
                          ? `to ${leave.endDate}`
                          : ""}
                        {leave.reason ? ` • ${leave.reason}` : ""}
                      </p>
                    </div>
                    {getLeaveStatusBadge(leave.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <div className="px-6 pb-4 pt-2">
        <Button variant="outline" size="sm" asChild className="w-full text-xs h-8">
          <Link to="/leave">Apply for Leave</Link>
        </Button>
      </div>
    </Card>
  );
}
