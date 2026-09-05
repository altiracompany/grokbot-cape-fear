import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicFrame } from "@/components/public-frame";
import { readPending } from "@/lib/spinup";
import { useAgency } from "@/lib/store";

export const Route = createFileRoute("/live/")({ component: LiveIndex });

function LiveIndex() {
  const navigate = useNavigate();
  const spinUp = useAgency((s) => s.spinUp);
  const hydrated = useAgency((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    const pending = readPending();
    const paid = new URLSearchParams(window.location.search).get("paid") === "1";
    if (!pending) {
      void navigate({ to: "/go" });
      return;
    }
    spinUp({ ...pending, paid });
    void navigate({ to: "/live/$code", params: { code: pending.code } });
  }, [hydrated, navigate, spinUp]);

  return (
    <PublicFrame>
      <p className="py-20 text-sm text-muted">Opening your line…</p>
    </PublicFrame>
  );
}
