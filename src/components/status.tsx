import { Badge } from "@/components/ui/badge";
import { FREE_TRIAL } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { Wedge } from "@/lib/field";
import type { BuyerStatus, Decision, HuntStatus, LeadStatus, ScreenGrade, Stage } from "@/lib/types";

export function DecisionBadge({ decision }: { decision: Decision }) {
  const tone =
    decision === "go" ? "go" : decision === "maybe" ? "maybe" : decision === "skip" ? "skip" : "muted";
  return <Badge tone={tone}>{decision}</Badge>;
}

export function StageBadge({ stage }: { stage: Stage }) {
  const tone = stage === "live" ? "live" : stage === "ranking" ? "fg" : stage === "build" ? "maybe" : "muted";
  const label = stage === "score" ? "Scoring" : stage === "build" ? "Building" : stage === "ranking" ? "Ranking" : "Live";
  return <Badge tone={tone}>{label}</Badge>;
}

export function LeadBadge({ status }: { status: LeadStatus }) {
  const tone = status === "sold" ? "go" : status === "new" ? "maybe" : status === "dead" ? "skip" : "muted";
  const label = status === "sold" ? "handed" : status;
  return <Badge tone={tone}>{label}</Badge>;
}

export function ScreenBadge({ screen }: { screen: ScreenGrade }) {
  const tone =
    screen === "hot" ? "go" : screen === "warm" ? "maybe" : screen === "screening" ? "live" : screen === "dead" ? "skip" : "muted";
  return <Badge tone={tone}>{screen}</Badge>;
}

export function BuyerBadge({ status }: { status: BuyerStatus }) {
  const tone = status === "active" ? "go" : status === "paused" ? "maybe" : "muted";
  return <Badge tone={tone}>{status}</Badge>;
}

export function HuntBadge({ hunt }: { hunt: HuntStatus }) {
  const tone = hunt === "paying" ? "go" : hunt === "trial" ? "maybe" : hunt === "pitched" ? "live" : "muted";
  const label = hunt === "paying" ? "Paying" : hunt === "trial" ? "Trial" : hunt === "pitched" ? "Pitched" : "Open";
  return <Badge tone={tone}>{label}</Badge>;
}

export function WedgeBadge({ wedge }: { wedge: Wedge }) {
  const tone = wedge === "flank" ? "go" : wedge === "fight" ? "maybe" : "skip";
  const label = wedge === "flank" ? "Flank" : wedge === "fight" ? "Fight" : "Skip";
  return <Badge tone={tone}>{label}</Badge>;
}

export function FreeBadge({ remaining }: { remaining: number }) {
  if (remaining <= 0) return <Badge tone="muted">trial used</Badge>;
  return <Badge tone="maybe">{remaining} free</Badge>;
}

export function FreeMeter({ used, remaining }: { used: number; remaining: number }) {
  const consumed = Math.min(FREE_TRIAL, Math.max(0, used));
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${remaining} of ${FREE_TRIAL} free left`}>
      {Array.from({ length: FREE_TRIAL }, (_, i) => (
        <span
          key={i}
          className={cn("size-2 rounded-full", i < consumed ? "bg-subtle" : "bg-maybe")}
        />
      ))}
      <span className="text-xs text-muted">
        {remaining > 0 ? `${remaining} free` : "trial used"}
      </span>
    </span>
  );
}
