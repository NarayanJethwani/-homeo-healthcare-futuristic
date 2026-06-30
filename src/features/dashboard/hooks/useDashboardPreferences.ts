import { useState, useEffect } from "react";

export function useDashboardPreferences() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDisplayDrawerOpen, setIsDisplayDrawerOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [sidebarFavorites, setSidebarFavorites] = useState<string[]>(["intake", "patients"]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [dashboardTimeframe, setDashboardTimeframe] = useState<"today" | "week" | "month" | "year">("week");
  const [reduceMotion, setReduceMotion] = useState(false);

  const [globalFontSize, setGlobalFontSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [globalLayoutZoom, setGlobalLayoutZoom] = useState(100);
  const [globalReadingWidth, setGlobalReadingWidth] = useState<"standard" | "wide" | "full">("standard");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  // Load preferences from localStorage on mount (SSR Safe)
  useEffect(() => {
    try {
      const savedCollapsed = localStorage.getItem("sidebar_collapsed");
      if (savedCollapsed !== null) setIsSidebarCollapsed(JSON.parse(savedCollapsed));

      const savedFavorites = localStorage.getItem("sidebar_favorites");
      if (savedFavorites !== null) setSidebarFavorites(JSON.parse(savedFavorites));

      const savedDismissed = localStorage.getItem("dismissed_alerts");
      if (savedDismissed !== null) setDismissedAlerts(JSON.parse(savedDismissed));

      const savedTheme = localStorage.getItem("theme");
      if (savedTheme !== null) {
        setTheme(savedTheme as any);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.style.colorScheme = "dark";
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.style.colorScheme = "light";
        }
      }

      const savedFontSize = localStorage.getItem("global_font_size");
      if (savedFontSize !== null) setGlobalFontSize(savedFontSize as any);

      const savedZoom = localStorage.getItem("global_layout_zoom");
      if (savedZoom !== null) setGlobalLayoutZoom(JSON.parse(savedZoom));

      const savedWidth = localStorage.getItem("global_reading_width");
      if (savedWidth !== null) setGlobalReadingWidth(savedWidth as any);

      const savedMotion = localStorage.getItem("reduce_motion");
      if (savedMotion !== null) setReduceMotion(JSON.parse(savedMotion));
    } catch (e) {
      console.warn("localStorage disabled or not accessible:", e);
    }
  }, []);

  // Save changes to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(isSidebarCollapsed));
    } catch (e) {}
  }, [isSidebarCollapsed]);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar_favorites", JSON.stringify(sidebarFavorites));
    } catch (e) {}
  }, [sidebarFavorites]);

  useEffect(() => {
    try {
      localStorage.setItem("dismissed_alerts", JSON.stringify(dismissedAlerts));
    } catch (e) {}
  }, [dismissedAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem("global_font_size", globalFontSize);
    } catch (e) {}
  }, [globalFontSize]);

  useEffect(() => {
    try {
      localStorage.setItem("global_layout_zoom", JSON.stringify(globalLayoutZoom));
    } catch (e) {}
  }, [globalLayoutZoom]);

  useEffect(() => {
    try {
      localStorage.setItem("global_reading_width", globalReadingWidth);
    } catch (e) {}
  }, [globalReadingWidth]);

  useEffect(() => {
    try {
      localStorage.setItem("reduce_motion", JSON.stringify(reduceMotion));
    } catch (e) {}
  }, [reduceMotion]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
      }
    } catch (e) {}
  };

  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isDisplayDrawerOpen,
    setIsDisplayDrawerOpen,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    sidebarFavorites,
    setSidebarFavorites,
    dismissedAlerts,
    setDismissedAlerts,
    dashboardTimeframe,
    setDashboardTimeframe,
    reduceMotion,
    setReduceMotion,
    globalFontSize,
    setGlobalFontSize,
    globalLayoutZoom,
    setGlobalLayoutZoom,
    globalReadingWidth,
    setGlobalReadingWidth,
    theme,
    toggleTheme
  };
}
