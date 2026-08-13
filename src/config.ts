/**
 * Central application configuration.
 * The Apps Script web app URL lives here and nowhere else.
 */
export const APPS_SCRIPT_URL =
  (import.meta.env["VITE_APPS_SCRIPT_URL"] as string | undefined) ??
  "https://script.google.com/macros/s/AKfycbyKjCgkadhM753pidTko0N6kmRqMgGT877UjvkhqsfnU-eR5vf4BEjc3Bx-VZecYWiI/exec";

export const APP_NAME = "JB InfoTech";
export const APP_SUBTITLE = "Attendance Management";

/** localStorage key for the persisted session. */
export const SESSION_STORAGE_KEY = "jbit.session";
