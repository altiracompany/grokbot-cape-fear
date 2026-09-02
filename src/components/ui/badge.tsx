import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      tone: {
        go: "bg-go/15 text-go",
        maybe: "bg-maybe/15 text-maybe",
        skip: "bg-skip/15 text-skip",
        live: "bg-live/15 text-live",
        muted: "bg-elevated text-muted",
        fg: "bg-accent/10 text-fg",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}

export { Badge, badgeVariants };
