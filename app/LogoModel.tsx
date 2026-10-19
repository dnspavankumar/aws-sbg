"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// One shared 3D AWS logo that docks into empty `[data-logo-anchor]` slots around the page and glides between them on scroll.
// It holds still in its slot apart from a steady turn; `data-tone="dark"` swaps the navy lettering to cream for black sections.

const INK = new THREE.Color(0.0185, 0.0284, 0.0482);
const CREAM = new THREE.Color("#f3f0e9");
const SPIN_RADIANS_PER_SECOND = 0.6;
const INTRO_SECONDS = 1.6;

const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const easeOutBack = (p: number) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;

export default function LogoModel({ revealAfterMs }: { revealAfterMs: number | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealAt = useRef<number | null>(null);

  useEffect(() => {
    if (revealAfterMs === null) return;
    revealAt.current = performance.now() + revealAfterMs;
  }, [revealAfterMs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.NeutralToneMapping;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.25;
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(0.4, 0.8, 1);
    scene.add(key, new THREE.AmbientLight(0xffffff, 0.2));
    // Orthographic camera in CSS pixels, so anchor rects map straight onto world units.
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -5000, 5000);
    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      Object.assign(camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    const rig = new THREE.Group();
    scene.add(rig);
    let aspect = 1;
    let letters: THREE.MeshStandardMaterial | null = null;
    let disposed = false;
    new GLTFLoader().load("/aws-logo-3d.glb", (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(box.getCenter(new THREE.Vector3()));
      const wrapper = new THREE.Group();
      wrapper.add(model);
      wrapper.scale.setScalar(1 / size.x);
      aspect = size.y / size.x;
      model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.name === "Material.003") { letters = material; material.roughness = 0.6; }
      });
      rig.add(wrapper);
    });

    const pos = { x: 0, y: 0, w: 0 };
    let spin = 0;
    let placed = false;

    const pickAnchor = () => {
      const middle = window.innerHeight / 2;
      let best: Element | null = null, bestDistance = Infinity;
      document.querySelectorAll("[data-logo-anchor]").forEach((anchor) => {
        const rect = anchor.getBoundingClientRect();
        if (rect.width === 0) return;
        const distance = Math.abs(rect.top + rect.height / 2 - middle);
        if (distance < bestDistance) { best = anchor; bestDistance = distance; }
      });
      return best as Element | null;
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const anchor = pickAnchor();
      if (!anchor) { renderer.render(scene, camera); return; }
      const rect = anchor.getBoundingClientRect();
      const width = Math.min(rect.width, rect.height / aspect);
      const target = { x: rect.left + rect.width / 2 - window.innerWidth / 2, y: window.innerHeight / 2 - (rect.top + rect.height / 2), w: width };
      if (!placed) { Object.assign(pos, target); placed = true; }
      // Fast follow keeps the logo glued to its anchor while scrolling; the lag only shows when it moves between anchors.
      const follow = damp(reducedMotion ? 30 : 7, dt);
      pos.x += (target.x - pos.x) * follow;
      pos.y += (target.y - pos.y) * follow;
      pos.w += (target.w - pos.w) * follow;

      if (!reducedMotion) spin = (spin + dt * SPIN_RADIANS_PER_SECOND) % (Math.PI * 2);

      const reveal = revealAt.current;
      const introProgress = reveal === null ? 0 : reducedMotion ? 1 : THREE.MathUtils.clamp((now - reveal) / (INTRO_SECONDS * 1000), 0, 1);
      const introScale = introProgress === 0 ? 0 : easeOutBack(introProgress);

      rig.position.set(pos.x, pos.y, 0);
      rig.scale.setScalar(Math.max(pos.w * introScale, 1e-4));
      rig.rotation.set(0, spin, 0);
      rig.visible = introScale > 0;

      if (letters) letters.color.lerp((anchor as HTMLElement).dataset.tone === "dark" ? CREAM : INK, damp(4, dt));
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas className="logo-canvas" ref={canvasRef} aria-hidden="true" />;
}
