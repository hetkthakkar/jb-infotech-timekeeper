import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Fingerprint,
  IdCard,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  MessageSquare,
  ShieldAlert,
  User,
} from "lucide-react";
import { LiveClock } from "@/components/punch/live-clock";
import type { AttendanceRecord, PunchRecord } from "@/services/api";
import { cn } from "@/lib/utils";

export type PunchActionCardProps = {
  employeeName: string;
  employeeId: string;
  userRole?: string | undefined;
  shiftName?: string | undefined;
  todayAttendance?: AttendanceRecord | null | undefined;
  todayPunches?: PunchRecord[] | undefined;
  isSubmitting?: boolean | undefined;
  onPunch: (type: "IN" | "OUT", remarks?: string | undefined) => Promise<void>;
  errorMessage?: string | null | undefined;
  onClearError?: (() => void) | undefined;
  locationStatus?:
    | {
        latitude: number | null;
        longitude: number | null;
        status: "idle" | "requesting" | "available" | "denied" | "unavailable";
        message?: string | undefined;
      }
    | undefined;
};

export function PunchActionCard({
  employeeName,
  employeeId,
  userRole = "Staff",
  shiftName = "General Shift",
  todayAttendance,
  todayPunches = [],
  isSubmitting = false,
  onPunch,
  errorMessage,
  locationStatus,
}: PunchActionCardProps) {
  const [remarks, setRemarks] = useState("");

  // Determine punch sequence and next expected action
  const lastPunch = todayPunches.length > 0 ? todayPunches[todayPunches.length - 1] : null;
  const lastPunchType = (lastPunch?.type || lastPunch?.Type || "").toUpperCase();

  // Calculation: Has user punched IN without an OUT?
  const isCurrentlyIn = lastPunchType === "IN";
  const hasPunchedToday = todayPunches.length > 0;

  // Completed day flag (if marked completed by backend or 2+ complete pairs)
  const isAttendanceCompleted =
    (todayAttendance?.status || "").toLowerCase().includes("completed") ||
    (todayPunches.length >= 4 && lastPunchType === "OUT");

  const nextActionType: "IN" | "OUT" = isCurrentlyIn ? "OUT" : "IN";

  const handleAction = async () => {
    if (isSubmitting) return;
    await onPunch(nextActionType, remarks.trim() || undefined);
    setRemarks("");
  };

  // Status badge logic
  const attendanceStatus =
    todayAttendance?.status ||
    (isCurrentlyIn ? "Checked IN (Working)" : hasPunchedToday ? "Checked OUT" : "Not Punched IN");

  return (
    <Card className="border-border/80 shadow-md overflow-hidden bg-card">
      {/* Top Banner with Employee & Shift Info */}
      <CardHeader className="bg-muted/30 border-b border-border/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-xs">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  {employeeName}
                </h2>
                <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                  {userRole}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1 font-mono">
                  <IdCard className="h-3 w-3 text-primary" />
                  {employeeId}
                </span>
                <span>•</span>
                <span>Shift: {shiftName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs text-muted-foreground">Today's Status:</span>
            <Badge
              className={cn(
                "text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1.5 shadow-2xs",
                isCurrentlyIn
                  ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30"
                  : hasPunchedToday
                    ? "bg-blue-500/15 text-blue-700 border-blue-500/30"
                    : "bg-muted text-muted-foreground border-border",
              )}
            >
              {isCurrentlyIn ? (
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {attendanceStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-7 space-y-6">
        {/* Backend Error Alert if any */}
        {errorMessage ? (
          <Alert variant="destructive" className="border-destructive/40 shadow-xs">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Punch Validation Notice</AlertTitle>
            <AlertDescription className="text-xs mt-1">{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {/* Live Clock Display */}
        <LiveClock />

        {/* Action Button Section */}
        <div className="flex flex-col items-center justify-center space-y-4 pt-2">
          {isAttendanceCompleted ? (
            <div className="w-full max-w-md rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center shadow-xs">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-500 text-white mb-2 shadow-xs">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-base font-bold text-emerald-800">Attendance Completed</p>
              <p className="text-xs text-emerald-700 mt-1">
                You have recorded all punches for today. Thank you for your work!
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  disabled={isSubmitting}
                  className="text-xs text-emerald-800 border-emerald-500/40 hover:bg-emerald-500/20 h-8"
                >
                  Record Additional Punch IN
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md flex flex-col items-center space-y-3">
              <Button
                size="lg"
                onClick={handleAction}
                disabled={isSubmitting}
                className={cn(
                  "w-full h-16 sm:h-18 rounded-2xl text-base sm:text-lg font-bold tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer",
                  nextActionType === "IN"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20",
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>RECORDING {nextActionType}…</span>
                  </>
                ) : (
                  <>
                    {nextActionType === "IN" ? (
                      <LogIn className="h-6 w-6" />
                    ) : (
                      <LogOut className="h-6 w-6" />
                    )}
                    <span>PUNCH {nextActionType}</span>
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {nextActionType === "IN"
                  ? "Click to record your entry timestamp for today's shift."
                  : "Click to record your exit timestamp or lunch/break departure."}
              </p>
            </div>
          )}

          {/* Optional Remarks Input */}
          <div className="w-full max-w-md space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span>Remarks / Note (Optional)</span>
            </div>
            <Input
              type="text"
              placeholder="e.g. Working from remote location, client meeting..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
              className="text-xs h-9 bg-muted/20"
            />
          </div>

          {/* Geolocation Status Indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            {locationStatus?.status === "available" ? (
              <span className="text-emerald-700 font-medium">
                GPS Location Captured ({locationStatus.latitude?.toFixed(4)},{" "}
                {locationStatus.longitude?.toFixed(4)})
              </span>
            ) : locationStatus?.status === "requesting" ? (
              <span className="text-primary flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Acquiring GPS location…
              </span>
            ) : locationStatus?.status === "denied" ? (
              <span className="text-amber-700 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" /> Location permission off (Web punch enabled)
              </span>
            ) : (
              <span>Location tagged with Web device source</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
