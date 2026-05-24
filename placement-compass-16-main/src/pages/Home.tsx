import { useMemo, useState } from "react";
import { Search, Building2, Layers, TrendingUp, Briefcase, Compass, BarChart3, Sparkles } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { mapCategory } from "@/lib/utils";

const CATEGORY_TILES = [
  { key: "Tech Giants", icon: Layers, hint: "Large cap & multinational orgs" },
  { key: "Product Based", icon: Briefcase, hint: "Product & SaaS companies" },
  { key: "Service Based", icon: Building2, hint: "IT services & consulting" },
  { key: "Startup or Small Scale Industries", icon: TrendingUp, hint: "High-growth startups & SMBs" },
];

const QUICK_CARDS = [
  { title: "Explore", description: "Search across companies and categories.", to: "/explore", icon: Compass },
  { title: "Companies", description: "Browse all partner profiles.", to: "/companies", icon: Building2 },
  { title: "Placement Analyzer", description: "Map skills against demand.", to: "/placement-analyzer", icon: Sparkles },
  { title: "Analytics", description: "Open placement insights.", to: "/analytics", icon: BarChart3 },
];

export default function Home() {
  const { data: companies = [], isLoading } = useCompanies();
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    companies.forEach(c => {
      const key = mapCategory(c.category);
      map[key] = (map[key] ?? 0) + 1;
    });
    return map;
  }, [companies]);

  const featuredCompanies = companies.slice(0, 5);
  const matched = companies.filter(c => !q || String(c.name).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-[0_40px_100px_rgba(15,23,42,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_35%)] pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-96 bg-[radial-gradient(circle,_rgba(168,85,247,0.15),_transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.85fr] items-center">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-200 shadow-sm">
              Modern placement experience</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight">Your campus hiring compass.</h1>
            <p className="max-w-xl text-sm leading-7 text-slate-200/90">Start with an engaging landing experience, then dive into Explore, Companies, Skill Mapping, Compare, and Analytics—without landing inside an admin dashboard.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Total recruitment partners</p>
                <p className="mt-3 text-3xl font-semibold">{companies.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl border border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Category coverage</p>
                <p className="mt-3 text-3xl font-semibold">{Object.keys(counts).length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Search companies</p>
                <p className="mt-1 text-lg font-semibold">Find the right hiring path</p>
              </div>
              <span className="rounded-full bg-brand/20 px-3 py-1 text-[11px] uppercase text-brand">Live</span>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search companies, domains, or tech stack…"
                className="h-12 rounded-3xl border border-white/10 bg-slate-900/90 pl-11 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="mt-6 grid gap-3">
              {QUICK_CARDS.map(({ title, description, to, icon: Icon }) => (
                <Link
                  key={title}
                  to={to}
                  className="group block rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-brand/30 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft/30 text-brand border border-brand/20 group-hover:bg-brand/20 transition-all"><Icon className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white group-hover:text-brand transition-colors">{title}</p>
                      <p className="text-sm text-slate-300 line-clamp-1">{description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand">Featured insights</p>
              <h2 className="mt-2 text-2xl font-display font-semibold">Browse high-impact hiring themes</h2>
            </div>
            <span className="rounded-full bg-brand/10 px-4 py-2 text-sm text-brand">Updated today</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CATEGORY_TILES.map(({ key, icon: Icon, hint }) => (
              <Link
                key={key}
                to={`/categories?cat=${encodeURIComponent(key)}`}
                className="group rounded-2xl border border-border bg-surface hover:bg-surface-muted p-6 transition-all duration-300 hover:shadow-elevated hover:border-brand/40 hover:-translate-y-0.5 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand/5 to-transparent rounded-full -mr-6 -mt-6 group-hover:from-brand/10 transition-all" />
                <div className="relative z-10 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-soft/60 to-brand-soft/30 border border-brand/20 group-hover:shadow-md transition-shadow"><Icon className="h-5 w-5 text-brand" /></div>
                  <div>
                    <h3 className="font-semibold text-base leading-tight group-hover:text-brand transition-colors">{key}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
                  </div>
                  <div className="flex items-end justify-between pt-2 border-t border-border/50">
                    <div>
                      <div className="text-3xl font-display font-bold text-brand">{counts[key] ?? 0}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{(counts[key] ?? 0) === 1 ? "company" : "companies"}</div>
                    </div>
                    <div className="text-xs font-medium text-brand/60 group-hover:text-brand transition-colors">Explore →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">Quick stats</p>
            <h2 className="mt-2 text-2xl font-display font-semibold">Placement metrics at a glance</h2>
          </div>
          <div className="grid gap-4">
            <StatMini label="Live hiring" value={companies.filter(c => String(c.hiring_velocity).toLowerCase() === "high").length} />
            <StatMini label="Verified profiles" value={featuredCompanies.length} />
            <StatMini label="Categories covered" value={Object.keys(counts).length} />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand">Featured companies</p>
            <h2 className="mt-2 text-2xl font-display font-semibold">Trending employers</h2>
          </div>
          <p className="text-sm text-muted-foreground">Showing the latest partner placements and active hiring signals.</p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-52 rounded-3xl bg-surface border border-border animate-pulse" />
            ))}
          </div>
        ) : featuredCompanies.length === 0 ? (
          <EmptyState title="No featured companies yet" description="The platform will show hiring partners once data is available." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCompanies.map(company => (
              <CompanyCard key={String(company.company_id)} company={company} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand">Recent analytics</p>
              <h2 className="mt-2 text-2xl font-display font-semibold">Latest trends</h2>
            </div>
            <span className="rounded-full bg-slate-100/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-300">Insights</span>
          </div>
          <div className="space-y-4">
            <ActionCard title="High demand sectors" description="Product and AI services are the top hiring focus for campus drives." />
            <ActionCard title="Skill gap signal" description="Cloud and full-stack development skills are in strong demand among current recruiters." />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand">Browse by action</p>
            <h2 className="mt-2 text-2xl font-display font-semibold">Quick navigation</h2>
          </div>
          <div className="grid gap-3">
            {QUICK_CARDS.map(({ title, description, to }) => (
              <Link key={title} to={to} className="rounded-3xl border border-border bg-surface p-4 transition hover:border-brand/40 hover:shadow-elevated">
                <div className="font-semibold">{title}</div>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border bg-white/5 p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

function ActionCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-border bg-slate-950/80 p-5">
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
