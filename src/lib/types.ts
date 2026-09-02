export type Decision = "go" | "maybe" | "skip" | "unscored";
export type Stage = "score" | "build" | "ranking" | "live";
export type LeadStatus = "new" | "sold" | "dead" | "duplicate";
export type LeadSource = "call" | "form";
export type HuntStatus = "open" | "pitched" | "trial" | "paying";
export type BuyerStatus = "active" | "paused" | "prospect";
export type Region = "capefear" | "alamo";
export type County =
  | "new-hanover"
  | "pender"
  | "brunswick"
  | "bexar"
  | "comal"
  | "guadalupe";
export type ScreenGrade = "unscreened" | "screening" | "hot" | "warm" | "dead";
export type Urgency = "now" | "today" | "week" | "quote";

export const FREE_TRIAL = 2;

export const COUNTIES: { id: County; label: string; seat: string; region: Region }[] = [
  { id: "new-hanover", label: "New Hanover", seat: "Wilmington", region: "capefear" },
  { id: "pender", label: "Pender", seat: "Hampstead", region: "capefear" },
  { id: "brunswick", label: "Brunswick", seat: "Leland", region: "capefear" },
  { id: "bexar", label: "Bexar", seat: "San Antonio", region: "alamo" },
  { id: "comal", label: "Comal", seat: "New Braunfels", region: "alamo" },
  { id: "guadalupe", label: "Guadalupe", seat: "Schertz", region: "alamo" },
];

export const REGIONS: { id: Region; label: string; line: string; maybe: string }[] = [
  { id: "capefear", label: "Cape Fear", line: "New Hanover · Pender · Brunswick", maybe: "Hold. 15 paying first." },
  { id: "alamo", label: "Alamo", line: "Bexar · Comal · Guadalupe", maybe: "Atascosa + Wilson after 15 paying." },
];

export function regionOf(county: County): Region {
  return COUNTIES.find((c) => c.id === county)?.region ?? "capefear";
}

export function countiesIn(region: Region) {
  return COUNTIES.filter((c) => c.region === region);
}

export type Scorecard = {
  demand: number;
  jobValue: number;
  weakCompetitors: number;
  willingness: number;
  ease: number;
  notes: string;
};

export type Niche = {
  id: string;
  name: string;
  slug: string;
  jobValue: number;
  jobRange: string;
  closeRate: number;
  typicalMonthlyLeads: number;
  urgency: "emergency" | "scheduled" | "mixed";
  gbpPrimary: string;
  gbpSecondary: string[];
  services: string[];
  hours: string;
};

export type Market = {
  id: string;
  city: string;
  state: string;
  nicheId: string;
  counties: County[];
  neighborhoods: string[];
  population: number;
  domain: string;
  trackingNumber: string;
  score?: Scorecard;
  stage: Stage;
  pplPrice: number;
  leadsThisMonth: number;
  callsThisMonth: number;
  soldThisMonth: number;
  revenueThisMonth: number;
  jobsEstimated: number;
  rankMaps: number | null;
  rankOrganic: number | null;
  aiCitations: number | null;
  topQueries: string[];
  createdAt: string;
  siteLiveAt?: string;
};

export type Buyer = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  marketIds: string[];
  nicheId: string;
  pplRate: number;
  monthlySeat: number;
  monthlyCap: number;
  status: BuyerStatus;
  hunt: HuntStatus;
  county: County;
  soldThisMonth: number;
  spendThisMonth: number;
  freeRemaining: number;
  freeUsed: number;
  notes: string;
};

export type CallTurn = {
  at: string;
  speaker: "caller" | "agent";
  text: string;
};

export type Lead = {
  id: string;
  marketId: string;
  at: string;
  name: string;
  phone: string;
  neighborhood: string;
  zip: string;
  county?: County;
  address: string;
  source: LeadSource;
  service: string;
  notes: string;
  status: LeadStatus;
  screen: ScreenGrade;
  urgency?: Urgency;
  conversation: CallTurn[];
  screenNotes: string;
  soldToBuyerId?: string;
  soldPrice?: number;
  soldAt?: string;
  free?: boolean;
  deadReason?: string;
};

export type NextAction = {
  id: string;
  title: string;
  why: string;
  to: "/leads" | "/buyers" | "/markets/$marketId" | "/queue" | "/queue/$leadId";
  marketId?: string;
  leadId?: string;
  tone: "urgent" | "money" | "work";
};
