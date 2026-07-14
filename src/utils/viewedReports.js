const STORAGE_KEY = "scape_viewed_report_ids";

export function getViewedReportIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function markReportViewed(reportId) {
  const ids = getViewedReportIds();
  if (ids.has(reportId)) return ids;
  ids.add(reportId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // localStorage unavailable -- non-fatal
  }
  return ids;
}
