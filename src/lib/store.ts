import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nicheById } from "./niches";
import { decide } from "./scoring";
import { pplPrice } from "./pricing";
import { scriptCall } from "./conversation";
import { cityForCounties, defaultHoods } from "./territory";
import { domainFor, trackingFor, uid } from "./utils";
import { INITIAL_BUYERS, INITIAL_LEADS, INITIAL_MARKETS, inferCounty, withRolledUpCounts } from "./seed";
import { FREE_TRIAL } from "./types";
import type {
  Buyer,
  BuyerStatus,
  CallTurn,
  County,
  Lead,
  LeadStatus,
  Market,
  Scorecard,
  ScreenGrade,
  Stage,
  Urgency,
} from "./types";

type NewMarketInput = {
  nicheId: string;
  counties: County[];
  neighborhoods: string;
};

type NewBuyerInput = {
  name: string;
  company: string;
  phone: string;
  email: string;
  marketId: string;
  pplRate: number;
  monthlyCap: number;
};

type NewLeadInput = {
  marketId: string;
  name: string;
  phone: string;
  neighborhood: string;
  zip: string;
  source: Lead["source"];
  service: string;
  notes: string;
};

type ScreenPatch = {
  screen: ScreenGrade;
  urgency?: Urgency;
  county?: County;
  address?: string;
  screenNotes?: string;
};

type AgencyState = {
  markets: Market[];
  buyers: Buyer[];
  leads: Lead[];
  hydrated: boolean;
  markHydrated: () => void;
  addMarket: (input: NewMarketInput) => string;
  updateMarket: (id: string, patch: Partial<Market>) => void;
  setScore: (id: string, score: Scorecard) => void;
  setStage: (id: string, stage: Stage) => void;
  addBuyer: (input: NewBuyerInput) => string;
  updateBuyer: (id: string, patch: Partial<Buyer>) => void;
  setBuyerStatus: (id: string, status: BuyerStatus) => void;
  captureLead: (input: NewLeadInput) => string;
  screenLead: (leadId: string, patch: ScreenPatch) => void;
  addTapeTurn: (leadId: string, speaker: CallTurn["speaker"], text: string) => void;
  handoffLead: (leadId: string, buyerId: string) => string;
  sellLead: (leadId: string, buyerId: string) => string;
  markLead: (leadId: string, status: Exclude<LeadStatus, "sold" | "new">, reason?: string) => void;
  simulateInbound: (marketId?: string) => string | null;
  resetDesk: () => void;
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function rollup(markets: Market[], buyers: Buyer[], leads: Lead[]) {
  return withRolledUpCounts(markets, buyers, leads);
}

function nextStamp(turns: CallTurn[]) {
  const sec = turns.length * 8;
  const m = Math.floor(sec / 60);
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

const INBOUND_POOL = [
  { name: "Jordan Hale", neighborhood: "Leland", zip: "28451" },
  { name: "Kim Alvarez", neighborhood: "Hampstead", zip: "28443" },
  { name: "Drew Patel", neighborhood: "Porters Neck", zip: "28411" },
  { name: "Sam Rivera", neighborhood: "Southport", zip: "28461" },
  { name: "Casey Nguyen", neighborhood: "Myrtle Grove", zip: "28409" },
];

export const useAgency = create<AgencyState>()(
  persist(
    (set, get) => ({
      markets: INITIAL_MARKETS,
      buyers: INITIAL_BUYERS,
      leads: INITIAL_LEADS,
      hydrated: false,
      markHydrated: () => set({ hydrated: true }),
      addMarket: (input) => {
        const niche = nicheById(input.nicheId);
        const counties =
          input.counties.length > 0 ? input.counties : (["new-hanover", "pender", "brunswick"] as County[]);
        const city = cityForCounties(counties);
        const hoods = input.neighborhoods
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean);
        const id = uid(city.toLowerCase().replace(/\s+/g, ""));
        const market: Market = {
          id,
          city,
          state: "NC",
          nicheId: input.nicheId,
          counties,
          neighborhoods: hoods.length ? hoods : defaultHoods(counties).slice(0, 5),
          population: 493000,
          domain: domainFor(city, niche.slug),
          trackingNumber: trackingFor("NC"),
          stage: "score",
          pplPrice: pplPrice(niche),
          leadsThisMonth: 0,
          callsThisMonth: 0,
          soldThisMonth: 0,
          revenueThisMonth: 0,
          jobsEstimated: 0,
          rankMaps: null,
          rankOrganic: null,
          aiCitations: null,
          topQueries: [],
          createdAt: new Date().toISOString().slice(0, 10),
        };
        set({ markets: [market, ...get().markets] });
        return id;
      },
      updateMarket: (id, patch) =>
        set({
          markets: get().markets.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        }),
      setScore: (id, score) => {
        const decision = decide(score);
        set({
          markets: get().markets.map((m) => {
            if (m.id !== id) return m;
            const nextStage =
              m.stage === "live" || m.stage === "ranking"
                ? m.stage
                : decision === "go" || decision === "maybe"
                  ? m.stage === "score"
                    ? "build"
                    : m.stage
                  : "score";
            return { ...m, score, stage: nextStage };
          }),
        });
      },
      setStage: (id, stage) =>
        set({
          markets: get().markets.map((m) =>
            m.id === id
              ? {
                  ...m,
                  stage,
                  siteLiveAt:
                    stage === "ranking" || stage === "live"
                      ? (m.siteLiveAt ?? new Date().toISOString().slice(0, 10))
                      : m.siteLiveAt,
                }
              : m,
          ),
        }),
      addBuyer: (input) => {
        const market = get().markets.find((m) => m.id === input.marketId);
        if (!market) return "";
        const id = uid("by");
        const buyer: Buyer = {
          id,
          name: input.name.trim(),
          company: input.company.trim(),
          phone: input.phone.trim(),
          email: input.email.trim(),
          marketIds: [input.marketId],
          nicheId: market.nicheId,
          pplRate: input.pplRate || market.pplPrice,
          monthlyCap: input.monthlyCap || 12,
          status: "active",
          soldThisMonth: 0,
          spendThisMonth: 0,
          freeRemaining: FREE_TRIAL,
          freeUsed: 0,
          notes: "2 free screened handoffs, then PPL.",
        };
        set({ buyers: [buyer, ...get().buyers] });
        return id;
      },
      updateBuyer: (id, patch) =>
        set({
          buyers: get().buyers.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        }),
      setBuyerStatus: (id, status) =>
        set({
          buyers: get().buyers.map((b) => (b.id === id ? { ...b, status } : b)),
        }),
      captureLead: (input) => {
        const market = get().markets.find((m) => m.id === input.marketId);
        const id = uid("ld");
        const hood = input.neighborhood.trim();
        const niche = market ? nicheById(market.nicheId) : null;
        const lead: Lead = {
          id,
          marketId: input.marketId,
          at: new Date().toISOString(),
          name: input.name.trim(),
          phone: input.phone.trim(),
          neighborhood: hood,
          zip: input.zip.trim(),
          county: market ? inferCounty(hood, market) : "new-hanover",
          address: "",
          source: input.source,
          service: input.service.trim(),
          notes: input.notes.trim(),
          status: "new",
          screen: "unscreened",
          conversation:
            market && niche
              ? scriptCall({
                  niche,
                  name: input.name.trim(),
                  hood,
                  service: input.service.trim() || niche.services[0] || niche.name,
                  tracking: market.trackingNumber,
                })
              : [],
          screenNotes: "",
        };
        const leads = [lead, ...get().leads];
        set(rollup(get().markets, get().buyers, leads));
        return id;
      },
      screenLead: (leadId, patch) => {
        const leads = get().leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                screen: patch.screen,
                urgency: patch.urgency ?? l.urgency,
                county: patch.county ?? l.county,
                address: patch.address ?? l.address,
                screenNotes: patch.screenNotes ?? l.screenNotes,
                status: patch.screen === "dead" ? ("dead" as const) : l.status,
                deadReason: patch.screen === "dead" ? patch.screenNotes || l.deadReason : l.deadReason,
              }
            : l,
        );
        set(rollup(get().markets, get().buyers, leads));
      },
      addTapeTurn: (leadId, speaker, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const leads = get().leads.map((l) => {
          if (l.id !== leadId) return l;
          const conversation = [...l.conversation, { at: nextStamp(l.conversation), speaker, text: trimmed }];
          return {
            ...l,
            conversation,
            screen: l.screen === "unscreened" ? ("screening" as const) : l.screen,
          };
        });
        set(rollup(get().markets, get().buyers, leads));
      },
      handoffLead: (leadId, buyerId) => {
        const lead = get().leads.find((l) => l.id === leadId);
        const buyer = get().buyers.find((b) => b.id === buyerId);
        if (!lead) return "Lead missing.";
        if (lead.status === "sold") return "Already handed off.";
        if (lead.screen !== "hot" && lead.screen !== "warm") return "Screen it hot or warm before handoff.";
        if (!buyer) return "Owner missing.";
        if (buyer.status !== "active") return `${buyer.company} is ${buyer.status}.`;
        if (buyer.soldThisMonth >= buyer.monthlyCap) return `${buyer.company} is at cap (${buyer.monthlyCap}).`;
        if (!buyer.marketIds.includes(lead.marketId)) return `${buyer.company} is not on this market.`;
        const isFree = buyer.freeRemaining > 0;
        const price = isFree ? 0 : buyer.pplRate;
        const leads = get().leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                status: "sold" as const,
                soldToBuyerId: buyer.id,
                soldPrice: price,
                soldAt: new Date().toISOString(),
                free: isFree,
              }
            : l,
        );
        set(rollup(get().markets, get().buyers, leads));
        return "";
      },
      sellLead: (leadId, buyerId) => get().handoffLead(leadId, buyerId),
      markLead: (leadId, status, reason) => {
        const leads = get().leads.map((l) =>
          l.id === leadId
            ? {
                ...l,
                status,
                screen: status === "dead" || status === "duplicate" ? ("dead" as const) : l.screen,
                deadReason: status === "dead" ? reason : l.deadReason,
                soldToBuyerId: undefined,
                soldPrice: undefined,
                soldAt: undefined,
                free: undefined,
              }
            : l,
        );
        set(rollup(get().markets, get().buyers, leads));
      },
      simulateInbound: (marketId) => {
        const live = get().markets.filter((m) => m.stage === "live" || m.stage === "ranking");
        const market = marketId
          ? get().markets.find((m) => m.id === marketId)
          : live[Math.floor(Math.random() * live.length)];
        if (!market) return null;
        const niche = nicheById(market.nicheId);
        const person = INBOUND_POOL[Math.floor(Math.random() * INBOUND_POOL.length)];
        const hood =
          market.neighborhoods[Math.floor(Math.random() * Math.max(market.neighborhoods.length, 1))] ||
          person.neighborhood;
        const service = niche.services[Math.floor(Math.random() * niche.services.length)];
        const source = Math.random() > 0.35 ? "call" : "form";
        const n = Math.floor(1000 + Math.random() * 8999);
        const id = uid("ld");
        const lead: Lead = {
          id,
          marketId: market.id,
          at: new Date().toISOString(),
          name: person.name,
          phone: `${market.trackingNumber.slice(0, 5)} 555-${n}`,
          neighborhood: hood,
          zip: person.zip,
          county: inferCounty(hood, market),
          address: "",
          source,
          service,
          notes: source === "call" ? "Inbound on tracking line." : "Form on the ranking site. We called back.",
          status: "new",
          screen: "unscreened",
          urgency: niche.urgency === "emergency" ? "now" : "today",
          conversation: scriptCall({
            niche,
            name: person.name,
            hood,
            service,
            tracking: market.trackingNumber,
          }),
          screenNotes: "",
        };
        set(rollup(get().markets, get().buyers, [lead, ...get().leads]));
        return id;
      },
      resetDesk: () =>
        set({
          markets: INITIAL_MARKETS,
          buyers: INITIAL_BUYERS,
          leads: INITIAL_LEADS,
        }),
    }),
    {
      name: "grokbot-capefear-v2",
      storage: createJSONStorage(() => (typeof window === "undefined" ? noopStorage : localStorage)),
      skipHydration: true,
      partialize: (s) => ({ markets: s.markets, buyers: s.buyers, leads: s.leads }),
    },
  ),
);
