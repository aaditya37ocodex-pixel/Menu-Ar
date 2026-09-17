import type { Category, MenuItem, PublicMenu, Restaurant, RestaurantTable } from "./types";

const RID = "rest_golden_oak";

const IMG = {
  cover:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
  burrata:
    "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=900&q=80",
  tikka:
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
  dumplings:
    "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
  biryani:
    "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80",
  salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  pizza:
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  brownie:
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  shake:
    "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=80",
};

export const DEMO_IMAGES = IMG;

const restaurant: Restaurant = {
  id: RID,
  ownerId: "system-demo",
  name: "Golden Oak Restaurant",
  slug: "golden-oak",
  description:
    "A contemporary oak-room kitchen. Scan the table, explore each dish in 3D, and place it on your table in AR where your phone supports it.",
  logoUrl: "/favicon.svg",
  coverImageUrl: IMG.cover,
  address: "14 Reserve Lane, Downtown",
  contactNumber: "+1 415 555 0148",
  openingHours: {
    monday: "11:30 – 22:00",
    tuesday: "11:30 – 22:00",
    wednesday: "11:30 – 22:00",
    thursday: "11:30 – 22:00",
    friday: "11:30 – 23:00",
    saturday: "11:00 – 23:00",
    sunday: "11:00 – 21:30",
  },
  themeSettings: { accent: "#E0A96D", mode: "dark" },
  socialLinks: { website: "/" },
  currency: "USD",
  isPublished: true,
  orderingEnabled: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const categories: Category[] = [
  { id: "cat_starters", restaurantId: RID, name: "Starters", description: "", iconKey: "sparkles", sortOrder: 1, isActive: true },
  { id: "cat_mains", restaurantId: RID, name: "Main Course", description: "", iconKey: "utensils", sortOrder: 2, isActive: true },
  { id: "cat_pizza", restaurantId: RID, name: "Pizza", description: "", iconKey: "pizza", sortOrder: 3, isActive: true },
  { id: "cat_burgers", restaurantId: RID, name: "Burgers", description: "", iconKey: "beef", sortOrder: 4, isActive: true },
  { id: "cat_salads", restaurantId: RID, name: "Salads", description: "", iconKey: "leaf", sortOrder: 5, isActive: true },
  { id: "cat_indian", restaurantId: RID, name: "Indian Food", description: "", iconKey: "flame", sortOrder: 6, isActive: true },
  { id: "cat_chinese", restaurantId: RID, name: "Chinese Food", description: "", iconKey: "soup", sortOrder: 7, isActive: true },
  { id: "cat_desserts", restaurantId: RID, name: "Desserts", description: "", iconKey: "ice-cream-bowl", sortOrder: 8, isActive: true },
  { id: "cat_beverages", restaurantId: RID, name: "Beverages", description: "", iconKey: "cup-soda", sortOrder: 9, isActive: true },
];

function item(
  partial: Omit<MenuItem, "restaurantId" | "isAvailable" | "isPublished" | "modelUrl"> &
    Partial<Pick<MenuItem, "isAvailable" | "isPublished" | "modelUrl">>,
): MenuItem {
  return {
    restaurantId: RID,
    isAvailable: true,
    isPublished: true,
    modelUrl: null,
    ...partial,
  };
}

const items: MenuItem[] = [
  item({ id: "item_burrata", categoryId: "cat_starters", name: "Burrata with Prosciutto", slug: "burrata-with-prosciutto", description: "Torn burrata, folded prosciutto, warm cherry tomatoes and basil oil.", price: 16, imageUrl: IMG.burrata, modelKey: "burrata", ingredients: ["Burrata", "Prosciutto", "Tomato", "Basil"], allergens: ["Milk"], dietary: "nonveg", spicyLevel: 0, prepTimeMinutes: 12, calories: 420, isRecommended: true, sortOrder: 1 }),
  item({ id: "item_tikka", categoryId: "cat_starters", name: "Paneer Tikka", slug: "paneer-tikka", description: "Char-grilled cottage cheese with peppers, onion and mint chutney.", price: 14, imageUrl: IMG.tikka, modelKey: "tikka", ingredients: ["Paneer", "Pepper", "Onion", "Yogurt marinade"], allergens: ["Milk"], dietary: "veg", spicyLevel: 2, prepTimeMinutes: 18, calories: 380, isRecommended: true, sortOrder: 2 }),
  item({ id: "item_dumplings", categoryId: "cat_chinese", name: "Gourmet Truffle Dumplings", slug: "gourmet-truffle-dumplings", description: "Pan-seared dumplings with black truffle and a dark glaze.", price: 18, imageUrl: IMG.dumplings, modelKey: "dumplings", ingredients: ["Wheat wrapper", "Mushroom", "Truffle", "Soy glaze"], allergens: ["Gluten", "Soy"], dietary: "veg", spicyLevel: 0, prepTimeMinutes: 16, calories: 360, isRecommended: false, sortOrder: 3 }),
  item({ id: "item_biryani", categoryId: "cat_mains", name: "Chicken Biryani", slug: "chicken-biryani", description: "Saffron basmati, slow-spiced chicken, fried onions and fresh herbs.", price: 22, imageUrl: IMG.biryani, modelKey: "biryani", ingredients: ["Basmati", "Chicken", "Saffron", "Fried onion"], allergens: [], dietary: "nonveg", spicyLevel: 2, prepTimeMinutes: 28, calories: 640, isRecommended: true, sortOrder: 4 }),
  item({ id: "item_salad", categoryId: "cat_salads", name: "Grilled Chicken Salad", slug: "grilled-chicken-salad", description: "Charred chicken, greens, tomato, cucumber and avocado on a cool plate.", price: 19, imageUrl: IMG.salad, modelKey: "salad", ingredients: ["Chicken", "Lettuce", "Tomato", "Cucumber", "Avocado"], allergens: [], dietary: "nonveg", spicyLevel: 0, prepTimeMinutes: 14, calories: 380, isRecommended: false, sortOrder: 5 }),
  item({ id: "item_pizza", categoryId: "cat_pizza", name: "Margherita Pizza", slug: "margherita-pizza", description: "Blistered crust, tomato, mozzarella and basil.", price: 16, imageUrl: IMG.pizza, modelKey: "pizza", ingredients: ["Dough", "Tomato", "Mozzarella", "Basil"], allergens: ["Gluten", "Milk"], dietary: "veg", spicyLevel: 0, prepTimeMinutes: 15, calories: 520, isRecommended: false, sortOrder: 6 }),
  item({ id: "item_burger", categoryId: "cat_burgers", name: "Classic Burger", slug: "classic-burger", description: "Sesame brioche, grilled patty, cheddar, lettuce, tomato and house sauce.", price: 18, imageUrl: IMG.burger, modelKey: "burger", ingredients: ["Brioche", "Beef", "Cheddar", "Lettuce", "Tomato"], allergens: ["Gluten", "Milk"], dietary: "nonveg", spicyLevel: 1, prepTimeMinutes: 16, calories: 720, isRecommended: true, sortOrder: 7 }),
  item({ id: "item_brownie", categoryId: "cat_desserts", name: "Chocolate Brownie", slug: "chocolate-brownie", description: "Warm fudge brownie with vanilla cream and dark chocolate sauce.", price: 11, imageUrl: IMG.brownie, modelKey: "brownie", ingredients: ["Chocolate", "Butter", "Vanilla cream"], allergens: ["Milk", "Eggs", "Gluten"], dietary: "veg", spicyLevel: 0, prepTimeMinutes: 10, calories: 460, isRecommended: false, sortOrder: 8 }),
  item({ id: "item_shake", categoryId: "cat_beverages", name: "Fresh Mango Shake", slug: "fresh-mango-shake", description: "Ripe Alphonso mango blended into a cold cream shake.", price: 8, imageUrl: IMG.shake, modelKey: "shake", ingredients: ["Mango", "Milk", "Cream"], allergens: ["Milk"], dietary: "veg", spicyLevel: 0, prepTimeMinutes: 6, calories: 280, isRecommended: false, sortOrder: 9 }),
];

const tables: RestaurantTable[] = Array.from({ length: 8 }, (_, i) => ({
  id: `tbl_${i + 1}`,
  restaurantId: RID,
  tableNumber: String(i + 1),
  tableName: `Table ${i + 1}`,
  isActive: true,
}));

export function getDemoPublicMenu(): PublicMenu {
  return { restaurant, categories, items, tables };
}

export function isDemoSlug(slug: string) {
  return slug === restaurant.slug;
}
