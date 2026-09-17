import { cn } from "@/lib/utils";
import type { Dietary } from "@/lib/menuar/types";

export function DietaryDot({ dietary, className }: { dietary: Dietary; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2.5 rounded-[2px] ring-1 ring-fg/20",
        dietary === "nonveg" ? "bg-nonveg" : "bg-veg",
        className,
      )}
      aria-label={dietary === "nonveg" ? "Non-vegetarian" : dietary === "vegan" ? "Vegan" : "Vegetarian"}
    />
  );
}
