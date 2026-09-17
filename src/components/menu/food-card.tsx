import { Link } from "@tanstack/react-router";
import { Box, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DietaryDot } from "@/components/menu/dietary-dot";
import { has3dModel, type MenuItem } from "@/lib/menuar/types";
import { cn, formatMoney } from "@/lib/utils";

export function FoodCard({
  item,
  slug,
  currency,
}: {
  item: MenuItem;
  slug: string;
  currency: string;
  onAdd?: (item: MenuItem) => void;
}) {
  const ar = has3dModel(item);
  return (
    <article className="grid grid-cols-[88px_1fr] gap-3 rounded-3xl bg-surface p-2.5 shadow-card sm:grid-cols-[104px_1fr]">
      <Link
        to="/menu/$slug/$itemSlug"
        params={{ slug, itemSlug: item.slug }}
        className="relative overflow-hidden rounded-2xl"
      >
        <img
          src={item.imageUrl ?? "/food/classic-burger.jpg"}
          alt={item.name}
          className="aspect-square h-full w-full object-cover"
          loading="lazy"
        />
      </Link>
      <div className="flex min-w-0 flex-col py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[17px] leading-tight text-fg">
            <Link to="/menu/$slug/$itemSlug" params={{ slug, itemSlug: item.slug }}>
              {item.name}
            </Link>
          </h3>
          <DietaryDot dietary={item.dietary} className="mt-1 shrink-0" />
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {item.isRecommended ? <Badge tone="accent">Recommended</Badge> : null}
          {ar ? <Badge>3D</Badge> : null}
          {!item.isAvailable ? <Badge tone="muted">Unavailable</Badge> : null}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <p className="text-sm font-semibold tabular-nums text-accent">
            {formatMoney(item.price, currency)}
          </p>
          <div className="flex gap-1.5">
            <Button asChild size="sm" variant="secondary" className="px-3">
              <Link to="/menu/$slug/$itemSlug" params={{ slug, itemSlug: item.slug }}>
                Details
              </Link>
            </Button>
            {ar ? (
              <Button asChild size="sm" className="px-3">
                <Link to="/ar/$slug/$itemSlug" params={{ slug, itemSlug: item.slug }}>
                  <Scan className="size-3.5" />
                  AR
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export function FoodCardWide({
  item,
  slug,
  currency,
}: {
  item: MenuItem;
  slug: string;
  currency: string;
}) {
  return (
    <Link
      to="/menu/$slug/$itemSlug"
      params={{ slug, itemSlug: item.slug }}
      className={cn("block overflow-hidden rounded-3xl bg-surface shadow-card")}
    >
      <div className="relative aspect-[4/3]">
        <img src={item.imageUrl ?? ""} alt="" className="size-full object-cover" loading="lazy" />
        {has3dModel(item) ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-bg/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
            <Box className="size-3" /> 3D
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-lg">{item.name}</h3>
          <DietaryDot dietary={item.dietary} />
        </div>
        <p className="mt-1 text-sm font-semibold tabular-nums text-accent">
          {formatMoney(item.price, currency)}
        </p>
      </div>
    </Link>
  );
}
