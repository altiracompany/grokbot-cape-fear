import type { Decision, Scorecard } from "./types";

export const SCORE_WEIGHTS = {
  demand: 0.25,
  jobValue: 0.25,
  weakCompetitors: 0.2,
  willingness: 0.2,
  ease: 0.1,
} as const;

export const SCORE_FIELDS: {
  key: keyof typeof SCORE_WEIGHTS;
  label: string;
  hint: string;
}[] = [
  {
    key: "demand",
    label: "Search demand / urgency",
    hint: "People searching now, especially emergency modifiers",
  },
  {
    key: "jobValue",
    label: "Job value",
    hint: "What one closed job is worth on the truck",
  },
  {
    key: "weakCompetitors",
    label: "Weak competitor sites / GBPs",
    hint: "Thin pages, dead GBPs. Packed Angi + 6 LSA in the 3-pack = skip, not a fight.",
  },
  {
    key: "willingness",
    label: "Willingness to buy leads",
    hint: "Already paying Angi / HomeAdvisor / LSA. Will take PPL this week.",
  },
  {
    key: "ease",
    label: "Ease of ranking",
    hint: "Hyper-specific + suburbs beat generic licensed trades the mills auction.",
  },
];

export function weightedScore(score: Scorecard) {
  return (
    score.demand * SCORE_WEIGHTS.demand +
    score.jobValue * SCORE_WEIGHTS.jobValue +
    score.weakCompetitors * SCORE_WEIGHTS.weakCompetitors +
    score.willingness * SCORE_WEIGHTS.willingness +
    score.ease * SCORE_WEIGHTS.ease
  );
}

export function decide(score?: Scorecard): Decision {
  if (!score) return "unscored";
  const w = weightedScore(score);
  if (w >= 7.2) return "go";
  if (w >= 5.5) return "maybe";
  return "skip";
}

export function decisionCopy(decision: Decision) {
  if (decision === "go") return "Enter. Build our site. Sell PPL this week. Don't fight Angi on their auction.";
  if (decision === "maybe") return "Only if two buyers will take leads at the posted PPL and the Map pack isn't a national brand.";
  if (decision === "skip") return "Leave it. Mill-owned or harder than the lead value.";
  return "Score it before you spend a day on copy.";
}
