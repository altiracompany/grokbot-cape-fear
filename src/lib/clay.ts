import type { County } from "./types";
import { HOME_NICHES, RSVP_NICHES, SEAT_NICHES, type SeatNicheId } from "./seats";

/** Clay / Outscraper / Maps CSV → desk. We don't rebuild Clay. We ingest it. */

export type ClayRow = {
  name: string;
  company: string;
  phone: string;
  email: string;
  county: County;
  nicheId: SeatNicheId;
  website?: string;
  rating?: string;
  reviews?: string;
  maps?: string;
};

const NICHES = new Set<string>([...SEAT_NICHES, ...RSVP_NICHES, ...HOME_NICHES]);

const NICHE_ALIAS: Record<string, SeatNicheId> = {
  fencing: "fence",
  "fence contractor": "fence",
  "fence company": "fence",
  gutters: "gutter",
  "gutter cleaning": "gutter",
  "pressure washing": "wash",
  "pressure wash": "wash",
  "power washing": "wash",
  landscaping: "landscape",
  landscaper: "landscape",
  "mobile detail": "detail",
  detailing: "detail",
  "foundation repair": "foundation",
  "general contractor": "gc",
  "window installer": "windows",
  "window replacement": "windows",
  "bounce house": "bounce",
  "party rental": "rental",
  "dryer vent": "dryer",
  "water damage": "water",
};

const COUNTY_ALIAS: Record<string, County> = {
  comal: "comal",
  "new braunfels": "comal",
  "canyon lake": "comal",
  bulverde: "comal",
  "spring branch": "comal",
  bexar: "bexar",
  "san antonio": "bexar",
  "stone oak": "bexar",
  guadalupe: "guadalupe",
  seguin: "guadalupe",
  cibolo: "guadalupe",
  schertz: "guadalupe",
  "new hanover": "new-hanover",
  wilmington: "new-hanover",
  pender: "pender",
  hampstead: "pender",
  brunswick: "brunswick",
  leland: "brunswick",
};

export const CLAY_MCP = "https://api.clay.com/v3/mcp";

export const CLAY_RECIPE = [
  "Clay is an MCP, not a CSV product. Endpoint: https://api.clay.com/v3/mcp",
  "Connect Clay to Grok (custom MCP / connectors). Sign in the Clay workspace. Credits bill there — no MCP surcharge.",
  "Then say: pull fence contractors in New Braunfels with phones. We ingest. We text from Cove.",
  "Until MCP is connected here: export CSV from Clay or Outscraper and paste below. Same desk.",
  "One trade per run. Drop 800s and under 3.8 stars. First YES locks the county+trade.",
] as const;

export const CLAY_SAMPLE = `name,company,phone,email,county,niche,website,rating,reviews
Alex,AMG Fence,(512) 801-5330,alexfence2006@gmail.com,comal,fence,https://amgfencebuildersllc.com,4.9,40
Dispatch,Kustom Fence,(830) 217-2864,,comal,fence,https://www.kustomfence.com,4.8,20`;

function norm(s: string) {
  return s.trim().toLowerCase().replace(/[_-]+/g, " ");
}

export function mapNiche(raw: string): SeatNicheId | null {
  const n = norm(raw);
  if (NICHES.has(n)) return n as SeatNicheId;
  if (NICHE_ALIAS[n]) return NICHE_ALIAS[n];
  for (const [k, v] of Object.entries(NICHE_ALIAS)) {
    if (n.includes(k)) return v;
  }
  for (const id of NICHES) {
    if (n.includes(id)) return id as SeatNicheId;
  }
  return null;
}

export function mapCounty(raw: string): County | null {
  const n = norm(raw);
  if (COUNTY_ALIAS[n]) return COUNTY_ALIAS[n];
  for (const [k, v] of Object.entries(COUNTY_ALIAS)) {
    if (n.includes(k)) return v;
  }
  return null;
}

function pick(row: Record<string, string>, keys: string[]) {
  for (const k of keys) {
    const hit = Object.entries(row).find(([h]) => norm(h) === norm(k) || norm(h).includes(norm(k)));
    if (hit?.[1]?.trim()) return hit[1].trim();
  }
  return "";
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      q = !q;
      continue;
    }
    if (c === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

export function parseClayPaste(text: string): { rows: ClayRow[]; errors: string[] } {
  const raw = text.trim();
  const errors: string[] = [];
  const rows: ClayRow[] = [];
  if (!raw) return { rows, errors: ["Paste a Clay CSV or JSON."] };

  let records: Record<string, string>[] = [];
  if (raw.startsWith("[") || raw.startsWith("{")) {
    try {
      const json = JSON.parse(raw) as unknown;
      const arr = Array.isArray(json) ? json : json && typeof json === "object" && "rows" in json ? (json as { rows: unknown[] }).rows : [json];
      records = arr.map((item) => {
        const o = item as Record<string, unknown>;
        const rec: Record<string, string> = {};
        for (const [k, v] of Object.entries(o)) rec[k] = v == null ? "" : String(v);
        return rec;
      });
    } catch {
      return { rows, errors: ["JSON didn't parse. Export CSV from Clay instead."] };
    }
  } else {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return { rows, errors: ["Need a header row and at least one company."] };
    const headers = splitCsvLine(lines[0] ?? "");
    for (const line of lines.slice(1)) {
      const cols = splitCsvLine(line);
      const rec: Record<string, string> = {};
      headers.forEach((h, i) => {
        rec[h] = cols[i] ?? "";
      });
      records.push(rec);
    }
  }

  records.forEach((rec, i) => {
    const company = pick(rec, ["company", "business", "title", "name"]) || pick(rec, ["company_name"]);
    const name = pick(rec, ["owner", "owner_name", "full_name", "contact", "name"]) || company;
    const phone = pick(rec, ["phone", "mobile", "cell", "phone_number"]);
    const email = pick(rec, ["email", "work_email", "owner_email"]);
    const nicheId = mapNiche(pick(rec, ["niche", "trade", "category", "type", "industry"]));
    const county = mapCounty(pick(rec, ["county", "city", "location", "address", "area"]));
    const digits = phone.replace(/\D/g, "");
    const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
    if (ten.length !== 10) {
      errors.push(`Row ${i + 1}: no real phone (${company || "blank"}).`);
      return;
    }
    if (ten.startsWith("555")) {
      errors.push(`Row ${i + 1}: 555 is seed junk. Clay real numbers only.`);
      return;
    }
    if (!nicheId) {
      errors.push(`Row ${i + 1}: ${company} — trade not a seat (fence, gutter, wash, foundation…).`);
      return;
    }
    if (!county) {
      errors.push(`Row ${i + 1}: ${company} — no county we work.`);
      return;
    }
    rows.push({
      name: name || company,
      company: company || name,
      phone: `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`,
      email,
      county,
      nicheId,
      website: pick(rec, ["website", "url", "domain"]),
      rating: pick(rec, ["rating", "stars", "google_rating"]),
      reviews: pick(rec, ["reviews", "review_count"]),
      maps: pick(rec, ["maps", "maps_url", "google_maps"]),
    });
  });

  return { rows, errors };
}
