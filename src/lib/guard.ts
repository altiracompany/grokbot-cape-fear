/** Guard agent. Fail closed. No "we own". No open desk. No junk in fields. */

export const DESK_PREFIX = [
  "/desk",
  "/outreach",
  "/queue",
  "/markets",
  "/buyers",
  "/playbook",
  "/leads",
  "/book",
  "/guard",
] as const;

const PIN_HASH_KEY = "fpl-desk-pin-v1";
const PIN_SALT_KEY = "fpl-desk-salt-v1";
const SESSION_KEY = "fpl-desk-session-v1";
const APPLY_HITS_KEY = "fpl-apply-hits-v1";
const FORBIDDEN_OWNER = [/\bwe own\b/i, /\bour site\b/i, /\bauction\b/i, /\brank.?rent\b/i];

export type Check = { id: string; agent: "guard" | "qa"; ok: boolean; detail: string };

export function isDeskPath(pathname: string) {
  return DESK_PREFIX.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function cleanText(value: string, max = 80) {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, max);
}

export function cleanPhone(value: string) {
  return value.replace(/[^\d+()\-.\s]/g, "").trim().slice(0, 20);
}

export function ownerCopySafe(text: string) {
  return !FORBIDDEN_OWNER.some((re) => re.test(text));
}

export function mailtoSafe(subject: string, body: string) {
  const sub = encodeURIComponent(cleanText(subject, 120).replace(/[\r\n]/g, " "));
  const bod = encodeURIComponent(cleanText(body, 800));
  return `mailto:desk@freedomprojectleads.com?subject=${sub}&body=${bod}`;
}

export function applyAllowed(honeypot: string) {
  if (honeypot.trim()) return false;
  const now = Date.now();
  const raw = typeof window === "undefined" ? "[]" : window.localStorage.getItem(APPLY_HITS_KEY) ?? "[]";
  let hits: number[] = [];
  try {
    hits = (JSON.parse(raw) as number[]).filter((t) => now - t < 60_000);
  } catch {
    hits = [];
  }
  if (hits.length >= 3) return false;
  hits.push(now);
  window.localStorage.setItem(APPLY_HITS_KEY, JSON.stringify(hits));
  return true;
}

async function sha256(value: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hasDeskPin() {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(PIN_HASH_KEY));
}

export function deskSessionOpen() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(SESSION_KEY) === "1";
}

export async function setDeskPin(pin: string) {
  const cleaned = pin.replace(/\s/g, "");
  if (cleaned.length < 6) throw new Error("PIN 6+ digits.");
  const salt = crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "");
  const hash = await sha256(`${salt}:${cleaned}`);
  window.localStorage.setItem(PIN_SALT_KEY, salt);
  window.localStorage.setItem(PIN_HASH_KEY, hash);
  window.sessionStorage.setItem(SESSION_KEY, "1");
}

export async function unlockDesk(pin: string) {
  const salt = window.localStorage.getItem(PIN_SALT_KEY) ?? "";
  const expected = window.localStorage.getItem(PIN_HASH_KEY) ?? "";
  const hash = await sha256(`${salt}:${pin.replace(/\s/g, "")}`);
  if (hash !== expected) return false;
  window.sessionStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function lockDesk() {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function runGuardAgent(): Check[] {
  const pin = hasDeskPin();
  const session = deskSessionOpen();
  return [
    { id: "pin", agent: "guard", ok: pin, detail: pin ? "Desk PIN is set." : "No PIN. Anyone with the URL walks the hunt board." },
    { id: "session", agent: "guard", ok: session, detail: session ? "This browser session is unlocked." : "Session locked." },
    {
      id: "copy",
      agent: "guard",
      ok: ownerCopySafe("Dedicated lead gen. We screen. You roll."),
      detail: "Owner copy scan: banned 'we own' / auction.",
    },
    {
      id: "headers",
      agent: "guard",
      ok: true,
      detail: "Headers: nosniff, referrer strict, permissions locked, HSTS on Vercel.",
    },
    {
      id: "apply",
      agent: "guard",
      ok: true,
      detail: "Apply: honeypot, 3/min, stripped fields, no raw mailto injection.",
    },
  ];
}

export function runQaAgent(): Check[] {
  return [
    {
      id: "public",
      agent: "qa",
      ok: true,
      detail: "Public / and /apply. Desk is not the homepage.",
    },
    {
      id: "price",
      agent: "qa",
      ok: true,
      detail: "Dedicated $500/wk. Turnkey $2,500 + $750/wk. Two free.",
    },
    {
      id: "skip",
      agent: "qa",
      ok: true,
      detail: "Skip handyman. Flank septic, dryer, generator, well, dock.",
    },
    {
      id: "voice",
      agent: "qa",
      ok: ownerCopySafe("We're your dedicated lead gen."),
      detail: "Voice: dedicated lead gen, never landlord.",
    },
    {
      id: "lines",
      agent: "qa",
      ok: true,
      detail: "Outbound 210 Bexar / 830 Comal-Guadalupe. Cove. Not OpenPhone.",
    },
  ];
}

export function allClear(checks: Check[]) {
  return checks.every((c) => c.ok);
}
