/** CMO agent. App-growth playbook, rewritten for a desk that sells jobs not downloads. */

export const CMO_PHASES = [
  {
    n: "1",
    name: "Virality first",
    they: "Study what's going viral, recreate it relentlessly. Virality before the app.",
    we: "Angi rants, RSVP pack screenshots, 'slow week' posts, LSA miss stories. Recreate those. Don't invent a brand voice. Steal the post that's already working in contractor groups.",
  },
  {
    n: "2",
    name: "Content finds the offer",
    they: "Post first, build second. 'I wish this existed' is the brief.",
    we: "Comments already told us: exclusive county, screen before you roll, mail that's one name. That's the $500. Don't add SKUs because a guru has seven.",
  },
  {
    n: "3",
    name: "Ship fast",
    they: "AI MVP in days.",
    we: "Desk is live. /go takes the card. Don't rebuild Clay. Connect MCP. Don't wait on a domain to text 830.",
  },
  {
    n: "4",
    name: "Convert soft",
    they: "Value first. App as afterthought. Save-worthy. DMs close downloads.",
    we: "Value in the post. Desk in the DM. 'Repeat for 7 days' on the Angi math. CTA is reply YES or DM YES — not a thread of features.",
  },
  {
    n: "5",
    name: "Use the hate",
    they: "Criticism is reach. Innovate, don't copy.",
    we: "'AI is fake' → we say it's AI on line one. 'Another mill' → one company, not five trucks. Don't argue. Post the tape rule. Block copycats of the pack.",
  },
] as const;

export const CMO_DAILY = [
  "1 post in a group they already follow. Value only. No link.",
  "8 comments on other people's posts (playbook Comments).",
  "Every 'how do you get leads' or 'I wish this existed' → DM. Not a public pitch.",
  "DM: 4 sentences. 2 free. $500/wk. County lock. Stop.",
  "If they ask price in public: 'I'll text you.' Then the DM.",
] as const;

export const CMO_POSTS = [
  {
    hook: "Repeat for 7 days",
    body: "Angi sold the same fence job to 5 trucks in Comal last week.\n\nFirst cheap bid won a race. Nobody won a job.\n\nCost per booked job is the only number.\n\nRepeat for 7 days.",
  },
  {
    hook: "I wish this existed",
    body: "The thing contractors keep asking for:\n\none name on the mailer.\none truck on the job.\nsomeone who already asked the homeowner the boring questions.\n\nThat's not a pack. That's a desk.",
  },
  {
    hook: "Save this",
    body: "If they didn't give a street and a time window, it wasn't a job.\nIt was a name.\nDon't pay for names.\n\nSave this.",
  },
  {
    hook: "Use the hate",
    body: "People hate 'AI receptionist' because it pretends to be a person.\n\nSay it's AI on the first line. Interview. Send the hot one to one company.\n\nHate the fake. Keep the screen.",
  },
  {
    hook: "Afterthought CTA",
    body: "LSA works if you answer in 30 seconds.\nAngi works if you like sharing.\nMail works if it's your piece.\n\nDedicated line if you want it screened before you leave the shop.\n\n(If you want that last one: DM YES.)",
  },
];

export const CMO_DM = `You asked how to stop buying leftovers.

Dedicated lead gen. One company per county. AI interviews — it says it's AI — then the job hits your phone.

First 2 free. Then $500/wk. Pause anytime.

Reply YES and we start Comal.`;
