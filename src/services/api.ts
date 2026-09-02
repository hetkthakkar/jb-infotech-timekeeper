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
  id?: string;
  employeeId?: string;
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  designation?: string;
  shift?: string;
  joinDate?: string;
  [key: string]: unknown;
};

export type LoginResponse = {
  token?: string;
  user?: SessionUser;
  employee?: SessionUser;
} & Record<string, unknown>;

export type AttendanceRecord = {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  date: string;
  firstIn?: string;
  lastOut?: string;
  totalHours?: number | string;
  status?: string; // Present, Absent, Half Day, Late, On Leave, Holiday, Weekly Off
  punchCount?: number;
  shiftName?: string;
  shiftStart?: string;
  shiftEnd?: string;
  isLate?: boolean;
  isEarlyExit?: boolean;
  remarks?: string;
  [key: string]: unknown;
};

export type PunchRecord = {
  id?: string;
  punchId?: string;
  PunchID?: string;
  employeeId?: string;
  EmployeeID?: string;
  employeeName?: string;
  date?: string;
  Date?: string;
  timestamp?: string;
  timestampIST?: string;
  TimestampIST?: string;
  type: "IN" | "OUT" | string;
  Type?: "IN" | "OUT" | string;
  source?: "App" | "Web" | "Biometric" | "Manual" | string;
  Source?: string;
  latitude?: number | string | null;
  Latitude?: number | string | null;
  longitude?: number | string | null;
  Longitude?: number | string | null;
  status?: string;
  Status?: string;
  remarks?: string;
  Remarks?: string;
  [key: string]: unknown;
};


export type LeaveRecord = {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  leaveType: "CL" | "SL" | "EL" | "Casual" | "Sick" | "Privilege" | "Unpaid" | string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled" | string;
  appliedOn?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  [key: string]: unknown;
};

export type LeaveBalance = {
  casualLeave?: number;
  sickLeave?: number;
  earnedLeave?: number;
  totalAvailable?: number;
  used?: number;
  remaining?: number;
  [key: string]: unknown;
};

export type WarningRecord = {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  date: string;
  category: "Late Coming" | "Unexcused Absence" | "Policy Violation" | "Performance" | string;
  severity?: "Low" | "Medium" | "High" | "Critical" | string;
  subject: string;
  description?: string;
  actionTaken?: string;
  issuedBy?: string;
  status?: "Active" | "Acknowledged" | "Resolved" | string;
  [key: string]: unknown;
};

export type ShiftRecord = {
  id?: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  graceMinutes?: number;
  halfDayHours?: number;
  fullDayHours?: number;
  isDefault?: boolean;
  [key: string]: unknown;
};

export type ManualPunchRequest = {
  id?: string;
  employeeId?: string;
  employeeName?: string;
  date: string;
  requestedTime: string;
  type: "IN" | "OUT" | string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  appliedOn?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
  [key: string]: unknown;
};

export type DashboardSummary = {
  todayStatus?: string;
  firstIn?: string;
  lastOut?: string;
  totalWorkingHours?: string | number;
  attendanceStatus?: string;
  pendingRequestsCount?: number;
  leaveBalance?: LeaveBalance;
  activeWarningsCount?: number;
  todayPunches?: PunchRecord[];
  weeklyAttendance?: AttendanceRecord[];
  recentLeaves?: LeaveRecord[];
  recentWarnings?: WarningRecord[];
  pendingManualPunches?: ManualPunchRequest[];
  [key: string]: unknown;
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
    employeeId?: string;
    source?: "App" | "Web" | "Mobile" | "Biometric" | string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    remarks?: string;
    [key: string]: unknown;
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
  getActive: (employeeId?: string) => get<WarningRecord[]>("getWarnings", { employeeId, status: "Active" }),
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

