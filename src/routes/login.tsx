import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { MenuArWordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="menuar-shell grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm space-y-6 rounded-3xl border border-border bg-surface p-6">
        <MenuArWordmark />
        <div>
          <h1 className="font-display text-3xl">Restaurant sign in</h1>
          <p className="mt-2 text-sm text-muted">
            Owners manage menus, 3D assets, QR codes and table orders from the dashboard.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/dashboard" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled in this environment.</p>
        )}
        <p className="text-center text-xs text-subtle">
          Guests never need an account.{" "}
          <Link to="/menu/$slug" params={{ slug: "golden-oak" }} className="text-accent">
            Open the demo menu
          </Link>
        </p>
      </div>
    </main>
  );
}
