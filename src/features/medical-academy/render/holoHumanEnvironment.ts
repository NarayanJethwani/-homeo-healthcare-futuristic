/**
 * HoloHuman™ Academy - 3D Lighting & Environment Setup
 * Studio-grade clinical lighting configurations for Dark Mode & Light Mode
 */

export interface LightConfig {
  type: "ambient" | "directional" | "point" | "hemisphere";
  color: string;
  groundColor?: string;
  intensity: number;
  position?: [number, number, number];
}

export interface EnvironmentPreset {
  id: "dark" | "light";
  name: string;
  backgroundGradient: string;
  canvasBackground: string;
  lights: LightConfig[];
  shadows: {
    enabled: boolean;
    bias: number;
    radius: number;
  };
  postProcessing: {
    bloom: boolean;
    bloomThreshold: number;
    bloomStrength: number;
    ssao: boolean;
    ssaoRadius: number;
    ssaoIntensity: number;
  };
}

export const HOLOHUMAN_ENVIRONMENTS: Record<"dark" | "light", EnvironmentPreset> = {
  dark: {
    id: "dark",
    name: "Clinical Cyber-Dark (High Contrast)",
    backgroundGradient: "radial-gradient(circle at center, #0F172A 0%, #0B0F19 60%, #030712 100%)",
    canvasBackground: "#0B0F19",
    lights: [
      {
        type: "ambient",
        color: "#1E293B",
        intensity: 0.45,
      },
      {
        type: "directional", // Key Light
        color: "#FFFFFF",
        intensity: 1.1,
        position: [5, 10, 7.5],
      },
      {
        type: "directional", // Fill Light
        color: "#94A3B8",
        intensity: 0.5,
        position: [-5, 5, -5],
      },
      {
        type: "directional", // Specular Rim Light (Cyan/Teal edge definition)
        color: "#06B6D4",
        intensity: 1.3,
        position: [0, 8, -8],
      },
      {
        type: "hemisphere",
        color: "#38BDF8",
        groundColor: "#020617",
        intensity: 0.4,
      },
    ],
    shadows: {
      enabled: true,
      bias: -0.0001,
      radius: 4,
    },
    postProcessing: {
      bloom: true,
      bloomThreshold: 0.85,
      bloomStrength: 0.35,
      ssao: true,
      ssaoRadius: 0.5,
      ssaoIntensity: 1.2,
    },
  },
  light: {
    id: "light",
    name: "Medical Studio Daylight",
    backgroundGradient: "radial-gradient(circle at center, #FFFFFF 0%, #F8FAFC 60%, #E2E8F0 100%)",
    canvasBackground: "#F8FAFC",
    lights: [
      {
        type: "ambient",
        color: "#FFFFFF",
        intensity: 0.65,
      },
      {
        type: "directional", // Key Light
        color: "#FFFFFF",
        intensity: 1.2,
        position: [4, 12, 6],
      },
      {
        type: "directional", // Fill Light (Soft warm bounce)
        color: "#FEF3C7",
        intensity: 0.4,
        position: [-6, 6, 4],
      },
      {
        type: "directional", // Subtle cool rim backlight
        color: "#CBD5E1",
        intensity: 0.5,
        position: [0, 6, -6],
      },
      {
        type: "hemisphere",
        color: "#FFFFFF",
        groundColor: "#CBD5E1",
        intensity: 0.55,
      },
    ],
    shadows: {
      enabled: true,
      bias: -0.0002,
      radius: 6,
    },
    postProcessing: {
      bloom: false,
      bloomThreshold: 1.0,
      bloomStrength: 0.0,
      ssao: true,
      ssaoRadius: 0.8,
      ssaoIntensity: 1.6,
    },
  },
};
