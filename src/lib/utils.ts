import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function num(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

export function domainFor(city: string, nicheSlug: string) {
  return `${slugify(city)}${nicheSlug}.com`;
}

export function minutesAgo(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
}

export function ageLabel(iso: string) {
  const m = minutesAgo(iso);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function trackingFor(state: string) {
  const area: Record<string, string> = {
    ID: "208",
    WA: "509",
    TN: "423",
    IN: "260",
    NV: "775",
    WI: "608",
    NC: "910",
    TX: "210",
    IA: "515",
    KY: "859",
    OK: "918",
    AL: "256",
    FL: "863",
  };
  const n = Math.floor(1000 + Math.random() * 8999);
  return `(${area[state] ?? "555"}) 555-${String(n).padStart(4, "0")}`;
}

export function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}
