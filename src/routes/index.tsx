import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, QrCode, Scan, Store } from "lucide-react";
import { MenuArWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { DEMO_IMAGES } from "@/lib/menuar/demo-menu";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="menuar-shell">
      <div className="mx-auto max-w-5xl px-5 pb-16 pt-6">
        <header className="flex items-center justify-between gap-4">
          <MenuArWordmark />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Owner sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/menu/$slug" params={{ slug: "golden-oak" }}>
                Open demo
              </Link>
            </Button>
          </div>
        </header>

        <section className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              3D AR restaurant menu
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] sm:text-6xl">
              See the dish on your table before you order.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              MenuAR is a QR menu for restaurants. Guests browse the kitchen, spin a real 3D
              model, and — on compatible phones — place food on the table with WebXR. The model
              stays in the room. It does not follow the camera.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/menu/$slug" params={{ slug: "golden-oak" }}>
                  Explore Golden Oak
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/login">Restaurant dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-card">
            <img
              src={DEMO_IMAGES.burger}
              alt="Classic burger in 3D-ready plating"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="grid grid-cols-3 divide-x divide-border bg-surface">
              {[
                ["9 dishes", "Demo kitchen"],
                ["True AR", "when WebXR allows"],
                ["3D fallback", "on every device"],
              ].map(([k, v]) => (
                <div key={k} className="px-3 py-3">
                  <p className="text-sm font-semibold text-fg">{k}</p>
                  <p className="text-[11px] text-muted">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: QrCode,
              title: "Scan",
              body: "Each table gets a QR code that opens the restaurant menu — no app install, no guest account.",
            },
            {
              icon: Box,
              title: "Explore",
              body: "Spin, zoom and inspect a 3D model of the dish. Models load only when a guest asks to see them.",
            },
            {
              icon: Scan,
              title: "Taste with confidence",
              body: "On supported Android Chrome sessions, hit-test AR parks the dish on the table. Elsewhere, a clear 3D fallback.",
            },
          ].map((step) => (
            <article key={step.title} className="rounded-3xl border border-border bg-surface p-5">
              <step.icon className="size-5 text-accent" />
              <h2 className="mt-4 font-display text-2xl">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] border border-border bg-surface">
          <div className="grid md:grid-cols-2">
            <div className="p-6 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                For restaurants
              </p>
              <h2 className="mt-2 font-display text-3xl">Publish a living menu.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Sign in to add dishes, categories, photos, 3D keys, table QR codes and kitchen
                orders. Guests never see the dashboard.
              </p>
              <Button asChild className="mt-6">
                <Link to="/login">
                  <Store className="size-4" />
                  Open dashboard
                </Link>
              </Button>
            </div>
            <img
              src={DEMO_IMAGES.salad}
              alt="Grilled chicken salad"
              className="h-full min-h-56 w-full object-cover"
            />
          </div>
        </section>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
          <p>MenuAR · Scan. Explore. Taste.</p>
          <p>WebXR table placement where the browser supports it. 3D everywhere else.</p>
        </footer>
      </div>
    </main>
  );
}
