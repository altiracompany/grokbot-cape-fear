import { FREE_TRIAL } from "./types";
import type { Buyer, Niche } from "./types";

export function expectedValue(niche: Niche) {
  return niche.jobValue * niche.closeRate;
}

export function monthlyJobRevenue(niche: Niche, leadOverride?: number) {
  const leads = leadOverride ?? niche.typicalMonthlyLeads;
  return Math.round(expectedValue(niche) * leads);
}

/** Shared / first-claim PPL. High-ticket niches price as a smaller cut of EV, capped. */
export function pplPrice(niche: Niche) {
  const ev = expectedValue(niche);
  const cut = ev > 800 ? 0.08 : 0.22;
  return Math.max(25, Math.min(180, Math.round((ev * cut) / 5) * 5));
}

export function pplMath(niche: Niche, leadOverride?: number) {
  const leads = leadOverride ?? niche.typicalMonthlyLeads;
  const price = pplPrice(niche);
  const ev = expectedValue(niche);
  const soldShare = 0.72;
  const revenue = Math.round(leads * soldShare * price);
  return {
    jobValue: niche.jobValue,
    closeRate: niche.closeRate,
    expectedValue: Math.round(ev),
    ppl: price,
    leads,
    soldShare,
    monthlyRevenue: revenue,
    buyerJobValue: Math.round(ev),
    buyerPaybackJobs: ev > 0 ? +(price / ev).toFixed(2) : 0,
  };
}

export function exclusiveReserve(niche: Niche, leadOverride?: number) {
  const rev = monthlyJobRevenue(niche, leadOverride);
  return Math.round((rev * 0.33) / 10) * 10;
}

export function handoffPrice(buyer: Buyer) {
  if (buyer.freeRemaining > 0) return 0;
  return buyer.pplRate;
}

export function freeLabel(buyer: Buyer) {
  if (buyer.freeRemaining <= 0) return "paid";
  return `free ${buyer.freeUsed + 1} of ${FREE_TRIAL}`;
}
