import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicFrame } from "@/components/public-frame";
import { Toaster } from "sonner";

export const Route = createFileRoute("/apply")({ component: ApplyPage });

const COUNTIES = [
  { id: "bexar", label: "Bexar" },
  { id: "comal", label: "Comal" },
  { id: "guadalupe", label: "Guadalupe" },
  { id: "new-hanover", label: "New Hanover" },
  { id: "pender", label: "Pender" },
  { id: "brunswick", label: "Brunswick" },
];

const NICHES = ["Septic", "Generator", "Well pump", "Dryer vent", "Pool", "Dock / lift", "Mosquito", "Tree", "Other"];

function ApplyPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("comal");
  const [niche, setNiche] = useState("Septic");
  const [busy, setBusy] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone.");
      return;
    }
    const offer = busy ? "TURNKEY" : "DEDICATED";
    const body = encodeURIComponent(
      `Name: ${name}\nCompany: ${company || "—"}\nPhone: ${phone}\nCounty: ${county}\nNiche: ${niche}\nOffer: ${offer}`,
    );
    window.location.href = `mailto:desk@freedomprojectleads.com?subject=${encodeURIComponent(`${offer} · ${county} ${niche}`)}&body=${body}`;
    toast.success("Opening mail. If nothing opens, text the desk from the number we used.");
  }

  return (
    <PublicFrame>
      <Toaster theme="dark" position="bottom-right" />
      <section className="max-w-lg py-12 md:py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Desk</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Two free jobs.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Tell us the county and the work. We'll text from a 210 or 830. Dedicated lead gen — one company, not a mill.
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
          <Field label="County" htmlFor="co">
            <select
              id="co"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-elevated px-3 text-sm"
            >
              {COUNTIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Work" htmlFor="ni">
            <select
              id="ni"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-elevated px-3 text-sm"
            >
              {NICHES.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Field>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input type="checkbox" checked={busy} onChange={(e) => setBusy(e.target.checked)} className="size-4" />
            I'm slammed. Send Turnkey ($2,500 + $750/wk).
          </label>
          <Button type="submit" className="h-12">
            Send to the desk
          </Button>
        </form>
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
