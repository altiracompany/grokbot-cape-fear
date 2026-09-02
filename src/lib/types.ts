export type Decision = "go" | "maybe" | "skip" | "unscored";
export type Stage = "score" | "build" | "ranking" | "live";
export type LeadStatus = "new" | "sold" | "dead" | "duplicate";
export type LeadSource = "call" | "form";
export type BuyerStatus = "active" | "paused" | "prospect";
export type County = "new-hanover" | "pender" | "brunswick";
export type ScreenGrade = "unscreened" | "screening" | "hot" | "warm" | "dead";
export type Urgency = "now" | "today" | "week" | "quote";

export const FREE_TRIAL = 2;

export const COUNTIES: { id: County; label: string; seat: string }[] = [
  { id: "new-hanover", label: "New Hanover", seat: "Wilmington" },
  { id: "pender", label: "Pender", seat: "Hampstead" },
  { id: "brunswick", label: "Brunswick", seat: "Leland" },
];

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
  monthlyCap: number;
  status: BuyerStatus;
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
