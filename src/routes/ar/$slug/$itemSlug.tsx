import { createFileRoute, Link } from "@tanstack/react-router";
import { ArExperience } from "@/components/food-3d/ar-experience";
import { getPublicItem } from "@/lib/menuar/public";
import { has3dModel } from "@/lib/menuar/types";

export const Route = createFileRoute("/ar/$slug/$itemSlug")({
  loader: async ({ params }) => {
    return getPublicItem({ data: { slug: params.slug, itemSlug: params.itemSlug } });
  },
  component: ArPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.item ? `AR · ${loaderData.item.name}` : "AR · MenuAR",
      },
    ],
  }),
});

function ArPage() {
  const data = Route.useLoaderData();
  if (!data || !has3dModel(data.item)) {
    return (
      <main className="grid min-h-dvh place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-3xl">AR is not available for this dish</h1>
          <p className="mt-2 text-sm text-muted">
            AR is not supported on this device or browser. You can still explore this food item in
            3D.
          </p>
          <Link to="/" className="mt-4 inline-block text-accent">
            Home
          </Link>
        </div>
      </main>
    );
  }
  return <ArExperience restaurant={data.restaurant} item={data.item} />;
}
