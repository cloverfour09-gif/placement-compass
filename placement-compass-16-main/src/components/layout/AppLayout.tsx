import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  LayoutGrid,
  GitCompareArrows,
  Brain,
  BarChart3,
  ListChecks,
  Sparkles,
  Target,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { useState } from "react";
import { UserProfile } from "./UserProfile";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/home", label: "Home", icon: LayoutDashboard },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/skill-mapping", label: "Skill Mapping", icon: Brain },
  { to: "/placement-analyzer", label: "Placement Analyzer", icon: Target },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { previewMode } = useSettings();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-sm">P</div>
          <span className="font-display font-semibold text-sm">PESCE PI</span>
        </div>
        <div className="flex items-center gap-3">
          <UserProfile />
          <button onClick={() => setOpen(v => !v)} className="p-2 rounded-md hover:bg-surface-muted">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-surface p-4 transition-transform lg:hidden",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold">P</div>
            <div>
              <div className="font-display font-semibold text-sm">PESCE Mandya</div>
              <div className="text-[11px] text-muted-foreground tracking-wide uppercase">Placement Intelligence</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-surface-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-2">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-brand-soft text-brand" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="min-h-screen flex flex-col lg:ml-0">
        <header className="hidden lg:flex h-16 shrink-0 items-center justify-between px-8 border-b border-border bg-surface/70 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold">P</div>
              <div>
                <div className="text-sm font-semibold">PESCE Placement Intelligence</div>
                <div className="text-xs text-muted-foreground">Modern landing navigation</div>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {nav.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      isActive ? "bg-brand text-brand-foreground shadow-sm" : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <UserProfile />
        </header>

        <div className="flex-1 overflow-y-auto bg-surface-muted/30 relative">
          <div className={cn(
            "mx-auto transition-all duration-300 origin-top",
            previewMode === "desktop" ? "max-w-[1400px] w-full" :
            previewMode === "tablet" ? "max-w-[768px] w-full border-x border-border shadow-xl min-h-full bg-surface" :
            "max-w-[375px] w-full border-x border-border shadow-2xl min-h-full bg-surface"
          )}>
            <div className="p-4 sm:p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
          <SettingsPanel />
        </div>
      </main>
    </div>
  );
}
