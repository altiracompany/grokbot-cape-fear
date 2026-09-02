import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { CopyBlock } from "@/components/copy-block";
import { NewBuyerDialog } from "@/components/new-buyer-dialog";
import { HandoffDialog } from "@/components/handoff-dialog";
import { MarketField } from "@/components/field-view";
import { BuyerBadge, DecisionBadge, FreeBadge, LeadBadge, ScreenBadge, StageBadge, WedgeBadge } from "@/components/status";
import { eligibleBuyers } from "@/lib/actions";
import { countyNames } from "@/lib/territory";
import { buildBlueprint } from "@/lib/blueprint";
import { outreachEmail, outreachSms, pplPitch, reportCopy, scorecardWhy } from "@/lib/copy";
import { fieldFor } from "@/lib/field";
import { nicheById } from "@/lib/niches";
import { exclusiveReserve, pplMath } from "@/lib/pricing";
import { SCORE_FIELDS, decide, decisionCopy, weightedScore } from "@/lib/scoring";
import { useAgency } from "@/lib/store";
import { ageLabel, cn, money, pct } from "@/lib/utils";
import type { Scorecard, Stage } from "@/lib/types";

export const Route = createFileRoute("/markets/$marketId")({
  component: MarketDesk,
});

const TABS = ["Overview", "Field", "Score", "Leads", "Buyers", "Site", "Pitch", "Report"] as const;
const STAGES: Stage[] = ["score", "build", "ranking", "live"];

function MarketDesk() {
  const { marketId } = Route.useParams();
  const market = useAgency((s) => s.markets.find((m) => m.id === marketId));
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  if (!market) {
    return (
      <main className="grid gap-3">
        <h1 className="text-2xl font-medium">Not in inventory</h1>
        <Link to="/markets" className="text-sm text-muted hover:text-fg">
          Back to markets
        </Link>
      </main>
    );
  }

  const niche = nicheById(market.nicheId);
  const decision = decide(market.score);
  const field = fieldFor(niche.id);

  return (
    <main className="flex flex-col gap-6" key={market.id}>
      <Link to="/markets" className="inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <ArrowLeft className="size-4" /> Markets
      </Link>
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">{market.domain}</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">
            {niche.name} · {market.city}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {countyNames(market.counties).join(" · ")} · {market.trackingNumber}
          </p>
          <p className="mt-1 text-xs text-subtle">{market.neighborhoods.join(" · ") || "Cape Fear"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <WedgeBadge wedge={field.wedge} />
          <DecisionBadge decision={decision} />
          <StageBadge stage={market.stage} />
        </div>
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

      {tab === "Overview" ? <Overview /> : null}
      {tab === "Field" ? <FieldTab /> : null}
      {tab === "Score" ? <ScoreTab /> : null}
      {tab === "Leads" ? <LeadsTab /> : null}
      {tab === "Buyers" ? <BuyersTab /> : null}
      {tab === "Site" ? <SiteTab /> : null}
      {tab === "Pitch" ? <PitchTab /> : null}
      {tab === "Report" ? <ReportTab /> : null}
    </main>
  );
}

function useMarket() {
  const { marketId } = Route.useParams();
  const market = useAgency((s) => s.markets.find((m) => m.id === marketId));
  if (!market) throw new Error("missing market");
  return { market, niche: nicheById(market.nicheId) };
}

function Overview() {
  const { market, niche } = useMarket();
  const setStage = useAgency((s) => s.setStage);
  const math = pplMath(niche);
  const parked = exclusiveReserve(niche);
  const kpis = [
    { label: "PPL", value: money(market.pplPrice) },
    { label: "Sold MTD", value: String(market.soldThisMonth) },
    { label: "Revenue", value: money(market.revenueThisMonth) },
    { label: "Leads in", value: String(market.leadsThisMonth) },
    { label: "Job model", value: money(niche.jobValue) },
  ];

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} className="rounded-xl p-4">
            <p className="text-xs tracking-wider text-muted uppercase">{k.label}</p>
            <p className="mt-2 font-mono text-xl tabular-nums">{k.value}</p>
          </Card>
        ))}
      </div>
      <Card>
        <CardTitle>Stage</CardTitle>
        <p className="mt-1 text-sm text-muted">Score → build our site → rank → our desk answers. We own the tape. Auction is parked.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={market.stage === s ? "default" : "secondary"}
              onClick={() => {
                setStage(market.id, s);
                toast.success(`Stage → ${s}`);
              }}
            >
              {s}
            </Button>
          ))}
        </div>
      </Card>
      <Card>
        <CardTitle>Why we screen</CardTitle>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Expected value of a screened lead is {money(math.expectedValue)} ({money(niche.jobValue)} × {pct(niche.closeRate)} close).
          First 2 handoffs per owner are free. Then {money(market.pplPrice)}. Exclusive reserve {money(parked)}/mo stays parked.
        </p>
        <p className="mt-2 text-sm text-muted">{scorecardWhy(market, niche)}</p>
      </Card>
    </div>
  );
}

function FieldTab() {
  const { market } = useMarket();
  return <MarketField market={market} />;
}

function ScoreTab() {
  const { market, niche } = useMarket();
  const setScore = useAgency((s) => s.setScore);
  const [draft, setDraft] = useState<Scorecard>(
    market.score ?? { demand: 5, jobValue: 5, weakCompetitors: 5, willingness: 5, ease: 5, notes: "" },
  );
  const w = weightedScore(draft);
  const d = decide(draft);

  function save(e: FormEvent) {
    e.preventDefault();
    setScore(market.id, draft);
    toast.success(`Scored ${w.toFixed(1)} · ${d}`);
  }

  return (
    <form onSubmit={save} className="grid gap-5">
      <p className="text-sm text-muted">
        {d.toUpperCase()} · {w.toFixed(1)}/10. {decisionCopy(d)}
      </p>
      {SCORE_FIELDS.map((f) => (
        <div key={f.key} className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <Label>{f.label}</Label>
            <span className="font-mono text-sm tabular-nums">{draft[f.key]}</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[draft[f.key]]}
            onValueChange={([v]) => setDraft({ ...draft, [f.key]: v ?? 5 })}
          />
          <p className="text-xs text-subtle">{f.hint}</p>
        </div>
      ))}
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          placeholder={`Why ${niche.name} in ${market.city} prints or dies.`}
        />
      </div>
      <Button type="submit">Save score</Button>
    </form>
  );
}

function LeadsTab() {
  const { market } = useMarket();
  const leads = useAgency((s) => s.leads.filter((l) => l.marketId === market.id));
  const simulateInbound = useAgency((s) => s.simulateInbound);

  return (
    <div className="grid gap-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            simulateInbound(market.id);
            toast.success("Inbound on this site.");
          }}
        >
          Capture inbound
        </Button>
      </div>
      {leads.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No leads yet. Rank, then capture.</p>
        </Card>
      ) : (
        leads.map((lead) => (
          <div key={lead.id} className="flex flex-col gap-2 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{lead.name}</p>
                <LeadBadge status={lead.status} />
                <ScreenBadge screen={lead.screen} />
                <span className="font-mono text-xs text-muted" suppressHydrationWarning>
                  {ageLabel(lead.at)}
                </span>
              </div>
              <p className="text-sm text-muted">
                {lead.phone} · {lead.service} · {lead.neighborhood}
              </p>
            </div>
            {lead.status === "new" ? (
              <div className="flex gap-2">
                {lead.screen === "hot" || lead.screen === "warm" ? <HandoffDialog lead={lead} /> : null}
                <Button asChild size="sm" variant="secondary">
                  <Link to="/queue/$leadId" params={{ leadId: lead.id }}>
                    Screen
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="font-mono text-sm tabular-nums">{lead.soldPrice ? money(lead.soldPrice) : "—"}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function BuyersTab() {
  const { market } = useMarket();
  const buyers = useAgency((s) => s.buyers.filter((b) => b.marketIds.includes(market.id)));
  const setBuyerStatus = useAgency((s) => s.setBuyerStatus);
  const open = eligibleBuyers(buyers, market.id);

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{open.length} can take a lead right now.</p>
        <NewBuyerDialog marketId={market.id} />
      </div>
      {buyers.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No owners. A hot lead with no truck dies on the line.</p>
        </Card>
      ) : (
        buyers.map((b) => (
          <div key={b.id} className="flex flex-col gap-2 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{b.company}</p>
                <BuyerBadge status={b.status} />
                <FreeBadge remaining={b.freeRemaining} />
              </div>
              <p className="text-sm text-muted">
                {b.name} · {money(b.pplRate)} · {b.soldThisMonth}/{b.monthlyCap}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => setBuyerStatus(b.id, b.status === "active" ? "paused" : "active")}
            >
              {b.status === "active" ? "Pause" : "Activate"}
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

function SiteTab() {
  const { market, niche } = useMarket();
  const bp = buildBlueprint(market, niche);
  return (
    <div className="grid gap-4">
      <Card>
        <CardTitle>GBP + conversion</CardTitle>
        <p className="mt-2 text-sm text-muted">Primary: {bp.gbpPrimary}</p>
        <p className="mt-1 text-sm text-muted">Hours: {bp.hours}</p>
        <ul className="mt-3 grid gap-1 text-sm text-muted">
          {bp.conversion.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Card>
      <div className="grid gap-2">
        {bp.pages.map((p) => (
          <Card key={p.path} className="rounded-xl p-4">
            <p className="text-sm font-medium">
              {p.name} <span className="font-mono text-xs text-subtle">{p.path}</span>
            </p>
            <p className="mt-1 text-sm text-muted">{p.lead}</p>
          </Card>
        ))}
      </div>
      <CopyBlock
        label="AEO questions"
        text={bp.questions.join("\n")}
        grokKind="blueprint"
        grokBrief={`FAQ questions for ${market.city} ${niche.name}. Spoken, city-specific.`}
      />
    </div>
  );
}

function PitchTab() {
  const { market, niche } = useMarket();
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">
        Kill-shot vs Angi. First 2 free. Auction is parked. Don't pitch WordPress.
      </p>
      <CopyBlock label="SMS" text={outreachSms(market, niche)} grokKind="outreach" grokBrief={`SMS PPL pitch, ${market.city} ${niche.name}, ${money(market.pplPrice)}.`} />
      <CopyBlock label="Email" text={outreachEmail(market, niche)} grokKind="outreach" grokBrief={`Email PPL pitch, ${market.city} ${niche.name}, ${money(market.pplPrice)}. Auction parked.`} />
      <CopyBlock label="One-pager" text={pplPitch(market, niche)} grokKind="offer" grokBrief={`PPL one-pager for ${market.city} ${niche.name} at ${money(market.pplPrice)}. We keep the site.`} />
    </div>
  );
}

function ReportTab() {
  const { market, niche } = useMarket();
  return (
    <CopyBlock
      label="Monthly"
      text={reportCopy(market, niche)}
      grokKind="report"
      grokBrief={`Monthly report, ${market.city} ${niche.name}, ${market.soldThisMonth} sold, ${money(market.revenueThisMonth)} revenue, auction parked.`}
    />
  );
}
