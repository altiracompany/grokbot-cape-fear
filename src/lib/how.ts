import type { Buyer, HandoffTarget } from "./types";

export const HOW_STEPS = [
  {
    n: "01",
    t: "They call",
    d: "A page, an ad, or a flyer to 5,000 homes. Someone needs a fence, a gutter, a quince, a septic. They call. We tell you how they found you.",
  },
  {
    n: "02",
    t: "A robot asks. It says it's a robot.",
    d: "County, street, what's wrong, can you be there. We keep the recording. If they're shopping five quotes, we cut them.",
  },
  {
    n: "03",
    t: "We text you",
    d: "You, your email, or your people — you pick. Name, phone, job, when they need it, the recording. Exclusive to you. Not four trucks.",
  },
  {
    n: "04",
    t: "You go",
    d: "That's it. Exclusive to you. Pause anytime.",
  },
] as const;

export const HANDOFF_OPTIONS: { id: HandoffTarget; label: string; blurb: string }[] = [
  { id: "founder", label: "You", blurb: "Hits your phone and email." },
  { id: "inbox", label: "Email", blurb: "Email first. Text backup." },
  { id: "team", label: "Your people", blurb: "Whoever runs the board." },
];

export function handoffDest(b: Pick<Buyer, "name" | "email" | "phone" | "handoffTo" | "handoffName" | "handoffEmail" | "handoffPhone">) {
  const to = b.handoffTo ?? "founder";
  const who = b.handoffName?.trim() || b.name;
  const email = b.handoffEmail?.trim() || b.email;
  const phone = b.handoffPhone?.trim() || b.phone;
  const label = to === "team" ? `Crew · ${who}` : to === "inbox" ? `Email · ${who}` : `You · ${who}`;
  return { to, who, email, phone, label };
}

export function sourceLine(source: string) {
  if (source === "eddm" || source === "mail") return "They called the number on your flyer.";
  if (source === "form") return "They filled the form on the page.";
  if (source === "gbp" || source === "maps") return "They found you on Google Maps.";
  return "They called the county number. Ad or page.";
}
