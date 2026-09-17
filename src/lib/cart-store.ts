import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  itemId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type CartState = {
  restaurantSlug: string | null;
  tableNumber: string | null;
  lines: CartLine[];
  setContext: (slug: string, table?: string | null) => void;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (itemId: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantSlug: null,
      tableNumber: null,
      lines: [],
      setContext: (slug, table) => {
        const cur = get();
        if (cur.restaurantSlug && cur.restaurantSlug !== slug) {
          set({ restaurantSlug: slug, tableNumber: table ?? null, lines: [] });
          return;
        }
        set({
          restaurantSlug: slug,
          tableNumber: table ?? cur.tableNumber,
        });
      },
      add: (line, qty = 1) => {
        const cur = get();
        const existing = cur.lines.find((l) => l.itemId === line.itemId);
        if (existing) {
          set({
            lines: cur.lines.map((l) =>
              l.itemId === line.itemId ? { ...l, quantity: Math.min(20, l.quantity + qty) } : l,
            ),
          });
          return;
        }
        set({ lines: [...cur.lines, { ...line, quantity: qty }] });
      },
      setQty: (itemId, qty) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.itemId !== itemId) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.itemId === itemId ? { ...l, quantity: qty } : l)),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    { name: "menuar-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.quantity * l.price, 0);
}
