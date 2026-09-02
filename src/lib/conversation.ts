import type { Buyer, CallTurn, County, Lead, Market, Niche } from "./types";
import { COUNTIES, FREE_TRIAL } from "./types";
import { money } from "./utils";
import { handoffPrice } from "./pricing";

export function countyLabel(id?: County) {
  return COUNTIES.find((c) => c.id === id)?.label ?? "Tri-county";
}

export function scriptCall(args: {
  niche: Niche;
  name: string;
  hood: string;
  service: string;
  tracking: string;
}): CallTurn[] {
  const { niche, name, hood, service, tracking } = args;
  const first = name.split(" ")[0] ?? "there";
  return [
    { at: "0:00", speaker: "agent", text: `Cape Fear ${niche.name.toLowerCase()}, this is the desk. You're on ${tracking}.` },
    { at: "0:06", speaker: "caller", text: `Hey — this is ${first} in ${hood}. I need ${service.toLowerCase()}.` },
    { at: "0:14", speaker: "agent", text: `Got it. Are you in New Hanover, Pender, or Brunswick?` },
    { at: "0:18", speaker: "caller", text: `${hood}. Can someone come today?` },
    { at: "0:24", speaker: "agent", text: `That's our coverage. What's going on, exactly?` },
    { at: "0:30", speaker: "caller", text: `${service}. I can be home. Phone is the best number.` },
    { at: "0:38", speaker: "agent", text: `I'm going to screen this and hand you to a local owner, not a call mill. Stay by the phone.` },
  ];
}

export function handoffPacket(lead: Lead, market: Market, niche: Niche, buyer: Buyer) {
  const price = lead.free ? 0 : (lead.soldPrice ?? handoffPrice(buyer));
  const slot = Math.max(1, Math.min(FREE_TRIAL, buyer.freeUsed || 1));
  const priceLine = lead.free || price === 0 ? `FREE — free ${slot} of ${FREE_TRIAL}` : money(price);
  const lines = lead.conversation
    .slice(-4)
    .map((t) => `${t.speaker === "agent" ? "Desk" : "Caller"}: ${t.text}`)
    .join("\n");
  return `SCREENED HANDOFF — ${buyer.company}

${priceLine}

Caller: ${lead.name} · ${lead.phone}
Where: ${lead.address || lead.neighborhood}${lead.zip ? ` ${lead.zip}` : ""} · ${countyLabel(lead.county)}
Job: ${lead.service}
Urgency: ${(lead.urgency ?? "today").toUpperCase()}
Source: ${lead.source} on ${market.domain}

Screen
${lead.screenNotes || "In territory. Real job. Wants service. Not a mill dump."}

Call excerpt
${lines || "(no transcript)"}

We answered. We qualified. You roll. Do not call them a second time to "see if it's real" — we already did.`;
}

export function ownerOfferSms(market: Market, niche: Niche, ppl: number) {
  return `Stop buying Angi leftovers. Cape Fear ${niche.name.toLowerCase()} — we own ${market.domain}, we answer ${market.trackingNumber}. Screened job, not a shared ping. First 2 free. Then ${money(ppl)}. Reply YES and a weekly cap.`;
}
