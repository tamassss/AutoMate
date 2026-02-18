// Dátum formázása: YYYY. MM. DD.
export function formatDate(isoDate) {
  if (!isoDate) return "-";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}. ${month}. ${day}.`;
}

// Hónap kulcs formázása: YYYY-MM -> YYYY. MM.
export function formatMonth(monthKey) {
  if (!monthKey || !monthKey.includes("-")) return monthKey || "-";

  const [year, month] = monthKey.split("-");
  return `${year}. ${month}.`;
}

// Másodperc formázása: HH:MM:SS
export function formatHmsFromSeconds(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");

  return `${h}:${m}:${s}`;
}

// Date objektum formázása: HH:MM
export function formatHHMMFromDate(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// Dátum rövid lokalizált formában
export function formatDateLocale(isoDate, locale = "hu-HU") {
  if (!isoDate) return "-";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(locale);
}

// HH:MM -> össz perc
export function hhmmToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== "string" || !hhmm.includes(":")) return null;

  const [hours, minutes] = hhmm.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  return hours * 60 + minutes;
}
