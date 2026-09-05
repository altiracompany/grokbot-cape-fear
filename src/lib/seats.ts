import { COUNTIES, regionOf, type Buyer, type County, type HuntStatus, type Region } from "./types";
import { nicheById } from "./niches";
import { MONTHLY_SEAT, TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "./pricing";
import { money } from "./utils";

/** 10 niches we actually sell. 3 counties. 30 exclusive monthly seats. */
export const SEAT_NICHES = [
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

export type SeatNicheId = (typeof SEAT_NICHES)[number];

export type HuntSeat = {
  id: string;
  nicheId: SeatNicheId;
  county: County;
  name: string;
  company: string;
  phone: string;
  email: string;
  hunt: HuntStatus;
  notes: string;
};

export function marketIdForNiche(nicheId: string, county?: County) {
  if (county && regionOf(county) === "alamo") return `alamo-${nicheId}`;
  if (nicheId === "well") return "pender-well";
  return `wilmington-${nicheId}`;
}

export function countyLabel(id: County) {
  return COUNTIES.find((c) => c.id === id)?.label ?? id;
}

export function seatKey(nicheId: string, county: County) {
  return `${nicheId}:${county}`;
}

/** Composite local operators. 555 numbers. Close these, don't buy Bark. */
export const HUNT_CAPE: HuntSeat[] = [
  { id: "by-pell", nicheId: "septic", county: "new-hanover", name: "Wayne Pell", company: "Pell Septic", phone: "(910) 555-2201", email: "wayne@pellseptic.example", hunt: "paying", notes: "NH backups. Two trucks. Trial burned. Paying the seat." },
  { id: "by-lewis", nicheId: "septic", county: "pender", name: "Dale Lewis", company: "Lewis Lane Septic", phone: "(910) 555-2214", email: "dale@lewislane.example", hunt: "pitched", notes: "Pender pump + inspect. Already on Angi." },
  { id: "by-cape", nicheId: "septic", county: "brunswick", name: "Rita Holton", company: "Cape Pumping Co", phone: "(910) 555-2208", email: "rita@capepump.example", hunt: "paying", notes: "Brunswick inspections. Paying the seat." },

  { id: "by-grant", nicheId: "generator", county: "new-hanover", name: "Eli Grant", company: "Grant Electric", phone: "(910) 555-3302", email: "eli@grantelectric.example", hunt: "trial", notes: "Kohler + Generac. Landfall. 2 free open." },
  { id: "by-hamp-power", nicheId: "generator", county: "pender", name: "Cole Rigsby", company: "Hampstead Power Co", phone: "(910) 555-3318", email: "cole@hampsteadpower.example", hunt: "open", notes: "Pender standby. No mill spend yet." },
  { id: "by-storm", nicheId: "generator", county: "brunswick", name: "Paige Nunez", company: "Stormline Power", phone: "(910) 555-3310", email: "paige@stormline.example", hunt: "trial", notes: "St. James / Southport. One free used." },

  { id: "by-lint", nicheId: "dryer", county: "new-hanover", name: "Chris Lang", company: "LintLock Cape Fear", phone: "(910) 555-1180", email: "chris@lintlock.example", hunt: "trial", notes: "Same-day. Two techs. Best wedge." },
  { id: "by-tide-lint", nicheId: "dryer", county: "pender", name: "Maya Crowe", company: "Tide Lint", phone: "(910) 555-1186", email: "maya@tidelint.example", hunt: "open", notes: "Hampstead / Surf City long runs." },
  { id: "by-leland-vent", nicheId: "dryer", county: "brunswick", name: "Drew Pate", company: "Leland Vent Co", phone: "(910) 555-1192", email: "drew@lelandvent.example", hunt: "pitched", notes: "Leland humidity. Thumbtack leftover." },

  { id: "by-castle-pump", nicheId: "well", county: "new-hanover", name: "Hank Ivey", company: "Castle Hayne Pump", phone: "(910) 555-5508", email: "hank@castlehaynepump.example", hunt: "open", notes: "Rural NH wells. Mills ignore." },
  { id: "by-well", nicheId: "well", county: "pender", name: "Sage Patton", company: "Pender Pump Co", phone: "(910) 555-5502", email: "sage@penderpump.example", hunt: "pitched", notes: "Wants 2 free the week the site ranks." },
  { id: "by-bolivia-well", nicheId: "well", county: "brunswick", name: "Tessa Quinn", company: "Bolivia Well Service", phone: "(910) 555-5514", email: "tessa@boliviawell.example", hunt: "open", notes: "Brunswick wells + pressure tanks." },

  { id: "by-salt", nicheId: "garage", county: "new-hanover", name: "Nora Vines", company: "Salt Air Doors", phone: "(910) 555-4401", email: "nora@saltair.example", hunt: "pitched", notes: "Salt rust + hurricane doors. Fight, don't volume-bid." },
  { id: "by-surf-door", nicheId: "garage", county: "pender", name: "Will Hester", company: "Surf City Doors", phone: "(910) 555-4408", email: "will@surfcitydoors.example", hunt: "open", notes: "Pender springs. Not Overhead Door." },
  { id: "by-oak-door", nicheId: "garage", county: "brunswick", name: "Gina Rhodes", company: "Oak Island Overhead", phone: "(910) 555-4416", email: "gina@oakoverhead.example", hunt: "open", notes: "Island salt. Same-day spring." },

  { id: "by-salt-tree", nicheId: "tree", county: "new-hanover", name: "Marcus Seagate", company: "Salt Marsh Tree", phone: "(910) 555-6602", email: "marcus@saltmarshtree.example", hunt: "pitched", notes: "Storm take-downs. Hates Angi 5-pro dump." },
  { id: "by-sloop-tree", nicheId: "tree", county: "pender", name: "Ivy Patriot", company: "Sloop Point Tree", phone: "(910) 555-6610", email: "ivy@slooppointtree.example", hunt: "open", notes: "Hampstead / Burgaw emergency tree." },
  { id: "by-cleancut", nicheId: "tree", county: "brunswick", name: "Chris Cutler", company: "Cape Fear Clean Cut", phone: "(910) 555-6618", email: "chris@capefearcleancut.example", hunt: "open", notes: "Leland / Oak Island. Storm debris." },

  { id: "by-floodline", nicheId: "water", county: "new-hanover", name: "Dana Voss", company: "FloodLine Wilmington", phone: "(910) 555-7702", email: "dana@floodline.example", hunt: "pitched", notes: "Independent. Don't fight SERVPRO on brand — steal the overflow." },
  { id: "by-pender-dry", nicheId: "water", county: "pender", name: "Owen Drake", company: "Pender Dry Out", phone: "(910) 555-7710", email: "owen@penderdryout.example", hunt: "open", notes: "Pender flood extract. Thin franchise." },
  { id: "by-brunswick-extract", nicheId: "water", county: "brunswick", name: "Lila Shore", company: "Brunswick Extract", phone: "(910) 555-7718", email: "lila@brunswickextract.example", hunt: "open", notes: "Leland / Southport water jobs." },

  { id: "by-wright-moz", nicheId: "mosquito", county: "new-hanover", name: "Brett Hale", company: "Wrightsville Mosquito", phone: "(910) 555-8802", email: "brett@wrightmosquito.example", hunt: "pitched", notes: "Barrier spray. Seasonal but monthly seat still prints." },
  { id: "by-hamp-moz", nicheId: "mosquito", county: "pender", name: "June Alden", company: "Hampstead Yard Guard", phone: "(910) 555-8810", email: "june@hampsteadyard.example", hunt: "open", notes: "Pender mosquitoes. Franchise leftover." },
  { id: "by-james-moz", nicheId: "mosquito", county: "brunswick", name: "Rico St. James", company: "St James Mosquito", phone: "(910) 555-8818", email: "rico@stjamesmosquito.example", hunt: "open", notes: "Retirement + golf. Recurring routes." },

  { id: "by-landfall-pool", nicheId: "pool", county: "new-hanover", name: "Amber Colt", company: "Landfall Pool Tech", phone: "(910) 555-8902", email: "amber@landfallpool.example", hunt: "open", notes: "Landfall / Porters Neck weekly." },
  { id: "by-hamp-pool", nicheId: "pool", county: "pender", name: "Nate Bloom", company: "Hampstead Pool Care", phone: "(910) 555-8910", email: "nate@hampsteadpool.example", hunt: "open", notes: "Pender new-build pools." },
  { id: "by-leland-pool", nicheId: "pool", county: "brunswick", name: "Sofia Leland", company: "Leland Pool Co", phone: "(910) 555-8918", email: "sofia@lelandpoolco.example", hunt: "pitched", notes: "Brunswick weekly + green-to-clean." },

  { id: "by-wright-dock", nicheId: "dock", county: "new-hanover", name: "Captain Rhee", company: "Wrightsville Dock & Lift", phone: "(910) 555-9002", email: "rhee@wrightsdock.example", hunt: "pitched", notes: "Boat lifts. Mills don't even list this right." },
  { id: "by-surf-lift", nicheId: "dock", county: "pender", name: "Kara Inlet", company: "Surf City Lifts", phone: "(910) 555-9010", email: "kara@surfcitylifts.example", hunt: "open", notes: "Pender ICW docks." },
  { id: "by-southport-dock", nicheId: "dock", county: "brunswick", name: "Miles Harbor", company: "Southport Marine Dock", phone: "(910) 555-9018", email: "miles@southportdock.example", hunt: "pitched", notes: "Southport / Oak Island. High ticket, thin SERP." },
];

/** Bexar · Comal · Guadalupe. All open. Atascosa / Wilson wait. */
export const HUNT_ALAMO: HuntSeat[] = [
  { id: "tx-helotes-septic", nicheId: "septic", county: "bexar", name: "Ray Valdez", company: "Helotes Pumping", phone: "(210) 555-2201", email: "ray@helotespump.example", hunt: "open", notes: "Unincorporated Bexar. Not SAWS sewer. Don't pitch downtown plumbers." },
  { id: "tx-canyon-septic", nicheId: "septic", county: "comal", name: "Dana Krueger", company: "Canyon Lake Septic", phone: "(830) 555-2214", email: "dana@canyonseptic.example", hunt: "open", notes: "Comal septic belt. Hill Country. Strongest TX septic seat." },
  { id: "tx-seguin-septic", nicheId: "septic", county: "guadalupe", name: "Luis Mora", company: "Seguin Lane Septic", phone: "(830) 555-2208", email: "luis@seguinseptic.example", hunt: "open", notes: "Seguin / Cibolo pump + inspect." },

  { id: "tx-alamo-power", nicheId: "generator", county: "bexar", name: "Eli Navarro", company: "Alamo Standby", phone: "(210) 555-3302", email: "eli@alamostandby.example", hunt: "open", notes: "ERCOT ice. Stone Oak / Helotes. Don't fight SA electrician LSA." },
  { id: "tx-hill-power", nicheId: "generator", county: "comal", name: "Cole Richter", company: "Hill Country Power", phone: "(830) 555-3318", email: "cole@hillcountrypower.example", hunt: "open", notes: "New Braunfels / Canyon Lake standby." },
  { id: "tx-cibolo-power", nicheId: "generator", county: "guadalupe", name: "Paige Solis", company: "Cibolo Power Co", phone: "(210) 555-3310", email: "paige@cibolopower.example", hunt: "open", notes: "Schertz / Cibolo whole-house." },

  { id: "tx-oak-lint", nicheId: "dryer", county: "bexar", name: "Chris Pena", company: "Stone Oak Lint", phone: "(210) 555-1180", email: "chris@stoneoaklint.example", hunt: "open", notes: "North Bexar long runs. Volume seat." },
  { id: "tx-gruene-vent", nicheId: "dryer", county: "comal", name: "Maya Fuchs", company: "Gruene Vent", phone: "(830) 555-1186", email: "maya@gruenevent.example", hunt: "open", notes: "New Braunfels humidity + dryers." },
  { id: "tx-schertz-vent", nicheId: "dryer", county: "guadalupe", name: "Drew Hale", company: "Schertz Vent Co", phone: "(210) 555-1192", email: "drew@schertzvent.example", hunt: "open", notes: "Schertz / Cibolo. Thumbtack leftover." },

  { id: "tx-somerset-well", nicheId: "well", county: "bexar", name: "Hank Ortiz", company: "Somerset Well Service", phone: "(210) 555-5508", email: "hank@somersetwell.example", hunt: "open", notes: "South Bexar wells. Mills ignore." },
  { id: "tx-bulverde-well", nicheId: "well", county: "comal", name: "Sage Patton", company: "Bulverde Well Co", phone: "(830) 555-5502", email: "sage@bulverdewell.example", hunt: "open", notes: "Comal hill wells. Best TX well seat." },
  { id: "tx-marion-pump", nicheId: "well", county: "guadalupe", name: "Tessa Quinn", company: "Marion Pump", phone: "(830) 555-5514", email: "tessa@marionpump.example", hunt: "open", notes: "Guadalupe wells + pressure tanks." },

  { id: "tx-alamo-door", nicheId: "garage", county: "bexar", name: "Nora Vines", company: "Alamo Springs", phone: "(210) 555-4401", email: "nora@alamosprings.example", hunt: "open", notes: "Fight on storm doors only. Don't outbid Overhead Door SA." },
  { id: "tx-nb-door", nicheId: "garage", county: "comal", name: "Will Hester", company: "Braunfels Doors", phone: "(830) 555-4408", email: "will@braunfelsdoors.example", hunt: "open", notes: "Comal springs. Not the national." },
  { id: "tx-schertz-door", nicheId: "garage", county: "guadalupe", name: "Gina Rhodes", company: "Schertz Overhead", phone: "(210) 555-4416", email: "gina@schertzoverhead.example", hunt: "open", notes: "Schertz / Cibolo same-day spring." },

  { id: "tx-north-tree", nicheId: "tree", county: "bexar", name: "Marcus Seagate", company: "Northside Tree", phone: "(210) 555-6602", email: "marcus@northsidetree.example", hunt: "open", notes: "Storm take-downs. Oak wilt language. Hates Angi 5-pro dump." },
  { id: "tx-river-tree", nicheId: "tree", county: "comal", name: "Ivy Patriot", company: "Guadalupe River Tree", phone: "(830) 555-6610", email: "ivy@guadaluperivertree.example", hunt: "open", notes: "New Braunfels / Canyon Lake emergency tree." },
  { id: "tx-seguin-tree", nicheId: "tree", county: "guadalupe", name: "Chris Cutler", company: "Seguin Tree Co", phone: "(830) 555-6618", email: "chris@seguintree.example", hunt: "open", notes: "Seguin / Cibolo storm debris." },

  { id: "tx-extract-sa", nicheId: "water", county: "bexar", name: "Dana Voss", company: "Independent Extract SA", phone: "(210) 555-7702", email: "dana@extractsa.example", hunt: "open", notes: "Don't fight SERVPRO on brand. Steal overflow." },
  { id: "tx-comal-dry", nicheId: "water", county: "comal", name: "Owen Drake", company: "Comal Dry Out", phone: "(830) 555-7710", email: "owen@comaldryout.example", hunt: "open", notes: "Hill Country flood extract. Thin franchise." },
  { id: "tx-cibolo-extract", nicheId: "water", county: "guadalupe", name: "Lila Shore", company: "Cibolo Extract", phone: "(210) 555-7718", email: "lila@ciboloextract.example", hunt: "open", notes: "Schertz / Cibolo water jobs." },

  { id: "tx-oak-moz", nicheId: "mosquito", county: "bexar", name: "Brett Hale", company: "Stone Oak Mosquito", phone: "(210) 555-8802", email: "brett@stoneoakmosquito.example", hunt: "open", notes: "North Bexar barrier spray. Recurring." },
  { id: "tx-gruene-moz", nicheId: "mosquito", county: "comal", name: "June Alden", company: "Gruene Yard Guard", phone: "(830) 555-8810", email: "june@grueneyard.example", hunt: "open", notes: "Comal mosquitoes. Franchise leftover." },
  { id: "tx-schertz-moz", nicheId: "mosquito", county: "guadalupe", name: "Rico St. James", company: "Schertz Mosquito", phone: "(210) 555-8818", email: "rico@schertzmosquito.example", hunt: "open", notes: "Schertz / Cibolo routes." },

  { id: "tx-oak-pool", nicheId: "pool", county: "bexar", name: "Amber Colt", company: "Stone Oak Pool Tech", phone: "(210) 555-8902", email: "amber@stoneoakpool.example", hunt: "open", notes: "North Bexar weekly. Strongest TX volume seat." },
  { id: "tx-nb-pool", nicheId: "pool", county: "comal", name: "Nate Bloom", company: "Braunfels Pool Care", phone: "(830) 555-8910", email: "nate@braunfelspool.example", hunt: "open", notes: "New Braunfels / Gruene weekly + green-to-clean." },
  { id: "tx-cibolo-pool", nicheId: "pool", county: "guadalupe", name: "Sofia Leland", company: "Cibolo Pool Co", phone: "(210) 555-8918", email: "sofia@cibolopool.example", hunt: "open", notes: "Schertz / Cibolo new-build pools." },

  { id: "tx-calaveras-dock", nicheId: "dock", county: "bexar", name: "Captain Rhee", company: "Calaveras Dock & Lift", phone: "(210) 555-9002", email: "rhee@calaverasdock.example", hunt: "open", notes: "Calaveras Lake. Thin SERP. Not River Walk." },
  { id: "tx-canyon-lift", nicheId: "dock", county: "comal", name: "Kara Inlet", company: "Canyon Lake Lifts", phone: "(830) 555-9010", email: "kara@canyonlakelifts.example", hunt: "open", notes: "Best TX dock seat. Canyon Lake boat lifts." },
  { id: "tx-mcqueeney-dock", nicheId: "dock", county: "guadalupe", name: "Miles Harbor", company: "McQueeney Boat Lift", phone: "(830) 555-9018", email: "miles@mcqueeneylift.example", hunt: "open", notes: "Lake McQueeney. High ticket, thin mill." },
];

export const HUNT: HuntSeat[] = [...HUNT_CAPE, ...HUNT_ALAMO];

export function seatPriceFor(_nicheId?: string) {
  return MONTHLY_SEAT;
}

export function targetWeekly(region?: Region | "all") {
  const seats = !region || region === "all" ? 60 : 30;
  return WEEKLY_SEAT * seats;
}

export function targetMrr(region?: Region | "all") {
  return targetWeekly(region) * 4;
}

export function payingWeekly(buyers: Buyer[], region?: Region | "all") {
  return inRegion(buyers, region).filter((b) => b.hunt === "paying").length * WEEKLY_SEAT;
}

export function payingMrr(buyers: Buyer[], region?: Region | "all") {
  return payingWeekly(buyers, region) * 4;
}

export function inRegion(buyers: Buyer[], region?: Region | "all") {
  if (!region || region === "all") return buyers;
  return buyers.filter((b) => regionOf(b.county) === region);
}

export function huntCounts(buyers: Buyer[], region?: Region | "all") {
  const slice = inRegion(buyers, region);
  const paying = slice.filter((b) => b.hunt === "paying").length;
  const trial = slice.filter((b) => b.hunt === "trial").length;
  const pitched = slice.filter((b) => b.hunt === "pitched").length;
  const open = slice.filter((b) => b.hunt === "open").length;
  const target = !region || region === "all" ? 60 : 30;
  return { paying, trial, pitched, open, total: slice.length, gap: Math.max(0, target - paying), target };
}

export function seatSms(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  const area = regionOf(buyer.county) === "alamo" ? "Bexar / Comal / Guadalupe" : "Cape Fear";
  return `Bark had zero jobs in a 30-mile radius. They don't make demand here. Angi still sells your name to 4 trucks.

Freedom Project Leads is your dedicated ${niche.name.toLowerCase()} lead gen for ${county}. We answer, we screen, we send the job to your truck — not four others.

First 2 free. Then $500 a week. Pause anytime.

One company in ${county}. ${area} only.

Reply YES if you want ${county} dedicated.`;
}

export function seatEmail(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  const area = regionOf(buyer.county) === "alamo" ? "Bexar, Comal, and Guadalupe" : "Cape Fear";
  const extra = regionOf(buyer.county) === "alamo" ? " Atascosa and Wilson wait." : "";
  return `Subject: Freedom Project Leads — your dedicated ${county} ${niche.name.toLowerCase()} line · 2 free then $500/week

${buyer.name} —

Bark and TaskRabbit don't create ${area} demand. Angi and Thumbtack buy Google, then sell the same name to 3–8 trucks.

We're your dedicated lead gen. Desk screens every conversation. The job goes to your truck — not a credit pack.

Your line: ${county} ${niche.name}
First 2 screened jobs: free
Then: $500 a week dedicated. Extra jobs ${money(buyer.pplRate)} if you want them.

One company per county.${extra} Reply YES.`;
}

export function turnkeySms(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  const first = buyer.name.split(" ")[0] ?? "Hey";
  return `${first} — you're busy. Angi still sells your name to 4 trucks.

Freedom Project Leads is your dedicated ${niche.name.toLowerCase()} lead gen for ${county}. Turnkey: we run the ads, we answer, we screen, we send the job to your truck. You roll. That's it.

Stand-up ${money(TURNKEY_SETUP)}. Then ${money(TURNKEY_WEEKLY)} a week. First 2 jobs free so you see the desk.

Reply TURNKEY.`;
}

export function turnkeyEmail(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  return `Subject: Turnkey ${county} ${niche.name.toLowerCase()} lead gen — you just roll

${buyer.name} —

You're booked. You don't have time to babysit Angi, ads, or a receptionist.

We're your dedicated lead gen. Turnkey:
- We run the ${county} ${niche.name.toLowerCase()} demand
- Our desk answers and screens every call
- You get a packet: name, address, job, urgency, tape
- You roll. We don't share you with 4 other companies

Stand-up: ${money(TURNKEY_SETUP)} (line, ads, desk)
Then: ${money(TURNKEY_WEEKLY)} a week
First 2 screened jobs: free

Dedicated ${money(WEEKLY_SEAT)}/wk is the line if you still want to be in the mix. Turnkey is for owners who won't lift a finger.

Reply TURNKEY and we start this week.`;
}

export function nextHunt(current: HuntStatus): HuntStatus | null {
  if (current === "open") return "pitched";
  if (current === "pitched") return "trial";
  if (current === "trial") return "paying";
  return null;
}
