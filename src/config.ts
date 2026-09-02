/**
 * Central application configuration.
 * The Apps Script web app URL lives here and nowhere else.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://script.google.com/macros/s/AKfycbxVMZUiNvlg_yIx_e2zKfzhWavXpfjfRA8TDdjVILsj1Yy0zlHspOK_ScF83i4J36Ov/exec";

export const APPS_SCRIPT_URL = API_BASE_URL;


export const APP_NAME = "JB InfoTech";
export const APP_SUBTITLE = "Attendance Management";

/** localStorage key for the persisted session. */
export const SESSION_STORAGE_KEY = "jbit.session";
