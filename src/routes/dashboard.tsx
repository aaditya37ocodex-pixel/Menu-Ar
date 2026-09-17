import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: DashboardHome,
});

function DashboardHome() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Owner tools</p>
      <h1 className="mt-3 font-display text-4xl">Dashboard</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        The live demo menu is ready for guests. Full owner editing needs a database later.
        For now, open the Golden Oak guest menu.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Button asChild size="lg">
          <Link to="/menu/$slug" params={{ slug: "golden-oak" }}>
            Open guest menu
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link to="/">Back home</Link>
        </Button>
      </div>
    </main>
  );
}
