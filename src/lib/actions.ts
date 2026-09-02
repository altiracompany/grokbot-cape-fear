import { decide } from "./scoring";
import { nicheById } from "./niches";
import { minutesAgo, money } from "./utils";
import { countyLabel } from "./conversation";
import { COUNTIES } from "./types";
import type { Buyer, County, Lead, Market, NextAction } from "./types";

export function nextActions(markets: Market[], buyers: Buyer[], leads: Lead[]): NextAction[] {
  const out: NextAction[] = [];

  const open = leads
    .filter((l) => l.status === "new")
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  for (const lead of open) {
    const age = minutesAgo(lead.at);
    const market = markets.find((m) => m.id === lead.marketId);
    if (!market) continue;
    const niche = nicheById(market.nicheId);
    const eligible = eligibleBuyers(buyers, market.id);

    if (lead.screen === "unscreened" || lead.screen === "screening") {
      out.push({
        id: `screen-${lead.id}`,
        title: `Screen ${lead.name}`,
        why: `${niche.name} · ${countyLabel(lead.county)}. ${age}m on the line. Don't hand a raw caller.`,
        to: "/queue/$leadId",
        leadId: lead.id,
        tone: "urgent",
      });
      continue;
    }

    if (lead.screen === "hot" || lead.screen === "warm") {
      if (eligible.length === 0) {
        out.push({
          id: `nobuyer-${lead.id}`,
          title: `No owner for ${lead.name}`,
          why: `Hot ${niche.name} in ${countyLabel(lead.county)}. Onboard a truck or this dies.`,
          to: "/buyers",
          tone: "urgent",
        });
      } else {
        out.push({
          id: `hand-${lead.id}`,
          title: `Handoff ${lead.name}`,
          why: `Screened ${lead.urgency ?? "today"}. ${eligible[0].freeRemaining > 0 ? "Still on 2 free." : money(eligible[0].pplRate)}.`,
          to: "/queue/$leadId",
          leadId: lead.id,
          tone: "money",
        });
      }
    }
  }

  for (const market of markets) {
    const title = `${nicheById(market.nicheId).name} · ${market.city}`;
    const decision = decide(market.score);
    const marketBuyers = buyers.filter((b) => b.marketIds.includes(market.id) && b.status !== "paused");
    if (decision === "unscored") {
      out.push({
        id: `score-${market.id}`,
        title: `Score ${title}`,
        why: "No numbers on the card. Don't build blind.",
        to: "/markets/$marketId",
        marketId: market.id,
        tone: "work",
      });
    }
    if (
      (market.stage === "live" || market.stage === "ranking") &&
      marketBuyers.filter((b) => b.status === "active").length < 2
    ) {
      out.push({
        id: `buyers-${market.id}`,
        title: `Need a second owner · ${title}`,
        why: "One truck is a bottleneck. Two actives + 2 free each fills the queue.",
        to: "/buyers",
        tone: "work",
      });
    }
    if (decision === "go" && market.stage === "build") {
      out.push({
        id: `build-${market.id}`,
        title: `Ship the site · ${title}`,
        why: "Go market. Desk is ready to answer. Get it ranking.",
        to: "/markets/$marketId",
        marketId: market.id,
        tone: "work",
      });
    }
  }

  const rank = { urgent: 0, money: 1, work: 2 };
  const seen = new Set<string>();
  return out
    .sort((a, b) => rank[a.tone] - rank[b.tone])
    .filter((a) => {
      if (seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    })
    .slice(0, 3);
}

export function revenueMtd(markets: Market[]) {
  return markets.reduce((s, m) => s + m.revenueThisMonth, 0);
}

export function liveSites(markets: Market[]) {
  return markets.filter((m) => m.stage === "live").length;
}

export function soldRate(leads: Lead[]) {
  const countable = leads.filter((l) => l.status === "sold" || l.status === "dead" || l.status === "new");
  if (!countable.length) return 0;
  return countable.filter((l) => l.status === "sold").length / countable.length;
}

export function queueOpen(leads: Lead[]) {
  return leads.filter((l) => l.status === "new");
}

export function unsoldCount(leads: Lead[]) {
  return queueOpen(leads).length;
}

export function hotCount(leads: Lead[]) {
  return leads.filter((l) => l.status === "new" && (l.screen === "hot" || l.screen === "warm")).length;
}

export function ownedHot(leads: Lead[]) {
  return leads
    .filter((l) => l.status === "new" && (l.screen === "hot" || l.screen === "warm"))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function ringing(leads: Lead[]) {
  return leads
    .filter((l) => l.status === "new" && (l.screen === "unscreened" || l.screen === "screening"))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function unscreenedCount(leads: Lead[]) {
  return ringing(leads).length;
}

export function unsoldValue(leads: Lead[], markets: Market[]) {
  return leads
    .filter((l) => l.status === "new" && (l.screen === "hot" || l.screen === "warm"))
    .reduce((s, l) => {
      const m = markets.find((x) => x.id === l.marketId);
      return s + (m?.pplPrice ?? 0);
    }, 0);
}

export function blendedPpl(leads: Lead[]) {
  const sold = leads.filter((l) => l.status === "sold" && !l.free && l.soldPrice);
  if (!sold.length) return null;
  return Math.round(sold.reduce((s, l) => s + (l.soldPrice ?? 0), 0) / sold.length);
}

export function activeBuyers(buyers: Buyer[]) {
  return buyers.filter((b) => b.status === "active").length;
}

export function freeOnBooks(buyers: Buyer[]) {
  return buyers.filter((b) => b.status === "active").reduce((s, b) => s + b.freeRemaining, 0);
}

export function eligibleBuyers(buyers: Buyer[], marketId: string) {
  return buyers.filter(
    (b) => b.status === "active" && b.marketIds.includes(marketId) && b.soldThisMonth < b.monthlyCap,
  );
}

export function buyerName(buyers: Buyer[], id?: string) {
  if (!id) return "—";
  return buyers.find((b) => b.id === id)?.company ?? "—";
}

export function captureRate(leads: Lead[]) {
  const countable = leads.filter((l) => l.status !== "duplicate");
  if (!countable.length) return 1;
  return countable.filter((l) => l.conversation.length > 0).length / countable.length;
}

export type CountyRollup = {
  id: County;
  label: string;
  seat: string;
  inbound: number;
  hot: number;
  ringing: number;
  handed: number;
};

export function countyRollup(leads: Lead[]): CountyRollup[] {
  return COUNTIES.map((c) => {
    const mine = leads.filter((l) => l.county === c.id && l.status !== "duplicate");
    return {
      id: c.id,
      label: c.label,
      seat: c.seat,
      inbound: mine.length,
      hot: mine.filter((l) => l.status === "new" && (l.screen === "hot" || l.screen === "warm")).length,
      ringing: mine.filter((l) => l.status === "new" && (l.screen === "unscreened" || l.screen === "screening")).length,
      handed: mine.filter((l) => l.status === "sold").length,
    };
  });
}

export type DeskLine = {
  marketId: string;
  domain: string;
  niche: string;
  trackingNumber: string;
  inbound: number;
  taped: number;
  lastName?: string;
  lastAt?: string;
};

export function deskLines(markets: Market[], leads: Lead[]): DeskLine[] {
  return markets
    .filter((m) => m.stage === "live" || m.stage === "ranking")
    .map((m) => {
      const mine = leads.filter((l) => l.marketId === m.id && l.status !== "duplicate");
      const last = [...mine].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0];
      return {
        marketId: m.id,
        domain: m.domain,
        niche: nicheById(m.nicheId).name,
        trackingNumber: m.trackingNumber,
        inbound: mine.length,
        taped: mine.filter((l) => l.conversation.length > 0).length,
        lastName: last?.name,
        lastAt: last?.at,
      };
    });
}
