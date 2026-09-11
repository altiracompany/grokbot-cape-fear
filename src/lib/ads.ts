/** Aristotle 7-part mapped onto one $500 desk. Not a new menu. */

export const SYSTEM = [
  {
    n: "1",
    name: "County page",
    they: "AI website optimization",
    we: "Fast local page for the job. Mobile. One CTA: call. Not their WordPress.",
    in: "dedicated",
  },
  {
    n: "2",
    name: "Old list",
    they: "Database reactivation",
    we: "We text THEIR past quotes. Higher open than email. Jobs they already paid to meet.",
    in: "turnkey",
  },
  {
    n: "3",
    name: "Reviews",
    they: "Reputation manager",
    we: "After a closed job: one SMS asking for the Google review. Not fake reviews.",
    in: "turnkey",
  },
  {
    n: "4",
    name: "Speed-to-lead",
    they: "Website lead nurturing",
    we: "Form or call in. AI interview in minutes. Packet to founder/inbox/team.",
    in: "dedicated",
  },
  {
    n: "5",
    name: "AI desk",
    they: "AI receptionist",
    we: "Missed-call interview. Says it's AI. Hot/warm only. This is the product.",
    in: "dedicated",
  },
  {
    n: "6",
    name: "Closer tape",
    they: "AI sales coach",
    we: "Skip until a paying seat asks. Don't sell training. Sell jobs.",
    in: "skip",
  },
  {
    n: "7",
    name: "Paid demand",
    they: "Marketing director / ads last",
    we: "Homeowner ads AFTER the desk answers. EDDM $300 to start this week. Don't buy traffic you can't interview.",
    in: "dedicated",
  },
] as const;

export type OwnerAd = {
  id: string;
  market: string;
  hook: string;
  primary: string;
  headline: string;
  cta: string;
};

/** Ads TO owners. They already know they need leads. 5th grade. Call the trade in line 1. */
export const OWNER_ADS: OwnerAd[] = [
  {
    id: "fence-comal",
    market: "Comal fence",
    hook: "Fence company in New Braunfels?",
    primary:
      "Fence company in New Braunfels?\n\nAngi still sends your job to 5 other trucks.\n\nExclusive to you in Comal. Not five trucks.\n\nA robot asks the homeowner the boring questions. It says it is a robot. Street. What's down. Can they be there.\n\nWe text you. You go.\n\nFirst 2 jobs free. Then $500 a week.\n\nTap YES.",
    headline: "Exclusive to you. Not 5 trucks.",
    cta: "YES — start 2 free",
  },
  {
    id: "gutter-storm",
    market: "Gutters / roof-adjacent",
    hook: "Gutter company tired of shared names?",
    primary:
      "Gutter company tired of shared names?\n\nYou pay Angi. Four other crews get the same person.\n\nExclusive to you. Homeowner calls. We ask. You get the storm work — not a race.\n\nFirst 2 free. Then $500 a week. Pause anytime.\n\nNeed work this week? Flyer from $300. High zip $650. Your name only. 5,000 homes.",
    headline: "Exclusive to you. One county.",
    cta: "Start this week",
  },
  {
    id: "hvac-lsa",
    market: "HVAC already on LSA",
    hook: "HVAC owner still on Google LSA?",
    primary:
      "HVAC owner still paying Google for clicks?\n\nYou already pay. You lose the ones you miss.\n\nWe ask on the missed call. It says it is a robot. Then the job hits your phone — exclusive to you, not three other techs.\n\nComal or Guadalupe.\n\nFirst 2 free. Then $500 a week.\n\nDon't buy more ads until someone answers.",
    headline: "Stop missing the call you paid for.",
    cta: "YES — cover the miss",
  },
  {
    id: "angi-tax",
    market: "Any home service already buying leads",
    hook: "Still paying Angi for leftovers?",
    primary:
      "Still paying Angi for leftovers?\n\nYou already know you need jobs. You don't need a webinar.\n\nExclusive to you in your county. A robot asks. Job on your phone.\n\nFence. Gutters. HVAC. Foundation. Pressure wash.\n\nBexar. Comal. Guadalupe.\n\nFirst 2 free. Then $500 a week.",
    headline: "Stop buying leftovers.",
    cta: "Get the next job",
  },
];

export const AD_RULES = [
  "5th grade. Short words. Periods.",
  "Trade in the first line. County in the first screen.",
  "High contrast: black field, one truck photo, yellow YES.",
  "Sell the job on their phone. Not AI. Not 'optimization.'",
  "Ads to owners get us clients. Ads to homeowners wait until we answer.",
];
