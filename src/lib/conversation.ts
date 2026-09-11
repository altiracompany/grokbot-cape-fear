import type { Buyer, CallTurn, County, Lead, Market, Niche } from "./types";
import { COUNTIES, FREE_TRIAL } from "./types";
import { money } from "./utils";
import { handoffPrice } from "./pricing";
import { handoffDest, sourceLine } from "./how";

export function countyLabel(id?: County) {
  return COUNTIES.find((c) => c.id === id)?.label ?? "Tri-county";
}

export function scriptCall(args: {
  niche: Niche;
  name: string;
  hood: string;
  service: string;
  tracking: string;
  counties?: string[];
}): CallTurn[] {
  const { niche, name, hood, service, tracking } = args;
  const first = name.split(" ")[0] ?? "there";
  const area = args.counties?.length
    ? args.counties.join(", ")
    : "Bexar, Comal, or Guadalupe";
  return [
    {
      at: "0:00",
      speaker: "agent",
      text: `Freedom Project interview desk. I'm an AI, not a person. You're on ${tracking}. I'll ask a few questions and send this to one local ${niche.name.toLowerCase()} company if it's a real job.`,
    },
    { at: "0:08", speaker: "caller", text: `Hey — this is ${first} in ${hood}. I need ${service.toLowerCase()}.` },
    { at: "0:16", speaker: "agent", text: `Got it. Which county — ${area}?` },
    { at: "0:20", speaker: "caller", text: `${hood}. Can someone come today?` },
    { at: "0:26", speaker: "agent", text: `What's going on, exactly, and what's the street?` },
    { at: "0:32", speaker: "caller", text: `${service}. I can be home. This number is good.` },
    {
      at: "0:40",
      speaker: "agent",
      text: `I'm sending this to your local company now. One crew, not four. Stay by the phone.`,
    },
  ];
}

export function handoffPacket(lead: Lead, market: Market, niche: Niche, buyer: Buyer) {
  const price = lead.free ? 0 : (lead.soldPrice ?? handoffPrice(buyer));
  const slot = Math.max(1, Math.min(FREE_TRIAL, buyer.freeUsed || 1));
  const priceLine = lead.free || price === 0 ? `FREE — free ${slot} of ${FREE_TRIAL}` : money(price);
  const dest = handoffDest(buyer);
  const lines = lead.conversation
    .slice(-6)
    .map((t) => `${t.speaker === "agent" ? "AI desk" : "Caller"}: ${t.text}`)
    .join("\n");
  return `FREEDOM PROJECT LEADS — ${buyer.company}

${priceLine}
TO: ${dest.label}
Inbox: ${dest.email}
SMS: ${dest.phone}

Caller: ${lead.name} · ${lead.phone}
Where: ${lead.address || lead.neighborhood}${lead.zip ? ` ${lead.zip}` : ""} · ${countyLabel(lead.county)}
Job: ${lead.service}
Urgency: ${(lead.urgency ?? "today").toUpperCase()}

How we got this
${sourceLine(lead.source)} ${market.domain}

AI interview (they were told it's AI)
${lead.screenNotes || "In the county. Real job. Wants work. Not a shopper."}

Tape
${lines || "(no transcript)"}

We interviewed. Exclusive to you. Don't call them to "see if it's real" — we already did.`;
}

export function ownerOfferSms(market: Market, niche: Niche, ppl: number) {
  return `Stop buying Angi leftovers. Exclusive to you. A robot asks on ${market.trackingNumber}. Job to your phone, not four other trucks. First 2 free. Then $500 a week. Reply YES.`;
}
