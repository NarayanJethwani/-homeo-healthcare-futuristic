"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// 1D Value Noise for smooth cursor drift
class ValueNoise1D {
  private values: number[] = [];

  constructor() {
    for (let i = 0; i < 256; i++) {
      this.values.push(Math.random());
    }
  }

  getVal(t: number): number {
    const floor = Math.floor(t);
    const fraction = t - floor;
    const i0 = floor & 255;
    const i1 = (i0 + 1) & 255;
    const v0 = this.values[i0];
    const v1 = this.values[i1];
    const fade = fraction * fraction * (3 - 2 * fraction);
    return v0 + (v1 - v0) * fade;
  }
}

// Bridson's Poisson Disk Sampling to seed coordinates inside [-250, 250]
function generatePoissonPoints(density: number): number[] {
  // Map density (100 - 300) to minDistance (5.5 - 3.5)
  const minDistance = 5.5 - ((density - 100) / 200) * 2.0;
  
  const width = 500;
  const height = 500;
  const cellSize = minDistance / Math.sqrt(2);
  const gridWidth = Math.ceil(width / cellSize);
  const gridHeight = Math.ceil(height / cellSize);
  
  const grid: number[] = new Array(gridWidth * gridHeight).fill(-1);
  const points: [number, number][] = [];
  const active: number[] = [];
  
  // Seed first point randomly
  const firstPoint: [number, number] = [Math.random() * width, Math.random() * height];
  points.push(firstPoint);
  const firstIdx = points.length - 1;
  active.push(firstIdx);
  
  const gx = Math.floor(firstPoint[0] / cellSize);
  const gy = Math.floor(firstPoint[1] / cellSize);
  grid[gx + gy * gridWidth] = firstIdx;
  
  const maxTries = 20;
  
  while (active.length > 0) {
    const randIdx = Math.floor(Math.random() * active.length);
    const pIdx = active[randIdx];
    const p = points[pIdx];
    let found = false;
    
    for (let i = 0; i < maxTries; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = minDistance + Math.random() * minDistance;
      const nx = p[0] + Math.cos(theta) * r;
      const ny = p[1] + Math.sin(theta) * r;
      
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const ngx = Math.floor(nx / cellSize);
        const ngy = Math.floor(ny / cellSize);
        
        let ok = true;
        const startX = Math.max(0, ngx - 2);
        const endX = Math.min(gridWidth - 1, ngx + 2);
        const startY = Math.max(0, ngy - 2);
        const endY = Math.min(gridHeight - 1, ngy + 2);
        
        for (let y = startY; y <= endY && ok; y++) {
          for (let x = startX; x <= endX && ok; x++) {
            const checkIdx = grid[x + y * gridWidth];
            if (checkIdx !== -1) {
              const cp = points[checkIdx];
              const dx = cp[0] - nx;
              const dy = cp[1] - ny;
              if (dx * dx + dy * dy < minDistance * minDistance) {
                ok = false;
              }
            }
          }
        }
        
        if (ok) {
          points.push([nx, ny]);
          const newIdx = points.length - 1;
          active.push(newIdx);
          grid[ngx + ngy * gridWidth] = newIdx;
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      active.splice(randIdx, 1);
    }
  }
  
  const flat: number[] = [];
  for (let i = 0; i < points.length; i++) {
    flat.push(points[i][0] - 250, points[i][1] - 250);
  }
  return flat;
}

const GLSL_SIMPLEX_NOISE = `
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float permute(float x) { return floor(mod(((x*34.0)+1.0)*x, 289.0)); }

  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float taylorInvSqrt(float r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

export default function AntigravityBackground() {
  const [isMobile, setIsMobile] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse State
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const mouseIsOverRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      const touchDevice = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(touchDevice || isSmallScreen);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.offsetWidth;
    let height = container.offsetHeight;

    // Density and counts
    const density = 200;
    const pointsData = generatePoissonPoints(density);
    const count = Math.min(pointsData.length / 2, 256 * 256);
    const size = 256;
    const length = size * size;

    // Clock and Time tracking
    const clock = new THREE.Clock();
    let time = 0;
    let lastTime = 0;

    // Noise drift tracker
    const driftNoise = new ValueNoise1D();
    const ringPos = new THREE.Vector2(0, 0);
    const cursorPos = new THREE.Vector2(0, 0);

    // Initial positioning data texture (FBO Seed)
    const posData = new Float32Array(length * 4);
    for (let i = 0; i < count; i++) {
      const r = i * 4;
      posData[r + 0] = pointsData[i * 2 + 0] * (1 / 250); // Scale down coordinates to [-1, 1]
      posData[r + 1] = pointsData[i * 2 + 1] * (1 / 250);
      posData[r + 2] = 0;
      posData[r + 3] = 0;
    }

    const posTex = new THREE.DataTexture(
      posData,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    posTex.needsUpdate = true;

    // WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      stencil: false,
      depth: false,
    });
    const pixelRatio = window.devicePixelRatio || 1;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    
    // Request float texture extension to write simulator positions
    renderer.extensions.get("EXT_color_buffer_float");

    // Primary rendering Scene, Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 3.1;

    // Raycast Plane for mouse position mapping (virtual flat plane at z = 0)
    const raycastPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 12.5),
      new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false, side: THREE.DoubleSide })
    );
    scene.add(raycastPlane);

    const raycaster = new THREE.Raycaster();
    const intersectionPoint = new THREE.Vector3();
    let isIntersecting = false;

    // GPGPU Simulation setup (Double-buffered Render Targets)
    const rt1 = new THREE.WebGLRenderTarget(size, size, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });

    const rt2 = new THREE.WebGLRenderTarget(size, size, {
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
    });

    // Clear render targets initially
    renderer.setRenderTarget(rt1);
    renderer.setClearColor(0, 0);
    renderer.clear();
    renderer.setRenderTarget(rt2);
    renderer.setClearColor(0, 0);
    renderer.clear();
    renderer.setRenderTarget(null);

    // Simulation Scene and Camera (Orthographic Ortho projection covering [-1, 1] quad)
    const simScene = new THREE.Scene();
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Simulation Material (GPGPU Position Solver)
    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: posTex },
        uPosRefs: { value: posTex },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRingRadius: { value: 0.2 },
        uDeltaTime: { value: 0 },
        uRingWidth: { value: 0.107 },
        uRingWidth2: { value: 0.05 },
        uRingDisplacement: { value: 0.15 },
        uTime: { value: 0 },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uPosition;
        uniform sampler2D uPosRefs;
        uniform vec2 uRingPos;
        uniform float uTime;
        uniform float uDeltaTime;
        uniform float uRingRadius;

        uniform float uRingWidth;
        uniform float uRingWidth2;
        uniform float uRingDisplacement;

        ${GLSL_SIMPLEX_NOISE}

        void main() {
          vec2 simTexCoords = gl_FragCoord.xy / vec2(${size.toFixed(1)}, ${size.toFixed(1)});
          vec4 pFrame = texture2D(uPosition, simTexCoords);

          float scale = pFrame.z;
          float velocity = pFrame.w;
          vec2 refPos = texture2D(uPosRefs, simTexCoords).xy;

          float time = uTime * .5;
          vec2 curentPos = refPos;

          vec2 pos = pFrame.xy;
          pos *= .8;

          float dist = distance(curentPos.xy, uRingPos);
          float noise0 = snoise(vec3(curentPos.xy * .2 + vec2(18.4924, 72.9744), time * 0.5));
          float dist1 = distance(curentPos.xy + (noise0 * .005), uRingPos);

          float t = smoothstep(uRingRadius - (uRingWidth * 2.), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
          float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
          float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

          t = pow(t, 2.);
          t2 = pow(t2, 3.);

          t += t2 * 3.;
          t += t3 * .4;
          t += snoise(vec3(curentPos.xy * 30. + vec2(11.4924, 12.9744), time * 0.5)) * t3 * .5;

          float nS = snoise(vec3(curentPos.xy * 2. + vec2(18.4924, 72.9744), time * 0.5));
          t += pow((nS + 1.5) * .5, 2.) * .6;

          // Mid scale noise
          float noise1 = snoise(vec3(curentPos.xy * 4. + vec2(88.494, 32.4397), time * 0.35));
          float noise2 = snoise(vec3(curentPos.xy * 4. + vec2(50.904, 120.947), time * 0.35));

          // Close scale noise
          float noise3 = snoise(vec3(curentPos.xy * 20. + vec2(18.4924, 72.9744), time * .5));
          float noise4 = snoise(vec3(curentPos.xy * 20. + vec2(50.904, 120.947), time * .5));

          vec2 disp = vec2(noise1, noise2) * .03;
          disp += vec2(noise3, noise4) * .005;

          // Sin wave
          disp.x += sin((refPos.x * 20.) + (time * 4.)) * .02 * clamp(dist, 0., 1.);
          disp.y += cos((refPos.y * 20.) + (time * 3.)) * .02 * clamp(dist, 0., 1.);

          pos -= (uRingPos - (curentPos + disp)) * pow(t2, .75) * uRingDisplacement;

          // Add scale
          float scaleDiff = t - scale;
          scaleDiff *= .2;
          scale += scaleDiff;

          // Final position
          vec2 finalPos = curentPos + disp + (pos * .25);

          velocity *= .5;
          velocity += scale * .25;

          gl_FragColor = vec4(finalPos, scale, velocity);
        }
      `,
    });

    const simMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    simScene.add(simMesh);

    // Particle render geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const uvs = new Float32Array(count * 2);
    const seeds = new Float32Array(count * 4);

    for (let s = 0; s < count; s++) {
      const u = ((s % size) + 0.5) / size;
      const v = (Math.floor(s / size) + 0.5) / size;
      uvs[s * 2] = u;
      uvs[s * 2 + 1] = v;

      seeds[s * 4] = Math.random();
      seeds[s * 4 + 1] = Math.random();
      seeds[s * 4 + 2] = Math.random();
      seeds[s * 4 + 3] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute("seeds", new THREE.BufferAttribute(seeds, 4));

    // Base color settings (tribute to Google Antigravity colors, customized to fit)
    const colorControls = {
      color1: "#2c64ed", // Google Blue
      color2: "#f84242", // Google Red
      color3: "#ffcf03", // Google Yellow
    };

    // Calculate dynamic base scaling of particles
    let particlesScaleFactor = 1.0;
    let particleScale = (width / pixelRatio / 2000.0) * particlesScaleFactor;

    // Render material
    const renderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPosition: { value: posTex },
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(colorControls.color1) },
        uColor2: { value: new THREE.Color(colorControls.color2) },
        uColor3: { value: new THREE.Color(colorControls.color3) },
        uAlpha: { value: 1.0 },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRez: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
        uParticleScale: { value: particleScale },
        uPixelRatio: { value: pixelRatio },
        uColorScheme: { value: 1 }, // 1 represents light mode (vel blends color)
      },
      vertexShader: `
        precision highp float;
        attribute vec4 seeds;

        uniform sampler2D uPosition;
        uniform float uTime;
        uniform float uParticleScale;
        uniform float uPixelRatio;
        uniform int uColorScheme;

        varying vec4 vSeeds;
        varying float vVelocity;
        varying vec2 vLocalPos;
        varying vec2 vScreenPos;
        varying float vScale;

        void main() {
          vec4 pos = texture2D(uPosition, uv);
          vSeeds = seeds;

          vVelocity = pos.w;
          vScale = pos.z;
          vLocalPos = pos.xy;
          vec4 viewSpace = modelViewMatrix * vec4(vec3(pos.xy, 0.), 1.0);

          gl_Position = projectionMatrix * viewSpace;
          vScreenPos = gl_Position.xy;

          gl_PointSize = ((vScale * 7.) * (uPixelRatio * 0.5) * uParticleScale);
        }
      `,
      fragmentShader: `
        precision highp float;

        varying vec4 vSeeds;
        varying vec2 vScreenPos;
        varying vec2 vLocalPos;
        varying float vScale;
        varying float vVelocity;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;

        uniform vec2 uRingPos;
        uniform vec2 uRez;

        uniform float uAlpha;
        uniform float uTime;

        uniform int uColorScheme;

        ${GLSL_SIMPLEX_NOISE}

        #define PI 3.1415926535897932384626433832795

        float sdRoundBox(in vec2 p, in vec2 b, in vec4 r) {
          r.xy = (p.x > 0.0) ? r.xy : r.zw;
          r.x  = (p.y > 0.0) ? r.x  : r.y;
          vec2 q = abs(p) - b + r.x;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
        }

        vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          mat2 m = mat2(c, s, -s, c);
          return m * v;
        }

        void main() {
          float uBorderSize = 0.2;
          float ratio = uRez.x / uRez.y;

          // Noise for dynamic tilt and color blending
          float noiseAngle = snoise(vec3(vLocalPos * 10. + vec2(18.4924, 72.9744), uTime * .85));
          float noiseColor = snoise(vec3(vLocalPos * 2. + vec2(74.664, 91.556), uTime * .5));
          noiseColor = (noiseColor + 1.) * .5;

          // Angle rotation relative to repulsion core
          float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);

          vec2 uv = gl_PointCoord.xy;
          uv -= vec2(0.5);
          uv.y *= -1.;
          uv = rotate(uv, -angle + (noiseAngle * .5));

          float h = 0.8; // Position pivot of midColor
          float progress = smoothstep(0., .75, pow(noiseColor, 2.));
          vec3 col = mix(mix(uColor1, uColor2, progress / h), mix(uColor2, uColor3, (progress - h) / (1.0 - h)), step(h, progress));
          vec3 color = col;

          float rounded = sdRoundBox(uv, vec2(0.5, 0.2), vec4(.25));
          rounded = smoothstep(.1, 0., rounded);

          float a = uAlpha * rounded * smoothstep(0.1, 0.2, vScale);

          if (a < 0.01) {
            discard;
          }

          color = clamp(color, 0., 1.);
          
          // Velocity darkens/saturates the color slightly to match Google Antigravity physics
          color = mix(color, color * clamp(vVelocity, 0., 1.), float(uColorScheme));

          gl_FragColor = vec4(color, clamp(a, 0., 1.));
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, renderMaterial);
    points.position.set(0, 0, 0);
    points.scale.set(5, 5, 5); // Scale coordinates to expand particle grid
    scene.add(points);

    // Animation variables
    let animationFrameId: number;
    let everRendered = false;
    let activeRT = rt1;
    let nextRT = rt2;

    // Window Resize Handler
    const onResize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      particleScale = (width / pixelRatio / 2000.0) * particlesScaleFactor;
      renderMaterial.uniforms.uRez.value.set(width * pixelRatio, height * pixelRatio);
      renderMaterial.uniforms.uParticleScale.value = particleScale;
    };

    window.addEventListener("resize", onResize);

    // Mouse Tracking Event Listeners
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.set(x, y);
      mouseIsOverRef.current = true;
    };

    const handlePointerLeave = () => {
      mouseIsOverRef.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    // Core Animation loop
    const tick = () => {
      const elapsed = clock.getElapsedTime();
      const dt = elapsed - lastTime;
      lastTime = elapsed;
      time += dt;

      // Calculate 1D drift offset
      const driftX = (driftNoise.getVal(time * 0.66 + 94.234) - 0.5) * 2;
      const driftY = (driftNoise.getVal(time * 0.75 + 21.028) - 0.5) * 2;

      if (mouseIsOverRef.current) {
        // Project NDC mouse coordinate onto our flat virtual plane at z = 0
        raycaster.setFromCamera(mouseRef.current, camera);
        const intersects = raycaster.intersectObject(raycastPlane);
        
        if (intersects.length > 0) {
          intersectionPoint.copy(intersects[0].point);
          isIntersecting = true;
        } else {
          isIntersecting = false;
        }

        if (isIntersecting) {
          // Snap cursor influence to intersection point (scaled from scene space back to FBO simulation coordinate space)
          // Scale by 0.20 because points are scaled by 5.0 (1 / 5.0 = 0.2)
          cursorPos.set(
            intersectionPoint.x * 0.2,
            intersectionPoint.y * 0.2
          );
          ringPos.lerp(cursorPos, 0.08); // responsive and fluid
        } else {
          cursorPos.set(driftX * 0.2, driftY * 0.1);
          ringPos.lerp(cursorPos, 0.015);
        }
      } else {
        cursorPos.set(driftX * 0.2, driftY * 0.1);
        ringPos.lerp(cursorPos, 0.015);
      }

      // 1. Simulation Step: Solve particle positions
      simMaterial.uniforms.uPosition.value = everRendered ? activeRT.texture : posTex;
      simMaterial.uniforms.uTime.value = elapsed;
      simMaterial.uniforms.uDeltaTime.value = dt;
      simMaterial.uniforms.uRingRadius.value = 0.18; // Steady ring radius matching antigravity.google
      simMaterial.uniforms.uRingPos.value = ringPos;

      renderer.setRenderTarget(nextRT);
      renderer.render(simScene, simCamera);
      renderer.setRenderTarget(null);

      // 2. Rendering Step: Draw final particles
      renderMaterial.uniforms.uPosition.value = everRendered ? nextRT.texture : posTex;
      renderMaterial.uniforms.uTime.value = elapsed;
      renderMaterial.uniforms.uRingPos.value = ringPos;
      renderMaterial.uniforms.uParticleScale.value = particleScale;

      renderer.autoClear = false;
      renderer.clear();
      renderer.render(scene, camera);

      // 3. Ping-Pong Buffer Swap
      const temp = activeRT;
      activeRT = nextRT;
      nextRT = temp;
      everRendered = true;

      animationFrameId = requestAnimationFrame(tick);
    };

    // Run first frame
    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      // Dispose resources
      geometry.dispose();
      simMesh.geometry.dispose();
      simMaterial.dispose();
      renderMaterial.dispose();
      rt1.dispose();
      rt2.dispose();
      posTex.dispose();
      raycastPlane.geometry.dispose();
      (raycastPlane.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-transparent"
    >
      <canvas ref={canvasRef} className="block h-full w-full bg-transparent" />
    </div>
  );
}
