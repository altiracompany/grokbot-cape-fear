import type { Market, Niche } from "./types";
import { money } from "./utils";

export type RivalId = "angi" | "thumbtack" | "lsa" | "yelp" | "local-seo" | "rank-rent" | "ai-farm";
export type Wedge = "flank" | "fight" | "skip";
export type Density = "thin" | "mixed" | "packed";

export type Rival = {
  id: RivalId;
  name: string;
  camp: "mill" | "copycat";
  play: string;
  leak: string;
  ourMove: string;
};

export type NicheField = {
  nicheId: string;
  wedge: Wedge;
  angi: Density;
  lsa: Density;
  thumbtack: Density;
  localSeo: Density;
  rankRent: Density;
  angiPpl: string;
  why: string;
  doThis: string;
  dont: string;
};

export const RIVALS: Rival[] = [
  {
    id: "angi",
    name: "Angi / HomeAdvisor",
    camp: "mill",
    play: "Shared marketplace. 3–5 trucks buy the same ping. $40–$180 a lead.",
    leak: "Homeowner gets four callbacks. Close rate dies. Owners already hate the bill.",
    ourMove: "Name them in sentence one. Stop paying Angi for a lead four other trucks already called.",
  },
  {
    id: "thumbtack",
    name: "Thumbtack",
    camp: "mill",
    play: "Quote race. Lowest bid often wins. Price shoppers, not emergencies.",
    leak: "No exclusive. No urgency. Race to the bottom.",
    ourMove: "We don't quote-shop. We hand a screened job with a clock on it.",
  },
  {
    id: "lsa",
    name: "Google LSA",
    camp: "mill",
    play: "Google-branded pay-per-lead. Licensed HVAC, plumber, electrician, garage.",
    leak: "Expensive. Category-locked. Thin on septic, dryer vent, well.",
    ourMove: "Never bid 'Wilmington plumber.' Rank the specific query they don't sell.",
  },
  {
    id: "yelp",
    name: "Yelp Ads",
    camp: "mill",
    play: "Tax on a listing they already own. Shopper traffic.",
    leak: "Owners don't control the page. Leads browse, they don't book.",
    ourMove: "Ignore. Don't sell Yelp management.",
  },
  {
    id: "local-seo",
    name: "Local SEO shops",
    camp: "copycat",
    play: "We'll rank YOUR site. $1.5–4k/mo retainer. Client keeps the asset when they leave.",
    leak: "Slow. They don't answer the phone. They polish a brochure.",
    ourMove: "We own the ranker. Jobs this week. Their domain is 1.5–2× and a warning, then walk.",
  },
  {
    id: "rank-rent",
    name: "Rank-and-rent shops",
    camp: "copycat",
    play: "Same model as us: domain + GBP + rent. They noticed Cape Fear isn't Charlotte.",
    leak: "Most don't answer the phone. Thin copy. They still spray shared leads.",
    ourMove: "First-mover on domain + GBP. Desk that screens. Ship this week, not next quarter.",
  },
  {
    id: "ai-farm",
    name: "AI site farms",
    camp: "copycat",
    play: "Programmatic city pages. Spun NAP. Doorway spam at scale.",
    leak: "Google already suppressing it. No reviews engine. No human on the line.",
    ourMove: "Unique Cape Fear copy, real hours, real tracking, real desk. Don't race page count.",
  },
];

export const ENGAGE: { title: string; rule: string }[] = [
  {
    title: "Don't buy their auction",
    rule: "Never enter Wilmington plumber, HVAC, or electrician. LSA + Angi own that fight. You will lose on bid price.",
  },
  {
    title: "Flank what they list but don't rank",
    rule: "Dryer vent, septic, well pump, standby generator. They sell shared leads. Nobody owns the niche+city page.",
  },
  {
    title: "Packed Map pack = skip",
    rule: "Six-plus LSA advertisers and a national brand in the 3-pack: score it skip. Don't hero it.",
  },
  {
    title: "First-mover is the only moat",
    rule: "Copycats will clone any niche that prints in 90 days. Lock domain + GBP this week. Desk is what they can't copy overnight.",
  },
  {
    title: "Pitch jobs, not rankings",
    rule: "New shops will try to out-SEO you. They can't out-desk you. Screened exclusive vs shared mill is the only line that beats price.",
  },
  {
    title: "Don't outspend LSA",
    rule: "Outrank the specific query they don't sell. Garage door: only fight on salt + hurricane. Crawl: don't fight Ninja in the city.",
  },
];

export const NICHE_FIELD: Record<string, NicheField> = {
  septic: {
    nicheId: "septic",
    wedge: "flank",
    angi: "thin",
    lsa: "thin",
    thumbtack: "mixed",
    localSeo: "thin",
    rankRent: "thin",
    angiPpl: "$45–$90 shared",
    why: "Family pumpers, brochure sites. Angi lists it; nobody ranks 'septic pumping Wilmington NC.' LSA barely covers pumping.",
    doThis: "Own wilmingtonseptic.com. Screen backups. Two trucks on 2-free then $50.",
    dont: "Don't pitch city plumbers. That's LSA.",
  },
  dryer: {
    nicheId: "dryer",
    wedge: "flank",
    angi: "thin",
    lsa: "thin",
    thumbtack: "thin",
    localSeo: "thin",
    rankRent: "thin",
    angiPpl: "$20–$45 (HVAC upsell)",
    why: "Best wedge. HVAC techs upsell it. No dedicated LSA. Humidity + long vents. Copycats haven't noticed yet.",
    doThis: "Keep the page #1. Same-day screen. Flood LintLock with 2-free then $25.",
    dont: "Don't expand into duct cleaning vs national HVAC. Stay dryer vent.",
  },
  generator: {
    nicheId: "generator",
    wedge: "flank",
    angi: "mixed",
    lsa: "mixed",
    thumbtack: "mixed",
    localSeo: "mixed",
    rankRent: "mixed",
    angiPpl: "$90–$180 shared",
    why: "Florence memory. $12–20k tickets. LSA electricians exist — they are not generator specialists. Rank-rent will show up after the next named storm.",
    doThis: "Own standby + storm language. Desk qualifies panel and county before the $180 handoff.",
    dont: "Don't fight 'Wilmington electrician.' That's Google's auction.",
  },
  well: {
    nicheId: "well",
    wedge: "flank",
    angi: "thin",
    lsa: "thin",
    thumbtack: "thin",
    localSeo: "thin",
    rankRent: "thin",
    angiPpl: "$50–$120 shared",
    why: "Pender/Brunswick wells. Mills ignore rural. Same dirt as septic. New shops chase city HVAC.",
    doThis: "Ship penderwellpump.com. No-water is 24/7. Two free then $125.",
    dont: "Don't run Wilmington city water-heater ads. Stay wells.",
  },
  garage: {
    nicheId: "garage",
    wedge: "fight",
    angi: "packed",
    lsa: "mixed",
    thumbtack: "packed",
    localSeo: "mixed",
    rankRent: "mixed",
    angiPpl: "$40–$90 shared",
    why: "Mill favorite. Overhead Door + A1 + Angi. Copycats will come here first because the PPL is obvious.",
    doThis: "Only fight on salt rust and hurricane-rated doors. Screen springs. Don't buy volume.",
    dont: "Don't outbid Angi on generic 'garage door repair Wilmington.' You'll lose.",
  },
  crawl: {
    nicheId: "crawl",
    wedge: "skip",
    angi: "mixed",
    lsa: "thin",
    thumbtack: "mixed",
    localSeo: "packed",
    rankRent: "mixed",
    angiPpl: "$80–$200 shared",
    why: "Ninja owns Wilmington city. Modernize dumps mold leads. A city fight is vanity.",
    doThis: "Brunswick-only if you touch it. Score it. Don't build a Wilmington crawl page.",
    dont: "Don't fight Ninja for the city 3-pack.",
  },
  tow: {
    nicheId: "tow",
    wedge: "skip",
    angi: "thin",
    lsa: "thin",
    thumbtack: "thin",
    localSeo: "mixed",
    rankRent: "packed",
    angiPpl: "Dispatch networks, not Angi",
    why: "Motor clubs and dispatch apps own roadside. Ranking a tow page is a dispatch war, not a local SERP war.",
    doThis: "Leave it unless you already own a yard.",
    dont: "Don't buy AAA leftover calls.",
  },
  handyman: {
    nicheId: "handyman",
    wedge: "skip",
    angi: "packed",
    lsa: "mixed",
    thumbtack: "packed",
    localSeo: "packed",
    rankRent: "packed",
    angiPpl: "$30–$70 shared",
    why: "Thumbtack + Angi + Taskrabbit. Generic, low ticket, shared everything.",
    doThis: "Skip.",
    dont: "Don't 'just add handyman' to a real niche site.",
  },
  appliance: {
    nicheId: "appliance",
    wedge: "fight",
    angi: "packed",
    lsa: "mixed",
    thumbtack: "packed",
    localSeo: "mixed",
    rankRent: "mixed",
    angiPpl: "$35–$75 shared",
    why: "Mills love it. Sears leftover. Same-day is the only angle.",
    doThis: "Only if you already have a tech who answers. Not this week.",
    dont: "Don't open a new city page against packed Thumbtack.",
  },
  dental: {
    nicheId: "dental",
    wedge: "skip",
    angi: "thin",
    lsa: "thin",
    thumbtack: "thin",
    localSeo: "packed",
    rankRent: "thin",
    angiPpl: "Patient acquisition platforms, not Angi",
    why: "PatientPop / NexHealth / local groups. Different game. Not a home-service mill fight.",
    doThis: "Leave it. Not our desk.",
    dont: "Don't pretend emergency dental is dryer vent.",
  },
  ev: {
    nicheId: "ev",
    wedge: "fight",
    angi: "mixed",
    lsa: "mixed",
    thumbtack: "mixed",
    localSeo: "mixed",
    rankRent: "mixed",
    angiPpl: "$60–$140 shared",
    why: "Electricians on LSA already. Slow ticket, permit lag, low close.",
    doThis: "Park it. Generator prints first.",
    dont: "Don't split Grant Electric across EV and standby.",
  },
  mechanic: {
    nicheId: "mechanic",
    wedge: "skip",
    angi: "mixed",
    lsa: "thin",
    thumbtack: "packed",
    localSeo: "mixed",
    rankRent: "mixed",
    angiPpl: "$25–$60 shared",
    why: "Thumbtack owns mobile mechanic quotes. Low trust, low ticket.",
    doThis: "Skip.",
    dont: "Don't add it because someone has a van.",
  },
  gutter: {
    nicheId: "gutter",
    wedge: "fight",
    angi: "packed",
    lsa: "mixed",
    thumbtack: "packed",
    localSeo: "mixed",
    rankRent: "packed",
    angiPpl: "$25–$55 shared",
    why: "Seasonal mill category. Rank-rent loves it. Easy to copy.",
    doThis: "Only after dryer vent is printing. Storm-window only.",
    dont: "Don't be the fifth 'Wilmington gutter cleaning' page.",
  },
};

const FALLBACK: Omit<NicheField, "nicheId"> = {
  wedge: "fight",
  angi: "mixed",
  lsa: "mixed",
  thumbtack: "mixed",
  localSeo: "mixed",
  rankRent: "mixed",
  angiPpl: "Unknown — score it",
  why: "No Cape Fear card yet. Score demand, Map pack, and LSA count before you build.",
  doThis: "Score. Two buyers or don't build.",
  dont: "Don't copy a Charlotte playbook into this dirt.",
};

export function fieldFor(nicheId: string): NicheField {
  return NICHE_FIELD[nicheId] ?? { nicheId, ...FALLBACK };
}

export function mills() {
  return RIVALS.filter((r) => r.camp === "mill");
}

export function copycats() {
  return RIVALS.filter((r) => r.camp === "copycat");
}

export function wedgeLabel(wedge: Wedge) {
  if (wedge === "flank") return "Flank";
  if (wedge === "fight") return "Fight";
  return "Skip";
}

export function killShotSms(market: Market, niche: Niche) {
  const field = fieldFor(niche.id);
  return `You're paying Angi ${field.angiPpl} for a ${niche.name.toLowerCase()} lead 3 other trucks already called.

We own ${market.domain}. Our desk answers ${market.trackingNumber}. One screened job — name, address, urgency, tape. Not a shared ping.

First 2 free. Then ${money(market.pplPrice)}.

Reply YES and a weekly cap.`;
}

export function killShotEmail(market: Market, niche: Niche) {
  const field = fieldFor(niche.id);
  return `Subject: Stop buying Angi ${niche.name.toLowerCase()} leftovers — Cape Fear

${field.why}

Angi / Thumbtack / LSA sell shared inventory. You pay ${field.angiPpl}. Four trucks hit the same phone.

We own ${market.domain}. We answer ${market.trackingNumber}. You get one screened handoff.

First 2 free. Then ${money(market.pplPrice)}.

Do: ${field.doThis}
Don't: ${field.dont}

How many can you take this week after the 2 free?`;
}

export function fieldWhy(nicheId: string) {
  const f = fieldFor(nicheId);
  return `${wedgeLabel(f.wedge).toUpperCase()}. ${f.why} ${f.doThis}`;
}
