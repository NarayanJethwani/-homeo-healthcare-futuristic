"use client";

import React, { useState } from "react";
import { DashboardContext } from "../contexts/DashboardContext";
import { useDashboardPreferences } from "../hooks/useDashboardPreferences";

interface DashboardProviderProps {
  children: React.ReactNode;
  initialTab?: string;
}

export function DashboardProvider({ children, initialTab = "dashboard" }: DashboardProviderProps) {
  const prefs = useDashboardPreferences();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [immersiveMode, setImmersiveMode] = useState<boolean>(false);

  const value = {
    ...prefs,
    activeTab,
    setActiveTab,
    immersiveMode,
    setImmersiveMode
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
