import { COUNTIES, regionOf, type Buyer, type County, type HuntStatus, type Region } from "./types";
import { nicheById } from "./niches";
import { MONTHLY_SEAT, TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "./pricing";
import { money } from "./utils";

/** 10 truck niches. RSVP lane is extra Alamo inventory. */
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

export const RSVP_NICHES = ["quince", "bounce", "dj", "catering", "rental"] as const;

/** RSVP Home Improvement / Home Services / Automotive advertisers. Alamo only. */
export const HOME_NICHES = ["fence", "gc", "foundation", "windows", "gutter", "wash", "detail", "landscape"] as const;

export type SeatNicheId =
  | (typeof SEAT_NICHES)[number]
  | (typeof RSVP_NICHES)[number]
  | (typeof HOME_NICHES)[number];

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

  { id: "tx-nb-quince", nicheId: "quince", county: "comal", name: "Lupita Reyes", company: "Gruene Quince Co", phone: "(830) 555-2101", email: "lupita@gruenequince.example", hunt: "open", notes: "Comal quince. The Knot dumps 6 planners. Exclusive county." },
  { id: "tx-sa-quince", nicheId: "quince", county: "bexar", name: "Marisol Vega", company: "Westside Quince", phone: "(210) 555-2108", email: "marisol@westsidequince.example", hunt: "open", notes: "Bexar quince. Don't fight downtown ballrooms. Own the party lead." },
  { id: "tx-seguin-quince", nicheId: "quince", county: "guadalupe", name: "Elena Cruz", company: "Seguin Celebrations", phone: "(830) 555-2114", email: "elena@seguincelebrations.example", hunt: "open", notes: "Seguin / Cibolo quince + baptism." },

  { id: "tx-nb-bounce", nicheId: "bounce", county: "comal", name: "Ty Maddox", company: "Comal Jump", phone: "(830) 555-3101", email: "ty@comaljump.example", hunt: "open", notes: "Weekend inflatables. Thumbtack leftover." },
  { id: "tx-sa-bounce", nicheId: "bounce", county: "bexar", name: "Rico Jump", company: "Alamo Inflate", phone: "(210) 555-3108", email: "rico@alamoinflate.example", hunt: "open", notes: "North Bexar weekend. Volume seat." },
  { id: "tx-schertz-bounce", nicheId: "bounce", county: "guadalupe", name: "Kendra Bounce", company: "Schertz Jump Co", phone: "(210) 555-3114", email: "kendra@schertzjump.example", hunt: "open", notes: "Schertz / Cibolo church + birthday." },

  { id: "tx-nb-dj", nicheId: "dj", county: "comal", name: "DJ Canyon", company: "Canyon Sound", phone: "(830) 555-4101", email: "canyon@canyonsound.example", hunt: "open", notes: "Comal wedding + quince DJ. The Knot shared." },
  { id: "tx-sa-dj", nicheId: "dj", county: "bexar", name: "DJ Rio", company: "Rio Lights", phone: "(210) 555-4108", email: "rio@riolights.example", hunt: "open", notes: "Bexar quince DJ. Don't fight club DJs." },
  { id: "tx-seguin-dj", nicheId: "dj", county: "guadalupe", name: "DJ Cibolo", company: "Cibolo Mix", phone: "(210) 555-4114", email: "mix@cibolomix.example", hunt: "open", notes: "Guadalupe school + quince." },

  { id: "tx-nb-cater", nicheId: "catering", county: "comal", name: "Rosa Molina", company: "Braunfels Mesa", phone: "(830) 555-5101", email: "rosa@braunfelsmesa.example", hunt: "open", notes: "Comal taco bar + quince food. High ticket." },
  { id: "tx-sa-cater", nicheId: "catering", county: "bexar", name: "Chef Paco", company: "Westside Mesa", phone: "(210) 555-5108", email: "paco@westsidemesa.example", hunt: "open", notes: "Bexar event catering. Steal WeddingWire overflow." },
  { id: "tx-seguin-cater", nicheId: "catering", county: "guadalupe", name: "Ana Sosa", company: "Seguin Mesa", phone: "(830) 555-5114", email: "ana@seguinmesa.example", hunt: "open", notes: "Guadalupe catering. Recurring church." },

  { id: "tx-nb-rent", nicheId: "rental", county: "comal", name: "Brett Tents", company: "Comal Party Rent", phone: "(830) 555-6101", email: "brett@comalpartyrent.example", hunt: "open", notes: "Tents + chairs. Weekend only. Exclusive county." },
  { id: "tx-sa-rent", nicheId: "rental", county: "bexar", name: "Paola Linens", company: "Alamo Event Rent", phone: "(210) 555-6108", email: "paola@alamoeventrent.example", hunt: "open", notes: "Bexar tents. Don't fight Aztec." },
  { id: "tx-schertz-rent", nicheId: "rental", county: "guadalupe", name: "Hank Chairs", company: "Cibolo Tent Co", phone: "(210) 555-6114", email: "hank@cibolotent.example", hunt: "open", notes: "Schertz / Cibolo backyard + quince." },

  { id: "tx-nb-fence", nicheId: "fence", county: "comal", name: "Dale Fences", company: "Comal Cedar", phone: "(830) 555-7101", email: "dale@comalcedar.example", hunt: "open", notes: "Comal privacy fence. Angi shares 5 crews." },
  { id: "tx-sa-fence", nicheId: "fence", county: "bexar", name: "Ray Posts", company: "Northside Fence", phone: "(210) 555-7108", email: "ray@northsidefence.example", hunt: "open", notes: "North Bexar. Don't fight the big iron shops downtown." },
  { id: "tx-seguin-fence", nicheId: "fence", county: "guadalupe", name: "Milo Gates", company: "Seguin Fence Co", phone: "(830) 555-7114", email: "milo@seguinfence.example", hunt: "open", notes: "Seguin / Cibolo wood + gate." },

  { id: "tx-nb-gc", nicheId: "gc", county: "comal", name: "Todd Remodel", company: "Braunfels Build", phone: "(830) 555-7201", email: "todd@braunfelsbuild.example", hunt: "open", notes: "Comal kitchen/bath. Not new-home GCs." },
  { id: "tx-sa-gc", nicheId: "gc", county: "bexar", name: "Marco Additions", company: "Helotes GC", phone: "(210) 555-7208", email: "marco@helotesgc.example", hunt: "open", notes: "Unincorporated Bexar remodel. Skip downtown high-rise." },
  { id: "tx-cibolo-gc", nicheId: "gc", county: "guadalupe", name: "Pete Crew", company: "Cibolo Remodel", phone: "(210) 555-7214", email: "pete@ciboloremodel.example", hunt: "open", notes: "Schertz / Cibolo one-crew remodel." },

  { id: "tx-nb-found", nicheId: "foundation", county: "comal", name: "Clay Piers", company: "Hill Country Level", phone: "(830) 555-7301", email: "clay@hclevel.example", hunt: "open", notes: "Comal clay. Angi mill is fat. Exclusive county." },
  { id: "tx-sa-found", nicheId: "foundation", county: "bexar", name: "Hank Slab", company: "Alamo Piers", phone: "(210) 555-7308", email: "hank@alamopiers.example", hunt: "open", notes: "North Bexar slab. Don't fight Olshan on brand." },
  { id: "tx-seguin-found", nicheId: "foundation", county: "guadalupe", name: "Wes Crack", company: "Seguin Foundation", phone: "(830) 555-7314", email: "wes@seguinfoundation.example", hunt: "open", notes: "Guadalupe level + inspect." },

  { id: "tx-nb-win", nicheId: "windows", county: "comal", name: "Iris Glass", company: "Gruene Windows", phone: "(830) 555-7401", email: "iris@gruenewindows.example", hunt: "open", notes: "Comal replace. Hail leftover." },
  { id: "tx-sa-win", nicheId: "windows", county: "bexar", name: "Paul Panes", company: "Stone Oak Windows", phone: "(210) 555-7408", email: "paul@stoneoakwindows.example", hunt: "open", notes: "North Bexar energy replace. Not Renewal by Andersen." },
  { id: "tx-schertz-win", nicheId: "windows", county: "guadalupe", name: "Nina Sash", company: "Schertz Glass Co", phone: "(210) 555-7414", email: "nina@schertzglass.example", hunt: "open", notes: "Schertz / Cibolo one-day swap." },

  { id: "tx-nb-gutter", nicheId: "gutter", county: "comal", name: "Gus Downs", company: "Comal Gutters", phone: "(830) 555-7501", email: "gus@comalgutters.example", hunt: "open", notes: "Storm dump + replace. Thin mill." },
  { id: "tx-sa-gutter", nicheId: "gutter", county: "bexar", name: "Lane Fascia", company: "Northside Gutters", phone: "(210) 555-7508", email: "lane@northsidegutters.example", hunt: "open", notes: "North Bexar clean + guard." },
  { id: "tx-seguin-gutter", nicheId: "gutter", county: "guadalupe", name: "Bo Spout", company: "Seguin Gutter Co", phone: "(830) 555-7514", email: "bo@seguingutter.example", hunt: "open", notes: "Guadalupe storm follow-up." },

  { id: "tx-nb-wash", nicheId: "wash", county: "comal", name: "Jet Wash", company: "Braunfels Pressure", phone: "(830) 555-7601", email: "jet@braunfelspressure.example", hunt: "open", notes: "House + driveway. Thumbtack leftover." },
  { id: "tx-sa-wash", nicheId: "wash", county: "bexar", name: "Soft Roof", company: "Alamo Soft Wash", phone: "(210) 555-7608", email: "soft@alamosoftwash.example", hunt: "open", notes: "North Bexar house wash. Volume." },
  { id: "tx-cibolo-wash", nicheId: "wash", county: "guadalupe", name: "Pam Drive", company: "Cibolo Wash Co", phone: "(210) 555-7614", email: "pam@cibolowash.example", hunt: "open", notes: "Schertz / Cibolo HOA + driveway." },

  { id: "tx-nb-detail", nicheId: "detail", county: "comal", name: "Mobile Shine", company: "Comal Mobile Detail", phone: "(830) 555-7701", email: "shine@comaldetail.example", hunt: "open", notes: "We come to you. RSVP auto bucket." },
  { id: "tx-sa-detail", nicheId: "detail", county: "bexar", name: "Fleet Buff", company: "Stone Oak Detail", phone: "(210) 555-7708", email: "fleet@stoneoakdetail.example", hunt: "open", notes: "North Bexar mobile + fleet." },
  { id: "tx-schertz-detail", nicheId: "detail", county: "guadalupe", name: "Wax Van", company: "Schertz Mobile Wash", phone: "(210) 555-7714", email: "wax@schertzmobile.example", hunt: "open", notes: "Schertz / Cibolo HOA driveways." },

  { id: "tx-nb-land", nicheId: "landscape", county: "comal", name: "Yard Crew", company: "Gruene Lawn", phone: "(830) 555-7801", email: "yard@gruenelawn.example", hunt: "open", notes: "Comal mow + clean-up. Recurring." },
  { id: "tx-sa-land", nicheId: "landscape", county: "bexar", name: "Mulch Route", company: "Helotes Landscape", phone: "(210) 555-7808", email: "mulch@heloteslandscape.example", hunt: "open", notes: "North Bexar weekly. Don't fight the big mow franchises on price." },
  { id: "tx-cibolo-land", nicheId: "landscape", county: "guadalupe", name: "Sprinkler Joe", company: "Cibolo Green", phone: "(210) 555-7814", email: "joe@cibologreen.example", hunt: "open", notes: "Schertz / Cibolo mow + irrigation." },
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
  return `Angi still sells your name to 4 trucks.

Dedicated ${niche.name.toLowerCase()} lead gen for ${county}. We screen. You roll. First 2 free, then $500/wk.

Need jobs this week? $300 EDDM · 5,000 homes.

Reply YES or MAIL.`;
}

export function seatEmail(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  const area = regionOf(buyer.county) === "alamo" ? "Bexar, Comal, and Guadalupe" : "Cape Fear";
  const extra = regionOf(buyer.county) === "alamo" ? " Atascosa and Wilson wait." : "";
  return `Subject: ${county} ${niche.name.toLowerCase()} — 2 free jobs then $500 a week

${buyer.name} —

Bark and TaskRabbit don't make phones ring in ${area}. Angi and Thumbtack buy Google, then sell the same name to 3–8 trucks.

We get the jobs for one company. A robot asks the questions. The job goes to your truck — not a card pack.

${county} ${niche.name}
First 2 jobs: free
Then: $500 a week. Extra jobs ${money(buyer.pplRate)} if you want them.

One company per county.${extra} Reply YES.`;
}

export function turnkeySms(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  const first = buyer.name.split(" ")[0] ?? "Hey";
  return `${first} — you're busy. Angi still sells your name to 4 trucks.

We get ${niche.name.toLowerCase()} jobs in ${county}. We run the ads, we answer, we ask, we send the job to your truck. You go. That's it.

${money(TURNKEY_SETUP)} to start. Then ${money(TURNKEY_WEEKLY)} a week. First 2 jobs free so you see it.

Reply RUN IT.`;
}

export function turnkeyEmail(buyer: Buyer) {
  const niche = nicheById(buyer.nicheId);
  const county = countyLabel(buyer.county);
  return `Subject: We run ${county} ${niche.name.toLowerCase()} — you just go

${buyer.name} —

You're booked. You don't have time to babysit Angi, ads, or a fake receptionist.

We get the jobs:
- We make the phone ring for ${county} ${niche.name.toLowerCase()}
- We answer and ask every caller
- You get a text: name, street, job, when, recording
- You go. We don't share you with 4 other companies

To start: ${money(TURNKEY_SETUP)}
Then: ${money(TURNKEY_WEEKLY)} a week
First 2 jobs: free

$500 a week if you still want to be in the mix. We run it is for owners who won't lift a finger.

Reply RUN IT and we start this week.`;
}

export function nextHunt(current: HuntStatus): HuntStatus | null {
  if (current === "open") return "pitched";
  if (current === "pitched") return "trial";
  if (current === "trial") return "paying";
  return null;
}
