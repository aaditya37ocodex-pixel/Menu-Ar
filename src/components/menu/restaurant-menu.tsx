import { Link } from "@tanstack/react-router";
import {
  Beef,
  CupSoda,
  Flame,
  IceCream,
  Leaf,
  Pizza,
  Search,
  ShoppingBag,
  Soup,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { MenuArWordmark } from "@/components/brand/logo";
import { FoodCard } from "@/components/menu/food-card";
import { CartSheet } from "@/components/menu/cart-sheet";
import { Input } from "@/components/ui/input";
import { cartCount, useCart } from "@/lib/cart-store";
import { trackEvent } from "@/lib/menuar/public";
import type { PublicMenu } from "@/lib/menuar/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Utensils> = {
  sparkles: Sparkles,
  utensils: Utensils,
  pizza: Pizza,
  beef: Beef,
  leaf: Leaf,
  flame: Flame,
  soup: Soup,
  "ice-cream-bowl": IceCream,
  "cup-soda": CupSoda,
  star: Star,
};

export function RestaurantMenu({
  data,
  table,
}: {
  data: PublicMenu;
  table?: string | null;
}) {
  const { restaurant, categories, items } = data;
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [diet, setDiet] = useState<"all" | "veg" | "nonveg">("all");
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    cart.setContext(restaurant.slug, table ?? null);
    void trackEvent({
      data: {
        restaurantId: restaurant.id,
        eventType: table ? "qr_visit" : "menu_view",
        deviceType: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "web",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.id, restaurant.slug, table]);

  const accent = restaurant.themeSettings.accent || "#E0A96D";
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (cat !== "all" && item.categoryId !== cat) return false;
      if (diet === "veg" && item.dietary === "nonveg") return false;
      if (diet === "nonveg" && item.dietary === "veg") return false;
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, cat, diet, query]);

  const count = cartCount(cart.lines);

  return (
    <div
      className="menuar-shell mx-auto min-h-dvh max-w-lg pb-24"
      style={{ ["--color-accent" as string]: accent, ["--restaurant-accent" as string]: accent }}
    >
      <header className="relative overflow-hidden">
        <img
          src={restaurant.coverImageUrl ?? "/restaurant/golden-oak-cover.jpg"}
          alt=""
          className="h-52 w-full object-cover sm:h-64"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/10" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Link to="/" className="rounded-full bg-bg/55 px-2 py-1 backdrop-blur-md">
            <MenuArWordmark className="origin-left scale-90" />
          </Link>
          <button
            className="relative grid size-11 place-items-center rounded-full bg-bg/70 text-fg backdrop-blur-md"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag className="size-4" />
            {count ? (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-fg">
                {count}
              </span>
            ) : null}
          </button>
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Good evening</p>
          <h1 className="font-display text-3xl text-fg sm:text-4xl">{restaurant.name}</h1>
          {table ? <p className="mt-1 text-xs text-muted">Table {table}</p> : null}
        </div>
      </header>

      <div className="px-5 pt-4">
        <p className="text-sm leading-relaxed text-muted">{restaurant.description}</p>
        {restaurant.address ? (
          <p className="mt-2 text-xs text-subtle">
            {restaurant.address}
            {restaurant.contactNumber ? ` · ${restaurant.contactNumber}` : ""}
          </p>
        ) : null}

        <div className="relative mt-5">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes…"
            className="pl-10"
            aria-label="Search dishes"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <CategoryChip active={cat === "all"} label="All" icon={Utensils} onClick={() => setCat("all")} />
          {categories.map((c) => {
            const Icon = ICONS[c.iconKey] ?? Utensils;
            return (
              <CategoryChip
                key={c.id}
                active={cat === c.id}
                label={c.name}
                icon={Icon}
                onClick={() => setCat(c.id)}
              />
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs">
          {(["all", "veg", "nonveg"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiet(d)}
              className={cn(
                "h-9 rounded-full border px-3 font-medium capitalize",
                diet === d ? "border-accent bg-accent text-accent-fg" : "border-border text-muted",
              )}
            >
              {d === "all" ? "All" : d === "veg" ? "Veg" : "Non-veg"}
            </button>
          ))}
        </div>

        <section className="mt-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
              No dishes match that search.
            </p>
          ) : (
            filtered.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                slug={restaurant.slug}
                currency={restaurant.currency}
                onAdd={(it) => {
                  cart.add({
                    itemId: it.id,
                    slug: it.slug,
                    name: it.name,
                    price: it.price,
                    imageUrl: it.imageUrl,
                  });
                  toast.success(`Added ${it.name}`);
                }}
              />
            ))
          )}
        </section>
      </div>
      <CartSheet restaurant={restaurant} open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function CategoryChip({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof Utensils;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex min-w-[4.6rem] flex-col items-center gap-2 rounded-2xl px-3 py-3 text-[10px] font-semibold uppercase tracking-[0.08em]",
        active ? "bg-accent text-accent-fg" : "bg-surface text-muted",
      )}
    >
      <Icon className="size-5" />
      <span className="max-w-[4.8rem] truncate">{label}</span>
    </button>
  );
}
