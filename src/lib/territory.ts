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
  { name: "San Antonio", county: "bexar", zip: "78201" },
  { name: "Stone Oak", county: "bexar", zip: "78258" },
  { name: "Helotes", county: "bexar", zip: "78023" },
  { name: "Leon Valley", county: "bexar", zip: "78238" },
  { name: "New Braunfels", county: "comal", zip: "78130" },
  { name: "Canyon Lake", county: "comal", zip: "78133" },
  { name: "Bulverde", county: "comal", zip: "78163" },
  { name: "Gruene", county: "comal", zip: "78130" },
  { name: "Schertz", county: "guadalupe", zip: "78154" },
  { name: "Cibolo", county: "guadalupe", zip: "78108" },
  { name: "Seguin", county: "guadalupe", zip: "78155" },
  { name: "McQueeney", county: "guadalupe", zip: "78123" },
];

export const CAPE_NICHES = [
  "septic",
  "generator",
  "dryer",
  "well",
  "garage",
  "tree",
  "water",
  "mosquito",
  "pool",
  "dock",
] as const;

export function cityForCounties(counties: County[]) {
  if (counties.includes("new-hanover")) return "Wilmington";
  if (counties.includes("pender")) return "Hampstead";
  if (counties.includes("brunswick")) return "Leland";
  if (counties.includes("comal")) return "New Braunfels";
  if (counties.includes("guadalupe")) return "Schertz";
  if (counties.includes("bexar")) return "San Antonio";
  return "Wilmington";
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
  if (/canyon lake|new braunfels|bulverde|gruene|comal/.test(h)) return "comal";
  if (/schertz|cibolo|seguin|mcqueeney|guadalupe/.test(h)) return "guadalupe";
  if (/san antonio|stone oak|helotes|leon valley|bexar/.test(h)) return "bexar";
  return fallback;
}
