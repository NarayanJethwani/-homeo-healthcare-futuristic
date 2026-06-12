"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ScrollProviderProps {
  children: ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [isMobile, setIsMobile] = useState(true); // default to true to prevent hydration mismatch on SSR

  useEffect(() => {
    // Check if the device is a mobile layout or has a touch pointer coarse
    const checkMobile = () => {
      const touchDevice = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(touchDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isAdmin || isMobile) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{ 
        duration: 1.4, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.05,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
