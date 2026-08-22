"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AnatomySystemId } from "../../data/medicalAcademyData";
import { SYSTEM_3D_REGISTRY } from "../system3DRegistry";
import { GLBAnatomyModelLoader, AnatomyMeshNode } from "./GLBAnatomyModelLoader";
import { AnatomyMaterialPipeline } from "./AnatomyMaterialPipeline";
import { AnatomyCameraController } from "./AnatomyCameraController";
import { AnatomyRaycaster } from "./AnatomyRaycaster";
import { AnatomyModelErrorBoundary } from "./AnatomyModelErrorBoundary";
import { AnatomyLayerVisibility } from "./RealisticAnatomyEngine";

interface NativeSystem3DCanvasProps {
  systemId: AnatomySystemId;
  accentColor: string;
  activeSubOrganId: string | null;
  onSubOrganSelect: (subOrganId: string | null) => void;
  activeRemedyTropismId?: string | null;
  autoRotate?: boolean;
  layers?: AnatomyLayerVisibility;
}

export const NativeSystem3DCanvas: React.FC<NativeSystem3DCanvasProps> = ({
  systemId,
  accentColor,
  activeSubOrganId,
  onSubOrganSelect,
  autoRotate = false,
  layers,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hoveredNodeName, setHoveredNodeName] = useState<string | null>(null);

  // References for render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraControllerRef = useRef<AnatomyCameraController | null>(null);
  const materialPipelineRef = useRef<AnatomyMaterialPipeline | null>(null);
  const raycasterRef = useRef<AnatomyRaycaster | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const meshNodesRef = useRef<AnatomyMeshNode[]>([]);

  const config = SYSTEM_3D_REGISTRY[systemId] || SYSTEM_3D_REGISTRY.digestive;
  const primaryAsset = config.assets[0];

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    // If the system has no registered authentic assets, fail-visible immediately
    if (!primaryAsset || !primaryAsset.filePath) {
      setIsLoading(false);
      setLoadError("Anatomical model dataset is currently in preparation for this system.");
      return;
    }

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    sceneRef.current = scene;

    // 2. Camera setup with balanced framing (prevents balloon zoom)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.0);
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
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Adaptive Medical Lighting Suite
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.7);
    fillLight.position.set(-4, -2, 3);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 0.65);
    rimLight.position.set(0, 5, -4);

    scene.add(ambientLight, keyLight, fillLight, rimLight);

    // 6. Controllers
    const cameraController = new AnatomyCameraController(camera, controls);
    cameraControllerRef.current = cameraController;

    const materialPipeline = new AnatomyMaterialPipeline();
    materialPipelineRef.current = materialPipeline;

    const raycaster = new AnatomyRaycaster(camera);
    raycasterRef.current = raycaster;

    // 7. Load Authentic GLB Model
    const loader = new GLBAnatomyModelLoader();
    loader
      .loadModel(primaryAsset.filePath, systemId, primaryAsset.id)
      .then((result) => {
        if (!isMounted) return;

        rootGroupRef.current = result.rootGroup;
        meshNodesRef.current = result.nodes;

        scene.add(result.rootGroup);

        // Frame the scene cleanly with 35% margin padding
        cameraController.frameScene(result.boundingSphere);

        // Apply initial material styling
        materialPipeline.applyMedicalShading(
          result.rootGroup,
          accentColor,
          activeSubOrganId,
          layers?.crossSectionSlice || false
        );

        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setIsLoading(false);
        setLoadError(err.message || "Failed to load authentic anatomical model.");
      });

    // 8. Render Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (cameraControllerRef.current) cameraControllerRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.clear();
    };
  }, [systemId, primaryAsset?.filePath]);

  // Update controls auto-rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update materials on sub-organ selection or clipping changes
  useEffect(() => {
    if (rootGroupRef.current && materialPipelineRef.current) {
      materialPipelineRef.current.applyMedicalShading(
        rootGroupRef.current,
        accentColor,
        activeSubOrganId,
        layers?.crossSectionSlice || false
      );

      // Focus camera on selected sub-mesh if active
      if (activeSubOrganId && cameraControllerRef.current) {
        const matchedNode = meshNodesRef.current.find(
          (n) => n.structureId === activeSubOrganId || n.meshName.toLowerCase().includes(activeSubOrganId.toLowerCase())
        );
        if (matchedNode) {
          cameraControllerRef.current.focusOnObject(matchedNode.object3D);
        }
      } else if (!activeSubOrganId && cameraControllerRef.current) {
        cameraControllerRef.current.reset(7.0);
      }
    }
  }, [activeSubOrganId, layers?.crossSectionSlice, accentColor]);

  // Pointer event handlers for recursive raycasting
  const handlePointerMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !rootGroupRef.current || !raycasterRef.current) return;
    const hitNode = raycasterRef.current.castRay(
      e.nativeEvent,
      containerRef.current,
      rootGroupRef.current,
      meshNodesRef.current
    );
    setHoveredNodeName(hitNode?.anatomicalName || null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !rootGroupRef.current || !raycasterRef.current) return;
    const hitNode = raycasterRef.current.castRay(
      e.nativeEvent,
      containerRef.current,
      rootGroupRef.current,
      meshNodesRef.current
    );
    if (hitNode) {
      onSubOrganSelect(hitNode.structureId || hitNode.meshName);
    }
  };

  if (loadError) {
    return (
      <AnatomyModelErrorBoundary
        systemName={config.name}
        errorMessage={loadError}
        onRetry={() => {
          setLoadError(null);
          setIsLoading(true);
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onClick={handleClick}
      className="relative h-full w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      <canvas ref={canvasRef} className="h-full w-full outline-none" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-teal-400 border-t-transparent shadow-lg" />
          <p className="mt-3 text-xs font-semibold text-teal-300">
            Streaming Authentic 3D Anatomical Reference Model...
          </p>
          <span className="mt-1 text-[10px] text-slate-400 font-mono">
            {primaryAsset?.source || "OSTM™ Anatomy Engine"}
          </span>
        </div>
      )}

      {/* Floating Hover Raycast Label */}
      {hoveredNodeName && !isLoading && (
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full border border-teal-500/40 bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-teal-300 shadow-xl backdrop-blur animate-fadeIn">
          <span>🔍</span>
          <span>{hoveredNodeName}</span>
          <span className="text-[10px] text-slate-400 font-mono">(Click to isolate)</span>
        </div>
      )}
    </div>
  );
};
