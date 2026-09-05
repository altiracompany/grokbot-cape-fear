import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicFrame } from "@/components/public-frame";
import { offerById } from "@/lib/spinup";
import { countyLabel } from "@/lib/seats";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { money } from "@/lib/utils";

export const Route = createFileRoute("/live/$code")({ component: LivePage });

function LivePage() {
  const { code } = Route.useParams();
  const paid = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("paid") === "1";
  const buyers = useAgency((s) => s.buyers);
  const leads = useAgency((s) => s.leads);
  const spinUp = useAgency((s) => s.spinUp);
  const hydrated = useAgency((s) => s.hydrated);
  const buyer = buyers.find((b) => b.liveCode === code) ?? null;

  useEffect(() => {
    if (!hydrated || !paid || !buyer) return;
    if (buyer.hunt === "paying") return;
    spinUp({
      name: buyer.name,
      company: buyer.company,
      phone: buyer.phone,
      email: buyer.email,
      county: buyer.county,
      nicheId: buyer.nicheId,
      offer: buyer.offer ?? "dedicated",
      code,
      paid: true,
      eddm: buyer.eddm,
    });
  }, [hydrated, paid, buyer, code, spinUp]);

  if (!hydrated) {
    return (
      <PublicFrame>
        <p className="py-20 text-sm text-muted">Loading your line…</p>
      </PublicFrame>
    );
  }

  if (!buyer) {
    return (
      <PublicFrame>
        <section className="max-w-lg py-16">
          <h1 className="font-display text-3xl font-medium tracking-tight">Line not found.</h1>
          <p className="mt-3 text-sm text-muted">Start again. One company per county.</p>
          <Button asChild className="mt-8 h-12">
            <Link to="/go">Start</Link>
          </Button>
        </section>
      </PublicFrame>
    );
  }

  const niche = nicheById(buyer.nicheId);
  const offer = offerById(buyer.offer ?? "dedicated");
  const jobs = leads.filter((l) => l.soldToBuyerId === buyer.id);
  const inbound = leads.filter(
    (l) => l.marketId === buyer.marketIds[0] && (l.screen === "hot" || l.screen === "warm") && l.status === "new",
  );

  return (
    <PublicFrame>
      <section className="flex flex-col gap-8 py-12 md:py-16">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Your line</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
            {countyLabel(buyer.county)} {niche.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Dedicated lead gen. Cove answers. We screen. Jobs land here and we text {buyer.phone}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-xl p-5">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">Status</p>
            <p className="mt-2 text-xl">{buyer.hunt === "paying" ? "Paid · locked" : "Live · 2 free"}</p>
          </Card>
          <Card className="rounded-xl p-5">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">Free left</p>
            <p className="mt-2 font-mono text-xl tabular-nums">{buyer.freeRemaining}</p>
          </Card>
          <Card className="rounded-xl p-5">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">Then</p>
            <p className="mt-2 font-mono text-xl tabular-nums">
              {offer.weekly ? `${money(offer.weekly)}/wk` : "Mail first"}
            </p>
          </Card>
        </div>

        {buyer.eddm ? (
          <Card className="rounded-xl p-5">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">EDDM</p>
            <p className="mt-2 text-lg">5,000 homes on your routes. Flyer in drop.</p>
            <p className="mt-1 text-sm text-muted">Your name, phone, service. One company on the piece. Cove takes the inbound.</p>
          </Card>
        ) : null}

        <section>
          <h2 className="font-display text-2xl font-medium tracking-tight">Pre-screened jobs</h2>
          <p className="mt-1 text-sm text-muted">Hot or warm only. Name, address, job, urgency. You roll.</p>
          <div className="mt-6 grid gap-3">
            {jobs.length === 0 && inbound.length === 0 ? (
              <Card className="rounded-xl p-6">
                <p className="text-sm leading-relaxed text-muted">
                  Line is live. Cove is on. The next screened {niche.name.toLowerCase()} job in {countyLabel(buyer.county)}{" "}
                  hits this page and your phone. Keep this link.
                </p>
              </Card>
            ) : null}
            {[...inbound, ...jobs].map((l) => (
              <Card key={l.id} className="rounded-xl p-5">
                <p className="text-sm font-medium">
                  {l.name} · {l.neighborhood}
                </p>
                <p className="mt-1 font-mono text-sm">{l.phone}</p>
                <p className="mt-2 text-sm text-muted">
                  {l.service}
                  {l.urgency ? ` · ${l.urgency}` : ""}
                </p>
                {l.address ? <p className="mt-1 text-sm text-muted">{l.address}</p> : null}
              </Card>
            ))}
          </div>
        </section>

        <p className="text-xs text-subtle">
          Bookmark this page. Same link on your phone. One company. Pause anytime — text STOP to the Cove line.
        </p>
      </section>
    </PublicFrame>
  );
}
