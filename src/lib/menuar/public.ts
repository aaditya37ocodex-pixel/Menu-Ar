import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { getDemoPublicMenu, isDemoSlug } from "./demo-menu";
import { ensureDemoRestaurant } from "./ensure-demo";
import { mapCategory, mapItem, mapRestaurant, mapTable } from "./map";
import { asNumber, type OrderStatus, type PublicMenu } from "./types";

function hasDatabase() {
  return Boolean(typeof process !== "undefined" && process.env.DATABASE_URL?.trim());
}

export const getPublicMenu = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }): Promise<PublicMenu | null> => {
    if (!hasDatabase()) {
      return isDemoSlug(data.slug) ? getDemoPublicMenu() : null;
    }
    await ensureDemoRestaurant();
    const sql = await getSql();
    const rests = await sql<Record<string, unknown>>`
      select * from restaurants
      where slug = ${data.slug} and is_published = true
      limit 1
    `;
    const rest = rests[0];
    if (!rest) return null;
    const restaurant = mapRestaurant(rest);
    const cats = await sql<Record<string, unknown>>`
      select * from categories
      where restaurant_id = ${restaurant.id} and is_active = true
      order by sort_order, name
    `;
    const items = await sql<Record<string, unknown>>`
      select * from menu_items
      where restaurant_id = ${restaurant.id} and is_published = true
      order by sort_order, name
    `;
    const tables = await sql<Record<string, unknown>>`
      select * from restaurant_tables
      where restaurant_id = ${restaurant.id} and is_active = true
      order by table_number
    `;
    return {
      restaurant,
      categories: cats.map(mapCategory),
      items: items.map(mapItem),
      tables: tables.map(mapTable),
    };
  });

export const getPublicItem = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string().min(1), itemSlug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const menu = await getPublicMenu({ data: { slug: data.slug } });
    if (!menu) return null;
    const item = menu.items.find((i) => i.slug === data.itemSlug) ?? null;
    if (!item) return null;
    const category = menu.categories.find((c) => c.id === item.categoryId) ?? null;
    return { restaurant: menu.restaurant, item, category, tables: menu.tables };
  });

export const trackEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      restaurantId: z.string().min(1),
      menuItemId: z.string().optional(),
      eventType: z.enum([
        "menu_view",
        "item_view",
        "viewer_open",
        "ar_launch",
        "qr_visit",
        "cart_add",
      ]),
      deviceType: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!hasDatabase()) return { ok: true };
    const sql = await getSql();
    await sql`
      insert into analytics_events (id, restaurant_id, menu_item_id, event_type, device_type)
      values (
        ${crypto.randomUUID()},
        ${data.restaurantId},
        ${data.menuItemId ?? null},
        ${data.eventType},
        ${data.deviceType ?? null}
      )
    `;
    return { ok: true };
  });

export const placeOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      restaurantSlug: z.string().min(1),
      tableNumber: z.string().optional(),
      customerName: z.string().max(80).optional(),
      specialInstructions: z.string().max(400).optional(),
      items: z
        .array(
          z.object({
            menuItemId: z.string(),
            quantity: z.number().int().min(1).max(20),
          }),
        )
        .min(1)
        .max(40),
    }),
  )
  .handler(async ({ data }) => {
    if (!hasDatabase()) {
      const menu = getDemoPublicMenu();
      if (!isDemoSlug(data.restaurantSlug)) throw new Error("Restaurant not found");
      let total = 0;
      for (const line of data.items) {
        const item = menu.items.find((i) => i.id === line.menuItemId);
        if (item) total += item.price * line.quantity;
      }
      if (!total) throw new Error("No available items in this order");
      return { orderId: crypto.randomUUID(), total, status: "pending" as OrderStatus };
    }

    await ensureDemoRestaurant();
    const sql = await getSql();
    const rests = await sql<Record<string, unknown>>`
      select * from restaurants where slug = ${data.restaurantSlug} and is_published = true limit 1
    `;
    const rest = rests[0];
    if (!rest) throw new Error("Restaurant not found");
    if (!rest.ordering_enabled) throw new Error("Ordering is disabled for this restaurant");

    const rows = await sql<{ id: string; name: string; price: unknown; is_available: boolean }>`
      select id, name, price, is_available from menu_items
      where restaurant_id = ${String(rest.id)}
    `;
    const byId = new Map(rows.map((r) => [r.id, r]));
    let total = 0;
    const lines: Array<{ id: string; name: string; qty: number; price: number }> = [];
    for (const line of data.items) {
      const found = byId.get(line.menuItemId);
      if (!found || !found.is_available) continue;
      const price = asNumber(found.price);
      total += price * line.quantity;
      lines.push({ id: found.id, name: found.name, qty: line.quantity, price });
    }
    if (!lines.length) throw new Error("No available items in this order");

    let tableId: string | null = null;
    if (data.tableNumber) {
      const tables = await sql<{ id: string }>`
        select id from restaurant_tables
        where restaurant_id = ${String(rest.id)} and table_number = ${data.tableNumber}
        limit 1
      `;
      tableId = tables[0]?.id ?? null;
    }

    const orderId = crypto.randomUUID();
    await sql`
      insert into orders (
        id, restaurant_id, table_id, table_number, customer_name, status, total_amount, special_instructions
      ) values (
        ${orderId},
        ${String(rest.id)},
        ${tableId},
        ${data.tableNumber ?? null},
        ${data.customerName?.trim() || null},
        ${"pending"},
        ${total},
        ${data.specialInstructions?.trim() || null}
      )
    `;
    for (const line of lines) {
      await sql`
        insert into order_items (id, order_id, menu_item_id, name, quantity, price)
        values (${crypto.randomUUID()}, ${orderId}, ${line.id}, ${line.name}, ${line.qty}, ${line.price})
      `;
    }
    return { orderId, total, status: "pending" as OrderStatus };
  });
