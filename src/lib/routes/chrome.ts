export const BARE_PATHS = new Set([
  "/signin",
  "/signup",
  "/reset-password",
  "/two-step-verification",
  "/terms",
  "/privacy",
  "/error-404",
  "/error-500",
  "/error-503",
  "/coming-soon",
  "/maintenance",
  "/success",
]);

export const SUMMARY_PATHS = new Set(["/contacts", "/companies", "/deals", "/tasks"]);

export function isBarePath(path: string): boolean {
  return BARE_PATHS.has(path) || path.startsWith("/layout-");
}

export function showsPageSummary(path: string): boolean {
  return SUMMARY_PATHS.has(path);
}
