import { Link } from "@tanstack/react-router";
import { Card, CardTitle } from "@/components/ui/card";
import { WedgeBadge } from "@/components/status";
import { CopyBlock } from "@/components/copy-block";
import { ENGAGE, copycats, fieldFor, killShotSms, mills, type Density, type NicheField } from "@/lib/field";
import { nicheById } from "@/lib/niches";
import { CAPE_NICHES } from "@/lib/territory";
import { money } from "@/lib/utils";
import type { Market } from "@/lib/types";

function DensityMark({ value }: { value: Density }) {
  return (
    <span className={value === "thin" ? "text-go" : value === "packed" ? "text-skip" : "text-maybe"}>{value}</span>
  );
}

export function RivalGrid({ camp }: { camp: "mill" | "copycat" }) {
  const rows = camp === "mill" ? mills() : copycats();
  const title = camp === "mill" ? "The mills" : "The copycats";
  const sub =
    camp === "mill"
      ? "Huge share. Shared leads. Generic licensed trades. Do not buy their auction."
      : "Coming into Cape Fear. Same model or cheaper SEO. Beat them on speed and the desk, not adjectives.";
  return (
    <section className="grid gap-3">
      <div>
        <h2 className="text-sm font-medium tracking-wider text-muted uppercase">{title}</h2>
        <p className="mt-1 text-sm text-muted">{sub}</p>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {rows.map((r) => (
          <Card key={r.id} className="rounded-xl p-4">
            <CardTitle>{r.name}</CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.play}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">Leak: {r.leak}</p>
            <p className="mt-2 text-sm leading-relaxed text-fg">{r.ourMove}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function EngageRules() {
  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Rules of engagement</h2>
      <div className="grid gap-2">
        {ENGAGE.map((r, i) => (
          <Card key={r.title} className="rounded-xl p-4">
            <p className="font-mono text-xs text-subtle tabular-nums">{String(i + 1).padStart(2, "0")}</p>
            <CardTitle className="mt-1">{r.title}</CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-muted">{r.rule}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function CapeFearWedgeTable() {
  return (
    <section className="grid gap-3">
      <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Cape Fear field</h2>
      <div className="overflow-x-auto rounded-2xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full text-left text-sm">
          <thead className="text-xs tracking-wider text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Niche</th>
              <th className="px-4 py-3 font-medium">Wedge</th>
              <th className="px-4 py-3 font-medium">Angi</th>
              <th className="px-4 py-3 font-medium">LSA</th>
              <th className="px-4 py-3 font-medium">Copycats</th>
              <th className="px-4 py-3 font-medium">Move</th>
            </tr>
          </thead>
          <tbody>
            {CAPE_NICHES.map((id) => {
              const field = fieldFor(id);
              const niche = nicheById(id);
              return (
                <tr key={id} className="border-t border-border">
                  <td className="px-4 py-3">{niche.name}</td>
                  <td className="px-4 py-3">
                    <WedgeBadge wedge={field.wedge} />
                  </td>
                  <td className="px-4 py-3">
                    <DensityMark value={field.angi} />
                  </td>
                  <td className="px-4 py-3">
                    <DensityMark value={field.lsa} />
                  </td>
                  <td className="px-4 py-3">
                    <DensityMark value={field.rankRent} />
                  </td>
                  <td className="max-w-xs px-4 py-3 text-muted">{field.doThis}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function FieldCard({ field }: { field: NicheField }) {
  const rows: { label: string; value: Density }[] = [
    { label: "Angi", value: field.angi },
    { label: "LSA", value: field.lsa },
    { label: "Thumbtack", value: field.thumbtack },
    { label: "Local SEO", value: field.localSeo },
    { label: "Rank-rent", value: field.rankRent },
  ];
  return (
    <div className="grid gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Field</CardTitle>
          <WedgeBadge wedge={field.wedge} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{field.why}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-xs tracking-wider text-subtle uppercase">{r.label}</dt>
              <dd className="mt-1 text-sm">
                <DensityMark value={r.value} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-fg">Do: {field.doThis}</p>
        <p className="mt-1 text-sm text-muted">Don't: {field.dont}</p>
        <p className="mt-3 font-mono text-sm text-muted">Angi sells this at {field.angiPpl}</p>
      </Card>
    </div>
  );
}

export function MarketField({ market }: { market: Market }) {
  const niche = nicheById(market.nicheId);
  const field = fieldFor(niche.id);
  return (
    <div className="grid gap-4">
      <FieldCard field={field} />
      <Card>
        <CardTitle>Price vs the mill</CardTitle>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          They sell a shared ping at {field.angiPpl}. We sell one screened exclusive for {money(market.pplPrice)} after two
          free. Do not discount to "beat Angi." The screen is the beat.
        </p>
      </Card>
      <CopyBlock
        label="Kill-shot SMS"
        text={killShotSms(market, niche)}
        grokKind="outreach"
        grokBrief={`Kill-shot SMS vs Angi for ${market.city} ${niche.name}. Dedicated lead gen. PPL ${money(market.pplPrice)}. Name the mill. Never say we own.`}
      />
    </div>
  );
}

export function MillsStrip() {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium tracking-wider text-muted uppercase">Don't fight the mill</h2>
        <Link to="/playbook" className="text-sm text-muted hover:text-fg">
          Field playbook
        </Link>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <Card className="rounded-xl p-4">
          <CardTitle>Big boys</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Angi, Thumbtack, LSA. Huge share on plumber, HVAC, electrician. Shared leads. You will lose that auction.
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <CardTitle>Copycats</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Rank-and-rent shops and AI page farms are walking into Cape Fear. First-mover on domain + GBP. Desk they
            can't clone overnight.
          </p>
        </Card>
        <Card className="rounded-xl p-4">
          <CardTitle>Our wedge</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Hyper-specific niches they list but don't rank. Dedicated line. We answer. One screened job to their truck, not four.
          </p>
        </Card>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CAPE_NICHES.map((id) => {
          const field = fieldFor(id);
          const niche = nicheById(id);
          return (
            <Card key={id} className="rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{niche.name}</p>
                <WedgeBadge wedge={field.wedge} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{field.doThis}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
