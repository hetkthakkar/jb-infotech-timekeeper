import { redirect } from "@tanstack/react-router";
import { SESSION_STORAGE_KEY } from "@/config";

/**
 * Route guard: redirects unauthenticated users to /login.
 * Reads the persisted session directly so it works on hard navigations
 * before the AuthProvider has hydrated.
 */
export function requireAuth() {
  if (typeof window === "undefined") return;
  let session: unknown = null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    session = raw ? JSON.parse(raw) : null;
  } catch {
    session = null;
  }
  if (!session) {
    throw redirect({ to: "/login" });
  }
}

/** Login page guard: already-authenticated users go straight to the dashboard. */
export function redirectIfAuthenticated() {
  if (typeof window === "undefined") return;
  let session: unknown = null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    session = raw ? JSON.parse(raw) : null;
  } catch {
    session = null;
  }
  if (session) {
    throw redirect({ to: "/" });
  }
}
