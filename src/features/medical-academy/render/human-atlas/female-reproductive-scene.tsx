import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { View } from "./anatomy";
import { FEMALE_REPRODUCTIVE_ORGANS } from "./female-reproductive";

interface Props {
  selectedId: string | null;
  view: View;
  rotate: boolean;
  reset: number;
  onSelect: (id: string) => void;
  onProgress: (value: number) => void;
  onError: (message: string) => void;
}

export default function FemaleReproductiveScene({ selectedId, view, rotate, reset, onSelect, onProgress, onError }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef({ selectedId, view, rotate, reset, onSelect });
  useEffect(() => { latest.current = { selectedId, view, rotate, reset, onSelect }; }, [selectedId, view, rotate, reset, onSelect]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      onError("This browser could not start the female anatomy viewer. Please use a browser with WebGL enabled.");
      return;
    }

    let disposed = false;
    let frame = 0;
    let loaded = 0;
    let lastReset = latest.current.reset;
    let lastView = latest.current.view;
    let lastSelected = "";
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f2f3f3");
    const camera = new THREE.PerspectiveCamera(38, 1, 0.001, 10);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.085;
    controls.minDistance = 0.09;
    controls.maxDistance = 1.5;
    controls.maxPolarAngle = Math.PI * 0.95;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.setAttribute("aria-label", "Female reproductive anatomy. Drag to rotate, scroll or pinch to zoom, and select an organ to inspect it.");
    element.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xb4a6af, 2.4));
    const light = new THREE.DirectionalLight(0xffffff, 2.8);
    light.position.set(0.4, 0.8, 1);
    scene.add(light);
    const rim = new THREE.DirectionalLight(0xfce7ef, 1.5);
    rim.position.set(-0.5, 0.3, -0.6);
    scene.add(rim);

    const organs = new Map<string, THREE.Group>();
    const materials = new Map<string, THREE.MeshStandardMaterial[]>();
    const pickable: THREE.Object3D[] = [];
    const bounds = new THREE.Box3();
    const center = new THREE.Vector3();
    let radius = 0.08;
    const frameView = (direction: View) => {
      const aspect = Math.max(0.5, camera.aspect);
      const distance = Math.max(radius * 2.8, radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(1, aspect) * 1.25);
      const vector = direction === "back" ? new THREE.Vector3(0, 0.08, -1)
        : direction === "side" ? new THREE.Vector3(1, 0.08, 0)
          : direction === "front" ? new THREE.Vector3(0, 0.08, 1)
            : new THREE.Vector3(0.4, 0.15, 1);
      controls.target.copy(center);
      camera.position.copy(center).add(vector.normalize().multiplyScalar(distance));
      camera.near = Math.max(0.001, distance / 100);
      camera.far = distance * 20;
      camera.updateProjectionMatrix();
      controls.update();
    };
    const resize = () => {
      const width = Math.max(1, element.clientWidth);
      const height = Math.max(1, element.clientHeight);
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (loaded === FEMALE_REPRODUCTIVE_ORGANS.length) frameView(latest.current.view);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();

    const loader = new GLTFLoader();
    Promise.all(FEMALE_REPRODUCTIVE_ORGANS.map(async (organ) => {
      const model = await loader.loadAsync(organ.path);
      if (disposed) {
        model.scene.traverse((object) => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
        return;
      }
      const group = model.scene;
      group.name = organ.name;
      const organMaterials: THREE.MeshStandardMaterial[] = [];
      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.userData.organId = organ.id;
        const previousMaterial = object.material;
        object.material = new THREE.MeshStandardMaterial({ color: latest.current.selectedId === organ.id ? "#36a8a0" : organ.color, roughness: 0.55, metalness: 0.03, side: THREE.DoubleSide });
        (Array.isArray(previousMaterial) ? previousMaterial : [previousMaterial]).forEach((material) => material.dispose());
        organMaterials.push(object.material);
        pickable.push(object);
      });
      scene.add(group);
      organs.set(organ.id, group);
      materials.set(organ.id, organMaterials);
      bounds.expandByObject(group);
      loaded += 1;
      onProgress(Math.round(loaded / FEMALE_REPRODUCTIVE_ORGANS.length * 100));
      if (loaded === FEMALE_REPRODUCTIVE_ORGANS.length) {
        bounds.getCenter(center);
        radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
        frameView(latest.current.view);
      }
    })).catch((error: unknown) => {
      if (!disposed) onError(error instanceof Error ? error.message : "Could not load female reproductive anatomy.");
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let down: { x: number; y: number } | null = null;
    const onDown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY }; };
    const onUp = (event: PointerEvent) => {
      if (!down || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 8) return;
      down = null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickable, false)[0];
      const id = hit?.object.userData.organId;
      if (typeof id === "string") latest.current.onSelect(id);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    const animate = () => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);
      const current = latest.current;
      if (loaded === FEMALE_REPRODUCTIVE_ORGANS.length && (current.reset !== lastReset || current.view !== lastView)) {
        lastReset = current.reset;
        lastView = current.view;
        frameView(current.view);
      }
      if (lastSelected !== (current.selectedId ?? "")) {
        lastSelected = current.selectedId ?? "";
        materials.forEach((items, id) => items.forEach((material) => {
          const source = FEMALE_REPRODUCTIVE_ORGANS.find((organ) => organ.id === id);
          material.color.set(id === current.selectedId ? "#36a8a0" : source?.color ?? "#c86883");
        }));
      }
      controls.autoRotate = current.rotate;
      controls.autoRotateSpeed = 1.2;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      organs.forEach((group) => group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        (object.material as THREE.Material).dispose();
      }));
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onError, onProgress]);

  return <div ref={host} className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:touch-none" />;
}
