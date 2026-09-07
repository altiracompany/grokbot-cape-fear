import type { Buyer, HandoffTarget } from "./types";

export const HOW_STEPS = [
  {
    n: "01",
    t: "We make the phone ring",
    d: "Local pages, county ads, and optional EDDM to 5,000 homes. The homeowner is looking for the job — fence, gutter, quince, septic. They call or tap. We tell you which.",
  },
  {
    n: "02",
    t: "AI interview. Not a fake receptionist.",
    d: "The desk says it's AI. County, address, what's wrong, can you be there. Tape on every call. Hot or warm only. Quote-shoppers get cut.",
  },
  {
    n: "03",
    t: "Packet to you",
    d: "Inbox, your team, or the founder — you pick. Name, phone, job, urgency, interview tape. One company. Not four trucks.",
  },
  {
    n: "04",
    t: "You roll",
    d: "That's the product. Dedicated lead gen. Pause anytime.",
  },
] as const;

export const HANDOFF_OPTIONS: { id: HandoffTarget; label: string; blurb: string }[] = [
  { id: "founder", label: "Founder", blurb: "Hits the owner. Phone + inbox." },
  { id: "inbox", label: "Inbox", blurb: "Email first. SMS backup." },
  { id: "team", label: "Team", blurb: "Named dispatcher or crew lead." },
];

export function handoffDest(b: Pick<Buyer, "name" | "email" | "phone" | "handoffTo" | "handoffName" | "handoffEmail" | "handoffPhone">) {
  const to = b.handoffTo ?? "founder";
  const who = b.handoffName?.trim() || b.name;
  const email = b.handoffEmail?.trim() || b.email;
  const phone = b.handoffPhone?.trim() || b.phone;
  const label = to === "team" ? `Team · ${who}` : to === "inbox" ? `Inbox · ${who}` : `Founder · ${who}`;
  return { to, who, email, phone, label };
}

export function sourceLine(source: string) {
  if (source === "eddm" || source === "mail") return "EDDM / mailer. They called the number on the piece.";
  if (source === "form") return "Form on the local page.";
  if (source === "gbp" || source === "maps") return "Maps / Google listing.";
  return "Inbound call on the county line. Ads + local page.";
}
