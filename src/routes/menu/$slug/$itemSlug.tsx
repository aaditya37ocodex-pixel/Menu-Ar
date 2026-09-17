import { createFileRoute, Link } from "@tanstack/react-router";
import { FoodDetails } from "@/components/menu/food-details";
import { getPublicItem } from "@/lib/menuar/public";

export const Route = createFileRoute("/menu/$slug/$itemSlug")({
  loader: async ({ params }) => {
    return getPublicItem({ data: { slug: params.slug, itemSlug: params.itemSlug } });
  },
  component: ItemPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.item
          ? `${loaderData.item.name} · ${loaderData.restaurant.name}`
          : "Dish not found · MenuAR",
      },
    ],
  }),
});

function ItemPage() {
  const data = Route.useLoaderData();
  if (!data) {
    return (
      <main className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">Dish not found</h1>
          <p className="mt-2 text-sm text-muted">It may be unpublished or unavailable.</p>
          <Link to="/" className="mt-4 inline-block text-accent">
            Home
          </Link>
        </div>
      </main>
    );
  }
  return (
    <FoodDetails restaurant={data.restaurant} item={data.item} category={data.category} />
  );
}
