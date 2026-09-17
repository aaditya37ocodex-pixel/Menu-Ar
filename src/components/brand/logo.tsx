import { cn } from "@/lib/utils";

export function MenuArMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#090A0F" />
      <ellipse cx="16" cy="21" rx="9" ry="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.5 14.5c0-5 3.2-8.2 7.5-8.2s7.5 3.2 7.5 8.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="14.2" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function MenuArWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-accent", className)}>
      <MenuArMark className="size-8 text-accent" />
      <div className="leading-none">
        <div className="font-display text-lg tracking-tight text-fg">MenuAR</div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          Scan. Explore. Taste.
        </div>
      </div>
    </div>
  );
}
