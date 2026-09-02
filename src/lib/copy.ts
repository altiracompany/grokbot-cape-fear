import { money, pct } from "./utils";
import { conservativeValue, pplMath, WEEKLY_SEAT } from "./pricing";
import { decide, decisionCopy, weightedScore } from "./scoring";
import { FREE_TRIAL } from "./types";
import { fieldFor, killShotEmail, killShotSms } from "./field";
import type { Buyer, Market, Niche } from "./types";

export function marketTitle(market: Market, niche: Niche) {
  return `${niche.name} · ${market.city}, ${market.state}`;
}

export function pplPitch(market: Market, niche: Niche) {
  const math = pplMath(niche);
  const field = fieldFor(niche.id);
  return `FREEDOM PROJECT LEADS — ${niche.name.toUpperCase()} / CAPE FEAR

New Hanover · Pender · Brunswick.
We own ${market.domain}. We answer ${market.trackingNumber}. You never talk to a raw caller.

Wedge: ${field.wedge.toUpperCase()}
Angi sells this at ${field.angiPpl}. Shared. Three other trucks on the same ping.
We sell one screened job.

What you get
- A screened handoff: name, phone, address, job, urgency, transcript
- First ${FREE_TRIAL} free. Then $500 a week for the county seat
- Extra jobs ${money(market.pplPrice)}. Pause anytime. We keep the ranker

What you do not get
- The site, the number, or a dump of unscreened form fills
- Shared mill leads five other trucks already called

The math
Typical job: ${niche.jobRange} (we model ${money(niche.jobValue)})
Close we underwrite: ${pct(niche.closeRate)}
Expected value of a screened lead: ${money(math.expectedValue)}
After the 2 free: $500 a week exclusive

Reply YES for the county seat.`;
}

export function conservativePitch(niche: Niche) {
  const v = conservativeValue(niche);
  const leftoverLine =
    v.leftover >= 0
      ? `Left in the truck: ${money(v.leftover)} after the seat. That's a SLOW week.`
      : `Slow week is short ${money(Math.abs(v.leftover))}. ${v.closedToCover} closed job${v.closedToCover === 1 ? "" : "s"} still covers.`;
  const oneJob =
    v.coversOnOneJob
      ? `One ${money(v.jobValue)} job covers ${v.weeksOneJobCovers} week${v.weeksOneJobCovers === 1 ? "" : "s"} of the seat.`
      : `${v.closedToCover} closed jobs at ${money(v.jobValue)} cover the week.`;
  return `CONSERVATIVE VALUE — FREEDOM PROJECT LEADS / ${niche.name.toUpperCase()}

We underwrite ${money(v.jobValue)} a job (range ${v.jobRange}). Not the max.
Close we underwrite: ${pct(v.closeRate)}. Not 70%.
One screened handoff is worth ~${money(v.ev)}.

Seat: ${money(WEEKLY_SEAT)}/week exclusive.
Break-even: ${v.closedToCover} closed job${v.closedToCover === 1 ? "" : "s"} — or ${v.screenedToCover} screened.
${oneJob}

SLOW WEEK we model (not a hero week):
${v.screenedPerWeek} screened handoffs, not ${niche.typicalMonthlyLeads}/mo fantasy.
Expected closed: ${v.expectedClosed}
Expected revenue: ${money(v.expectedRev)}
Seat: ${money(WEEKLY_SEAT)}
${leftoverLine}

Angi: ~${money(v.angiLead)} shared × 4 trucks. ~${pct(v.angiClose)} close. ~${money(v.angiCostPerJob)} per booked job — and you paid when you lost.
Us: exclusive, screened, tape included. ${money(WEEKLY_SEAT)} for the whole week.

First 2 free. Then $500 a week. Freedom Project Leads keeps the page.`;
}

export function outreachSms(market: Market, niche: Niche) {
  return killShotSms(market, niche);
}

export function outreachEmail(market: Market, niche: Niche) {
  return killShotEmail(market, niche);
}

export function scorecardWhy(market: Market, niche: Niche) {
  const d = decide(market.score);
  const field = fieldFor(niche.id);
  if (!market.score) {
    return `Unscored. Field says ${field.wedge.toUpperCase()}: ${field.why}`;
  }
  const w = weightedScore(market.score).toFixed(1);
  return `Decision: ${d.toUpperCase()} (${w}/10). Field: ${field.wedge.toUpperCase()}. ${decisionCopy(d)} ${market.score.notes || ""}`.trim();
}

export function reportCopy(market: Market, niche: Niche) {
  const cpl = market.soldThisMonth > 0 ? Math.round(market.revenueThisMonth / market.soldThisMonth) : null;
  const sellPct = market.leadsThisMonth > 0 ? Math.round((market.soldThisMonth / market.leadsThisMonth) * 100) : 0;
  const field = fieldFor(niche.id);
  return `MONTHLY — ${niche.name.toUpperCase()} / CAPE FEAR

Coverage: ${market.neighborhoods.join(", ")}
Field: ${field.wedge.toUpperCase()} vs Angi ${field.angi} / LSA ${field.lsa} / rank-rent ${field.rankRent}
Calls / forms: ${market.callsThisMonth} inbound, ${market.leadsThisMonth} screened
Handed: ${market.soldThisMonth} (${sellPct}%)
Paid PPL: ${money(market.revenueThisMonth)}
Avg paid handoff: ${cpl ? money(cpl) : "n/a"}
Jobs estimated: ${market.jobsEstimated}
Top queries: ${market.topQueries.join("; ") || "none logged"}
Rank: Maps ${market.rankMaps ?? "—"} · Organic ${market.rankOrganic ?? "—"} · AI ${market.aiCitations ?? "—"}

We answered every conversation. Freedom Project Leads. Owners got screened handoffs, not Angi leftovers. First ${FREE_TRIAL} per owner were free.

We keep the domain.`;
}

export function buyerIntro(buyer: Buyer, market: Market, niche: Niche) {
  const trial =
    buyer.hunt === "paying"
      ? `Paying $500 a week for the ${market.city} seat.`
      : buyer.freeRemaining > 0
        ? `${buyer.freeRemaining} free screened jobs left, then $500 a week exclusive.`
        : `Trial used. $500 a week or we re-open the seat.`;
  return `${buyer.name} — exclusive ${niche.name.toLowerCase()} · ${buyer.county.replace(/-/g, " ")}. Not Angi. Desk answers ${market.trackingNumber}. ${trial} Reply YES.`;
}