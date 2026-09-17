import { createFileRoute } from "@tanstack/react-router";
import { RestaurantMenu } from "@/components/menu/restaurant-menu";
import { getPublicMenu } from "@/lib/menuar/public";

export const Route = createFileRoute("/menu/$slug/")({
  loader: async ({ params, location }) => {
    const menu = await getPublicMenu({ data: { slug: params.slug } });
    const raw = location.search as { table?: unknown };
    const table = typeof raw?.table === "string" ? raw.table : undefined;
    return { menu, table };
  },
  component: MenuPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.menu
          ? `${loaderData.menu.restaurant.name} · MenuAR`
          : "Menu not found · MenuAR",
      },
    ],
  }),
});

function MenuPage() {
  const { menu, table } = Route.useLoaderData();
  if (!menu) {
    return (
      <main className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Restaurant not found</h1>
          <p className="mt-2 text-sm text-muted">
            This menu is unpublished or the link is incorrect.
          </p>
        </div>
      </main>
    );
  }
  return <RestaurantMenu data={menu} table={table} />;
}
