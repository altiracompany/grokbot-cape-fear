import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deskSessionOpen, hasDeskPin, setDeskPin, unlockDesk } from "@/lib/guard";

export function DeskLock({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [needsPin, setNeedsPin] = useState(true);
  const [locked, setLocked] = useState(true);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setNeedsPin(!hasDeskPin());
    setLocked(!deskSessionOpen());
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="py-20 text-center text-sm text-muted">Guard checking…</p>;
  }

  if (needsPin) {
    return (
      <Gate
        title="Set the desk PIN"
        copy="Hunt, queue, and Cove numbers sit behind this. 6+ digits. Stays on this device."
        pin={pin}
        error={error}
        onPin={setPin}
        action="Set PIN"
        onSubmit={async () => {
          try {
            await setDeskPin(pin);
            setNeedsPin(false);
            setLocked(false);
            setError("");
          } catch (e) {
            setError(e instanceof Error ? e.message : "PIN failed.");
          }
        }}
      />
    );
  }

  if (locked) {
    return (
      <Gate
        title="Desk locked"
        copy="Guard agent. Enter the PIN."
        pin={pin}
        error={error}
        onPin={setPin}
        action="Unlock"
        onSubmit={async () => {
          const ok = await unlockDesk(pin);
          if (!ok) {
            setError("Wrong PIN.");
            return;
          }
          setLocked(false);
          setError("");
        }}
      />
    );
  }

  return <>{children}</>;
}

function Gate({
  title,
  copy,
  pin,
  error,
  onPin,
  action,
  onSubmit,
}: {
  title: string;
  copy: string;
  pin: string;
  error: string;
  onPin: (v: string) => void;
  action: string;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center gap-4">
      <p className="font-mono text-xs tracking-[0.2em] text-subtle uppercase">Guard</p>
      <h1 className="font-display text-3xl font-medium tracking-tight">{title}</h1>
      <p className="text-sm leading-relaxed text-muted">{copy}</p>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void onSubmit();
        }}
      >
        <Label htmlFor="pin">PIN</Label>
        <Input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          value={pin}
          onChange={(e) => onPin(e.target.value)}
        />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="h-12">
          {action}
        </Button>
      </form>
    </div>
  );
}
