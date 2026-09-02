import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyBlock } from "@/components/copy-block";
import { NewBuyerDialog } from "@/components/new-buyer-dialog";
import { BuyerBadge, FreeMeter } from "@/components/status";
import { buyerIntro } from "@/lib/copy";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { money } from "@/lib/utils";
import type { Buyer } from "@/lib/types";

export const Route = createFileRoute("/buyers")({ component: BuyersPage });

function BuyersPage() {
  const markets = useAgency((s) => s.markets);
  const buyers = useAgency((s) => s.buyers);
  const setBuyerStatus = useAgency((s) => s.setBuyerStatus);

  const spend = buyers.reduce((s, b) => s + b.spendThisMonth, 0);
  const freeLeft = buyers.filter((b) => b.status === "active").reduce((s, b) => s + b.freeRemaining, 0);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Cape Fear owners</p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Owners</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Local operators. Two screened handoffs free, then PPL. They never own the ranker or the tape.
          </p>
        </div>
        <NewBuyerDialog />
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Card className="rounded-xl p-4">
          <p className="text-xs tracking-wider text-muted uppercase">Owners</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{buyers.length}</p>
        </Card>
        <Card className="rounded-xl p-4">
          <p className="text-xs tracking-wider text-muted uppercase">Free left</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{freeLeft}</p>
        </Card>
        <Card className="rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="text-xs tracking-wider text-muted uppercase">Spend MTD</p>
          <p className="mt-2 font-mono text-2xl tabular-nums">{money(spend)}</p>
        </Card>
      </div>

      <div className="grid gap-2">
        {buyers.map((buyer) => (
          <BuyerRow
            key={buyer.id}
            buyer={buyer}
            onStatus={(s) => {
              setBuyerStatus(buyer.id, s);
              toast.success(`${buyer.company} → ${s}`);
            }}
          />
        ))}
      </div>
    </main>
  );

  function BuyerRow({
    buyer,
    onStatus,
  }: {
    buyer: Buyer;
    onStatus: (s: Buyer["status"]) => void;
  }) {
    const market = markets.find((m) => m.id === buyer.marketIds[0]);
    const niche = nicheById(buyer.nicheId);
    const capPct = buyer.monthlyCap > 0 ? buyer.soldThisMonth / buyer.monthlyCap : 0;
    return (
      <article className="grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{buyer.company}</p>
              <BuyerBadge status={buyer.status} />
              <FreeMeter used={buyer.freeUsed} remaining={buyer.freeRemaining} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {buyer.name} · {buyer.phone}
            </p>
            <p className="mt-1 text-xs text-subtle">
              {market ? (
                <Link to="/markets/$marketId" params={{ marketId: market.id }} className="hover:text-fg">
                  {niche.name} · {market.city}
                </Link>
              ) : (
                niche.name
              )}
              {buyer.notes ? ` · ${buyer.notes}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm tabular-nums">
              {buyer.freeRemaining > 0 ? "2 free, then " : ""}
              {money(buyer.pplRate)}
            </span>
            <span className="text-sm text-muted">
              {buyer.soldThisMonth}/{buyer.monthlyCap} · {money(buyer.spendThisMonth)}
            </span>
            {buyer.status === "active" ? (
              <Button type="button" size="sm" variant="secondary" onClick={() => onStatus("paused")}>
                Pause
              </Button>
            ) : (
              <Button type="button" size="sm" onClick={() => onStatus("active")}>
                Activate
              </Button>
            )}
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-accent"
            style={{ width: `${Math.min(100, Math.max(4, capPct * 100))}%` }}
          />
        </div>
        {market ? (
          <CopyBlock
            label="Text to send"
            text={buyerIntro(buyer, market, niche)}
            grokKind="outreach"
            grokBrief={`SMS to ${buyer.name} at ${buyer.company} for ${market.city} ${niche.name} PPL at ${buyer.pplRate}, cap ${buyer.monthlyCap}. Auction parked.`}
          />
        ) : null}
      </article>
    );
  }
}
