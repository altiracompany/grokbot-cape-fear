import { COUNTIES, type County } from "./types";
import { SEAT_NICHES, countyLabel, marketIdForNiche, type SeatNicheId } from "./seats";
import { TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "./pricing";
import { nicheById } from "./niches";
import { money, uid } from "./utils";

export type OfferId = "dedicated" | "turnkey";

export const OFFERS: {
  id: OfferId;
  label: string;
  dueToday: number;
  weekly: number;
  blurb: string;
}[] = [
  {
    id: "dedicated",
    label: "Dedicated",
    dueToday: WEEKLY_SEAT,
    weekly: WEEKLY_SEAT,
    blurb: "We answer. We screen. Packet to your truck. First 2 free, then $500/wk.",
  },
  {
    id: "turnkey",
    label: "Turnkey",
    dueToday: TURNKEY_SETUP,
    weekly: TURNKEY_WEEKLY,
    blurb: "We run ads, the line, after-hours. You roll. $2,500 today, then $750/wk.",
  },
];

export function offerById(id: OfferId) {
  return OFFERS.find((o) => o.id === id) ?? OFFERS[0];
}

export function makeLiveCode() {
  return uid("fpl").replace("fpl-", "fpl");
}

export function spinCopy(opts: { county: County; nicheId: string; offer: OfferId }) {
  const niche = nicheById(opts.nicheId);
  const offer = offerById(opts.offer);
  const county = countyLabel(opts.county);
  return {
    title: `${county} ${niche.name}`,
    marketId: marketIdForNiche(opts.nicheId, opts.county),
    due: money(offer.dueToday),
    weekly: money(offer.weekly),
    line: `${county} ${niche.name.toLowerCase()} · one company`,
  };
}

export const GO_COUNTIES = COUNTIES.filter((c) => c.region === "alamo");
export const GO_NICHES = SEAT_NICHES;

const PAY_KEY = "fpl-pay-v1";

export type PayLinks = { dedicated: string; turnkey: string };

export function loadPayLinks(): PayLinks {
  if (typeof window === "undefined") return { dedicated: "", turnkey: "" };
  try {
    const raw = window.localStorage.getItem(PAY_KEY);
    if (!raw) return { dedicated: "", turnkey: "" };
    const parsed = JSON.parse(raw) as Partial<PayLinks>;
    return { dedicated: parsed.dedicated ?? "", turnkey: parsed.turnkey ?? "" };
  } catch {
    return { dedicated: "", turnkey: "" };
  }
}

export function savePayLinks(links: PayLinks) {
  window.localStorage.setItem(PAY_KEY, JSON.stringify(links));
}

export function checkoutHref(offer: OfferId, code: string, email: string) {
  const links = loadPayLinks();
  const base = links[offer]?.trim();
  if (!base) return "";
  const url = new URL(base);
  url.searchParams.set("client_reference_id", code);
  if (email) url.searchParams.set("prefilled_email", email);
  return url.toString();
}

export type PendingSpin = {
  code: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  county: County;
  nicheId: SeatNicheId;
  offer: OfferId;
};

export function stashPending(p: PendingSpin) {
  sessionStorage.setItem("fpl-pending", JSON.stringify(p));
}

export function readPending(): PendingSpin | null {
  try {
    const raw = sessionStorage.getItem("fpl-pending");
    return raw ? (JSON.parse(raw) as PendingSpin) : null;
  } catch {
    return null;
  }
}
