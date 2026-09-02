import { COUNTIES, type County } from "./types";

export const AREA = "Cape Fear";
export const AREA_LINE = "New Hanover, Pender, Brunswick";

export const HOODS: { name: string; county: County; zip: string }[] = [
  { name: "Wilmington", county: "new-hanover", zip: "28401" },
  { name: "Porters Neck", county: "new-hanover", zip: "28411" },
  { name: "Myrtle Grove", county: "new-hanover", zip: "28409" },
  { name: "Carolina Beach", county: "new-hanover", zip: "28428" },
  { name: "Wrightsville", county: "new-hanover", zip: "28403" },
  { name: "Landfall", county: "new-hanover", zip: "28405" },
  { name: "Hampstead", county: "pender", zip: "28443" },
  { name: "Burgaw", county: "pender", zip: "28425" },
  { name: "Rocky Point", county: "pender", zip: "28457" },
  { name: "Surf City", county: "pender", zip: "28445" },
  { name: "Leland", county: "brunswick", zip: "28451" },
  { name: "Southport", county: "brunswick", zip: "28461" },
  { name: "St. James", county: "brunswick", zip: "28461" },
  { name: "Oak Island", county: "brunswick", zip: "28465" },
  { name: "Bolivia", county: "brunswick", zip: "28422" },
];

export const CAPE_NICHES = ["septic", "generator", "dryer", "garage", "well", "crawl"] as const;

export function cityForCounties(counties: County[]) {
  if (counties.includes("new-hanover")) return "Wilmington";
  if (counties.includes("pender")) return "Hampstead";
  return "Leland";
}

export function defaultHoods(counties: County[]) {
  const set = new Set(counties);
  return HOODS.filter((h) => set.has(h.county)).map((h) => h.name);
}

export function countyNames(ids: County[]) {
  return COUNTIES.filter((c) => ids.includes(c.id)).map((c) => c.label);
}

export function inferCountyFromHood(hood: string, fallback: County = "new-hanover"): County {
  const h = hood.toLowerCase();
  const exact = HOODS.find((row) => row.name.toLowerCase() === h || h.includes(row.name.toLowerCase()));
  if (exact) return exact.county;
  if (/hampstead|burgaw|rocky point|surf city|pender/.test(h)) return "pender";
  if (/leland|bolivia|southport|oak island|st\.? james|holden|brunswick/.test(h)) return "brunswick";
  if (/wilmington|porters|myrtle|carolina beach|wrightsville|landfall|kure/.test(h)) return "new-hanover";
  return fallback;
}
