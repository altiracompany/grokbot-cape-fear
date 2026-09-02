import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyBlock } from "@/components/copy-block";
import { NewBuyerDialog } from "@/components/new-buyer-dialog";
import { FreeMeter, HuntBadge } from "@/components/status";
import { ValueCard } from "@/components/value-showcase";
import { huntCounts, nextHunt, payingWeekly, seatEmail, seatSms, targetWeekly, countyLabel } from "@/lib/seats";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { cn, money } from "@/lib/utils";
import { REGIONS, countiesIn, type County, type HuntStatus, type Region } from "@/lib/types";
import type { Buyer } from "@/lib/types";

export const Route = createFileRoute("/buyers")({ component: BuyersPage });

const HUNT_FILTERS: { id: "all" | HuntStatus; label: string }[] = [
  { id: "all", label: "All seats" },
  { id: "paying", label: "Paying" },
  { id: "trial", label: "Trial" },
  { id: "pitched", label: "Pitched" },
  { id: "open", label: "Open" },
];

function BuyersPage() {
  const buyers = useAgency((s) => s.buyers);
  const advanceHunt = useAgency((s) => s.advanceHunt);
  const [huntFilter, setHuntFilter] = useState<(typeof HUNT_FILTERS)[number]["id"]>("all");
  const [regionFilter, setRegionFilter] = useState<Region>("alamo");
  const [countyFilter, setCountyFilter] = useState<County | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = huntCounts(buyers, regionFilter);
  const weekly = payingWeekly(buyers, regionFilter);
  const target = targetWeekly(regionFilter);
  const countyOpts = countiesIn(regionFilter);

  const rows = useMemo(() => {
    return buyers
      .filter((b) => countyOpts.some((c) => c.id === b.county))
      .filter((b) => (huntFilter === "all" ? true : b.hunt === huntFilter))
      .filter((b) => (countyFilter === "all" ? true : b.county === countyFilter))
      .sort((a, b) => {
        const order: HuntStatus[] = ["paying", "trial", "pitched", "open"];
        const d = order.indexOf(a.hunt) - order.indexOf(b.hunt);
        if (d !== 0) return d;
        if (a.nicheId !== b.nicheId) return a.nicheId.localeCompare(b.nicheId);
        return a.county.localeCompare(b.county);
      });
  }, [buyers, huntFilter, countyFilter, countyOpts]);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Freedom Project Leads</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Hunt</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Alamo first: Bexar, Comal, Guadalupe. 30 seats × $500/wk. Atascosa and Wilson wait. Cape Fear still pays.
          </p>
        </div>
        <NewBuyerDialog />
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="rounded-xl p-4">
          <p className="text-xs tracking-wider text-muted uppercase">Paying</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">
            {counts.paying}
            <span className="text-sm text-subtle">/{counts.target}</span>
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs tracking-wider text-muted uppercase">This week</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{money(weekly)}</p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs tracking-wider text-muted uppercase">If 30 pay</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{money(target)}<span className="text-sm text-subtle">/wk</span></p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs tracking-wider text-muted uppercase">Still open</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{counts.gap}</p>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
          {HUNT_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setHuntFilter(f.id)}
              className={cn(
                "h-11 shrink-0 rounded-md px-4 text-sm",
                huntFilter === f.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRegionFilter(r.id);
                setCountyFilter("all");
              }}
              className={cn(
                "h-11 shrink-0 rounded-md px-4 text-sm",
                regionFilter === r.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
          <button
            type="button"
            onClick={() => setCountyFilter("all")}
            className={cn(
              "h-11 shrink-0 rounded-md px-4 text-sm",
              countyFilter === "all" ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            Core 3
          </button>
          {countyOpts.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCountyFilter(c.id)}
              className={cn(
                "h-11 shrink-0 rounded-md px-4 text-sm",
                countyFilter === c.id ? "bg-elevated text-fg" : "text-muted hover:text-fg",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {rows.map((buyer) => (
          <SeatRow
            key={buyer.id}
            buyer={buyer}
            expanded={openId === buyer.id}
            onToggle={() => setOpenId(openId === buyer.id ? null : buyer.id)}
            onAdvance={() => {
              const next = advanceHunt(buyer.id);
              if (!next) {
                toast.message(`${buyer.company} already paying.`);
                return;
              }
              toast.success(`${buyer.company} → ${next}`);
            }}
          />
        ))}
      </div>
    </main>
  );
}

function SeatRow({
  buyer,
  expanded,
  onToggle,
  onAdvance,
}: {
  buyer: Buyer;
  expanded: boolean;
  onToggle: () => void;
  onAdvance: () => void;
}) {
  const niche = nicheById(buyer.nicheId);
  const next = nextHunt(buyer.hunt);
  const nextLabel =
    next === "pitched" ? "Mark pitched" : next === "trial" ? "Start 2 free" : next === "paying" ? "Convert paying" : null;

  return (
    <article className="grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <button type="button" onClick={onToggle} className="min-w-0 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{buyer.company}</p>
            <HuntBadge hunt={buyer.hunt} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {niche.name} · {countyLabel(buyer.county)} · {buyer.name}
          </p>
          <p className="mt-1 font-mono text-xs text-subtle">
            $500/wk · then {money(buyer.pplRate)} overage
          </p>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {buyer.hunt === "trial" ? <FreeMeter used={buyer.freeUsed} remaining={buyer.freeRemaining} /> : null}
          {nextLabel ? (
            <Button type="button" size="sm" onClick={onAdvance}>
              {nextLabel}
            </Button>
          ) : (
            <p className="text-xs tracking-wider text-go uppercase">Seat sold</p>
          )}
        </div>
      </div>
      {expanded ? (
        <div className="grid gap-3 border-t border-border pt-3">
          <p className="text-sm text-muted">{buyer.notes}</p>
          <p className="font-mono text-xs text-subtle">
            {buyer.phone} · {buyer.email}
          </p>
          <CopyBlock label="Text" text={seatSms(buyer)} />
          <CopyBlock label="Email" text={seatEmail(buyer)} />
          <ValueCard niche={niche} />
        </div>
      ) : null}
    </article>
  );
}
