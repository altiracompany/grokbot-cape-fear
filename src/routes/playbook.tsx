import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CapeFearWedgeTable, EngageRules, RivalGrid } from "@/components/field-view";
import { ValueShowcase } from "@/components/value-showcase";
import { useAgency } from "@/lib/store";
import { TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "@/lib/pricing";
import { cn, money } from "@/lib/utils";

export const Route = createFileRoute("/playbook")({ component: Playbook });

const TABS = ["Field", "Rules", "Value", "Offers"] as const;

function Playbook() {
  const resetDesk = useAgency((s) => s.resetDesk);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Field");

  return (
    <main className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Rules</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Playbook</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Don't fight Angi on plumber. Flank niches they list but don't rank. Dedicated lead gen. Answer the phone. Close.
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
              <CardTitle>Dedicated, not landlord</CardTitle>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                To the owner we are their lead gen company. Never "we own the page." One company per county. Jobs go to
                their truck. Auction stays parked.
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

      {tab === "Offers" ? (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            Other models don't matter until a phone rings. Two SKUs. Same desk. Sell Dedicated unless they're too busy
            to care — then Turnkey.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">Core</p>
              <CardTitle className="mt-1">Dedicated</CardTitle>
              <p className="mt-2 font-mono text-2xl tabular-nums">{money(WEEKLY_SEAT)}/wk</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                We answer. We screen. Packet to their truck. First 2 free. For owners already hunting leads.
              </p>
              <p className="mt-3 text-xs text-subtle">Reply YES</p>
            </Card>
            <Card>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">Busy professional</p>
              <CardTitle className="mt-1">Turnkey</CardTitle>
              <p className="mt-2 font-mono text-2xl tabular-nums">
                {money(TURNKEY_SETUP)} + {money(TURNKEY_WEEKLY)}/wk
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                We run ads, the line, after-hours, the screen. They only roll. Checkbook close. Same one-company rule.
              </p>
              <p className="mt-3 text-xs text-subtle">Reply TURNKEY</p>
            </Card>
          </div>
          <Card>
            <CardTitle>Live this week — ignore the rest</CardTitle>
            <ol className="mt-3 grid gap-2 text-sm text-muted">
              <li>1. 210 number on OpenPhone. Desk answers.</li>
              <li>2. Outscraper: 10 real Comal septic phones. Text Dedicated. If they say they're slammed, send Turnkey.</li>
              <li>3. One page live with that number. $50/day ads after the first YES — not before.</li>
            </ol>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
