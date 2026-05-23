"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

interface ScrollProviderProps {
  children: ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.6, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.05,
      }}
    >
      {children}
    </ReactLenis>
  );
}
