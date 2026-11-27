// format.js — the small helpers every view uses: money, percentages,
// dates and safe HTML. Nothing here touches the page; it only turns
// numbers and text into the strings the views print.

export function money(amount) {
  const value = Number(amount) || 0;
  return "$" + value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function signedMoney(amount, kind) {
  const sign = kind === "income" ? "+" : "−";
  return sign + money(amount);
}

export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

export function clampPercent(part, whole) {
  return Math.min(100, Math.max(0, percent(part, whole)));
}

// Escape text a household member typed, so a description can never
// break the page or run as markup.
export function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return "&quot;";
  });
}

// "2026-11-20" -> "20 Nov". The table keeps the full date; the
// dashboard's recent list uses this shorter form.
export function shortDate(iso) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = String(iso).split("-");
  if (parts.length !== 3) return iso;
  return Number(parts[2]) + " " + months[Number(parts[1]) - 1];
}

export function daysLeftInMonth(todayIso) {
  const day = Number(String(todayIso).slice(8, 10)) || 27;
  return Math.max(1, 30 - day);
}
