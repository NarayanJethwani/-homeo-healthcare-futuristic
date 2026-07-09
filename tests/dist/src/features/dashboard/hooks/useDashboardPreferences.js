"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardPreferences = useDashboardPreferences;
const react_1 = require("react");
function useDashboardPreferences() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = (0, react_1.useState)(false);
    const [isDisplayDrawerOpen, setIsDisplayDrawerOpen] = (0, react_1.useState)(false);
    const [isGlobalSearchOpen, setIsGlobalSearchOpen] = (0, react_1.useState)(false);
    const [sidebarFavorites, setSidebarFavorites] = (0, react_1.useState)(["intake", "patients"]);
    const [dismissedAlerts, setDismissedAlerts] = (0, react_1.useState)([]);
    const [dashboardTimeframe, setDashboardTimeframe] = (0, react_1.useState)("week");
    const [reduceMotion, setReduceMotion] = (0, react_1.useState)(false);
    const [globalFontSize, setGlobalFontSize] = (0, react_1.useState)("M");
    const [globalLayoutZoom, setGlobalLayoutZoom] = (0, react_1.useState)(100);
    const [globalReadingWidth, setGlobalReadingWidth] = (0, react_1.useState)("standard");
    const [theme, setTheme] = (0, react_1.useState)("light");
    // Load preferences from localStorage on mount (SSR Safe)
    (0, react_1.useEffect)(() => {
        try {
            const savedCollapsed = localStorage.getItem("sidebar_collapsed");
            if (savedCollapsed !== null)
                setIsSidebarCollapsed(JSON.parse(savedCollapsed));
            const savedFavorites = localStorage.getItem("sidebar_favorites");
            if (savedFavorites !== null)
                setSidebarFavorites(JSON.parse(savedFavorites));
            const savedDismissed = localStorage.getItem("dismissed_alerts");
            if (savedDismissed !== null)
                setDismissedAlerts(JSON.parse(savedDismissed));
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme !== null) {
                setTheme(savedTheme);
                if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark");
                    document.documentElement.style.colorScheme = "dark";
                }
                else {
                    document.documentElement.classList.remove("dark");
                    document.documentElement.style.colorScheme = "light";
                }
            }
            const savedFontSize = localStorage.getItem("global_font_size");
            if (savedFontSize !== null)
                setGlobalFontSize(savedFontSize);
            const savedZoom = localStorage.getItem("global_layout_zoom");
            if (savedZoom !== null)
                setGlobalLayoutZoom(JSON.parse(savedZoom));
            const savedWidth = localStorage.getItem("global_reading_width");
            if (savedWidth !== null)
                setGlobalReadingWidth(savedWidth);
            const savedMotion = localStorage.getItem("reduce_motion");
            if (savedMotion !== null)
                setReduceMotion(JSON.parse(savedMotion));
        }
        catch (e) {
            console.warn("localStorage disabled or not accessible:", e);
        }
    }, []);
    // Save changes to localStorage on state changes
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("sidebar_collapsed", JSON.stringify(isSidebarCollapsed));
        }
        catch (e) { }
    }, [isSidebarCollapsed]);
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("sidebar_favorites", JSON.stringify(sidebarFavorites));
        }
        catch (e) { }
    }, [sidebarFavorites]);
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("dismissed_alerts", JSON.stringify(dismissedAlerts));
        }
        catch (e) { }
    }, [dismissedAlerts]);
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("global_font_size", globalFontSize);
        }
        catch (e) { }
    }, [globalFontSize]);
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("global_layout_zoom", JSON.stringify(globalLayoutZoom));
        }
        catch (e) { }
    }, [globalLayoutZoom]);
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("global_reading_width", globalReadingWidth);
        }
        catch (e) { }
    }, [globalReadingWidth]);
    (0, react_1.useEffect)(() => {
        try {
            localStorage.setItem("reduce_motion", JSON.stringify(reduceMotion));
        }
        catch (e) { }
    }, [reduceMotion]);
    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        try {
            localStorage.setItem("theme", nextTheme);
            if (nextTheme === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.style.colorScheme = "dark";
            }
            else {
                document.documentElement.classList.remove("dark");
                document.documentElement.style.colorScheme = "light";
            }
        }
        catch (e) { }
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
