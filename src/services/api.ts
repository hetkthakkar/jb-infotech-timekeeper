import { APPS_SCRIPT_URL } from "@/config";

/**
 * Centralized API service layer.
 * Every call to the Google Apps Script backend goes through `request()`.
 */

export type ApiResult<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export class ApiError extends Error {
  status: number | undefined;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Payload = Record<string, unknown>;

function buildUrl(action: string, params?: Payload) {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set("action", action);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem("jbit.session");
    if (!raw) return undefined;
    return JSON.parse(raw)?.token as string | undefined;
  } catch {
    return undefined;
  }
}

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!response.ok) {
    throw new ApiError(
      `Request failed (${response.status}). ${text.slice(0, 200)}`,
      response.status,
    );
  }
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ApiError("Backend returned a non-JSON response.");
  }
  const body = json as Partial<ApiResult<T>> & Record<string, unknown>;
  if (body && typeof body === "object" && "success" in body && body.success === false) {
    throw new ApiError((body.message as string) || "The backend rejected this request.");
  }
  if (body && typeof body === "object" && "data" in body) {
    return body.data as T;
  }
  return json as T;
}

/** GET-style read against the Apps Script web app. */
export async function get<T>(action: string, params?: Payload): Promise<T> {
  const token = getToken();
  const response = await fetch(buildUrl(action, { ...params, token }), {
    method: "GET",
    redirect: "follow",
  });
  return parse<T>(response);
}

/**
 * POST-style write. Uses text/plain to avoid a CORS preflight,
 * which Apps Script web apps do not answer.
 */
export async function post<T>(action: string, payload?: Payload): Promise<T> {
  const token = getToken();
  const response = await fetch(buildUrl(action), {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, token, ...(payload ?? {}) }),
  });
  return parse<T>(response);
}

export const api = { get, post };

/* ---------------------------------------------------------------------- */
/* Domain endpoints — thin wrappers, no business data is hardcoded here.   */
/* ---------------------------------------------------------------------- */

export type SessionUser = {
  id?: string | undefined;
  employeeId?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  role?: string | undefined;
  department?: string | undefined;
  designation?: string | undefined;
  shift?: string | undefined;
  joinDate?: string | undefined;
};

export type LoginResponse = {
  token?: string | undefined;
  user?: SessionUser | undefined;
  employee?: SessionUser | undefined;
};

export type AttendanceRecord = {
  id?: string | undefined;
  employeeId?: string | undefined;
  employeeName?: string | undefined;
  date: string;
  firstIn?: string | undefined;
  lastOut?: string | undefined;
  totalHours?: number | string | undefined;
  status?: string | undefined; // Present, Absent, Half Day, Late, On Leave, Holiday, Weekly Off
  punchCount?: number | undefined;
  shiftName?: string | undefined;
  shiftStart?: string | undefined;
  shiftEnd?: string | undefined;
  isLate?: boolean | undefined;
  isEarlyExit?: boolean | undefined;
  remarks?: string | undefined;
};

export type PunchRecord = {
  id?: string | undefined;
  punchId?: string | undefined;
  PunchID?: string | undefined;
  employeeId?: string | undefined;
  EmployeeID?: string | undefined;
  employeeName?: string | undefined;
  date?: string | undefined;
  Date?: string | undefined;
  timestamp?: string | undefined;
  timestampIST?: string | undefined;
  TimestampIST?: string | undefined;
  type: "IN" | "OUT" | string;
  Type?: "IN" | "OUT" | string | undefined;
  source?: "App" | "Web" | "Biometric" | "Manual" | string | undefined;
  Source?: string | undefined;
  location?: string | undefined;
  latitude?: number | string | null | undefined;
  Latitude?: number | string | null | undefined;
  longitude?: number | string | null | undefined;
  Longitude?: number | string | null | undefined;
  status?: string | undefined;
  Status?: string | undefined;
  remarks?: string | undefined;
  Remarks?: string | undefined;
};

export type LeaveRecord = {
  id?: string | undefined;
  employeeId?: string | undefined;
  employeeName?: string | undefined;
  leaveType: "CL" | "SL" | "EL" | "Casual" | "Sick" | "Privilege" | "Unpaid" | string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string | undefined;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | string;
  appliedOn?: string | undefined;
  reviewedBy?: string | undefined;
  reviewedAt?: string | undefined;
  remarks?: string | undefined;
};

export type LeaveBalance = {
  casualLeave?: number | undefined;
  sickLeave?: number | undefined;
  earnedLeave?: number | undefined;
  totalAvailable?: number | undefined;
  used?: number | undefined;
  remaining?: number | undefined;
};

export type WarningRecord = {
  id?: string | undefined;
  employeeId?: string | undefined;
  employeeName?: string | undefined;
  date: string;
  category: "Late Coming" | "Unexcused Absence" | "Policy Violation" | "Performance" | string;
  severity?: "Low" | "Medium" | "High" | "Critical" | string | undefined;
  subject: string;
  description?: string | undefined;
  actionTaken?: string | undefined;
  issuedBy?: string | undefined;
  status?: "Active" | "Acknowledged" | "Resolved" | string | undefined;
};

export type ShiftRecord = {
  id?: string | undefined;
  shiftName: string;
  startTime: string;
  endTime: string;
  graceMinutes?: number | undefined;
  halfDayHours?: number | undefined;
  fullDayHours?: number | undefined;
  isDefault?: boolean | undefined;
};

export type ManualPunchRequest = {
  id?: string | undefined;
  employeeId?: string | undefined;
  employeeName?: string | undefined;
  date: string;
  requestedTime: string;
  type: "IN" | "OUT" | string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  appliedOn?: string | undefined;
  reviewedBy?: string | undefined;
  reviewedAt?: string | undefined;
  remarks?: string | undefined;
};

export type DashboardSummary = {
  todayStatus?: string | undefined;
  firstIn?: string | undefined;
  lastOut?: string | undefined;
  totalWorkingHours?: string | number | undefined;
  attendanceStatus?: string | undefined;
  pendingRequestsCount?: number | undefined;
  leaveBalance?: LeaveBalance | undefined;
  activeWarningsCount?: number | undefined;
  todayPunches?: PunchRecord[] | undefined;
  weeklyAttendance?: AttendanceRecord[] | undefined;
  recentLeaves?: LeaveRecord[] | undefined;
  recentWarnings?: WarningRecord[] | undefined;
  pendingManualPunches?: ManualPunchRequest[] | undefined;
};

export const authApi = {
  login: (employeeId: string, password: string) =>
    post<LoginResponse>("login", { employeeId, email: employeeId, password }),
  me: () => get<SessionUser>("me"),
  logout: () => post<unknown>("logout"),
};

export const employeesApi = {
  list: (params?: Payload) => get<SessionUser[]>("getEmployees", params),
  getById: (id: string) => get<SessionUser>("getEmployee", { id }),
};

export const attendanceApi = {
  list: (params?: Payload) => get<AttendanceRecord[]>("getAttendance", params),
  getToday: (employeeId?: string) => get<AttendanceRecord>("getTodayAttendance", { employeeId }),
  getWeekly: (employeeId?: string, startDate?: string) =>
    get<AttendanceRecord[]>("getWeeklyAttendance", { employeeId, startDate }),
};

export const punchApi = {
  list: (params?: Payload) => get<PunchRecord[]>("getPunches", params),
  getToday: (employeeId?: string) => get<PunchRecord[]>("getTodayPunches", { employeeId }),
  punch: (payload: {
    type: "IN" | "OUT" | string;
    employeeId?: string | undefined;
    source?: "App" | "Web" | "Mobile" | "Biometric" | string | undefined;
    latitude?: number | string | null | undefined;
    longitude?: number | string | null | undefined;
    remarks?: string | undefined;
  }) => post<PunchRecord>("punch", payload),
};

export const manualPunchApi = {
  list: (params?: Payload) => get<ManualPunchRequest[]>("getManualPunches", params),
  getPending: (employeeId?: string) =>
    get<ManualPunchRequest[]>("getManualPunchRequests", { employeeId, status: "Pending" }),
  create: (payload: { date: string; time: string; type: string; reason: string }) =>
    post<ManualPunchRequest>("requestManualPunch", payload),
};

export const leaveApi = {
  list: (params?: Payload) => get<LeaveRecord[]>("getLeaves", params),
  getBalances: (employeeId?: string) => get<LeaveBalance>("getLeaveBalances", { employeeId }),
  apply: (payload: { leaveType: string; startDate: string; endDate: string; reason: string }) =>
    post<LeaveRecord>("applyLeave", payload),
};

export const warningsApi = {
  list: (params?: Payload) => get<WarningRecord[]>("getWarnings", params),
  getActive: (employeeId?: string) =>
    get<WarningRecord[]>("getWarnings", { employeeId, status: "Active" }),
};

export const shiftsApi = {
  list: (params?: Payload) => get<ShiftRecord[]>("getShifts", params),
};

export const payrollApi = {
  list: (params?: Payload) => get<unknown[]>("getPayroll", params),
};

export const reportsApi = {
  list: (params?: Payload) => get<unknown[]>("getReports", params),
};

export const settingsApi = {
  get: () => get<Record<string, unknown>>("getSettings"),
};

export const dashboardApi = {
  getSummary: (employeeId?: string) => get<DashboardSummary>("getDashboardSummary", { employeeId }),
};
