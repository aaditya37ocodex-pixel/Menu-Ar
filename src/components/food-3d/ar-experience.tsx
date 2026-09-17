import { Link } from "@tanstack/react-router";
import { Box, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { detectArSupport, startHitTestAr, type ArHandle, type ArSupport } from "@/lib/ar/webxr";
import { Button } from "@/components/ui/button";
import { FoodViewerLazy } from "@/components/food-3d/food-viewer";
import type { MenuItem, Restaurant } from "@/lib/menuar/types";

export function ArExperience({
  restaurant,
  item,
}: {
  restaurant: Restaurant;
  item: MenuItem;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ArHandle | null>(null);
  const [support, setSupport] = useState<ArSupport | null>(null);
  const [status, setStatus] = useState("Checking this device…");
  const [sessionOn, setSessionOn] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [scale, setScale] = useState(1);
  const [rot, setRot] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    detectArSupport().then((s) => {
      if (live) setSupport(s);
    });
    return () => {
      live = false;
      handleRef.current?.end().catch(() => undefined);
    };
  }, []);

  async function start() {
    setError(null);
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    try {
      const handle = await startHitTestAr({
        canvas,
        overlay,
        modelKey: item.modelKey || "burger",
        modelUrl: item.modelUrl,
        onStatus: setStatus,
        onPlaced: setPlaced,
      });
      handleRef.current = handle;
      setSessionOn(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not start AR. Camera permission may have been denied.",
      );
      setSessionOn(false);
    }
  }

  function changeScale(next: number) {
    const s = Math.min(2.4, Math.max(0.5, next));
    setScale(s);
    handleRef.current?.setScale(s);
  }
  function changeRot(next: number) {
    setRot(next);
    handleRef.current?.setRotation(next);
  }

  const canAr = Boolean(support?.immersiveAr);

  return (
    <div className="relative min-h-dvh bg-bg text-fg">
      <canvas
        ref={canvasRef}
        className={sessionOn ? "fixed inset-0 h-full w-full" : "hidden"}
      />
      <div
        ref={overlayRef}
        className={sessionOn ? "pointer-events-none fixed inset-0 z-10" : "hidden"}
      >
        <div className="pointer-events-auto flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              {restaurant.name}
            </p>
            <h1 className="font-display text-xl">{item.name}</h1>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => {
              handleRef.current?.end().catch(() => undefined);
              setSessionOn(false);
              setPlaced(false);
            }}
            aria-label="Exit AR"
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 rounded-full border border-accent/70 px-4 py-2 text-xs text-fg">
          {status}
        </div>
        {placed ? (
          <div className="pointer-events-auto absolute bottom-6 left-1/2 flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-3 rounded-3xl border border-border bg-bg/85 p-4 backdrop-blur-md">
            <p className="text-center text-xs text-muted">
              Use two fingers or the controls to adjust the model.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="icon" onClick={() => changeScale(scale - 0.12)} aria-label="Smaller">
                <Minus className="size-4" />
              </Button>
              <span className="w-16 text-center text-xs tabular-nums text-muted">
                {Math.round(scale * 100)}%
              </span>
              <Button variant="secondary" size="icon" onClick={() => changeScale(scale + 0.12)} aria-label="Larger">
                <Plus className="size-4" />
              </Button>
              <Button variant="secondary" onClick={() => changeRot(rot + 0.4)}>
                Rotate
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  handleRef.current?.reset();
                  setScale(1);
                  setRot(0);
                }}
                aria-label="Reset placement"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {!sessionOn ? (
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-10 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <Link
              to="/menu/$slug/$itemSlug"
              params={{ slug: restaurant.slug, itemSlug: item.slug }}
              className="text-sm text-muted"
            >
              Back to dish
            </Link>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              Table AR
            </p>
          </div>
          <h1 className="font-display text-3xl">{item.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Place this dish on a real table where WebXR is available. The model stays on the
            surface — it does not stick to the camera.
          </p>
          <div className="mt-5 h-[42vh] min-h-56">
            <FoodViewerLazy modelKey={item.modelKey} modelUrl={item.modelUrl} className="h-full" />
          </div>
          <div className="mt-5 rounded-2xl border border-border bg-surface p-4 text-sm text-muted">
            <p>{support?.message ?? status}</p>
            {error ? <p className="mt-2 text-danger">{error}</p> : null}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Button size="lg" disabled={!canAr} onClick={() => void start()}>
              {canAr ? "Start table AR" : "AR unavailable on this device"}
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link
                to="/menu/$slug/$itemSlug"
                params={{ slug: restaurant.slug, itemSlug: item.slug }}
              >
                <Box className="size-4" />
                Explore in 3D instead
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
