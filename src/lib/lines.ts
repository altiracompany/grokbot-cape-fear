const STORAGE_KEY = "fpl-lines-v1";

export type AreaLine = {
  id: "210" | "830";
  area: string;
  label: string;
  counties: string;
};

export const AREA_LINES: AreaLine[] = [
  { id: "210", area: "210", label: "Bexar", counties: "San Antonio · Stone Oak · Helotes" },
  { id: "830", area: "830", label: "Comal / Guadalupe", counties: "New Braunfels · Canyon Lake · Seguin · Cibolo" },
];

export type SavedLines = { "210": string; "830": string };

export function emptyLines(): SavedLines {
  return { "210": "", "830": "" };
}

export function loadLines(): SavedLines {
  if (typeof window === "undefined") return emptyLines();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLines();
    const parsed = JSON.parse(raw) as Partial<SavedLines>;
    return { "210": digits(parsed["210"] ?? ""), "830": digits(parsed["830"] ?? "") };
  } catch {
    return emptyLines();
  }
}

export function saveLines(lines: SavedLines) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ "210": digits(lines["210"]), "830": digits(lines["830"]) }));
}

export function digits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function e164(value: string) {
  const d = digits(value);
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return "";
}

export function prettyPhone(value: string) {
  const d = digits(value);
  const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
  if (ten.length !== 10) return value.trim() || "Not set";
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
}

export function smsHref(toOwner: string, body: string) {
  const num = e164(toOwner);
  if (!num) return "";
  return `sms:${num}?body=${encodeURIComponent(body)}`;
}

export function telHref(value: string) {
  const num = e164(value);
  return num ? `tel:${num}` : "";
}

export function lineForCounty(county: string): AreaLine["id"] {
  if (county === "bexar") return "210";
  return "830";
}
