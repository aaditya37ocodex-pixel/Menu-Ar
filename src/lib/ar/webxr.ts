import * as THREE from "three";
import { buildFoodModel, FOOD_AR_SCALE } from "@/lib/food-3d/build-food";

type XRLike = {
  isSessionSupported: (mode: string) => Promise<boolean>;
  requestSession: (mode: string, opts?: Record<string, unknown>) => Promise<XRSessionLike>;
};

type XRSessionLike = {
  requestReferenceSpace: (type: string) => Promise<unknown>;
  requestHitTestSource?: (opts: { space: unknown }) => Promise<unknown>;
  addEventListener: (name: string, cb: () => void) => void;
  removeEventListener: (name: string, cb: () => void) => void;
  end: () => Promise<void>;
};

export type ArSupport = {
  webxr: boolean;
  immersiveAr: boolean;
  hitTest: boolean;
  message: string;
};

export async function detectArSupport(): Promise<ArSupport> {
  const xr = (navigator as Navigator & { xr?: XRLike }).xr;
  if (!xr?.isSessionSupported) {
    return {
      webxr: false,
      immersiveAr: false,
      hitTest: false,
      message:
        "AR is not supported on this device or browser. You can still explore this food item in 3D.",
    };
  }
  let immersiveAr = false;
  try {
    immersiveAr = await xr.isSessionSupported("immersive-ar");
  } catch {
    immersiveAr = false;
  }
  if (!immersiveAr) {
    return {
      webxr: true,
      immersiveAr: false,
      hitTest: false,
      message:
        "WebXR AR is not available here. On many phones, Android Chrome supports table placement. You can still explore this dish in 3D.",
    };
  }
  return {
    webxr: true,
    immersiveAr: true,
    hitTest: true,
    message: "This browser reports WebXR AR. Table placement works when hit-test is granted.",
  };
}

export type ArHandle = {
  setScale: (s: number) => void;
  setRotation: (y: number) => void;
  reset: () => void;
  end: () => Promise<void>;
};

export async function startHitTestAr(options: {
  canvas: HTMLCanvasElement;
  overlay: HTMLElement;
  modelKey: string;
  modelUrl?: string | null;
  onStatus: (text: string) => void;
  onPlaced: (placed: boolean) => void;
}): Promise<ArHandle> {
  const xr = (navigator as Navigator & { xr?: XRLike }).xr;
  if (!xr) throw new Error("WebXR is not available");

  const renderer = new THREE.WebGLRenderer({
    canvas: options.canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.xr.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  scene.add(new THREE.HemisphereLight(0xffe8c8, 0x16120c, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(0.4, 1.4, 0.3);
  scene.add(key);

  const built = buildFoodModel(options.modelKey);
  const food = built.group;
  const baseScale = FOOD_AR_SCALE[options.modelKey] ?? 0.22;
  let userScale = 1;
  let userRot = 0;
  food.visible = false;
  scene.add(food);

  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.075, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0xe0a96d }),
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  const session = await xr.requestSession("immersive-ar", {
    requiredFeatures: ["hit-test"],
    optionalFeatures: ["dom-overlay", "local-floor", "anchors"],
    domOverlay: { root: options.overlay },
  });

  await renderer.xr.setSession(session as never);
  const refSpace = await session.requestReferenceSpace("local");
  const viewerSpace = await session.requestReferenceSpace("viewer");
  if (!session.requestHitTestSource) {
    await session.end();
    throw new Error("Hit-test is not available in this browser");
  }
  const hitTestSource = await session.requestHitTestSource({ space: viewerSpace });

  let placed = false;
  options.onStatus("Move your phone slowly to detect a flat surface.");

  const onSelect = () => {
    if (!reticle.visible) return;
    food.matrix.copy(reticle.matrix);
    food.matrixAutoUpdate = false;
    food.visible = true;
    placed = true;
    options.onPlaced(true);
    options.onStatus("Use the controls to rotate and resize. The dish stays on the table.");
    applyFoodTransform();
  };

  options.overlay.addEventListener("pointerdown", onSelect);

  function applyFoodTransform() {
    const s = baseScale * userScale;
    food.scale.setScalar(s);
    food.rotation.set(0, userRot, 0);
    food.matrixAutoUpdate = true;
  }

  renderer.setAnimationLoop((_time, frame) => {
    if (!frame) return;
    const xrFrame = frame as unknown as {
      getHitTestResults: (source: unknown) => Array<{
        getPose: (space: unknown) => { transform: { matrix: Float32Array } } | null;
      }>;
    };
    if (!placed) {
      const hits = xrFrame.getHitTestResults(hitTestSource);
      if (hits[0]) {
        const pose = hits[0].getPose(refSpace);
        if (pose) {
          reticle.visible = true;
          reticle.matrix.fromArray(pose.transform.matrix);
          options.onStatus("Tap on the table to place your food.");
        }
      } else {
        reticle.visible = false;
      }
    }
    renderer.render(scene, camera);
  });

  const onEnd = () => {
    renderer.setAnimationLoop(null);
    built.dispose();
    renderer.dispose();
    options.overlay.removeEventListener("pointerdown", onSelect);
  };
  session.addEventListener("end", onEnd);

  return {
    setScale(s: number) {
      userScale = s;
      if (placed) applyFoodTransform();
    },
    setRotation(y: number) {
      userRot = y;
      if (placed) applyFoodTransform();
    },
    reset() {
      placed = false;
      food.visible = false;
      reticle.visible = false;
      userScale = 1;
      userRot = 0;
      options.onPlaced(false);
      options.onStatus("Move your phone slowly to detect a flat surface.");
    },
    async end() {
      try {
        await session.end();
      } catch {
        onEnd();
      }
    },
  };
}
