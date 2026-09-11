import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicFrame } from "@/components/public-frame";
import { offerById } from "@/lib/spinup";
import { handoffDest, HOW_STEPS, sourceLine } from "@/lib/how";
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
      eddmZip: buyer.eddmZip,
      handoffTo: buyer.handoffTo,
      handoffName: buyer.handoffName,
      handoffEmail: buyer.handoffEmail,
      handoffPhone: buyer.handoffPhone,
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
  const dest = handoffDest(buyer);
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
            A robot asks. We text {dest.label}. Phone {dest.phone}. Email {dest.email}.
          </p>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2">
          {HOW_STEPS.map((s) => (
            <li key={s.n} className="rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
              <p className="font-mono text-xs text-subtle">{s.n}</p>
              <p className="mt-1 text-sm font-medium">{s.t}</p>
              <p className="mt-1 text-xs text-muted">{s.d}</p>
            </li>
          ))}
        </ol>

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
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">Mail · {buyer.eddmZip ?? "zip"}</p>
            <p className="mt-2 text-lg">
              {buyer.eddmPrice ? money(buyer.eddmPrice) : "Flyer"} · 5,000 homes. Exclusive to you.
            </p>
            <p className="mt-1 text-sm text-muted">Your name, phone, work. High zip costs more. We answer the call.</p>
          </Card>
        ) : null}

        <section>
          <h2 className="font-display text-2xl font-medium tracking-tight">Jobs</h2>
          <p className="mt-1 text-sm text-muted">Real work only. Name, street, what they need. You go.</p>
          <div className="mt-6 grid gap-3">
            {jobs.length === 0 && inbound.length === 0 ? (
              <Card className="rounded-xl p-6">
                <p className="text-sm leading-relaxed text-muted">
                  You're on. Next {niche.name.toLowerCase()} job in {countyLabel(buyer.county)} hits this page and your phone. Keep this link.
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
                <p className="mt-1 text-xs text-subtle">{sourceLine(l.source)}</p>
                {l.conversation.length ? (
                  <p className="mt-2 text-xs text-muted">
                    AI: {l.conversation.find((t) => t.speaker === "agent")?.text}
                  </p>
                ) : null}
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
