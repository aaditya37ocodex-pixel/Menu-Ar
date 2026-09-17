export type OpeningHours = Record<string, string>;

export type ThemeSettings = {
  accent?: string;
  mode?: "dark" | "light";
};

export type SocialLinks = {
  instagram?: string;
  website?: string;
};

export type Restaurant = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  address: string | null;
  contactNumber: string | null;
  openingHours: OpeningHours;
  themeSettings: ThemeSettings;
  socialLinks: SocialLinks;
  currency: string;
  isPublished: boolean;
  orderingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  iconKey: string;
  sortOrder: number;
  isActive: boolean;
};

export type Dietary = "veg" | "nonveg" | "vegan";

export type MenuItem = {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  modelUrl: string | null;
  modelKey: string | null;
  ingredients: string[];
  allergens: string[];
  dietary: Dietary;
  spicyLevel: number;
  prepTimeMinutes: number | null;
  calories: number | null;
  isAvailable: boolean;
  isRecommended: boolean;
  isPublished: boolean;
  sortOrder: number;
};

export type RestaurantTable = {
  id: string;
  restaurantId: string;
  tableNumber: string;
  tableName: string | null;
  isActive: boolean;
};

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  restaurantId: string;
  tableId: string | null;
  tableNumber: string | null;
  customerName: string | null;
  status: OrderStatus;
  totalAmount: number;
  specialInstructions: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
};

export type PublicMenu = {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  tables: RestaurantTable[];
};

export type AnalyticsSummary = {
  menuViews: number;
  itemViews: number;
  arLaunches: number;
  viewerOpens: number;
  qrVisits: number;
  popular: Array<{ itemId: string; name: string; views: number }>;
  recent: Array<{
    id: string;
    eventType: string;
    itemName: string | null;
    createdAt: string;
  }>;
};

export const FOOD_MODEL_KEYS = [
  "burger",
  "pizza",
  "tikka",
  "biryani",
  "brownie",
  "shake",
  "salad",
  "dumplings",
  "burrata",
] as const;

export type FoodModelKey = (typeof FOOD_MODEL_KEYS)[number];

export function has3dModel(item: Pick<MenuItem, "modelUrl" | "modelKey">) {
  return Boolean(item.modelKey || item.modelUrl);
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function asNumber(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function asBool(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "t" || value === "true" || value === 1 || value === "1") return true;
  if (value === "f" || value === "false" || value === 0 || value === "0") return false;
  return fallback;
}
