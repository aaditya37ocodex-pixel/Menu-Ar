create table if not exists restaurants (
  id text primary key,
  owner_id text not null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  logo_url text,
  cover_image_url text,
  address text,
  contact_number text,
  opening_hours jsonb not null default '{}'::jsonb,
  theme_settings jsonb not null default '{}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  currency text not null default 'USD',
  is_published boolean not null default true,
  ordering_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists restaurants_owner_id_idx on restaurants (owner_id);
create index if not exists restaurants_slug_idx on restaurants (slug);

create table if not exists categories (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  name text not null,
  description text not null default '',
  icon_key text not null default 'utensils',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists categories_restaurant_id_idx on categories (restaurant_id);

create table if not exists menu_items (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  category_id text references categories(id) on delete set null,
  name text not null,
  slug text not null,
  description text not null default '',
  price numeric(10,2) not null default 0,
  image_url text,
  model_url text,
  model_key text,
  ingredients jsonb not null default '[]'::jsonb,
  allergens jsonb not null default '[]'::jsonb,
  dietary text not null default 'veg',
  spicy_level integer not null default 0,
  prep_time_minutes integer,
  calories integer,
  is_available boolean not null default true,
  is_recommended boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, slug)
);
create index if not exists menu_items_restaurant_id_idx on menu_items (restaurant_id);
create index if not exists menu_items_category_id_idx on menu_items (category_id);

create table if not exists restaurant_tables (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  table_number text not null,
  table_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (restaurant_id, table_number)
);
create index if not exists restaurant_tables_restaurant_id_idx on restaurant_tables (restaurant_id);

create table if not exists orders (
  id text primary key,
  restaurant_id text not null references restaurants(id) on delete cascade,
  table_id text references restaurant_tables(id) on delete set null,
  table_number text,
  customer_name text,
  status text not null default 'pending',
  total_amount numeric(10,2) not null default 0,
  special_instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_restaurant_id_idx on orders (restaurant_id);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders(id) on delete cascade,
  menu_item_id text,
  name text not null,
  quantity integer not null default 1,
  price numeric(10,2) not null default 0,
  notes text
);
create index if not exists order_items_order_id_idx on order_items (order_id);

create table if not exists analytics_events (
  id text primary key,
  restaurant_id text not null,
  menu_item_id text,
  event_type text not null,
  device_type text,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_restaurant_id_idx on analytics_events (restaurant_id, created_at);
create index if not exists analytics_events_type_idx on analytics_events (restaurant_id, event_type);
