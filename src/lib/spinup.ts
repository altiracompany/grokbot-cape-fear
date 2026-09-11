import { COUNTIES, type County, type HandoffTarget } from "./types";
import { HOME_NICHES, RSVP_NICHES, SEAT_NICHES, countyLabel, marketIdForNiche, type SeatNicheId } from "./seats";
import { EDDM_HOMES, EDDM_PRICE, TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "./pricing";
import { nicheById } from "./niches";
import { money, uid } from "./utils";

export type OfferId = "dedicated" | "turnkey" | "eddm";

export const OFFERS: {
  id: OfferId;
  label: string;
  dueToday: number;
  weekly: number;
  blurb: string;
}[] = [
  {
    id: "dedicated",
    label: "The $500",
    dueToday: WEEKLY_SEAT,
    weekly: WEEKLY_SEAT,
    blurb: "Two free jobs. Then $500 a week. One company. We ask. You go.",
  },
  {
    id: "eddm",
    label: "Mail",
    dueToday: EDDM_PRICE,
    weekly: 0,
    blurb: `Your flyer. ${EDDM_HOMES.toLocaleString()} homes. $300. This week.`,
  },
  {
    id: "turnkey",
    label: "We run it",
    dueToday: TURNKEY_SETUP,
    weekly: TURNKEY_WEEKLY,
    blurb: "You're slammed. We run ads and the phone. $2,500 + $750/wk.",
  },
];

export function offerById(id: OfferId) {
  return OFFERS.find((o) => o.id === id) ?? OFFERS[0];
}

export function dueToday(offer: OfferId, addEddm: boolean) {
  const base = offerById(offer).dueToday;
  if (offer === "eddm") return EDDM_PRICE;
  return base + (addEddm ? EDDM_PRICE : 0);
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
export const GO_NICHES = [...SEAT_NICHES, ...RSVP_NICHES, ...HOME_NICHES];

const PAY_KEY = "fpl-pay-v1";

export type PayLinks = { dedicated: string; turnkey: string; eddm: string };

export function emptyPayLinks(): PayLinks {
  return { dedicated: "", turnkey: "", eddm: "" };
}

export function loadPayLinks(): PayLinks {
  const env: PayLinks = {
    dedicated: (typeof import.meta !== "undefined" && import.meta.env?.VITE_PAY_DEDICATED) || "",
    turnkey: (typeof import.meta !== "undefined" && import.meta.env?.VITE_PAY_TURNKEY) || "",
    eddm: (typeof import.meta !== "undefined" && import.meta.env?.VITE_PAY_EDDM) || "",
  };
  if (typeof window === "undefined") return env;
  try {
    const raw = window.localStorage.getItem(PAY_KEY);
    if (!raw) return env;
    const parsed = JSON.parse(raw) as Partial<PayLinks>;
    return {
      dedicated: parsed.dedicated || env.dedicated,
      turnkey: parsed.turnkey || env.turnkey,
      eddm: parsed.eddm || env.eddm,
    };
  } catch {
    return env;
  }
}

export function savePayLinks(links: PayLinks) {
  window.localStorage.setItem(PAY_KEY, JSON.stringify(links));
}

export function checkoutHref(offer: OfferId, code: string, email: string, addEddm = false) {
  const links = loadPayLinks();
  let key: keyof PayLinks = "dedicated";
  if (offer === "eddm") key = "eddm";
  else if (offer === "turnkey") key = "turnkey";
  else key = "dedicated";
  if (addEddm && !links[key]) key = "eddm";
  const base = links[key]?.trim();
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
  eddm: boolean;
  handoffTo: HandoffTarget;
  handoffName: string;
  handoffEmail: string;
  handoffPhone: string;
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
