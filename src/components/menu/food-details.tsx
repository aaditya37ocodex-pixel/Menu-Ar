import { Link } from "@tanstack/react-router";
import { ArrowLeft, Scan, ShoppingBag, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FoodViewerLazy } from "@/components/food-3d/food-viewer";
import { CartSheet } from "@/components/menu/cart-sheet";
import { DietaryDot } from "@/components/menu/dietary-dot";
import { cartCount, useCart } from "@/lib/cart-store";
import { trackEvent } from "@/lib/menuar/public";
import { has3dModel, type Category, type MenuItem, type Restaurant } from "@/lib/menuar/types";
import { formatMoney } from "@/lib/utils";

export function FoodDetails({
  restaurant,
  item,
  category,
}: {
  restaurant: Restaurant;
  item: MenuItem;
  category: Category | null;
}) {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const ar = has3dModel(item);
  const accent = restaurant.themeSettings.accent || "#E0A96D";
  const count = cartCount(cart.lines);

  useEffect(() => {
    cart.setContext(restaurant.slug);
    void trackEvent({
      data: { restaurantId: restaurant.id, menuItemId: item.id, eventType: "item_view" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  function add() {
    cart.add({
      itemId: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    toast.success(`Added ${item.name}`);
  }

  return (
    <div
      className="menuar-shell mx-auto min-h-dvh max-w-lg pb-28"
      style={{ ["--color-accent" as string]: accent }}
    >
      <header className="flex items-center justify-between px-4 py-3">
        <Link
          to="/menu/$slug"
          params={{ slug: restaurant.slug }}
          className="grid size-11 place-items-center rounded-full bg-surface"
          aria-label="Back to menu"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          {restaurant.name}
        </p>
        <button
          className="relative grid size-11 place-items-center rounded-full bg-surface"
          onClick={() => setCartOpen(true)}
          aria-label="Cart"
        >
          <ShoppingBag className="size-4" />
          {count ? <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" /> : null}
        </button>
      </header>

      <div className="px-5">
        <div className="overflow-hidden rounded-3xl">
          <img src={item.imageUrl ?? ""} alt={item.name} className="aspect-[4/3] w-full object-cover" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-3">
          <div>
            {category ? (
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {category.name}
              </p>
            ) : null}
            <h1 className="mt-1 font-display text-3xl">{item.name}</h1>
          </div>
          <DietaryDot dietary={item.dietary} className="mt-3 size-3" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-lg font-semibold tabular-nums text-accent">
            {formatMoney(item.price, restaurant.currency)}
          </p>
          {item.calories ? <span className="text-xs text-muted">{item.calories} Cal</span> : null}
          {item.prepTimeMinutes ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <Clock className="size-3" /> {item.prepTimeMinutes} min
            </span>
          ) : null}
          {item.isRecommended ? <Badge tone="accent">Recommended</Badge> : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>

        {item.ingredients.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.ingredients.map((ing) => (
              <span
                key={ing}
                className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted"
              >
                {ing}
              </span>
            ))}
          </div>
        ) : null}

        {item.allergens.length ? (
          <p className="mt-3 text-xs text-subtle">Allergens: {item.allergens.join(", ")}</p>
        ) : null}

        {item.spicyLevel > 0 ? (
          <p className="mt-2 text-xs text-muted">
            Spice level: {"●".repeat(item.spicyLevel)}
            {"○".repeat(3 - item.spicyLevel)}
          </p>
        ) : null}

        {ar ? (
          <section className="mt-6">
            <h2 className="font-display text-xl">3D preview</h2>
            <p className="mb-3 mt-1 text-xs text-muted">Rotate the dish before placing it on your table.</p>
            <FoodViewerLazy
              modelKey={item.modelKey}
              modelUrl={item.modelUrl}
              className="h-[320px]"
              onReady={() => {
                void trackEvent({
                  data: {
                    restaurantId: restaurant.id,
                    menuItemId: item.id,
                    eventType: "viewer_open",
                  },
                });
              }}
            />
          </section>
        ) : null}

        <div className="mt-6 space-y-3">
          {ar ? (
            <Button asChild size="lg" className="w-full">
              <Link
                to="/ar/$slug/$itemSlug"
                params={{ slug: restaurant.slug, itemSlug: item.slug }}
                onClick={() => {
                  void trackEvent({
                    data: {
                      restaurantId: restaurant.id,
                      menuItemId: item.id,
                      eventType: "ar_launch",
                    },
                  });
                }}
              >
                <Scan className="size-4" />
                View on your table
              </Link>
            </Button>
          ) : null}
          {restaurant.orderingEnabled && item.isAvailable ? (
            <Button size="lg" variant={ar ? "secondary" : "default"} className="w-full" onClick={add}>
              Add to order
            </Button>
          ) : null}
        </div>
      </div>
      <CartSheet restaurant={restaurant} open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
