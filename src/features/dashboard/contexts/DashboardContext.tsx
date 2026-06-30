"use client";

import { createContext, useContext } from "react";

export interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  immersiveMode: boolean;
  setImmersiveMode: (immersive: boolean) => void;
  isDisplayDrawerOpen: boolean;
  setIsDisplayDrawerOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  globalFontSize: "S" | "M" | "L" | "XL";
  setGlobalFontSize: (size: "S" | "M" | "L" | "XL") => void;
  globalLayoutZoom: number;
  setGlobalLayoutZoom: (zoom: number | ((prev: number) => number)) => void;
  globalReadingWidth: "standard" | "wide" | "full";
  setGlobalReadingWidth: (width: "standard" | "wide" | "full") => void;
  sidebarFavorites: string[];
  setSidebarFavorites: (favorites: string[] | ((prev: string[]) => string[])) => void;
  dismissedAlerts: string[];
  setDismissedAlerts: (alerts: string[] | ((prev: string[]) => string[])) => void;
  dashboardTimeframe: "today" | "week" | "month" | "year";
  setDashboardTimeframe: (timeframe: "today" | "week" | "month" | "year") => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
