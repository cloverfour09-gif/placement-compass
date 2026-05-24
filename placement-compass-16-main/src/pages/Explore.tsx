import { useMemo, useState } from "react";
import { Search, TrendingUp, Layers, Building2, Compass, Sparkles } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanies";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { mapCategory } from "@/lib/utils";

const CATEGORIES = [
  { key: "Tech Giants", icon: Layers, hint: "Large cap & multinational orgs" },
  { key: "Product Based", icon: Building2, hint: "Product & SaaS companies" },
  { key: "Service Based", icon: Compass, hint: "IT services & consulting" },
  { key: "Startup or Small Scale Industries", icon: TrendingUp, hint: "High-growth startups & SMBs" },
];

export default function Explore() {
  const { data: companies = [], isLoading } = useCompanies();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesQuery = !query || [company.name, company.category, company.tech_stack, company.focus_sectors]
        .map(value => String(value || "").toLowerCase())
        .some(value => value.includes(query.toLowerCase()));

      const matchesCategory = activeCategory === "All" || mapCategory(company.category) === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [companies, query, activeCategory]);

  const stats = useMemo(() => ({
    companies: companies.length,
    categories: new Set(companies.map(c => mapCategory(c.category))).size,
    trending: companies.filter(c => String(c.hiring_velocity).toLowerCase() === "high").length,
  }), [companies]);

  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Browse companies, categories, and placement momentum"
        description="Filter across hiring velocity, categories, and recruiting opportunities to uncover the best campus-intake match."
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] mb-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 shadow-[0_32px_120px_rgba(15,23,42,0.25)] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.2),_transparent_40%)]" />
          <div className="relative z-10 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Search the platform</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">A smarter way to discover hiring partners.</h2>
            <p className="text-sm leading-7 text-slate-200 max-w-xl">Explore recommended companies, compare demand categories, and surface the latest placement signals across the PESCE ecosystem.</p>
            <div className="grid gap-3 sm:grid-cols-3 mt-6">
              <StatCard label="Company profiles" value={stats.companies} />
              <StatCard label="Categories" value={stats.categories} />
              <StatCard label="High hiring" value={stats.trending} />
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {CATEGORIES.map(({ key, icon: Icon, hint }) => (
            <Link
              key={key}
              to={`/categories?cat=${encodeURIComponent(key)}`}
              className="group rounded-3xl border border-white/10 bg-surface p-5 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-base mb-1">{key}</h3>
              <p className="text-sm text-muted-foreground">{hint}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-brand">Search companies</p>
            <h3 className="font-display text-2xl font-semibold">Find companies by name, stack, or sector</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] w-full max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies, tech stack or sectors…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="h-12 rounded-3xl border border-border bg-surface pl-11"
              />
            </div>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ key }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveCategory(key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === key ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"}`}
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === "All" ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"}`}
          >
            All
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-52 rounded-3xl bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <EmptyState title="No companies match your search" description="Try a broader category or update your filter keywords." />
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.slice(0, 9).map(company => (
            <CompanyCard key={String(company.company_id)} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl text-white">
      <div className="text-xs uppercase tracking-[0.3em] text-slate-300">{label}</div>
      <div className="mt-3 text-3xl font-display font-semibold">{value}</div>
    </div>
  );
}
