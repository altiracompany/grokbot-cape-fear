import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicFrame } from "@/components/public-frame";
import { BRAND, BRAND_PUBLIC, PUBLIC_AREAS, PUBLIC_URL } from "@/lib/brand";
import { EDDM_HOMES, EDDM_PRICE, TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "@/lib/pricing";
import { HOW_STEPS } from "@/lib/how";
import { money } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: PublicHome });

const STEPS = HOW_STEPS;

const NICHES = [
  "Fence",
  "Foundation",
  "Gutters",
  "Windows",
  "Pressure wash",
  "Landscaper",
  "Mobile detail",
  "Quinceañera",
  "Septic",
];

const FAQS = [
  {
    q: "Who is Freedom Project Leads?",
    a: "We get jobs for one company in your county. A robot asks the homeowner the boring questions — it says it's a robot — then we text you the name and street. We do not sell your name to four other trucks.",
  },
  {
    q: "Is this Angi or Thumbtack?",
    a: "No. Those sell the same name to 3–8 trucks. You pay whether you win. We send the job to you.",
  },
  {
    q: "Is a person on the phone?",
    a: "No. A robot. First line: I'm not a person. County, street, what's wrong, can they be there. Recording goes to your phone, your email, or your people — you pick. Shoppers get cut.",
  },
  {
    q: "Do you work on my website?",
    a: "No. We make the phone ring. You go do the work. If you're slammed, pick We run it and don't touch ads.",
  },
  {
    q: "What does it cost?",
    a: `${money(WEEKLY_SEAT)} a week after two free jobs. Need work this week? Mail to ${EDDM_HOMES.toLocaleString()} homes is ${money(EDDM_PRICE)}. We run it is ${money(TURNKEY_SETUP)} plus ${money(TURNKEY_WEEKLY)}/wk if you don't want to lift a finger.`,
  },
  {
    q: "Where do you work?",
    a: PUBLIC_AREAS + " Also New Hanover, Pender, Brunswick.",
  },
];

function PublicHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND,
    description: BRAND_PUBLIC,
    areaServed: ["Bexar County", "Comal County", "Guadalupe County", "New Hanover County"],
    url: PUBLIC_URL,
    priceRange: "$$",
  };

  return (
    <PublicFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="flex flex-col gap-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <p className="font-mono text-xs tracking-[0.22em] text-muted uppercase">Alamo · Cape Fear</p>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl">
          Jobs for the truck that's already busy.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted">{BRAND_PUBLIC}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 min-w-44 px-6">
            <Link to="/go">
              Get two jobs free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-12 min-w-44 px-6">
            <a href="#how">How it works</a>
          </Button>
        </div>
        <p className="font-mono text-xs text-subtle">We text from 210 and 830. One company per county.</p>
      </section>

      <section className="grid gap-3 border-t border-border py-12 md:grid-cols-3">
        {[
          { k: "One", v: "company in your county. Not five trucks on the same name." },
          { k: "Two", v: "jobs free so you see it before you pay." },
          { k: "Local", v: "We text from 210 and 830." },
        ].map((item) => (
          <Card key={item.k} className="rounded-2xl p-6">
            <p className="font-mono text-xs tracking-wider text-subtle uppercase">{item.k}</p>
            <p className="mt-3 text-lg leading-snug">{item.v}</p>
          </Card>
        ))}
      </section>

      <section id="how" className="scroll-mt-24 border-t border-border py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">How it works</p>
        <h2 className="mt-2 max-w-lg font-display text-3xl font-medium tracking-tight">You don't babysit ads. You take the job.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="font-mono text-sm text-subtle">{s.n}</span>
              <div>
                <h3 className="text-lg font-medium">{s.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="offers" className="scroll-mt-24 grid gap-4 border-t border-border py-16 md:grid-cols-2">
        <Card className="rounded-2xl p-8">
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">The offer</p>
          <p className="mt-3 font-display text-4xl font-medium tracking-tight">{money(WEEKLY_SEAT)}/wk</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Two jobs free. Then $500 a week. One company. We ask. You go.
          </p>
        </Card>
        <Card className="rounded-2xl p-8">
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">Start this week</p>
          <p className="mt-3 font-display text-4xl font-medium tracking-tight">{money(EDDM_PRICE)}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your flyer to {EDDM_HOMES.toLocaleString()} homes. $300. Mail while the phone ramps.
          </p>
        </Card>
      </section>

      <section className="border-t border-border py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Coverage</p>
        <h2 className="mt-2 font-display text-3xl font-medium tracking-tight">Alamo first.</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{PUBLIC_AREAS}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <li key={n} className="rounded-full bg-elevated px-4 py-2 text-sm shadow-[var(--shadow-border)]">
              {n}
            </li>
          ))}
        </ul>
      </section>

      <section id="faq" className="scroll-mt-24 grid gap-6 border-t border-border py-16">
        <h2 className="font-display text-3xl font-medium tracking-tight">If you're vetting us.</h2>
        {FAQS.map((f) => (
          <div key={f.q} className="max-w-2xl">
            <h3 className="text-lg font-medium">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 border-t border-border py-16">
        <h2 className="font-display text-3xl font-medium tracking-tight">Two free jobs. Then you decide.</h2>
        <div>
          <Button asChild className="h-12 min-w-44 px-6">
            <Link to="/go">
              Talk to the desk
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicFrame>
  );
}
