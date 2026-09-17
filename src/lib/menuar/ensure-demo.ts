import { getSql } from "@/lib/db";

const DEMO_ID = "rest_golden_oak";

const HOURS = {
  monday: "11:30 – 22:00",
  tuesday: "11:30 – 22:00",
  wednesday: "11:30 – 22:00",
  thursday: "11:30 – 22:00",
  friday: "11:30 – 23:00",
  saturday: "11:00 – 23:00",
  sunday: "11:00 – 21:30",
};

type ItemSeed = {
  id: string;
  category: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  modelKey: string | null;
  ingredients: string[];
  allergens: string[];
  dietary: "veg" | "nonveg" | "vegan";
  spicy: number;
  prep: number;
  calories: number;
  recommended?: boolean;
};

const ITEMS: ItemSeed[] = [
  { id: "item_burrata", category: "starters", name: "Burrata with Prosciutto", slug: "burrata-with-prosciutto", description: "Torn burrata, folded prosciutto, warm cherry tomatoes and basil oil.", price: 16, image: "/food/burrata.jpg", modelKey: "burrata", ingredients: ["Burrata", "Prosciutto", "Tomato", "Basil"], allergens: ["Milk"], dietary: "nonveg", spicy: 0, prep: 12, calories: 420, recommended: true },
  { id: "item_tikka", category: "starters", name: "Paneer Tikka", slug: "paneer-tikka", description: "Char-grilled cottage cheese with peppers, onion and mint chutney.", price: 14, image: "/food/paneer-tikka.jpg", modelKey: "tikka", ingredients: ["Paneer", "Pepper", "Onion", "Yogurt marinade"], allergens: ["Milk"], dietary: "veg", spicy: 2, prep: 18, calories: 380, recommended: true },
  { id: "item_dumplings", category: "chinese", name: "Gourmet Truffle Dumplings", slug: "gourmet-truffle-dumplings", description: "Pan-seared dumplings with black truffle and a dark glaze.", price: 18, image: "/food/truffle-dumplings.jpg", modelKey: "dumplings", ingredients: ["Wheat wrapper", "Mushroom", "Truffle", "Soy glaze"], allergens: ["Gluten", "Soy"], dietary: "veg", spicy: 0, prep: 16, calories: 360 },
  { id: "item_biryani", category: "mains", name: "Chicken Biryani", slug: "chicken-biryani", description: "Saffron basmati, slow-spiced chicken, fried onions and fresh herbs.", price: 22, image: "/food/chicken-biryani.jpg", modelKey: "biryani", ingredients: ["Basmati", "Chicken", "Saffron", "Fried onion"], allergens: [], dietary: "nonveg", spicy: 2, prep: 28, calories: 640, recommended: true },
  { id: "item_salad", category: "salads", name: "Grilled Chicken Salad", slug: "grilled-chicken-salad", description: "Charred chicken, greens, tomato, cucumber and avocado on a cool plate.", price: 19, image: "/food/grilled-chicken-salad.jpg", modelKey: "salad", ingredients: ["Chicken", "Lettuce", "Tomato", "Cucumber", "Avocado"], allergens: [], dietary: "nonveg", spicy: 0, prep: 14, calories: 380 },
  { id: "item_pizza", category: "pizza", name: "Margherita Pizza", slug: "margherita-pizza", description: "Blistered crust, tomato, mozzarella and basil.", price: 16, image: "/food/margherita-pizza.jpg", modelKey: "pizza", ingredients: ["Dough", "Tomato", "Mozzarella", "Basil"], allergens: ["Gluten", "Milk"], dietary: "veg", spicy: 0, prep: 15, calories: 520 },
  { id: "item_burger", category: "burgers", name: "Classic Burger", slug: "classic-burger", description: "Sesame brioche, grilled patty, cheddar, lettuce, tomato and house sauce.", price: 18, image: "/food/classic-burger.jpg", modelKey: "burger", ingredients: ["Brioche", "Beef", "Cheddar", "Lettuce", "Tomato"], allergens: ["Gluten", "Milk"], dietary: "nonveg", spicy: 1, prep: 16, calories: 720, recommended: true },
  { id: "item_brownie", category: "desserts", name: "Chocolate Brownie", slug: "chocolate-brownie", description: "Warm fudge brownie with vanilla cream and dark chocolate sauce.", price: 11, image: "/food/chocolate-brownie.jpg", modelKey: "brownie", ingredients: ["Chocolate", "Butter", "Vanilla cream"], allergens: ["Milk", "Eggs", "Gluten"], dietary: "veg", spicy: 0, prep: 10, calories: 460 },
  { id: "item_shake", category: "beverages", name: "Fresh Mango Shake", slug: "fresh-mango-shake", description: "Ripe Alphonso mango blended into a cold cream shake.", price: 8, image: "/food/mango-shake.jpg", modelKey: "shake", ingredients: ["Mango", "Milk", "Cream"], allergens: ["Milk"], dietary: "veg", spicy: 0, prep: 6, calories: 280 },
];

const CATEGORIES = [
  { key: "starters", name: "Starters", icon: "sparkles", order: 1 },
  { key: "mains", name: "Main Course", icon: "utensils", order: 2 },
  { key: "pizza", name: "Pizza", icon: "pizza", order: 3 },
  { key: "burgers", name: "Burgers", icon: "beef", order: 4 },
  { key: "salads", name: "Salads", icon: "leaf", order: 5 },
  { key: "indian", name: "Indian Food", icon: "flame", order: 6 },
  { key: "chinese", name: "Chinese Food", icon: "soup", order: 7 },
  { key: "desserts", name: "Desserts", icon: "ice-cream-bowl", order: 8 },
  { key: "beverages", name: "Beverages", icon: "cup-soda", order: 9 },
  { key: "offers", name: "Special Offers", icon: "star", order: 10 },
];

let demoPromise: Promise<void> | null = null;

export async function ensureDemoRestaurant() {
  if (!demoPromise) {
    demoPromise = seedDemo().catch((err) => {
      demoPromise = null;
      throw err;
    });
  }
  await demoPromise;
}

async function seedDemo() {
  const sql = await getSql();
  const existing = await sql<{ id: string }>`select id from restaurants where slug = 'golden-oak' limit 1`;
  if (existing.length) return;

  await sql`
    insert into restaurants (
      id, owner_id, name, slug, description, logo_url, cover_image_url,
      address, contact_number, opening_hours, theme_settings, social_links,
      currency, is_published, ordering_enabled
    ) values (
      ${DEMO_ID},
      ${"system-demo"},
      ${"Golden Oak Restaurant"},
      ${"golden-oak"},
      ${"A contemporary oak-room kitchen. Scan the table, explore each dish in 3D, and place it on your table in AR where your phone supports it."},
      ${"/favicon.svg"},
      ${"/restaurant/golden-oak-cover.jpg"},
      ${"14 Reserve Lane, Downtown"},
      ${"+1 415 555 0148"},
      ${JSON.stringify(HOURS)}::jsonb,
      ${JSON.stringify({ accent: "#E0A96D", mode: "dark" })}::jsonb,
      ${JSON.stringify({ website: "/" })}::jsonb,
      ${"USD"},
      ${true},
      ${true}
    )
  `;

  for (const cat of CATEGORIES) {
    await sql`
      insert into categories (id, restaurant_id, name, icon_key, sort_order, is_active)
      values (${"cat_" + cat.key}, ${DEMO_ID}, ${cat.name}, ${cat.icon}, ${cat.order}, ${true})
    `;
  }

  let order = 1;
  for (const item of ITEMS) {
    await sql`
      insert into menu_items (
        id, restaurant_id, category_id, name, slug, description, price,
        image_url, model_key, ingredients, allergens, dietary, spicy_level,
        prep_time_minutes, calories, is_available, is_recommended, is_published, sort_order
      ) values (
        ${item.id}, ${DEMO_ID}, ${"cat_" + item.category}, ${item.name}, ${item.slug}, ${item.description}, ${item.price},
        ${item.image}, ${item.modelKey}, ${JSON.stringify(item.ingredients)}::jsonb, ${JSON.stringify(item.allergens)}::jsonb,
        ${item.dietary}, ${item.spicy}, ${item.prep}, ${item.calories}, ${true}, ${Boolean(item.recommended)}, ${true}, ${order}
      )
    `;
    order += 1;
  }

  for (let n = 1; n <= 8; n += 1) {
    await sql`
      insert into restaurant_tables (id, restaurant_id, table_number, table_name, is_active)
      values (${"tbl_" + n}, ${DEMO_ID}, ${String(n)}, ${"Table " + n}, ${true})
    `;
  }
}

export async function provisionOwnerRestaurant(userId: string, displayName?: string | null) {
  await ensureDemoRestaurant();
  const sql = await getSql();
  const mine = await sql<{ id: string; slug: string }>`select id, slug from restaurants where owner_id = ${userId} limit 1`;
  if (mine[0]) return mine[0];

  const id = crypto.randomUUID();
  const slugBase = `kitchen-${userId.replace(/[^a-z0-9]/gi, "").slice(0, 8).toLowerCase() || "new"}`;
  let slug = slugBase;
  for (let i = 0; i < 6; i += 1) {
    const clash = await sql<{ id: string }>`select id from restaurants where slug = ${slug} limit 1`;
    if (!clash.length) break;
    slug = `${slugBase}-${i + 2}`;
  }

  const name = displayName?.trim() ? `${displayName.trim()}'s Kitchen` : "My Restaurant";

  await sql`
    insert into restaurants (
      id, owner_id, name, slug, description, logo_url, cover_image_url,
      address, contact_number, opening_hours, theme_settings, social_links,
      currency, is_published, ordering_enabled
    )
    select ${id}, ${userId}, ${name}, ${slug}, description, logo_url, cover_image_url, address, contact_number,
      opening_hours, theme_settings, social_links, currency, is_published, ordering_enabled
    from restaurants where id = ${DEMO_ID}
  `;

  const cats = await sql<{ id: string; name: string; description: string; icon_key: string; sort_order: number; is_active: boolean }>`
    select id, name, description, icon_key, sort_order, is_active from categories where restaurant_id = ${DEMO_ID}
  `;
  const catMap = new Map<string, string>();
  for (const cat of cats) {
    const newId = crypto.randomUUID();
    catMap.set(cat.id, newId);
    await sql`
      insert into categories (id, restaurant_id, name, description, icon_key, sort_order, is_active)
      values (${newId}, ${id}, ${cat.name}, ${cat.description}, ${cat.icon_key}, ${cat.sort_order}, ${cat.is_active})
    `;
  }

  const items = await sql<Record<string, unknown>>`select * from menu_items where restaurant_id = ${DEMO_ID}`;
  for (const item of items) {
    const newCat = item.category_id ? catMap.get(String(item.category_id)) ?? null : null;
    await sql`
      insert into menu_items (
        id, restaurant_id, category_id, name, slug, description, price,
        image_url, model_url, model_key, ingredients, allergens, dietary,
        spicy_level, prep_time_minutes, calories, is_available, is_recommended,
        is_published, sort_order
      ) values (
        ${crypto.randomUUID()}, ${id}, ${newCat}, ${String(item.name)}, ${String(item.slug)}, ${String(item.description ?? "")},
        ${item.price}, ${item.image_url ?? null}, ${item.model_url ?? null}, ${item.model_key ?? null},
        ${JSON.stringify(item.ingredients ?? [])}::jsonb, ${JSON.stringify(item.allergens ?? [])}::jsonb,
        ${String(item.dietary ?? "veg")}, ${item.spicy_level ?? 0}, ${item.prep_time_minutes ?? null}, ${item.calories ?? null},
        ${item.is_available ?? true}, ${item.is_recommended ?? false}, ${item.is_published ?? true}, ${item.sort_order ?? 0}
      )
    `;
  }

  for (let n = 1; n <= 6; n += 1) {
    await sql`
      insert into restaurant_tables (id, restaurant_id, table_number, table_name, is_active)
      values (${crypto.randomUUID()}, ${id}, ${String(n)}, ${"Table " + n}, ${true})
    `;
  }

  return { id, slug };
}
