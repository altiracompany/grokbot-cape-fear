import type { County } from "./types";

/** Same 5,000 pieces. USPS stamp is ~the same. We charge the zip, not the postage. Parked — don't sell mail until we turn this on. */
export const MAIL_LIVE = false;
export const MAIL_HOMES = 5000;

export const MAIL_TIERS = {
  standard: { id: "standard", label: "Standard zip", price: 300, why: "Typical homes." },
  better: { id: "better", label: "Better zip", price: 450, why: "Newer streets. Bigger tickets." },
  high: { id: "high", label: "High zip", price: 650, why: "Expensive zip. Fence and window jobs pay more. You pay more." },
} as const;

export type MailTierId = keyof typeof MAIL_TIERS;

export type MailRoute = {
  zip: string;
  city: string;
  county: County;
  tier: MailTierId;
};

export const MAIL_ROUTES: MailRoute[] = [
  { zip: "78132", city: "New Braunfels west", county: "comal", tier: "high" },
  { zip: "78133", city: "Canyon Lake", county: "comal", tier: "high" },
  { zip: "78163", city: "Bulverde", county: "comal", tier: "high" },
  { zip: "78070", city: "Spring Branch", county: "comal", tier: "high" },
  { zip: "78130", city: "New Braunfels", county: "comal", tier: "better" },
  { zip: "78209", city: "Alamo Heights", county: "bexar", tier: "high" },
  { zip: "78212", city: "Olmos Park", county: "bexar", tier: "high" },
  { zip: "78231", city: "Shavano Park", county: "bexar", tier: "high" },
  { zip: "78248", city: "North central", county: "bexar", tier: "high" },
  { zip: "78255", city: "Helotes hills", county: "bexar", tier: "high" },
  { zip: "78257", city: "The Dominion", county: "bexar", tier: "high" },
  { zip: "78258", city: "Stone Oak", county: "bexar", tier: "high" },
  { zip: "78259", city: "Bulverde Rd", county: "bexar", tier: "high" },
  { zip: "78260", city: "Timberwood", county: "bexar", tier: "high" },
  { zip: "78261", city: "Cibolo Creek", county: "bexar", tier: "high" },
  { zip: "78232", city: "Hollywood Park", county: "bexar", tier: "better" },
  { zip: "78230", city: "Medical Center north", county: "bexar", tier: "better" },
  { zip: "78247", city: "Longhorn", county: "bexar", tier: "better" },
  { zip: "78249", city: "UTSA", county: "bexar", tier: "better" },
  { zip: "78254", city: "Talavera", county: "bexar", tier: "better" },
  { zip: "78253", city: "Westover Hills", county: "bexar", tier: "better" },
  { zip: "78245", city: "West SA", county: "bexar", tier: "standard" },
  { zip: "78251", city: "Northwest", county: "bexar", tier: "standard" },
  { zip: "78207", city: "Westside", county: "bexar", tier: "standard" },
  { zip: "78201", city: "Near northwest", county: "bexar", tier: "standard" },
  { zip: "78223", city: "Southside", county: "bexar", tier: "standard" },
  { zip: "78221", city: "South SA", county: "bexar", tier: "standard" },
  { zip: "78108", city: "Cibolo", county: "guadalupe", tier: "better" },
  { zip: "78154", city: "Schertz", county: "guadalupe", tier: "better" },
  { zip: "78124", city: "Marion", county: "guadalupe", tier: "better" },
  { zip: "78155", city: "Seguin", county: "guadalupe", tier: "standard" },
  { zip: "78123", city: "McQueeney", county: "guadalupe", tier: "standard" },
  { zip: "28480", city: "Wrightsville Beach", county: "new-hanover", tier: "high" },
  { zip: "28409", city: "Myrtle Grove", county: "new-hanover", tier: "high" },
  { zip: "28411", city: "Porters Neck", county: "new-hanover", tier: "high" },
  { zip: "28428", city: "Carolina Beach", county: "new-hanover", tier: "high" },
  { zip: "28403", city: "Wilmington east", county: "new-hanover", tier: "better" },
  { zip: "28405", city: "Wilmington north", county: "new-hanover", tier: "better" },
  { zip: "28412", city: "Wilmington south", county: "new-hanover", tier: "better" },
  { zip: "28401", city: "Downtown Wilmington", county: "new-hanover", tier: "standard" },
  { zip: "28451", city: "Leland", county: "brunswick", tier: "better" },
  { zip: "28461", city: "Southport", county: "brunswick", tier: "better" },
  { zip: "28470", city: "Shallotte", county: "brunswick", tier: "standard" },
  { zip: "28462", city: "Supply", county: "brunswick", tier: "standard" },
  { zip: "28443", city: "Hampstead", county: "pender", tier: "better" },
  { zip: "28457", city: "Rocky Point", county: "pender", tier: "standard" },
];

export function mailRoute(zip: string) {
  return MAIL_ROUTES.find((r) => r.zip === zip);
}

export function mailTier(zip: string) {
  return MAIL_TIERS[mailRoute(zip)?.tier ?? "standard"];
}

export function mailPrice(zip?: string) {
  if (!zip) return MAIL_TIERS.standard.price;
  return mailTier(zip).price;
}

export function mailZipsIn(county: County) {
  return MAIL_ROUTES.filter((r) => r.county === county);
}

export function defaultMailZip(county: County) {
  const zips = mailZipsIn(county);
  return zips.find((z) => z.tier === "better")?.zip ?? zips[0]?.zip ?? "78130";
}

export function payKeyForZip(zip?: string): "eddm" | "eddmBetter" | "eddmHigh" {
  const id = mailRoute(zip ?? "")?.tier ?? "standard";
  if (id === "high") return "eddmHigh";
  if (id === "better") return "eddmBetter";
  return "eddm";
}
