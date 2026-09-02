import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HandoffDialog } from "@/components/handoff-dialog";
import { MillsStrip } from "@/components/field-view";
import { ScreenBadge, StageBadge } from "@/components/status";
import {
  captureRate,
  countyRollup,
  deskLines,
  freeOnBooks,
  hotCount,
  nextActions,
  ownedHot,
  revenueMtd,
  ringing,
  unscreenedCount,
} from "@/lib/actions";
import { countyLabel } from "@/lib/conversation";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { cn, money, pct } from "@/lib/utils";
import type { NextAction } from "@/lib/types";

export const Route = createFileRoute("/")({ component: CommandCenter });

function actionParams(a: NextAction) {
  if (a.to === "/queue/$leadId" && a.leadId) return { leadId: a.leadId };
  if (a.to === "/markets/$marketId" && a.marketId) return { marketId: a.marketId };
  return undefined;
}

function CommandCenter() {
  const markets = useAgency((s) => s.markets);
  const buyers = useAgency((s) => s.buyers);
  const leads = useAgency((s) => s.leads);
  const simulateInbound = useAgency((s) => s.simulateInbound);
  const actions = nextActions(markets, buyers, leads);
  const counties = countyRollup(leads);
  const hot = ownedHot(leads);
  const ring = ringing(leads);
  const lines = deskLines(markets, leads);
  const kpis = [
    { label: "On the line", value: String(unscreenedCount(leads) + hotCount(leads)) },
    { label: "Hot we own", value: String(hot.length) },
    { label: "Tapes kept", value: pct(captureRate(leads)) },
    { label: "Paid MTD", value: money(revenueMtd(markets)) },
    { label: "Free left", value: String(freeOnBooks(buyers)) },
  ];

  const live = [...markets]
    .filter((m) => m.revenueThisMonth > 0 || m.stage === "live")
    .sort((a, b) => b.revenueThisMonth - a.revenueThisMonth);
  const maxRev = Math.max(...live.map((m) => m.revenueThisMonth), 1);

  function ping() {
    const id = simulateInbound();
    if (!id) {
      toast.error("No live site to ping.");
      return;
    }
    toast.success("Inbound on the desk. Screen it.");
  }

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">Cape Fear · tri-county</p>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">We own the hot leads</h1>
          <p className="max-w-xl text-sm text-muted">
            New Hanover, Pender, Brunswick. Don't fight Angi on plumber. Flank what they list but don't rank. Our desk
            answers. First two free.
          </p>
        </div>
        <Button type="button" onClick={ping}>
          Answer inbound
        </Button>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-xl p-4">
            <p className="text-xs tracking-wider text-muted uppercase">{k.label}</p>
            <p className="mt-2 font-mono text-xl tabular-nums tracking-tight md:text-2xl">{k.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-3">
        <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Tri-county coverage</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {counties.map((c) => (
            <Card key={c.id} className="rounded-xl p-4">
              <p className="text-sm font-medium">{c.label}</p>
              <p className="mt-0.5 text-xs text-subtle">{c.seat}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 font-mono text-sm tabular-nums">
                <div>
                  <dt className="text-xs tracking-wider text-subtle uppercase">Hot</dt>
                  <dd className="mt-0.5">{c.hot}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wider text-subtle uppercase">Ring</dt>
                  <dd className="mt-0.5">{c.ringing}</dd>
                </div>
                <div>
                  <dt className="text-xs tracking-wider text-subtle uppercase">Handed</dt>
                  <dd className="mt-0.5">{c.handed}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </section>

      <MillsStrip />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Hot inventory we own</h2>
            <Link to="/queue" className="text-sm text-muted hover:text-fg">
              Queue
            </Link>
          </div>
          {hot.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">No exclusive jobs sitting. Screen the line.</p>
            </Card>
          ) : (
            hot.map((lead) => {
              const market = markets.find((m) => m.id === lead.marketId);
              if (!market) return null;
              return (
                <article
                  key={lead.id}
                  className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <Link to="/queue/$leadId" params={{ leadId: lead.id }} className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{lead.name}</p>
                      <ScreenBadge screen={lead.screen} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {lead.service} · {countyLabel(lead.county)} · {lead.neighborhood}
                    </p>
                  </Link>
                  <HandoffDialog lead={lead} />
                </article>
              );
            })
          )}
        </div>
        <div className="grid gap-3">
          <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Need screen</h2>
          {ring.length === 0 ? (
            <Card>
              <p className="text-sm text-muted">Queue is clean. Every tape is graded.</p>
            </Card>
          ) : (
            ring.map((lead) => {
              const market = markets.find((m) => m.id === lead.marketId);
              if (!market) return null;
              return (
                <Link
                  key={lead.id}
                  to="/queue/$leadId"
                  params={{ leadId: lead.id }}
                  className="flex items-center justify-between gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{lead.name}</span>
                      <ScreenBadge screen={lead.screen} />
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {nicheById(market.nicheId).name} · {countyLabel(lead.county)}
                    </span>
                  </span>
                  <span className="text-sm text-muted">Screen</span>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Lines we answer</h2>
        <p className="text-sm text-muted">Tracking numbers ring this desk, not the owner. We keep every tape.</p>
        <div className="grid gap-2">
          {lines.map((line) => (
            <Link
              key={line.marketId}
              to="/markets/$marketId"
              params={{ marketId: line.marketId }}
              className="flex flex-col gap-1 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm tabular-nums">{line.trackingNumber}</p>
                <p className="mt-1 truncate text-sm text-muted">
                  {line.niche} · {line.domain}
                </p>
              </div>
              <p className="text-sm text-muted">
                {line.taped}/{line.inbound} taped
                {line.lastName ? ` · last ${line.lastName}` : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Next 3</h2>
        {actions.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Queue is clean. Answer a line or onboard another owner.</p>
          </Card>
        ) : (
          <ol className="grid gap-2">
            {actions.map((a, i) => (
              <li key={a.id}>
                <Link
                  to={a.to}
                  params={actionParams(a)}
                  className="flex items-start gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] transition-shadow duration-150 hover:shadow-[var(--shadow-border-hover)]"
                >
                  <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">{a.title}</span>
                    <span className="mt-1 block text-sm text-muted">{a.why}</span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 hidden text-xs tracking-wider uppercase sm:inline",
                      a.tone === "urgent" ? "text-skip" : a.tone === "money" ? "text-maybe" : "text-muted",
                    )}
                  >
                    {a.tone}
                  </span>
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Cash by site</h2>
          <Link to="/markets" className="text-sm text-muted hover:text-fg">
            All niches
          </Link>
        </div>
        <div className="grid gap-2">
          {live.map((m) => {
            const niche = nicheById(m.nicheId);
            return (
              <Link
                key={m.id}
                to="/markets/$marketId"
                params={{ marketId: m.id }}
                className="grid gap-2 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
              >
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {niche.name} · {m.city}
                    </p>
                    <p className="text-xs text-muted">
                      {m.soldThisMonth} handed · {m.leadsThisMonth} in · then {money(m.pplPrice)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StageBadge stage={m.stage} />
                    <span className="font-mono text-sm tabular-nums">{money(m.revenueThisMonth)}</span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(4, (m.revenueThisMonth / maxRev) * 100)}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
