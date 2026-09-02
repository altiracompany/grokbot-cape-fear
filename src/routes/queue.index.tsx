import { useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandoffDialog } from "@/components/handoff-dialog";
import { ScreenBadge } from "@/components/status";
import { captureRate, deskLines } from "@/lib/actions";
import { countyLabel } from "@/lib/conversation";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { ageLabel, cn, pct } from "@/lib/utils";
import type { ScreenGrade } from "@/lib/types";

export const Route = createFileRoute("/queue/")({ component: QueuePage });

const FILTERS: { id: "live" | "all" | ScreenGrade | "handed"; label: string }[] = [
  { id: "live", label: "On the line" },
  { id: "hot", label: "Hot" },
  { id: "screening", label: "Screening" },
  { id: "unscreened", label: "Ringing" },
  { id: "handed", label: "Handed" },
  { id: "all", label: "All" },
];

function QueuePage() {
  const markets = useAgency((s) => s.markets);
  const leads = useAgency((s) => s.leads);
  const simulateInbound = useAgency((s) => s.simulateInbound);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("live");
  const lines = deskLines(markets, leads);
  const taped = pct(captureRate(leads));

  const rows = useMemo(() => {
    return leads.filter((l) => {
      if (filter === "live") return l.status === "new";
      if (filter === "handed") return l.status === "sold";
      if (filter === "all") return true;
      return l.status === "new" && l.screen === filter;
    });
  }, [leads, filter]);

  const open = leads.filter((l) => l.status === "new").length;

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Call center</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Queue</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Every Cape Fear inbound rings us. Capture the tape. Screen it. Hand a hot job. {open} on the line · {taped} taped.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            const id = simulateInbound();
            if (!id) toast.error("No live site.");
            else {
              toast.success("Inbound. Answer it.");
              void navigate({ to: "/queue/$leadId", params: { leadId: id } });
            }
          }}
        >
          Answer inbound
        </Button>
      </header>

      <section className="grid gap-2">
        <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Lines we own</h2>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {lines.map((line) => (
            <Link
              key={line.marketId}
              to="/markets/$marketId"
              params={{ marketId: line.marketId }}
              className="min-w-56 shrink-0 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:min-w-0"
            >
              <p className="font-mono text-sm tabular-nums">{line.trackingNumber}</p>
              <p className="mt-1 truncate text-xs text-muted">{line.niche}</p>
              <p className="mt-2 text-xs text-subtle">
                {line.taped}/{line.inbound} taped
              </p>
            </Link>
          ))}
        </div>
      </section>

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
            <p className="text-sm text-muted">Queue is quiet. Answer inbound or wait on the tracking lines.</p>
          </Card>
        ) : (
          rows.map((lead) => {
            const market = markets.find((m) => m.id === lead.marketId);
            if (!market) return null;
            const niche = nicheById(market.nicheId);
            return (
              <article
                key={lead.id}
                className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:flex-row md:items-center md:justify-between"
              >
                <Link to="/queue/$leadId" params={{ leadId: lead.id }} className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{lead.name}</p>
                    <ScreenBadge screen={lead.screen} />
                    <span className="font-mono text-xs text-muted" suppressHydrationWarning>
                      {ageLabel(lead.at)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {lead.phone} · {lead.service} · {lead.neighborhood}
                  </p>
                  <p className="mt-1 text-xs text-subtle">
                    {niche.name} · {countyLabel(lead.county)} · {lead.source} · {lead.conversation.length} turns
                  </p>
                </Link>
                {lead.status === "new" && (lead.screen === "hot" || lead.screen === "warm") ? (
                  <HandoffDialog lead={lead} />
                ) : lead.status === "new" ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/queue/$leadId" params={{ leadId: lead.id }}>
                      Screen
                    </Link>
                  </Button>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
