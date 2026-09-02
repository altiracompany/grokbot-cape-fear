import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CapeFearWedgeTable, EngageRules, RivalGrid } from "@/components/field-view";
import { NICHES } from "@/lib/niches";
import { exclusiveReserve, pplPrice } from "@/lib/pricing";
import { useAgency } from "@/lib/store";
import { CAPE_NICHES } from "@/lib/territory";
import { cn, money } from "@/lib/utils";

export const Route = createFileRoute("/playbook")({ component: Playbook });

const TABS = ["Field", "Rules", "PPL"] as const;

function Playbook() {
  const resetDesk = useAgency((s) => s.resetDesk);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Field");

  return (
    <main className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Rules</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Playbook</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Don't fight Angi on plumber. Flank niches they list but don't rank. Own the page. Answer the phone. Copycats
          clone anything that prints — ship first.
        </p>
      </header>

      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "h-11 shrink-0 rounded-md px-4 text-sm",
              tab === t ? "bg-elevated text-fg" : "text-muted hover:text-fg",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Field" ? (
        <div className="grid gap-8">
          <EngageRules />
          <RivalGrid camp="mill" />
          <RivalGrid camp="copycat" />
          <CapeFearWedgeTable />
        </div>
      ) : null}

      {tab === "Rules" ? (
        <div className="grid gap-8">
          <section className="grid gap-3">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Operating mode</h2>
            <Card>
              <CardTitle>Tri-county lock</CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                New Hanover, Pender, Brunswick. No other metros. Neighborhoods we actually roll to. If it is not Cape
                Fear, it is not inventory.
              </p>
            </Card>
            <Card>
              <CardTitle>Call center owns the conversation</CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Tracking numbers ring our desk, not the owner. Capture the tape. Screen for county, job, urgency, access.
                Hot or warm gets a handoff packet. Unscreened callers never leave the queue.
              </p>
            </Card>
            <Card>
              <CardTitle>We own the hot leads</CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Exclusive. Not a shared mill dump. Domain, GBP, content, tracking number stay ours. Owners buy the job,
                not the site. Auction stays parked.
              </p>
            </Card>
            <Card>
              <CardTitle>First 2 free</CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Every owner starts with two screened handoffs at $0. Prove the desk. Third job is PPL. If they ghost a
                free one, pause them. Free does not mean unscreened.
              </p>
            </Card>
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Cape Fear stack</h2>
            <Card>
              <ol className="grid gap-2 text-sm text-muted">
                <li>1. Wilmington septic — live. Flank. Screen backups. 2 free then $50.</li>
                <li>2. Dryer vent — live. Best wedge. Season is open. Copycats haven't noticed.</li>
                <li>3. Standby generator — live. Highest ticket. Don't fight electrician LSA.</li>
                <li>4. Garage door — ranking. Fight, not flank. Salt + hurricane only.</li>
                <li>5. Pender well pump — building. Mills ignore rural. Ship it.</li>
                <li>6. Brunswick crawl space — skip the city. Ninja owns Wilmington.</li>
              </ol>
            </Card>
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Sales lines</h2>
            <Card>
              <ul className="grid gap-2 text-sm text-muted">
                <li>Pitch inventory, not WordPress. Name Angi in sentence one.</li>
                <li>Never sell guaranteed rankings, fake reviews, or scraped copy.</li>
                <li>Never claim to hack, dox, or manipulate platforms.</li>
                <li>If they want work on THEIR domain: 1.5–2× and warn they keep the asset. Then walk.</li>
                <li>Answer in the first two sentences on every page we build.</li>
                <li>City + neighborhood, real hours, real phone. Unique copy. No doorway spam.</li>
              </ul>
            </Card>
          </section>
        </div>
      ) : null}

      {tab === "PPL" ? (
        <div className="grid gap-8">
          <section className="grid gap-3">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">PPL card</h2>
            <div className="overflow-x-auto rounded-2xl bg-surface shadow-[var(--shadow-border)]">
              <table className="w-full text-left text-sm">
                <thead className="text-xs tracking-wider text-muted uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Niche</th>
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">PPL</th>
                    <th className="px-4 py-3 font-medium">Exclusive later</th>
                  </tr>
                </thead>
                <tbody>
                  {NICHES.filter((n) => (CAPE_NICHES as readonly string[]).includes(n.id)).map((n) => (
                    <tr key={n.id} className="border-t border-border">
                      <td className="px-4 py-3">{n.name}</td>
                      <td className="px-4 py-3 font-mono tabular-nums">{n.jobRange}</td>
                      <td className="px-4 py-3 font-mono tabular-nums">{money(pplPrice(n))}</td>
                      <td className="px-4 py-3 font-mono text-subtle tabular-nums">{money(exclusiveReserve(n))}/mo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Desk</h2>
            <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">Reset to the Cape Fear seed if the queue got noisy.</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  resetDesk();
                  toast.success("Desk reset. Tri-county seed loaded.");
                }}
              >
                Reset desk
              </Button>
            </Card>
          </section>
        </div>
      ) : null}
    </main>
  );
}
