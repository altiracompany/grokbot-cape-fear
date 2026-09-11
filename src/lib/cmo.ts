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
    we: "Comments already told us: one name, one truck, ask before you roll. That's the $500. Don't add a seventh product because a guru has seven.",
  },
  {
    n: "3",
    name: "Ship fast",
    they: "AI MVP in days.",
    we: "Site is live. Don't wait on a tool to post.",
  },
  {
    n: "4",
    name: "Convert soft",
    they: "Value first. App as afterthought. Save-worthy. DMs close downloads.",
    we: "Value in the post. The offer in the DM. 'Repeat for 7 days' on the Angi math. CTA is reply YES — not a list of features.",
  },
  {
    n: "5",
    name: "Use the hate",
    they: "Criticism is reach. Innovate, don't copy.",
    we: "'Robot is fake' → we say it's a robot on line one. 'Another Angi' → one company, not five trucks. Don't argue. Post the rule.",
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
    body: "The thing contractors keep asking for:\n\none name on the mailer.\none truck on the job.\nsomeone who already asked the homeowner the boring questions.\n\nThat's not a pack. That's one company.",
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
    body: "LSA works if you answer in 30 seconds.\nAngi works if you like sharing.\nMail works if it's your piece.\n\nOne company if you want it asked before you leave the shop.\n\n(If you want that last one: DM YES.)",
  },
];

export const CMO_DM = `You asked how to stop buying leftovers.

One company in your county. A robot asks — it says it's a robot — then the job hits your phone.

First 2 free. Then $500 a week. Pause anytime.

Reply YES and we start Comal.`;
