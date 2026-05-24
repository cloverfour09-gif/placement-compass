import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "carbon" | "glass";
export type PreviewMode = "desktop" | "tablet" | "mobile";
export type FontScale = "small" | "medium" | "large";

interface SettingsState {
  theme: ThemeMode;
  previewMode: PreviewMode;
  compactMode: boolean;
  cardDensity: "comfortable" | "compact";
  animationsEnabled: boolean;
  fontScale: FontScale;
}

interface SettingsContextType extends SettingsState {
  setTheme: (theme: ThemeMode) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setCompactMode: (enabled: boolean) => void;
  setCardDensity: (density: "comfortable" | "compact") => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setFontScale: (scale: FontScale) => void;
}

const defaultState: SettingsState = {
  theme: "light",
  previewMode: "desktop",
  compactMode: false,
  cardDensity: "comfortable",
  animationsEnabled: true,
  fontScale: "medium",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const stored = localStorage.getItem("pi-settings");
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("pi-settings", JSON.stringify(settings));
  }, [settings]);

  // Apply root classes/variables based on settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Theme
    root.classList.remove("light", "dark", "theme-carbon", "theme-glass");
    if (settings.theme === "dark") root.classList.add("dark");
    else if (settings.theme === "carbon") root.classList.add("theme-carbon");
    else if (settings.theme === "glass") root.classList.add("theme-glass");
    else root.classList.add("light"); // default

    // Animations
    if (!settings.animationsEnabled) {
      root.classList.add("disable-animations");
    } else {
      root.classList.remove("disable-animations");
    }

    // Font Scale
    root.classList.remove("font-scale-small", "font-scale-large");
    if (settings.fontScale === "small") root.classList.add("font-scale-small");
    if (settings.fontScale === "large") root.classList.add("font-scale-large");

    // Compact Mode / Card Density
    if (settings.compactMode) {
      root.classList.add("layout-compact");
    } else {
      root.classList.remove("layout-compact");
    }
    
    if (settings.cardDensity === "compact") {
      root.classList.add("card-density-compact");
    } else {
      root.classList.remove("card-density-compact");
    }

  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
        setPreviewMode: (previewMode) => setSettings((s) => ({ ...s, previewMode })),
        setCompactMode: (compactMode) => setSettings((s) => ({ ...s, compactMode })),
        setCardDensity: (cardDensity) => setSettings((s) => ({ ...s, cardDensity })),
        setAnimationsEnabled: (animationsEnabled) => setSettings((s) => ({ ...s, animationsEnabled })),
        setFontScale: (fontScale) => setSettings((s) => ({ ...s, fontScale })),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
