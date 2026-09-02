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
  [key: string]: unknown;
};

export type LoginResponse = {
  token?: string;
  user?: SessionUser;
  employee?: SessionUser;
} & Record<string, unknown>;

export const authApi = {
  login: (employeeId: string, password: string) =>
    post<LoginResponse>("login", { employeeId, email: employeeId, password }),
  me: () => get<SessionUser>("me"),
  logout: () => post<unknown>("logout"),
};

export const employeesApi = {
  list: (params?: Payload) => get<unknown[]>("getEmployees", params),
};

export const attendanceApi = {
  list: (params?: Payload) => get<unknown[]>("getAttendance", params),
};

export const leaveApi = {
  list: (params?: Payload) => get<unknown[]>("getLeaves", params),
};

export const warningsApi = {
  list: (params?: Payload) => get<unknown[]>("getWarnings", params),
};

export const payrollApi = {
  list: (params?: Payload) => get<unknown[]>("getPayroll", params),
};

export const shiftsApi = {
  list: (params?: Payload) => get<unknown[]>("getShifts", params),
};
