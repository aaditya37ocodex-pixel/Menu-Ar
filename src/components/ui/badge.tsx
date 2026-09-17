import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: "neutral" | "accent" | "veg" | "nonveg" | "muted" }) {
  const tones = {
    neutral: "border-border text-muted",
    accent: "border-accent/40 text-accent",
    veg: "border-veg/40 text-veg",
    nonveg: "border-nonveg/40 text-nonveg",
    muted: "border-border text-subtle",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
