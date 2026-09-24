/** Pulls a human-readable message out of an RTK Query / fetch error. */
export function apiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (err && typeof err === "object") {
    const e = err as { data?: { message?: string; title?: string } | string; message?: string };
    if (typeof e.data === "string" && e.data) return e.data;
    if (typeof e.data === "object" && (e.data?.message || e.data?.title)) return e.data.message ?? e.data.title!;
    if (e.message) return e.message;
  }
  return fallback;
}
