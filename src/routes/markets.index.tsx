import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { DecisionBadge, StageBadge, WedgeBadge } from "@/components/status";
import { fieldFor } from "@/lib/field";
import { nicheById } from "@/lib/niches";
import { decide, weightedScore } from "@/lib/scoring";
import { useAgency } from "@/lib/store";
import { countyNames } from "@/lib/territory";
import { money } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Decision, Stage } from "@/lib/types";

export const Route = createFileRoute("/markets/")({ component: MarketsPage });

const FILTERS: { id: "all" | Decision | Stage; label: string }[] = [
  { id: "all", label: "All" },
  { id: "go", label: "Go" },
  { id: "live", label: "Live" },
  { id: "ranking", label: "Ranking" },
  { id: "build", label: "Building" },
  { id: "score", label: "Scoring" },
];

function MarketsPage() {
  const markets = useAgency((s) => s.markets);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const rows = useMemo(() => {
    return markets.filter((m) => {
      if (filter === "all") return true;
      if (filter === "go" || filter === "maybe" || filter === "skip" || filter === "unscored") {
        return decide(m.score) === filter;
      }
      return m.stage === filter;
    });
  }, [markets, filter]);

  return (
    <main className="flex flex-col gap-6">
      <header>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Cape Fear inventory</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Niches we own</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          We own the ranker, the number, and the tape. Flank what Angi lists but doesn't rank. Don't buy their auction.
        </p>
      </header>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "h-11 shrink-0 rounded-full px-4 text-sm",
              filter === f.id ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-2">
        {rows.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Nothing in this slice. Open a Cape Fear niche.</p>
          </Card>
        ) : (
          rows.map((m) => {
            const niche = nicheById(m.nicheId);
            const decision = decide(m.score);
            const score = m.score ? weightedScore(m.score).toFixed(1) : "—";
            const field = fieldFor(niche.id);
            return (
              <Link
                key={m.id}
                to="/markets/$marketId"
                params={{ marketId: m.id }}
                className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-shadow duration-150 hover:shadow-[var(--shadow-border-hover)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {niche.name} · {m.city}
                    </p>
                    <DecisionBadge decision={decision} />
                    <WedgeBadge wedge={field.wedge} />
                    <StageBadge stage={m.stage} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{m.domain}</p>
                  <p className="mt-1 text-xs text-subtle">{countyNames(m.counties).join(" · ")}</p>
                </div>
                <div className="flex shrink-0 gap-6 font-mono text-sm tabular-nums">
                  <div>
                    <p className="text-xs text-subtle uppercase">Then</p>
                    <p>{money(m.pplPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle uppercase">MTD</p>
                    <p>{money(m.revenueThisMonth)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-subtle uppercase">Score</p>
                    <p>{score}</p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}
