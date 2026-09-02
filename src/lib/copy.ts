import { money, pct } from "./utils";
import { pplMath } from "./pricing";
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
  return `SCREENED HANDOFFS — ${niche.name.toUpperCase()} / CAPE FEAR

New Hanover · Pender · Brunswick.
We own ${market.domain}. We answer ${market.trackingNumber}. You never talk to a raw caller.

Wedge: ${field.wedge.toUpperCase()}
Angi sells this at ${field.angiPpl}. Shared. Three other trucks on the same ping.
We sell one screened job.

What you get
- A screened handoff: name, phone, address, job, urgency, transcript
- First ${FREE_TRIAL} free. Then ${money(market.pplPrice)} per accepted job
- Cap it. Pause it. We keep the ranker

What you do not get
- The site, the number, or a dump of unscreened form fills
- Shared mill leads five other trucks already called

The math
Typical job: ${niche.jobRange} (we model ${money(niche.jobValue)})
Close we underwrite: ${pct(niche.closeRate)}
Expected value of a screened lead: ${money(math.expectedValue)}
After the 2 free, you pay ${money(market.pplPrice)}

Reply YES and a weekly cap.`;
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

We answered every conversation. Owners got screened handoffs, not Angi leftovers. First ${FREE_TRIAL} per owner were free.

We keep the domain.`;
}

export function buyerIntro(buyer: Buyer, market: Market, niche: Niche) {
  const left = buyer.freeRemaining;
  const trial =
    left > 0 ? `${left} free screened handoff${left === 1 ? "" : "s"} left.` : `Trial used. ${money(buyer.pplRate)}/handoff.`;
  return `${buyer.name} — Cape Fear ${niche.name.toLowerCase()} is live. Not Angi. We answer, we screen, we hand you the job. ${trial} Cap ${buyer.monthlyCap}/mo. Reply YES.`;
}