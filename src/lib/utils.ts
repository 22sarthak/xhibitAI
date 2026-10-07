export function cn(...classes: Array<string | false | null | undefined | 0>) {
  return classes.filter(Boolean).join(" ");
}

/** 24999 → "24,999"; 149999 → "1,49,999" (Indian grouping). */
export const inr = (n: number) => n.toLocaleString("en-IN");

/** "Sharma Sweets" → "sharmasweets.in" — used in the demo browser bar. */
export function toDomain(name: string) {
  const s = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 26);
  return `${s || "yourbusiness"}.in`;
}

export function initials(name: string) {
  const parts = name
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
