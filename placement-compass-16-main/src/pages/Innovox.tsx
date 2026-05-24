import { PageHeader } from "@/components/common/PageHeader";
import { useCompanies } from "@/hooks/useCompanies";
import { Sparkles, Cpu, TrendingUp, Lightbulb, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Innovox() {
  const { data: companies = [] } = useCompanies();

  // Aggregate Data
  const techCounts: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  
  companies.forEach(c => {
    const ts = c.tech_stack ? (Array.isArray(c.tech_stack) ? c.tech_stack : typeof c.tech_stack === "string" ? c.tech_stack.split(/[;,]/) : []) : [];
    ts.forEach(t => {
      const trimmed = t.trim();
      if (trimmed) {
        techCounts[trimmed] = (techCounts[trimmed] || 0) + 1;
      }
    });

    const sr = c.skill_relevance ? (Array.isArray(c.skill_relevance) ? c.skill_relevance : typeof c.skill_relevance === "string" ? c.skill_relevance.split(/[;,]/) : []) : [];
    sr.forEach(s => {
      const trimmed = s.trim();
      if (trimmed && !trimmed.toLowerCase().startsWith("highly relevant") && trimmed.toLowerCase() !== "none") {
        skillCounts[trimmed] = (skillCounts[trimmed] || 0) + 1;
      }
    });
  });

  const topTech = Object.entries(techCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topSkills = Object.entries(skillCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const highGrowth = [...companies]
    .filter(c => String(c.hiring_velocity).toLowerCase().includes("high") || String(c.yoy_growth_rate).includes("%"))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Innovox"
        title="Innovation & Insights Layer"
        description="An extensible analytics surface for forward-looking placement intelligence."
        actions={
          <div className="hidden sm:flex items-center gap-2 text-xs text-brand bg-brand-soft px-3 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> Beta module
          </div>
        }
      />

      <div className="rounded-2xl bg-gradient-mesh border border-border p-6 sm:p-10 mb-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-balance">
            Turn 163 columns of company data into <span className="text-brand">strategic foresight</span>.
          </h2>
          <p className="text-sm text-muted-foreground mt-3">
            Innovox surfaces patterns across hiring, tech adoption, and growth signals — designed to plug into the same Supabase schema.
          </p>
          <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
            <span><span className="font-display text-2xl font-bold text-foreground">{companies.length}</span> companies analyzed</span>
            <span className="h-4 w-px bg-border" />
            <span><span className="font-display text-2xl font-bold text-foreground">163</span> data points each</span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Panel 1: Tech Trends */}
        <div className="group rounded-xl border border-border bg-surface p-5 hover:shadow-elevated transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-brand-soft text-brand grid place-items-center group-hover:bg-gradient-brand group-hover:text-brand-foreground transition-all">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="font-display font-semibold">Emerging Tech Trends</div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed mb-4">Aggregated tech stack requirements across recruiting partners.</p>
          <div className="mt-auto space-y-2">
            {topTech.length > 0 ? topTech.map(([tech, count]) => (
              <div key={tech} className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground truncate mr-2">{tech}</span>
                <span className="text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-md">{count} instances</span>
              </div>
            )) : <div className="text-xs text-muted-foreground text-center py-4">Not enough data</div>}
          </div>
        </div>

        {/* Panel 2: High Growth */}
        <div className="group rounded-xl border border-border bg-surface p-5 hover:shadow-elevated transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 grid place-items-center group-hover:bg-amber-500 group-hover:text-white transition-all">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="font-display font-semibold">High-growth Companies</div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed mb-4">Companies showing high hiring velocity or growth.</p>
          <div className="mt-auto space-y-2">
            {highGrowth.length > 0 ? highGrowth.map(c => (
              <Link to={`/company/${c.company_id}`} key={c.company_id} className="flex justify-between items-center text-xs group/link">
                <span className="font-medium text-foreground truncate mr-2 group-hover/link:text-brand">{c.name || c.short_name}</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[80px]">High Velocity</span>
              </Link>
            )) : <div className="text-xs text-muted-foreground text-center py-4">Not enough data</div>}
          </div>
        </div>

        {/* Panel 3: Skill Demand */}
        <div className="group rounded-xl border border-border bg-surface p-5 hover:shadow-elevated transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 grid place-items-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Lightbulb className="h-5 w-5" />
            </div>
          </div>
          <div className="font-display font-semibold">Skill Demand Insights</div>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed mb-4">Most-requested specific skills across the market.</p>
          <div className="mt-auto space-y-2">
            {topSkills.length > 0 ? topSkills.map(([skill, count]) => (
              <div key={skill} className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground truncate mr-2">{skill}</span>
                <span className="text-muted-foreground bg-surface-muted px-2 py-0.5 rounded-md">{count} matches</span>
              </div>
            )) : <div className="text-xs text-muted-foreground text-center py-4">Not enough data</div>}
          </div>
        </div>

      </div>
    </div>
  );
}
