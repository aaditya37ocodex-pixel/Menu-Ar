import {
  asBool,
  asNumber,
  parseJson,
  type Category,
  type MenuItem,
  type OpeningHours,
  type Restaurant,
  type RestaurantTable,
  type SocialLinks,
  type ThemeSettings,
  type Dietary,
} from "./types";

type Row = Record<string, unknown>;

export function mapRestaurant(row: Row): Restaurant {
  return {
    id: String(row.id),
    ownerId: String(row.owner_id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    logoUrl: row.logo_url ? String(row.logo_url) : null,
    coverImageUrl: row.cover_image_url ? String(row.cover_image_url) : null,
    address: row.address ? String(row.address) : null,
    contactNumber: row.contact_number ? String(row.contact_number) : null,
    openingHours: parseJson<OpeningHours>(row.opening_hours, {}),
    themeSettings: parseJson<ThemeSettings>(row.theme_settings, {}),
    socialLinks: parseJson<SocialLinks>(row.social_links, {}),
    currency: String(row.currency ?? "USD"),
    isPublished: asBool(row.is_published, true),
    orderingEnabled: asBool(row.ordering_enabled, true),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

export function mapCategory(row: Row): Category {
  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id),
    name: String(row.name),
    description: String(row.description ?? ""),
    iconKey: String(row.icon_key ?? "utensils"),
    sortOrder: asNumber(row.sort_order),
    isActive: asBool(row.is_active, true),
  };
}

export function mapItem(row: Row): MenuItem {
  const dietary = String(row.dietary ?? "veg");
  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id),
    categoryId: row.category_id ? String(row.category_id) : null,
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    price: asNumber(row.price),
    imageUrl: row.image_url ? String(row.image_url) : null,
    modelUrl: row.model_url ? String(row.model_url) : null,
    modelKey: row.model_key ? String(row.model_key) : null,
    ingredients: parseJson<string[]>(row.ingredients, []),
    allergens: parseJson<string[]>(row.allergens, []),
    dietary: (["veg", "nonveg", "vegan"].includes(dietary)
      ? dietary
      : "veg") as Dietary,
    spicyLevel: asNumber(row.spicy_level),
    prepTimeMinutes: row.prep_time_minutes == null ? null : asNumber(row.prep_time_minutes),
    calories: row.calories == null ? null : asNumber(row.calories),
    isAvailable: asBool(row.is_available, true),
    isRecommended: asBool(row.is_recommended, false),
    isPublished: asBool(row.is_published, true),
    sortOrder: asNumber(row.sort_order),
  };
}

export function mapTable(row: Row): RestaurantTable {
  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id),
    tableNumber: String(row.table_number),
    tableName: row.table_name ? String(row.table_name) : null,
    isActive: asBool(row.is_active, true),
  };
}
