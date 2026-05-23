"use client";

import dynamic from "next/dynamic";

const AntigravityBackground = dynamic(() => import("./AntigravityBackground"), {
  ssr: false,
});

export default function ClientCanvasWrapper() {
  return <AntigravityBackground />;
}

