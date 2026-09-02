import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  AlarmClock,
  Clock,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  attendanceApi,
  punchApi,
  type AttendanceRecord,
  type PunchRecord,
} from "@/services/api";
import { PunchActionCard } from "@/components/punch/punch-action-card";
import { TodayPunchHistory } from "@/components/punch/today-punch-history";
import { toast } from "sonner";

export const Route = createFileRoute("/punch")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Punch Attendance — JB InfoTech" },
      {
        name: "description",
        content: "Record daily biometric, web, and digital clock IN / OUT punches.",
      },
      { property: "og:title", content: "Punch Attendance — JB InfoTech" },
      {
        property: "og:description",
        content: "Record daily biometric, web, and digital clock IN / OUT punches.",
      },
    ],
  }),
  component: PunchPage,
});

function PunchPage() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || user?.id || "";
  const employeeName = user?.name || user?.email?.split("@")[0] || "Employee";
  const userRole = (user?.role as string) || "Staff";
  const shiftName = (user?.shift as string) || "General Shift (09:30 AM - 06:30 PM)";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [todayPunches, setTodayPunches] = useState<PunchRecord[]>([]);

  const [locationStatus, setLocationStatus] = useState<{
    latitude: number | null;
    longitude: number | null;
    status: "idle" | "requesting" | "available" | "denied" | "unavailable";
    message?: string;
  }>({
    latitude: null,
    longitude: null,
    status: "idle",
  });

  // Request browser geolocation coordinates
  const acquireLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationStatus({ latitude: null, longitude: null, status: "unavailable" });
      return;
    }

    setLocationStatus((prev) => ({ ...prev, status: "requesting" }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          status: "available",
        });
      },
      (err) => {
        setLocationStatus({
          latitude: null,
          longitude: null,
          status: err.code === 1 ? "denied" : "unavailable",
          message: err.message,
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  const fetchPunchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);

    try {
      const [attRes, punchesRes] = await Promise.allSettled([
        attendanceApi.getToday(employeeId).catch(() => attendanceApi.list({ employeeId, limit: 1 })),
        punchApi.getToday(employeeId).catch(() => punchApi.list({ employeeId })),
      ]);

      if (attRes.status === "fulfilled" && attRes.value) {
        const val = attRes.value;
        if (Array.isArray(val)) {
          setTodayAttendance(val.length > 0 ? (val[0] as AttendanceRecord) : null);
        } else {
          setTodayAttendance(val as AttendanceRecord);
        }
      } else {
        setTodayAttendance(null);
      }

      if (punchesRes.status === "fulfilled" && Array.isArray(punchesRes.value)) {
        setTodayPunches(punchesRes.value as PunchRecord[]);
      } else {
        setTodayPunches([]);
      }
    } catch {
      // Graceful error handling
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [employeeId]);

  useEffect(() => {
    acquireLocation();
    void fetchPunchData();
  }, [acquireLocation, fetchPunchData]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchPunchData(true);
    toast.success("Attendance and punch records updated");
  };

  const handlePunch = async (type: "IN" | "OUT", remarks?: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await punchApi.punch({
        employeeId,
        type,
        source: "App",
        latitude: locationStatus.latitude,
        longitude: locationStatus.longitude,
        remarks,
      });

      const recordedTime = result?.timestampIST || result?.TimestampIST || result?.timestamp || "just now";
      toast.success(`Successfully punched ${type} at ${recordedTime}`);
      
      // Reload punch records and today's attendance summary
      await fetchPunchData(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to record punch ${type}. Please try again.`;
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFirstIn = Boolean(todayAttendance?.firstIn && todayAttendance.firstIn !== "—");
  const hasLastOut = Boolean(todayAttendance?.lastOut && todayAttendance.lastOut !== "—");

  return (
    <AppShell title="Punch">
      <PageHeader
        title="Employee Punch Action"
        description="Live biometric and digital clock in/out recording connected to Google Sheets."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing || loading || isSubmitting}
            className="h-8 gap-1.5 text-xs shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
          </Button>
        }
      />

      {/* 3 Quick Shift / Attendance Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <Card className="border-border/80 shadow-2xs">
          <CardContent className="p-3.5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AlarmClock className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">Assigned Shift</p>
              <p className="text-xs font-bold text-foreground truncate">{shiftName}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-2xs">
          <CardContent className="p-3.5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
              <LogIn className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">First IN Today</p>
              <p className="text-xs font-bold text-foreground truncate">
                {todayAttendance?.firstIn || (todayPunches.find((p) => (p.type || p.Type)?.toUpperCase() === "IN")?.timestampIST) || "Not punched yet"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-2xs">
          <CardContent className="p-3.5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700">
              <LogOut className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground">Last OUT Today</p>
              <p className="text-xs font-bold text-foreground truncate">
                {todayAttendance?.lastOut || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Punch Action Card */}
      <div className="mb-6">
        <PunchActionCard
          employeeName={employeeName}
          employeeId={employeeId}
          userRole={userRole}
          shiftName={shiftName}
          todayAttendance={todayAttendance}
          todayPunches={todayPunches}
          isSubmitting={isSubmitting}
          onPunch={handlePunch}
          errorMessage={errorMessage}
          onClearError={() => setErrorMessage(null)}
          locationStatus={locationStatus}
        />
      </div>

      {/* Today's Punch History */}
      <div>
        <TodayPunchHistory punches={todayPunches} loading={loading} />
      </div>
    </AppShell>
  );
}
