import React, { useState } from "react";
import { Settings, X, Monitor, Tablet, Smartphone, Moon, Sun, Layers, LayoutTemplate, Type, Box } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-brand text-brand-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-105"
        aria-label="Open Settings"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-[340px] bg-surface border-l border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand" />
            Preferences
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
          
          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sun className="h-4 w-4" /> Theme Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['light', 'dark', 'carbon', 'glass'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => settings.setTheme(theme)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium border capitalize transition-all",
                    settings.theme === theme 
                      ? "bg-brand text-brand-foreground border-brand shadow-md" 
                      : "bg-surface text-foreground border-border hover:border-brand/40"
                  )}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Device Preview */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Monitor className="h-4 w-4" /> Device Preview
            </label>
            <div className="flex bg-surface-muted p-1 rounded-lg border border-border">
              {[
                { id: "desktop", icon: Monitor },
                { id: "tablet", icon: Tablet },
                { id: "mobile", icon: Smartphone }
              ].map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => settings.setPreviewMode(id as any)}
                  className={cn(
                    "flex-1 flex justify-center py-2 rounded-md transition-all",
                    settings.previewMode === id 
                      ? "bg-surface shadow-sm text-brand" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" /> Layout
            </label>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-muted/30">
              <span className="text-sm font-medium">Compact Mode</span>
              <button 
                onClick={() => settings.setCompactMode(!settings.compactMode)}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  settings.compactMode ? "bg-brand" : "bg-muted-foreground/30"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                  settings.compactMode ? "translate-x-4" : ""
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-muted/30">
              <span className="text-sm font-medium">Card Density</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => settings.setCardDensity("comfortable")}
                  className={cn("px-2 py-1 text-xs rounded transition-colors", settings.cardDensity === "comfortable" ? "bg-brand text-brand-foreground" : "bg-surface border border-border")}
                >
                  Comfy
                </button>
                <button 
                  onClick={() => settings.setCardDensity("compact")}
                  className={cn("px-2 py-1 text-xs rounded transition-colors", settings.cardDensity === "compact" ? "bg-brand text-brand-foreground" : "bg-surface border border-border")}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Type className="h-4 w-4" /> Typography
            </label>
            <div className="flex bg-surface-muted p-1 rounded-lg border border-border">
              {(['small', 'medium', 'large'] as const).map(scale => (
                <button
                  key={scale}
                  onClick={() => settings.setFontScale(scale)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all",
                    settings.fontScale === scale 
                      ? "bg-surface shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {scale === 'medium' ? 'Default' : scale}
                </button>
              ))}
            </div>
          </div>

          {/* Animations */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4" /> Effects
            </label>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-muted/30">
              <span className="text-sm font-medium">Animations</span>
              <button 
                onClick={() => settings.setAnimationsEnabled(!settings.animationsEnabled)}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  settings.animationsEnabled ? "bg-brand" : "bg-muted-foreground/30"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                  settings.animationsEnabled ? "translate-x-4" : ""
                )} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
