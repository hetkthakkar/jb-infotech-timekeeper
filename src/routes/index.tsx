import { requireAuth } from "@/lib/auth-guard";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Fingerprint,
  Hourglass,
  LogIn,
  LogOut,
  Palmtree,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";
import {
  attendanceApi,
  leaveApi,
  manualPunchApi,
  punchApi,
  warningsApi,
  type AttendanceRecord,
  type LeaveBalance,
  type LeaveRecord,
  type ManualPunchRequest,
  type PunchRecord,
  type WarningRecord,
} from "@/services/api";

import { StatBadgeCard } from "@/components/dashboard/stat-badge-card";
import { TodayAttendanceCard } from "@/components/dashboard/today-attendance-card";
import { PunchTimeline } from "@/components/dashboard/punch-timeline";
import { WeeklyAttendanceOverview } from "@/components/dashboard/weekly-attendance-overview";
import { LeaveSummaryCard } from "@/components/dashboard/leave-summary-card";
import { RecentWarningsCard } from "@/components/dashboard/recent-warnings-card";
import { PendingManualPunchesCard } from "@/components/dashboard/pending-manual-punches-card";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  beforeLoad: requireAuth,
  head: () => ({
    meta: [
      { title: "Dashboard — JB InfoTech Attendance" },
      {
        name: "description",
        content: "Real-time employee attendance dashboard for JB InfoTech.",
      },
      { property: "og:title", content: "Dashboard — JB InfoTech Attendance" },
      {
        property: "og:description",
        content: "Real-time employee attendance dashboard for JB InfoTech.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || user?.id || "";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real backend data states
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [weeklyAttendance, setWeeklyAttendance] = useState<AttendanceRecord[]>([]);
  const [todayPunches, setTodayPunches] = useState<PunchRecord[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance | undefined>(undefined);
  const [recentLeaves, setRecentLeaves] = useState<LeaveRecord[]>([]);
  const [activeWarnings, setActiveWarnings] = useState<WarningRecord[]>([]);
  const [pendingManualPunches, setPendingManualPunches] = useState<ManualPunchRequest[]>([]);

  const fetchDashboardData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      setError(null);

      try {
        // Parallel fetch from Google Apps Script endpoints
        const results = await Promise.allSettled([
          attendanceApi
            .getToday(employeeId)
            .catch(() => attendanceApi.list({ employeeId, limit: 1 })),
          attendanceApi
            .getWeekly(employeeId)
            .catch(() => attendanceApi.list({ employeeId, limit: 7 })),
          punchApi.getToday(employeeId).catch(() => punchApi.list({ employeeId })),
          leaveApi.getBalances(employeeId).catch(() => undefined),
          leaveApi.list({ employeeId }),
          warningsApi.getActive(employeeId).catch(() => warningsApi.list({ employeeId })),
          manualPunchApi.getPending(employeeId).catch(() => manualPunchApi.list({ employeeId })),
        ]);

        // Parse Today Attendance
        if (results[0].status === "fulfilled" && results[0].value) {
          const val = results[0].value;
          if (Array.isArray(val)) {
            setTodayAttendance(val.length > 0 ? (val[0] as AttendanceRecord) : null);
          } else {
            setTodayAttendance(val as AttendanceRecord);
          }
        } else {
          setTodayAttendance(null);
        }

        // Parse Weekly Attendance
        if (results[1].status === "fulfilled" && Array.isArray(results[1].value)) {
          setWeeklyAttendance(results[1].value as AttendanceRecord[]);
        } else {
          setWeeklyAttendance([]);
        }

        // Parse Today Punches
        if (results[2].status === "fulfilled" && Array.isArray(results[2].value)) {
          setTodayPunches(results[2].value as PunchRecord[]);
        } else {
          setTodayPunches([]);
        }

        // Parse Leave Balances
        if (results[3].status === "fulfilled" && results[3].value) {
          setLeaveBalances(results[3].value as LeaveBalance);
        }

        // Parse Recent Leaves
        if (results[4].status === "fulfilled" && Array.isArray(results[4].value)) {
          setRecentLeaves(results[4].value as LeaveRecord[]);
        } else {
          setRecentLeaves([]);
        }

        // Parse Active Warnings
        if (results[5].status === "fulfilled" && Array.isArray(results[5].value)) {
          setActiveWarnings(results[5].value as WarningRecord[]);
        } else {
          setActiveWarnings([]);
        }

        // Parse Pending Manual Punches
        if (results[6].status === "fulfilled" && Array.isArray(results[6].value)) {
          setPendingManualPunches(results[6].value as ManualPunchRequest[]);
        } else {
          setPendingManualPunches([]);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load dashboard data.";
        setError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [employeeId],
  );

  useEffect(() => {
    void fetchDashboardData();
  }, [fetchDashboardData]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(true);
    toast.success("Dashboard data refreshed");
  };

  // Derived calculations from backend results
  const hasFirstIn = Boolean(todayAttendance?.firstIn && todayAttendance.firstIn !== "—");
  const firstInVal =
    todayAttendance?.firstIn ||
    todayPunches.find((p) => p.type?.toUpperCase() === "IN")?.timestamp ||
    "—";
  const lastOutVal =
    todayAttendance?.lastOut ||
    todayPunches.filter((p) => p.type?.toUpperCase() === "OUT").pop()?.timestamp ||
    "—";

  const totalWorkingHours =
    todayAttendance?.totalHours !== undefined && todayAttendance.totalHours !== ""
      ? typeof todayAttendance.totalHours === "number"
        ? `${todayAttendance.totalHours.toFixed(1)} hrs`
        : String(todayAttendance.totalHours)
      : hasFirstIn
        ? "In Progress"
        : "0.0 hrs";

  const todayStatus = todayAttendance?.status || (hasFirstIn ? "Present" : "Not Checked In");

  let attendanceStatus = "Standard";
  if (todayAttendance?.isLate) attendanceStatus = "Late";
  else if (todayAttendance?.status) attendanceStatus = todayAttendance.status;
  else if (hasFirstIn) attendanceStatus = "On Time";

  const pendingLeavesCount = recentLeaves.filter((l) =>
    (l.status || "").toLowerCase().includes("pending"),
  ).length;
  const pendingPunchesCount = pendingManualPunches.filter((p) =>
    (p.status || "").toLowerCase().includes("pending"),
  ).length;
  const totalPendingRequests = pendingLeavesCount + pendingPunchesCount;

  const totalLeaveRemaining = leaveBalances
    ? (leaveBalances.remaining ??
      (leaveBalances.casualLeave ?? 0) +
        (leaveBalances.sickLeave ?? 0) +
        (leaveBalances.earnedLeave ?? 0))
    : recentLeaves.length > 0
      ? "Active"
      : "0";

  const employeeName = user?.name || user?.email?.split("@")[0] || "Employee";

  return (
    <AppShell title="Dashboard">
      <PageHeader
        title={`Welcome back, ${employeeName}`}
        description={`Emp ID: ${employeeId || "—"} • Role: ${user?.role || "Staff"} • Live Attendance Overview`}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            className="h-8 gap-1.5 text-xs shadow-2xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            <span>{refreshing ? "Refreshing…" : "Refresh"}</span>
          </Button>
        }
      />

      {error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Backend Communication Notice</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void fetchDashboardData()}
              className="h-7 px-2.5 text-xs border-destructive/40 hover:bg-destructive/10"
            >
              Retry Connection
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {/* 8 Metric Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
        {/* 1. Today's Status */}
        <StatBadgeCard
          label="Today's Status"
          value={todayStatus}
          hint={hasFirstIn ? "Punched in today" : "No punch recorded"}
          icon={<CheckCircle2 className="h-4 w-4" />}
          accentColor="emerald"
          badgeText={hasFirstIn ? "Active" : undefined}
          badgeVariant="success"
        />

        {/* 2. First IN */}
        <StatBadgeCard
          label="First IN"
          value={firstInVal}
          hint={
            hasFirstIn ? (todayAttendance?.isLate ? "Late Entry" : "On Schedule") : "Awaiting entry"
          }
          icon={<LogIn className="h-4 w-4" />}
          accentColor="emerald"
          badgeText={todayAttendance?.isLate ? "Late" : undefined}
          badgeVariant="warning"
        />

        {/* 3. Last OUT */}
        <StatBadgeCard
          label="Last OUT"
          value={lastOutVal}
          hint={lastOutVal !== "—" ? "Recorded exit" : hasFirstIn ? "In office" : "—"}
          icon={<LogOut className="h-4 w-4" />}
          accentColor="blue"
        />

        {/* 4. Total Working Hours */}
        <StatBadgeCard
          label="Working Hours"
          value={totalWorkingHours}
          hint="Calculated by backend"
          icon={<Clock className="h-4 w-4" />}
          accentColor="primary"
        />

        {/* 5. Attendance Status */}
        <StatBadgeCard
          label="Attendance Status"
          value={attendanceStatus}
          hint="Daily classification"
          icon={<CalendarCheck className="h-4 w-4" />}
          accentColor="violet"
        />

        {/* 6. Pending Requests */}
        <StatBadgeCard
          label="Pending Requests"
          value={totalPendingRequests}
          hint={`${pendingPunchesCount} punch, ${pendingLeavesCount} leave`}
          icon={<Hourglass className="h-4 w-4" />}
          accentColor="amber"
          badgeText={totalPendingRequests > 0 ? "Pending" : undefined}
          badgeVariant="warning"
        />

        {/* 7. Leave Balance */}
        <StatBadgeCard
          label="Leave Balance"
          value={
            typeof totalLeaveRemaining === "number"
              ? `${totalLeaveRemaining}d`
              : totalLeaveRemaining
          }
          hint="Available quota"
          icon={<Palmtree className="h-4 w-4" />}
          accentColor="blue"
        />

        {/* 8. Active Warnings */}
        <StatBadgeCard
          label="Active Warnings"
          value={activeWarnings.length}
          hint={activeWarnings.length === 0 ? "Clean record" : "Action required"}
          icon={<ShieldAlert className="h-4 w-4" />}
          accentColor={activeWarnings.length > 0 ? "rose" : "emerald"}
          badgeText={activeWarnings.length > 0 ? "Notice" : "Clear"}
          badgeVariant={activeWarnings.length > 0 ? "destructive" : "success"}
        />
      </div>

      {/* Grid Row 1: Today Attendance Summary & Punch Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <div className="lg:col-span-6">
          <TodayAttendanceCard
            record={todayAttendance}
            shiftName={user?.shift ? String(user.shift) : "General Shift"}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-6">
          <PunchTimeline punches={todayPunches} loading={loading} />
        </div>
      </div>

      {/* Grid Row 2: Weekly Attendance Overview */}
      <div className="mt-4">
        <WeeklyAttendanceOverview records={weeklyAttendance} loading={loading} />
      </div>

      {/* Grid Row 3: Leave Summary, Recent Warnings, Pending Manual Punch Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        <LeaveSummaryCard balances={leaveBalances} recentLeaves={recentLeaves} loading={loading} />
        <RecentWarningsCard warnings={activeWarnings} loading={loading} />
        <PendingManualPunchesCard requests={pendingManualPunches} loading={loading} />
      </div>
    </AppShell>
  );
}
