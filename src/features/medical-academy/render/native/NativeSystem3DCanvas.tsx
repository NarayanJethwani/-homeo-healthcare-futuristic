"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AnatomySystemId } from "../../data/medicalAcademyData";
import { createBioDigitalShaders } from "./BioDigitalOrganShaders";
import { buildBioDigitalOrganSystem } from "./realisticOrganModels";
import { SubOrganMeshMeta } from "./systemMeshBuilders";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface NativeSystem3DCanvasProps {
  systemId: AnatomySystemId;
  accentColor: string;
  activeSubOrganId: string | null;
  onSubOrganSelect: (subOrganId: string) => void;
  activeRemedyTropismId: string | null;
  autoRotate?: boolean;
  xrayMode?: boolean;
}

export const NativeSystem3DCanvas: React.FC<NativeSystem3DCanvasProps> = ({
  systemId,
  accentColor,
  activeSubOrganId,
  onSubOrganSelect,
  activeRemedyTropismId,
  autoRotate = false,
  xrayMode = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredOrganName, setHoveredOrganName] = useState<string | null>(null);

  // References for render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const subOrganMetasRef = useRef<SubOrganMeshMeta[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 4.5));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Precision PBR
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 10;
    controls.minDistance = 1.2;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Medical Surgical Studio 4-Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Overhead Surgical Spot
    const surgicalLight = new THREE.SpotLight(0xffffff, 3.5);
    surgicalLight.position.set(2, 7, 4);
    surgicalLight.angle = Math.PI / 4;
    surgicalLight.penumbra = 0.6;
    surgicalLight.castShadow = true;
    scene.add(surgicalLight);

    // Lateral Fill Light (Tissue Contour)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(-5, -1, -3);
    scene.add(fillLight);

    // Cyan/Gold Rim Accent Light (Depth Separation)
    const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 2.5);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Subtle Ground Shadow Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -3.2;
    scene.add(gridHelper);

    // 6. Build BioDigital-Grade Realistic 3D Organ Models
    const materials = createBioDigitalShaders(systemId, accentColor);
    const { group: organGroup, subOrganMetas, animatables } = buildBioDigitalOrganSystem(
      systemId,
      materials,
      activeSubOrganId,
      activeRemedyTropismId
    );
    scene.add(organGroup);
    subOrganMetasRef.current = subOrganMetas;

    // 7. Raycasting Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(organGroup.children, true);

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && !hitObj.userData?.subOrganId && hitObj.parent && hitObj.parent !== organGroup) {
          hitObj = hitObj.parent;
        }
        if (hitObj?.userData?.name) {
          setHoveredOrganName(hitObj.userData.name);
          if (canvasRef.current) canvasRef.current.style.cursor = "pointer";
          return;
        }
      }
      setHoveredOrganName(null);
      if (canvasRef.current) canvasRef.current.style.cursor = "default";
    };

    const handlePointerClick = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(organGroup.children, true);

      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && !hitObj.userData?.subOrganId && hitObj.parent && hitObj.parent !== organGroup) {
          hitObj = hitObj.parent;
        }
        if (hitObj?.userData?.subOrganId) {
          onSubOrganSelect(hitObj.userData.subOrganId);
        }
      }
    };

    const canvasDom = canvasRef.current;
    canvasDom.addEventListener("mousemove", handlePointerMove);
    canvasDom.addEventListener("click", handlePointerClick);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards target
      if (cameraRef.current && controlsRef.current) {
        camera.position.lerp(targetCamPosRef.current, 0.05);
        controls.target.lerp(targetLookAtRef.current, 0.05);
        controls.update();
      }

      // Animate living tissue pulsation (e.g. heartbeat or endocrine secretion)
      animatables.forEach((item) => {
        if (item.type === "pulse") {
          const s = 1.0 + Math.sin(elapsedTime * item.speed * Math.PI) * 0.04;
          item.mesh.scale.set(s, s, s);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvasDom.removeEventListener("mousemove", handlePointerMove);
      canvasDom.removeEventListener("click", handlePointerClick);
      renderer.dispose();
    };
  }, [systemId, accentColor, activeSubOrganId, activeRemedyTropismId, autoRotate, xrayMode, onSubOrganSelect]);

  // Update target camera focus when activeSubOrganId changes
  useEffect(() => {
    if (!activeSubOrganId) {
      targetCamPosRef.current.set(0, 0, 4.5);
      targetLookAtRef.current.set(0, 0, 0);
      return;
    }

    const meta = subOrganMetasRef.current.find((m) => m.subOrganId === activeSubOrganId);
    if (meta) {
      targetCamPosRef.current.set(meta.cameraOffset[0], meta.cameraOffset[1], meta.cameraOffset[2]);
      targetLookAtRef.current.set(meta.focusTarget[0], meta.focusTarget[1], meta.focusTarget[2]);
    }
  }, [activeSubOrganId]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="h-full w-full outline-none" />

      {/* Floating Hover Raycast Label */}
      {hoveredOrganName && (
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-teal-500/40 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-teal-300 shadow-xl backdrop-blur animate-fadeIn">
          <span>🔍</span>
          <span>{hoveredOrganName}</span>
          <span className="text-[10px] text-slate-400 font-mono">(Click to isolate)</span>
        </div>
      )}
    </div>
  );
};
