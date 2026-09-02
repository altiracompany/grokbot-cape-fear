import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CapeFearWedgeTable, EngageRules, RivalGrid } from "@/components/field-view";
import { ValueShowcase } from "@/components/value-showcase";
import { useAgency } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playbook")({ component: Playbook });

const TABS = ["Field", "Rules", "Value"] as const;

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
                Every owner starts with two screened handoffs at $0. Prove the desk. Then they pay the monthly seat —
                exclusive for that county. Overage is PPL. If they ghost a free one, pause them. Free does not mean
                unscreened.
              </p>
            </Card>
          </section>

          <section className="grid gap-3">
            <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Cape Fear stack</h2>
            <Card>
              <ol className="grid gap-2 text-sm text-muted">
                <li>1. Septic — live. Flank. $500/wk.</li>
                <li>2. Dryer vent — live. Best wedge. $500/wk.</li>
                <li>3. Standby generator — live. $500/wk. Don't fight electrician LSA.</li>
                <li>4. Well pump — building. Mills ignore rural. $500/wk.</li>
                <li>5. Garage door — ranking. Fight on salt + hurricane only. $500/wk.</li>
                <li>6. Storm / tree — ship it. $500/wk. Named storms print.</li>
                <li>7. Water damage — fight SERVPRO on overflow, not brand. $500/wk.</li>
                <li>8. Mosquito — coastal factory. Recurring. $500/wk.</li>
                <li>9. Pool — Brunswick golf + Landfall routes. $500/wk.</li>
                <li>10. Dock / lift — thinnest SERP, highest new wedge. $500/wk.</li>
                <li>Skip: handyman, tow, generic plumber/HVAC. Bark already proved that.</li>
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

      {tab === "Value" ? (
        <div className="grid gap-8">
          <ValueShowcase />

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
