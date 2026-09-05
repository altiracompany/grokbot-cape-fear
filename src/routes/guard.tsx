import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { allClear, lockDesk, runGuardAgent, runQaAgent, type Check } from "@/lib/guard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guard")({ component: GuardPage });

function GuardPage() {
  const guard = useMemo(() => runGuardAgent(), []);
  const qa = useMemo(() => runQaAgent(), []);
  const ok = allClear([...guard, ...qa]);

  return (
    <main className="flex flex-col gap-8">
      <header>
        <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Checks and balances</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight">Guard + QA</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Two agents. Guard blocks junk and open desks. QA blocks bad copy and skipped niches. Fail closed.
        </p>
        <p className={cn("mt-4 font-mono text-sm", ok ? "text-go" : "text-danger")}>
          {ok ? "CLEAR" : "HOLD — fix red before you send."}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <AgentCard name="Guard" job="Virus-adjacent: XSS, spam, open hunt, injection." checks={guard} />
        <AgentCard name="QA" job="Voice, price, public vs desk, skip list." checks={qa} />
      </section>

      <Button
        type="button"
        variant="secondary"
        className="w-fit"
        onClick={() => {
          lockDesk();
          window.location.reload();
        }}
      >
        Lock desk this session
      </Button>
    </main>
  );
}

function AgentCard({ name, job, checks }: { name: string; job: string; checks: Check[] }) {
  return (
    <Card className="rounded-xl p-5">
      <p className="font-mono text-xs tracking-wider text-subtle uppercase">{name} agent</p>
      <CardTitle className="mt-1">{job}</CardTitle>
      <ul className="mt-4 grid gap-3">
        {checks.map((c) => (
          <li key={c.id} className="flex gap-3 text-sm">
            <span className={cn("font-mono text-xs", c.ok ? "text-go" : "text-danger")}>{c.ok ? "OK" : "NO"}</span>
            <span className="text-muted">{c.detail}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
