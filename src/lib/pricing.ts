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

/** One price. Exclusive county seat. 4-week month. */
export const WEEKLY_SEAT = 500;
export const MONTHLY_SEAT = WEEKLY_SEAT * 4;

export function weeklySeat(_niche?: Niche) {
  return WEEKLY_SEAT;
}

export function monthlySeat(_niche?: Niche) {
  return MONTHLY_SEAT;
}

export type ConservativeValue = {
  jobValue: number;
  jobRange: string;
  closeRate: number;
  ev: number;
  weeklySeat: number;
  screenedPerWeek: number;
  expectedClosed: number;
  expectedRev: number;
  leftover: number;
  closedToCover: number;
  screenedToCover: number;
  weeksOneJobCovers: number;
  angiLead: number;
  angiClose: number;
  angiCostPerJob: number;
  ourCostPerClosed: number;
  coversOnOneJob: boolean;
};

/** Slow week. 40% of modeled monthly volume. Close rates already underwritten. */
export function conservativeValue(niche: Niche): ConservativeValue {
  const ev = expectedValue(niche);
  const screenedPerWeek = Math.max(1, Math.round((niche.typicalMonthlyLeads * 0.4) / 4.3));
  const expectedClosed = +(screenedPerWeek * niche.closeRate).toFixed(1);
  const expectedRev = Math.round(expectedClosed * niche.jobValue);
  const leftover = expectedRev - WEEKLY_SEAT;
  const closedToCover = Math.max(1, Math.ceil(WEEKLY_SEAT / niche.jobValue));
  const screenedToCover = Math.max(1, Math.ceil(WEEKLY_SEAT / Math.max(ev, 1)));
  const weeksOneJobCovers = +(niche.jobValue / WEEKLY_SEAT).toFixed(1);
  const angiLead = 70;
  const angiClose = 0.12;
  const angiCostPerJob = Math.round(angiLead / angiClose);
  const ourCostPerClosed = expectedClosed > 0 ? Math.round(WEEKLY_SEAT / expectedClosed) : WEEKLY_SEAT;
  return {
    jobValue: niche.jobValue,
    jobRange: niche.jobRange,
    closeRate: niche.closeRate,
    ev: Math.round(ev),
    weeklySeat: WEEKLY_SEAT,
    screenedPerWeek,
    expectedClosed,
    expectedRev,
    leftover,
    closedToCover,
    screenedToCover,
    weeksOneJobCovers,
    angiLead,
    angiClose,
    angiCostPerJob,
    ourCostPerClosed,
    coversOnOneJob: niche.jobValue >= WEEKLY_SEAT,
  };
}

export function handoffPrice(buyer: Buyer) {
  if (buyer.freeRemaining > 0) return 0;
  return buyer.pplRate;
}

export function freeLabel(buyer: Buyer) {
  if (buyer.freeRemaining <= 0) return "paid";
  return `free ${buyer.freeUsed + 1} of ${FREE_TRIAL}`;
}
