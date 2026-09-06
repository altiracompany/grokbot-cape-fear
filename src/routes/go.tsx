import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicFrame } from "@/components/public-frame";
import {
  checkoutHref,
  dueToday,
  GO_COUNTIES,
  GO_NICHES,
  makeLiveCode,
  offerById,
  OFFERS,
  stashPending,
  type OfferId,
} from "@/lib/spinup";
import { EDDM_HOMES, EDDM_PRICE } from "@/lib/pricing";
import { countyLabel } from "@/lib/seats";
import { nicheById } from "@/lib/niches";
import { useAgency } from "@/lib/store";
import { cn, money } from "@/lib/utils";
import type { County } from "@/lib/types";

export const Route = createFileRoute("/go")({ component: GoPage });

function GoPage() {
  const navigate = useNavigate();
  const buyers = useAgency((s) => s.buyers);
  const spinUp = useAgency((s) => s.spinUp);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [county, setCounty] = useState<County>("comal");
  const [nicheId, setNicheId] = useState<(typeof GO_NICHES)[number]>("septic");
  const [offer, setOffer] = useState<OfferId>("dedicated");
  const [addEddm, setAddEddm] = useState(false);
  const [busy, setBusy] = useState(false);

  const taken = useMemo(
    () =>
      buyers.some(
        (b) =>
          b.nicheId === nicheId &&
          b.county === county &&
          (b.hunt === "trial" || b.hunt === "paying") &&
          b.status !== "paused",
      ),
    [buyers, nicheId, county],
  );

  const picked = offerById(offer);
  const niche = nicheById(nicheId);
  const eddmOn = offer === "eddm" || addEddm;
  const today = dueToday(offer, addEddm);

  function start() {
    const code = makeLiveCode();
    const id = spinUp({
      name,
      company,
      phone,
      email,
      county,
      nicheId,
      offer,
      code,
      paid: false,
      eddm: eddmOn,
    });
    if (!id) {
      toast.error("That county is taken. Pick another.");
      return null;
    }
    stashPending({ code, name, company, phone, email, county, nicheId, offer, eddm: eddmOn });
    return code;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 10) {
      toast.error("Name and a real mobile.");
      return;
    }
    if (taken) {
      toast.error(`${countyLabel(county)} ${niche.name} is already with a company.`);
      return;
    }
    setBusy(true);
    const payUrl = checkoutHref(offer, "pending", email, addEddm);
    const code = start();
    if (!code) {
      setBusy(false);
      return;
    }
    if (payUrl) {
      const href = checkoutHref(offer, code, email, addEddm);
      window.location.href = href;
      return;
    }
    void navigate({ to: "/live/$code", params: { code } });
  }

  return (
    <PublicFrame>
      <Toaster theme="dark" position="bottom-right" />
      <section className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Start now</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">$500 a week. Two free. Mail this week if you want.</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
            One company per county. Cove answers. We screen. Need jobs this week? Add EDDM — {money(EDDM_PRICE)} puts
            your ad in {EDDM_HOMES.toLocaleString()} homes on the route.
          </p>
          <form onSubmit={submit} className="mt-10 grid gap-4">
            <Field label="Your name" htmlFor="n">
              <Input id="n" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Company" htmlFor="c">
              <Input id="c" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
            </Field>
            <Field label="Mobile" htmlFor="p">
              <Input id="p" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
            </Field>
            <Field label="Email" htmlFor="e">
              <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="County" htmlFor="co">
                <select
                  id="co"
                  value={county}
                  onChange={(e) => setCounty(e.target.value as County)}
                  className="h-11 w-full rounded-md border border-input bg-elevated px-3 text-sm"
                >
                  {GO_COUNTIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Work" htmlFor="ni">
                <select
                  id="ni"
                  value={nicheId}
                  onChange={(e) => setNicheId(e.target.value as (typeof GO_NICHES)[number])}
                  className="h-11 w-full rounded-md border border-input bg-elevated px-3 text-sm"
                >
                  {GO_NICHES.map((id) => (
                    <option key={id} value={id}>
                      {nicheById(id).name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {taken ? (
              <p className="text-sm text-skip">Taken. One company already on {countyLabel(county)} {niche.name}.</p>
            ) : (
              <p className="text-sm text-go">{countyLabel(county)} {niche.name} is open.</p>
            )}
            {offer !== "eddm" ? (
              <label className="flex min-h-11 items-start gap-3 text-sm leading-relaxed">
                <input
                  type="checkbox"
                  className="mt-1 size-4"
                  checked={addEddm}
                  onChange={(e) => setAddEddm(e.target.checked)}
                />
                <span>
                  Add EDDM — {money(EDDM_PRICE)} · {EDDM_HOMES.toLocaleString()} homes on your routes. Mail drops while
                  the line ramps.
                </span>
              </label>
            ) : null}
            <Button type="submit" className="h-12" disabled={busy || taken}>
              {checkoutHref(offer, "x", "", addEddm)
                ? `Pay ${money(today)} · start`
                : offer === "eddm"
                  ? `Start EDDM · ${money(EDDM_PRICE)} · ${EDDM_HOMES.toLocaleString()} homes`
                  : addEddm
                    ? `Start · 2 free + EDDM ${money(EDDM_PRICE)}`
                    : `Start · 2 free then ${money(picked.weekly)}/wk`}
            </Button>
            <p className="text-xs text-subtle">
              If a card link is live, you pay now and the county locks. If not, two free jobs start now — we text the
              pay link from Cove before job 3.
            </p>
          </form>
        </div>
        <div className="grid gap-3 content-start">
          {OFFERS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOffer(o.id);
                if (o.id === "eddm") setAddEddm(false);
              }}
              className={cn(
                "rounded-2xl p-6 text-left shadow-[var(--shadow-border)]",
                offer === o.id ? "bg-elevated" : "bg-surface",
              )}
            >
              <p className="font-mono text-xs tracking-wider text-subtle uppercase">{o.label}</p>
              <p className="mt-2 font-display text-3xl font-medium tracking-tight">
                {o.id === "turnkey"
                  ? `${money(o.dueToday)} today`
                  : o.id === "eddm"
                    ? `${money(o.dueToday)} · 5k homes`
                    : `${money(o.weekly)}/wk`}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{o.blurb}</p>
            </button>
          ))}
          <Card className="rounded-2xl p-6">
            <p className="text-sm leading-relaxed text-muted">
              Typical {niche.name.toLowerCase()} in {countyLabel(county)}: {niche.jobRange}. One closed job covers the
              week.
            </p>
          </Card>
        </div>
      </section>
    </PublicFrame>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
