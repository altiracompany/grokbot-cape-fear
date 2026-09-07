import { nicheById } from "./niches";
import { countyLabel } from "./seats";
import { minutesAgo } from "./utils";
import type { Buyer, Lead, Market } from "./types";

export const SCRUB_HOUR = 5;
export const SCRUB_TZ = "America/Chicago";

export type ScrubItem = {
  id: string;
  title: string;
  why: string;
  doThis: string;
  to: "/queue" | "/buyers" | "/outreach" | "/go";
  tone: "urgent" | "money" | "work";
};

export function chicagoStamp(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SCRUB_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  const hour = Number(get("hour") === "24" ? "0" : get("hour"));
  const day = `${get("year")}-${get("month")}-${get("day")}`;
  return { hour, day };
}

export function scrubDue(lastScrubAt: string | null, now = new Date()) {
  const { hour, day } = chicagoStamp(now);
  if (hour < SCRUB_HOUR) return false;
  if (!lastScrubAt) return true;
  const last = chicagoStamp(new Date(lastScrubAt)).day;
  return last < day;
}

export function runScrub(buyers: Buyer[], leads: Lead[], _markets: Market[]): ScrubItem[] {
  const out: ScrubItem[] = [];

  const unscreened = leads
    .filter((l) => l.status === "new" && (l.screen === "unscreened" || l.screen === "screening"))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
  for (const l of unscreened.slice(0, 3)) {
    out.push({
      id: `screen-${l.id}`,
      title: `Screen ${l.name}`,
      why: `${minutesAgo(l.at)}m on the line. Don't hand a raw caller.`,
      doThis: "Queue. Hot or warm only.",
      to: "/queue",
      tone: "urgent",
    });
  }

  const hotOrphan = leads.filter((l) => l.status === "new" && (l.screen === "hot" || l.screen === "warm"));
  if (hotOrphan.length) {
    const ready = buyers.filter((b) => b.status === "active" && (b.hunt === "trial" || b.hunt === "paying"));
    if (!ready.length) {
      out.push({
        id: "orphan-hot",
        title: `${hotOrphan.length} screened, no truck`,
        why: "Packet dies if it sits.",
        doThis: "Text 5 opens. Or EDDM $300.",
        to: "/outreach",
        tone: "urgent",
      });
    } else {
      out.push({
        id: "handoff-hot",
        title: `Handoff ${hotOrphan.length} screened`,
        why: `${ready[0].company} is on the books.`,
        doThis: "Send the packet. Text the owner.",
        to: "/queue",
        tone: "money",
      });
    }
  }

  const collect = buyers.filter((b) => b.hunt === "trial" && b.freeRemaining <= 0 && b.status === "active");
  for (const b of collect.slice(0, 2)) {
    out.push({
      id: `collect-${b.id}`,
      title: `Collect ${b.company}`,
      why: "2 free burned. $500/wk or pause.",
      doThis: "Send pay link. Don't ghost.",
      to: "/buyers",
      tone: "money",
    });
  }

  const eddmWait = buyers.filter((b) => b.eddm && b.status === "active");
  if (eddmWait.length) {
    out.push({
      id: "eddm-drop",
      title: `Drop EDDM · ${eddmWait.length} slot${eddmWait.length > 1 ? "s" : ""}`,
      why: "$300 already sold. 5k homes. Piece in the mail today.",
      doThis: "Print. Routes. Cove on that inbound.",
      to: "/buyers",
      tone: "money",
    });
  }

  const payingDry = buyers.filter((b) => b.hunt === "paying" && b.soldThisMonth === 0 && b.status === "active");
  if (payingDry.length) {
    out.push({
      id: "dry-paying",
      title: `${payingDry.length} paying with 0 jobs`,
      why: "They'll cancel. Source one screened job.",
      doThis: "Cove + EDDM. Don't wait on Google.",
      to: "/queue",
      tone: "urgent",
    });
  }

  const opens = buyers.filter((b) => b.hunt === "open" && ["comal", "bexar", "guadalupe"].includes(b.county));
  const priority = ["quince", "bounce", "dj", "catering", "septic", "generator"];
  const first = opens
    .slice()
    .sort((a, b) => priority.indexOf(a.nicheId) - priority.indexOf(b.nicheId) || a.county.localeCompare(b.county));
  if (first.length && out.filter((i) => i.to === "/outreach").length === 0) {
    const t = first[0];
    out.push({
      id: `text-${t.id}`,
      title: `Text ${t.company}`,
      why: `${countyLabel(t.county)} ${nicheById(t.nicheId).name} is open.`,
      doThis: "YES / MAIL. 10 texts before noon.",
      to: "/outreach",
      tone: "work",
    });
  }

  return out.slice(0, 7);
}
