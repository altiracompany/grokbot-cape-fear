import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { CapeFearWedgeTable, EngageRules, RivalGrid } from "@/components/field-view";
import { ValueShowcase } from "@/components/value-showcase";
import { useAgency } from "@/lib/store";
import { AD_RULES, OWNER_ADS, SYSTEM } from "@/lib/ads";
import { CMO_DAILY, CMO_DM, CMO_PHASES, CMO_POSTS } from "@/lib/cmo";
import { COMMENT_BANK, ICP_PAGES } from "@/lib/comments";
import { EDDM_HOMES, EDDM_PRICE, EDDM_PRICE_HIGH, TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "@/lib/pricing";
import { cn, money } from "@/lib/utils";

export const Route = createFileRoute("/playbook")({ component: Playbook });

const TABS = ["Field", "Rules", "Value", "Offers", "Comments", "Ads", "Posts"] as const;

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
            $500 a week. Two free. Mail from {money(EDDM_PRICE)}. High zips {money(EDDM_PRICE_HIGH)}. We run it only if they're slammed.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">The $500</p>
              <CardTitle className="mt-1">Jobs</CardTitle>
              <p className="mt-2 font-mono text-2xl tabular-nums">{money(WEEKLY_SEAT)}/wk</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                We answer. We ask. We text the name and street. First 2 free. For owners already buying names.
              </p>
              <p className="mt-3 text-xs text-subtle">Reply YES</p>
            </Card>
            <Card>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">Slammed</p>
              <CardTitle className="mt-1">We run it</CardTitle>
              <p className="mt-2 font-mono text-2xl tabular-nums">
                {money(TURNKEY_SETUP)} + {money(TURNKEY_WEEKLY)}/wk
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                We run ads and the phone. They only go. Same one-company rule.
              </p>
              <p className="mt-3 text-xs text-subtle">Reply RUN IT</p>
            </Card>
            <Card>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">This week</p>
              <CardTitle className="mt-1">Mail</CardTitle>
              <p className="mt-2 font-mono text-2xl tabular-nums">
                {money(EDDM_PRICE)}–{money(EDDM_PRICE_HIGH)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Flyer to {EDDM_HOMES.toLocaleString()} homes. Price is the zip. 78132 / Stone Oak / Wrightsville = high. Seguin / westside = $300.
              </p>
              <p className="mt-3 text-xs text-subtle">Reply MAIL</p>
            </Card>
          </div>
          <Card>
            <CardTitle>5am scrub</CardTitle>
            <ol className="mt-3 grid gap-2 text-sm text-muted">
              <li>1. Screen overnight. Handoff hot.</li>
              <li>2. Collect trials that burned 2 free.</li>
              <li>3. Drop sold EDDM. Text 10. Comment 8 on ICP pages. Mark scrubbed.</li>
            </ol>
          </Card>
        </div>
      ) : null}

      {tab === "Comments" ? (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            8 comments after 5am scrub. No links. No “check my site.” Value first. Pitch only if they ask.
          </p>
          <Card>
            <CardTitle>Pages they actually follow</CardTitle>
            <ul className="mt-3 grid gap-3">
              {ICP_PAGES.map((p) => (
                <li key={p.name} className="text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span className="block text-muted">{p.why} · {p.rule}</span>
                </li>
              ))}
            </ul>
          </Card>
          {COMMENT_BANK.map((c) => (
            <Card key={c.on}>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">{c.on}</p>
              <p className="mt-2 text-sm leading-relaxed">{c.text}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 h-10"
                onClick={() => {
                  void navigator.clipboard.writeText(c.text);
                  toast.success("Copied.");
                }}
              >
                Copy
              </Button>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === "Ads" ? (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            AI bubble is their problem. Jobs are ours. Seven-part agency stacks get sold as a menu. We run a desk.
            Paid ads target owners who already buy leads. Clay finds their real mobile — paste the CSV on /outreach.
          </p>
          <Card>
            <CardTitle>What we actually run</CardTitle>
            <ul className="mt-3 grid gap-3">
              {SYSTEM.map((s) => (
                <li key={s.n} className="text-sm">
                  <span className="font-mono text-xs text-subtle">{s.n}</span>{" "}
                  <span className="font-medium">{s.name}</span>
                  <span className="block text-muted">
                    {s.we}{" "}
                    <span className="text-subtle">
                      {s.in === "skip" ? "Skip." : s.in === "turnkey" ? "Turnkey only." : "In the $500."}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardTitle>Ad rules</CardTitle>
            <ul className="mt-3 grid gap-1 text-sm text-muted">
              {AD_RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Card>
          {OWNER_ADS.map((ad) => (
            <Card key={ad.id}>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">{ad.market}</p>
              <p className="mt-1 text-sm font-medium">{ad.headline}</p>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed">{ad.primary}</pre>
              <p className="mt-2 text-xs text-subtle">CTA: {ad.cta}</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 h-10"
                onClick={() => {
                  void navigator.clipboard.writeText(`${ad.headline}\n\n${ad.primary}\n\n${ad.cta}`);
                  toast.success("Copied.");
                }}
              >
                Copy ad
              </Button>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === "Posts" ? (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            Posts for contractor groups. Value in public. Offer in the DM. Talk like a person, not an agency.
          </p>
          {CMO_PHASES.map((p) => (
            <Card key={p.n}>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">
                Phase {p.n} · {p.name}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{p.we}</p>
              <p className="mt-2 text-xs text-subtle">{p.they}</p>
            </Card>
          ))}
          <Card>
            <CardTitle>Daily (after 5am scrub)</CardTitle>
            <ol className="mt-3 grid gap-2 text-sm text-muted">
              {CMO_DAILY.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
          </Card>
          {CMO_POSTS.map((p) => (
            <Card key={p.hook}>
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">{p.hook}</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{p.body}</pre>
              <Button
                type="button"
                variant="secondary"
                className="mt-3 h-10"
                onClick={() => {
                  void navigator.clipboard.writeText(p.body);
                  toast.success("Copied.");
                }}
              >
                Copy post
              </Button>
            </Card>
          ))}
          <Card>
            <CardTitle>DM after they bite</CardTitle>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">{CMO_DM}</pre>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 h-10"
              onClick={() => {
                void navigator.clipboard.writeText(CMO_DM);
                toast.success("Copied.");
              }}
            >
              Copy DM
            </Button>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
