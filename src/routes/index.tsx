import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicFrame } from "@/components/public-frame";
import { BRAND, BRAND_PUBLIC, PUBLIC_AREAS } from "@/lib/brand";
import { TURNKEY_SETUP, TURNKEY_WEEKLY, WEEKLY_SEAT } from "@/lib/pricing";
import { money } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: PublicHome });

const STEPS = [
  { n: "01", t: "Someone needs the job", d: "Backup. No water. Green pool. They call or tap a local page." },
  { n: "02", t: "We answer and screen", d: "County, address, what's wrong, can you be there. Tape on every call." },
  { n: "03", t: "You get the packet", d: "Name, phone, job, urgency. One company. Not four trucks on the same ping." },
  { n: "04", t: "You roll", d: "That's the whole product. Dedicated lead gen. Pause anytime." },
];

const NICHES = [
  "Septic",
  "Standby generator",
  "Well pump",
  "Dryer vent",
  "Pool service",
  "Dock / lift",
  "Mosquito",
  "Tree / storm",
];

const FAQS = [
  {
    q: "Who is Freedom Project Leads?",
    a: "Your dedicated lead generation company. We screen every conversation and send the job to your truck. One company per county. We do not share you with four other contractors.",
  },
  {
    q: "Is this Angi or Thumbtack?",
    a: "No. Those sell the same name to 3–8 trucks. You pay whether you win. We send one screened job to you.",
  },
  {
    q: "Do you work my website?",
    a: "We run the demand and the desk. You roll. Busy owners pick Turnkey and don't lift a finger. That's the point.",
  },
  {
    q: "What does it cost?",
    a: `Dedicated ${money(WEEKLY_SEAT)} a week after two free jobs. Turnkey is ${money(TURNKEY_SETUP)} to stand up, then ${money(TURNKEY_WEEKLY)} a week — we run ads, the phone, the screen.`,
  },
  {
    q: "Where do you work?",
    a: PUBLIC_AREAS + " Cape Fear (New Hanover, Pender, Brunswick) is live too.",
  },
];

function PublicHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND,
    description: BRAND_PUBLIC,
    areaServed: ["Bexar County", "Comal County", "Guadalupe County", "New Hanover County"],
    url: "https://grokbot-cape-fear.vercel.app/",
    priceRange: "$$",
  };

  return (
    <PublicFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="flex flex-col gap-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <p className="font-mono text-xs tracking-[0.22em] text-muted uppercase">Alamo · Cape Fear</p>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl">
          Dedicated lead gen for the truck that's already busy.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted">{BRAND_PUBLIC}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="h-12 min-w-44 px-6">
            <Link to="/apply">
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
          { k: "One", v: "company in your county. Not a mill dump." },
          { k: "Two", v: "jobs free so you see the desk before you pay." },
          { k: "Local", v: "210 Bexar. 830 Comal and Guadalupe." },
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
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">Dedicated</p>
          <p className="mt-3 font-display text-4xl font-medium tracking-tight">{money(WEEKLY_SEAT)}/wk</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We answer. We screen. Packet to your truck. First two free. For owners already buying leads.
          </p>
        </Card>
        <Card className="rounded-2xl p-8">
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">Turnkey · busy professionals</p>
          <p className="mt-3 font-display text-4xl font-medium tracking-tight">
            {money(TURNKEY_SETUP)} + {money(TURNKEY_WEEKLY)}/wk
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            We run ads, the line, after-hours. You only roll. Checkbook close.
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
            <Link to="/apply">
              Talk to the desk
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </PublicFrame>
  );
}
