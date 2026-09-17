import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cartCount, cartTotal, useCart } from "@/lib/cart-store";
import { placeOrder } from "@/lib/menuar/public";
import type { Restaurant } from "@/lib/menuar/types";
import { formatMoney } from "@/lib/utils";

export function CartSheet({
  restaurant,
  open,
  onClose,
}: {
  restaurant: Restaurant;
  open: boolean;
  onClose: () => void;
}) {
  const { lines, setQty, clear, tableNumber, setContext } = useCart();
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [table, setTable] = useState(tableNumber ?? "");
  const [busy, setBusy] = useState(false);

  if (!open) return null;
  const total = cartTotal(lines);

  async function submit() {
    if (!restaurant.orderingEnabled) return;
    if (!lines.length) return;
    setBusy(true);
    try {
      const result = await placeOrder({
        data: {
          restaurantSlug: restaurant.slug,
          tableNumber: table || undefined,
          customerName: name || undefined,
          specialInstructions: notes || undefined,
          items: lines.map((l) => ({ menuItemId: l.itemId, quantity: l.quantity })),
        },
      });
      setContext(restaurant.slug, table || null);
      clear();
      onClose();
      toast.success(`Order sent to the kitchen · ${formatMoney(result.total, restaurant.currency)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/60 sm:items-center">
      <button className="absolute inset-0" aria-label="Close cart" onClick={onClose} />
      <div className="relative z-10 flex max-h-[88dvh] w-full max-w-md flex-col rounded-t-3xl border border-border bg-bg-elevated p-5 sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4 text-accent" />
            <h2 className="font-display text-xl">Your table order</h2>
          </div>
          <button onClick={onClose} className="grid size-10 place-items-center rounded-full" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          {lines.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Your cart is empty.</p>
          ) : (
            lines.map((line) => (
              <div key={line.itemId} className="flex items-center gap-3">
                {line.imageUrl ? (
                  <img src={line.imageUrl} alt="" className="size-14 rounded-xl object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{line.name}</p>
                  <p className="text-xs tabular-nums text-accent">
                    {formatMoney(line.price * line.quantity, restaurant.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="grid size-9 place-items-center rounded-full border border-border"
                    onClick={() => setQty(line.itemId, line.quantity - 1)}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm tabular-nums">{line.quantity}</span>
                  <button
                    className="grid size-9 place-items-center rounded-full border border-border"
                    onClick={() => setQty(line.itemId, line.quantity + 1)}
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {restaurant.orderingEnabled ? (
          <div className="mt-4 space-y-3">
            <Input placeholder="Table number" value={table} onChange={(e) => setTable(e.target.value)} />
            <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea
              placeholder="Special instructions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">{cartCount(lines)} items</span>
              <span className="font-semibold tabular-nums">{formatMoney(total, restaurant.currency)}</span>
            </div>
            <Button className="w-full" size="lg" disabled={!lines.length || busy} onClick={() => void submit()}>
              {busy ? "Sending…" : "Send to kitchen"}
            </Button>
            <p className="text-center text-[11px] text-subtle">
              No online payment in this version. Staff receive the order at the pass.
            </p>
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-muted">Table ordering is disabled for this restaurant.</p>
        )}
      </div>
    </div>
  );
}
