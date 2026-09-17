import * as THREE from "three";

export type BuiltFood = {
  group: THREE.Group;
  dispose: () => void;
};

function std(
  color: number,
  extras: ConstructorParameters<typeof THREE.MeshStandardMaterial>[0] = {},
) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.62,
    metalness: 0.04,
    ...extras,
  });
}

function mesh(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  x = 0,
  y = 0,
  z = 0,
  sx = 1,
  sy = 1,
  sz = 1,
) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const meshObj = obj as THREE.Mesh;
    if (meshObj.geometry) meshObj.geometry.dispose();
    const mat = meshObj.material;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else if (mat) mat.dispose();
  });
}

function plate(group: THREE.Group, radius = 0.46, color = 0x1c1d22) {
  const p = mesh(new THREE.CylinderGeometry(radius, radius * 0.92, 0.035, 48), std(color, { roughness: 0.4 }), 0, 0.018, 0);
  const rim = mesh(
    new THREE.TorusGeometry(radius * 0.92, 0.012, 8, 48),
    std(0x2a2c33, { roughness: 0.35 }),
    0,
    0.036,
    0,
  );
  rim.rotation.x = Math.PI / 2;
  group.add(p, rim);
}

export function buildFoodModel(key: string): BuiltFood {
  const group = new THREE.Group();
  group.name = key;
  switch (key) {
    case "pizza":
      buildPizza(group);
      break;
    case "tikka":
      buildTikka(group);
      break;
    case "biryani":
      buildBiryani(group);
      break;
    case "brownie":
      buildBrownie(group);
      break;
    case "shake":
      buildShake(group);
      break;
    case "salad":
      buildSalad(group);
      break;
    case "dumplings":
      buildDumplings(group);
      break;
    case "burrata":
      buildBurrata(group);
      break;
    case "burger":
    default:
      buildBurger(group);
      break;
  }
  return {
    group,
    dispose: () => disposeObject(group),
  };
}

function buildBurger(g: THREE.Group) {
  plate(g, 0.42, 0x16171c);
  const bun = std(0xd9a15c, { roughness: 0.78 });
  const bunTop = std(0xc6863c, { roughness: 0.72 });
  const patty = std(0x4a2a18, { roughness: 0.9 });
  const cheese = std(0xe6b83a, { roughness: 0.45 });
  const lettuce = std(0x4f9a46, { roughness: 0.7 });
  const tomato = std(0xc4452d, { roughness: 0.5 });
  const seed = std(0xf3e6c8, { roughness: 0.4 });
  g.add(mesh(new THREE.SphereGeometry(0.22, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), bun, 0, 0.09, 0, 1.15, 0.55, 1.15));
  g.add(mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.035, 28), lettuce, 0, 0.13, 0, 1, 1, 1));
  g.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.018, 20), tomato, -0.05, 0.155, 0.02));
  g.add(mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.018, 20), tomato, 0.06, 0.155, -0.03));
  g.add(mesh(new THREE.CylinderGeometry(0.2, 0.205, 0.07, 24), patty, 0, 0.2, 0));
  const ch = mesh(new THREE.BoxGeometry(0.4, 0.018, 0.4), cheese, 0, 0.242, 0);
  ch.rotation.y = 0.18;
  g.add(ch);
  g.add(mesh(new THREE.SphereGeometry(0.23, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2), bunTop, 0, 0.255, 0, 1.12, 0.72, 1.12));
  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * Math.PI * 2;
    const r = 0.09 + (i % 3) * 0.035;
    g.add(mesh(new THREE.SphereGeometry(0.012, 8, 8), seed, Math.cos(a) * r, 0.41, Math.sin(a) * r));
  }
}

function buildPizza(g: THREE.Group) {
  plate(g, 0.5, 0x171614);
  const dough = std(0xd2a36a, { roughness: 0.86 });
  const sauce = std(0xa83222, { roughness: 0.55 });
  const cheese = std(0xf0d79a, { roughness: 0.48 });
  const pep = std(0x9a2d22, { roughness: 0.6 });
  const basil = std(0x2f7a38, { roughness: 0.65 });
  g.add(mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.04, 40), dough, 0, 0.055, 0));
  const crust = mesh(new THREE.TorusGeometry(0.38, 0.045, 10, 40), dough, 0, 0.07, 0);
  crust.rotation.x = Math.PI / 2;
  g.add(crust);
  g.add(mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.012, 40), sauce, 0, 0.08, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.01, 40), cheese, 0, 0.088, 0));
  for (let i = 0; i < 9; i += 1) {
    const a = (i / 9) * Math.PI * 2;
    const r = 0.1 + (i % 3) * 0.07;
    g.add(mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.012, 16), pep, Math.cos(a) * r, 0.098, Math.sin(a) * r));
  }
  for (let i = 0; i < 6; i += 1) {
    const a = i * 1.1;
    const leaf = mesh(new THREE.SphereGeometry(0.04, 10, 8), basil, Math.cos(a) * 0.18, 0.11, Math.sin(a) * 0.18, 1.4, 0.25, 0.8);
    leaf.rotation.z = 0.4;
    g.add(leaf);
  }
}

function buildTikka(g: THREE.Group) {
  plate(g, 0.44, 0x1a1814);
  const paneer = std(0xe8c98a, { roughness: 0.55 });
  const char = std(0x6a3a1c, { roughness: 0.8 });
  const pepper = std(0xb33a2a, { roughness: 0.5 });
  const onion = std(0xd9c4d0, { roughness: 0.45 });
  const stick = std(0x8a6a44, { roughness: 0.4, metalness: 0.2 });
  const chutney = std(0x2f6b3a, { roughness: 0.35 });
  g.add(mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.03, 20), chutney, 0.28, 0.05, 0.18));
  for (let s = 0; s < 2; s += 1) {
    const x = s === 0 ? -0.1 : 0.12;
    const z = s === 0 ? -0.08 : 0.08;
    const rod = mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.72, 8), stick, x, 0.16, z);
    rod.rotation.z = Math.PI / 2.4;
    rod.rotation.y = s === 0 ? 0.25 : -0.2;
    g.add(rod);
    for (let i = 0; i < 4; i += 1) {
      const t = (i - 1.5) * 0.13;
      const cube = mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), i % 2 ? paneer : char, x + t, 0.14 + Math.abs(t) * 0.08, z);
      cube.rotation.set(0.2, 0.4 * i, 0.15);
      g.add(cube);
      if (i % 2 === 0) g.add(mesh(new THREE.BoxGeometry(0.07, 0.04, 0.07), pepper, x + t + 0.02, 0.2, z + 0.02));
      else g.add(mesh(new THREE.BoxGeometry(0.06, 0.03, 0.06), onion, x + t - 0.01, 0.2, z - 0.02));
    }
  }
}

function buildBiryani(g: THREE.Group) {
  const bowl = std(0x6a3b24, { roughness: 0.35, metalness: 0.25 });
  const rim = std(0xc4a574, { roughness: 0.3, metalness: 0.4 });
  g.add(mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.16, 32), bowl, 0, 0.1, 0));
  const bowlRim = mesh(new THREE.TorusGeometry(0.28, 0.018, 8, 32), rim, 0, 0.18, 0);
  bowlRim.rotation.x = Math.PI / 2;
  g.add(bowlRim);
  const rice = std(0xf2e1b8, { roughness: 0.7 });
  const saffron = std(0xe0a04a, { roughness: 0.65 });
  const chicken = std(0x8a4a28, { roughness: 0.7 });
  const herb = std(0x3d7a3a, { roughness: 0.6 });
  g.add(mesh(new THREE.SphereGeometry(0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), rice, 0, 0.16, 0, 1, 0.7, 1));
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.018, 0.006, 0.006), saffron, 90);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 90; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.2;
    dummy.position.set(Math.cos(a) * r, 0.22 + Math.random() * 0.06, Math.sin(a) * r);
    dummy.rotation.set(0, Math.random() * 3, Math.random());
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  inst.castShadow = true;
  g.add(inst);
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    g.add(mesh(new THREE.SphereGeometry(0.045, 12, 10), chicken, Math.cos(a) * 0.12, 0.24, Math.sin(a) * 0.12, 1.2, 0.7, 1));
  }
  g.add(mesh(new THREE.SphereGeometry(0.03, 8, 8), herb, 0.05, 0.3, 0.04, 1.6, 0.3, 1));
}

function buildBrownie(g: THREE.Group) {
  plate(g, 0.36, 0x1b1714);
  const cake = std(0x4a2a1c, { roughness: 0.85 });
  const top = std(0x2d1810, { roughness: 0.55 });
  const cream = std(0xf4efe4, { roughness: 0.45 });
  const sauce = std(0x2a120c, { roughness: 0.35 });
  g.add(mesh(new THREE.BoxGeometry(0.28, 0.12, 0.28), cake, 0, 0.1, 0));
  g.add(mesh(new THREE.BoxGeometry(0.282, 0.02, 0.282), top, 0, 0.16, 0));
  g.add(mesh(new THREE.SphereGeometry(0.09, 18, 14), cream, 0.04, 0.24, 0.02, 1, 0.85, 1));
  g.add(mesh(new THREE.SphereGeometry(0.04, 10, 10), sauce, -0.02, 0.2, 0.08, 1.4, 0.35, 1));
}

function buildShake(g: THREE.Group) {
  const glass = std(0xdce7ee, { roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.28 });
  const drink = std(0xe8b03a, { roughness: 0.35 });
  const foam = std(0xf6e4b8, { roughness: 0.55 });
  const straw = std(0x1b1b1f, { roughness: 0.3, metalness: 0.4 });
  const mango = std(0xf0a020, { roughness: 0.5 });
  g.add(mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.32, 24), glass, 0, 0.2, 0));
  g.add(mesh(new THREE.CylinderGeometry(0.078, 0.062, 0.24, 24), drink, 0, 0.16, 0));
  g.add(mesh(new THREE.SphereGeometry(0.08, 16, 12), foam, 0, 0.34, 0, 1, 0.45, 1));
  const st = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 8), straw, 0.03, 0.32, 0);
  st.rotation.z = -0.22;
  g.add(st);
  g.add(mesh(new THREE.SphereGeometry(0.04, 10, 8), mango, 0.12, 0.38, 0.02, 1.3, 0.5, 0.8));
  plate(g, 0.22, 0x14151a);
}

function buildSalad(g: THREE.Group) {
  const dish = std(0xefefef, { roughness: 0.35 });
  g.add(mesh(new THREE.BoxGeometry(0.55, 0.05, 0.55), dish, 0, 0.03, 0));
  g.add(mesh(new THREE.BoxGeometry(0.5, 0.04, 0.5), std(0xe8e8e8, { roughness: 0.4 }), 0, 0.06, 0));
  const leaf = std(0x3f8a45, { roughness: 0.7 });
  const tomato = std(0xc83a2a, { roughness: 0.45 });
  const cukes = std(0x7bb86a, { roughness: 0.5 });
  const chicken = std(0xd9b07a, { roughness: 0.55 });
  const avo = std(0x7a9a3a, { roughness: 0.5 });
  for (let i = 0; i < 18; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.18;
    const m = mesh(new THREE.SphereGeometry(0.07, 10, 8), leaf, Math.cos(a) * r, 0.1, Math.sin(a) * r, 1.5, 0.22, 1.1);
    m.rotation.set(Math.random(), Math.random(), Math.random());
    g.add(m);
  }
  for (let i = 0; i < 5; i += 1) {
    g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.016, 20), tomato, -0.12 + i * 0.03, 0.12, 0.12 - i * 0.01));
  }
  for (let i = 0; i < 6; i += 1) {
    g.add(mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.012, 18), cukes, 0.14, 0.12, -0.12 + i * 0.035));
  }
  for (let i = 0; i < 6; i += 1) {
    const strip = mesh(new THREE.BoxGeometry(0.08, 0.025, 0.04), chicken, -0.02 + (i % 3) * 0.06, 0.16, -0.02 + Math.floor(i / 3) * 0.07);
    strip.rotation.y = 0.4;
    g.add(strip);
  }
  g.add(mesh(new THREE.SphereGeometry(0.06, 12, 10), avo, -0.18, 0.13, -0.08, 1.3, 0.45, 1));
}

function buildDumplings(g: THREE.Group) {
  plate(g, 0.4, 0x141416);
  const wrap = std(0xe6d3a8, { roughness: 0.55 });
  const sear = std(0xb8874a, { roughness: 0.6 });
  const glaze = std(0x2a1a12, { roughness: 0.3 });
  g.add(mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.01, 20), glaze, 0, 0.04, 0));
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    const x = Math.cos(a) * 0.12;
    const z = Math.sin(a) * 0.12;
    g.add(mesh(new THREE.SphereGeometry(0.08, 16, 12), wrap, x, 0.1, z, 1, 0.75, 1));
    g.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 12), sear, x, 0.07, z));
  }
}

function buildBurrata(g: THREE.Group) {
  plate(g, 0.42, 0x171614);
  const cheese = std(0xf4efe4, { roughness: 0.5 });
  const cream = std(0xf7f2e6, { roughness: 0.35 });
  const ham = std(0xc46a58, { roughness: 0.55 });
  const tomato = std(0xc4452d, { roughness: 0.45 });
  const basil = std(0x2f7a38, { roughness: 0.6 });
  g.add(mesh(new THREE.SphereGeometry(0.14, 24, 16), cheese, -0.04, 0.16, 0, 1.1, 0.85, 1.1));
  g.add(mesh(new THREE.SphereGeometry(0.08, 16, 12), cream, 0.04, 0.16, 0.02, 1, 0.5, 1));
  const fold = mesh(new THREE.BoxGeometry(0.22, 0.015, 0.12), ham, 0.16, 0.12, -0.08);
  fold.rotation.y = 0.5;
  g.add(fold);
  const fold2 = mesh(new THREE.BoxGeometry(0.18, 0.012, 0.1), ham, 0.14, 0.14, -0.02);
  fold2.rotation.y = 0.2;
  g.add(fold2);
  for (let i = 0; i < 4; i += 1) {
    g.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), tomato, 0.18 - i * 0.04, 0.1, 0.16));
  }
  g.add(mesh(new THREE.SphereGeometry(0.04, 8, 8), basil, -0.16, 0.12, 0.12, 1.5, 0.25, 1));
}

export const FOOD_AR_SCALE: Record<string, number> = {
  burger: 0.22,
  pizza: 0.28,
  tikka: 0.24,
  biryani: 0.22,
  brownie: 0.18,
  shake: 0.2,
  salad: 0.26,
  dumplings: 0.2,
  burrata: 0.22,
};
