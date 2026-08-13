import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SESSION_STORAGE_KEY } from "@/config";
import { authApi, type SessionUser } from "@/services/api";

type Session = { token?: string; user: SessionUser };

type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    const next: Session = {
      ...(result.token ? { token: result.token } : {}),
      user: result.user ?? { email },
    };
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
    void authApi.logout().catch(() => undefined);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      isReady,
      login,
      logout,
    }),
    [session, isReady, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
