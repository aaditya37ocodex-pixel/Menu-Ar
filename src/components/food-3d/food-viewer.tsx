import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RotateCcw, RefreshCw } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { buildFoodModel } from "@/lib/food-3d/build-food";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FoodPrimitive({ modelKey }: { modelKey?: string | null }) {
  const built = useMemo(() => buildFoodModel(modelKey || "burger"), [modelKey]);
  useEffect(() => () => built.dispose(), [built]);
  return <primitive object={built.group} />;
}

function Scene({
  modelKey,
  autoRotate,
}: {
  modelKey?: string | null;
  modelUrl?: string | null;
  autoRotate: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#0c0d12"]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffe8c8", "#16120c", 0.45]} />
      <directionalLight position={[3.2, 5.4, 2.4]} intensity={1.35} castShadow />
      <spotLight position={[-3, 4, -2]} intensity={0.45} angle={0.5} color="#e0a96d" />
      <group position={[0, 0, 0]}>
        <FoodPrimitive modelKey={modelKey} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[1.6, 48]} />
        <meshStandardMaterial color="#16171d" roughness={0.9} />
      </mesh>
      <ContactShadows opacity={0.45} scale={3} blur={2.2} far={2} />
      <OrbitControls
        enablePan={false}
        minDistance={0.8}
        maxDistance={3.2}
        maxPolarAngle={Math.PI / 1.7}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        makeDefault
      />
    </>
  );
}

export function FoodViewer({
  modelKey,
  modelUrl,
  className,
  onReady,
}: {
  modelKey?: string | null;
  modelUrl?: string | null;
  className?: string;
  onReady?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    onReady?.();
  }, [onReady]);

  if (!mounted) {
    return (
      <div className={cn("grid place-items-center rounded-3xl bg-surface text-sm text-muted", className)}>
        Preparing 3D view…
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-bg-elevated hairline", className)}>
      <Canvas
        key={resetKey}
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0.9, 0.85, 1.35], fov: 35 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0c0d12");
        }}
      >
        <Suspense fallback={null}>
          <Scene modelKey={modelKey} modelUrl={modelUrl} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Drag to rotate · pinch to zoom
        </p>
        <div className="flex gap-1.5">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="size-10"
            onClick={() => setAutoRotate((v) => !v)}
            aria-label="Toggle auto-rotate"
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="size-10"
            onClick={() => setResetKey((k) => k + 1)}
            aria-label="Reset camera"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FoodViewerLazy(props: {
  modelKey?: string | null;
  modelUrl?: string | null;
  className?: string;
  onReady?: () => void;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) {
    return (
      <div className={cn("grid min-h-64 place-items-center rounded-3xl bg-surface text-sm text-muted", props.className)}>
        Loading 3D…
      </div>
    );
  }
  return <FoodViewer {...props} />;
}
