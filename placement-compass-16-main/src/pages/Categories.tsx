import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCompanies } from "@/hooks/useCompanies";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { mapCategory } from "@/lib/utils";
import { Layers, Briefcase, Building2, TrendingUp } from "lucide-react";

const MAIN_CATEGORIES = [
  { name: "All", hint: "All recruitment partners", icon: null },
  { name: "Tech Giants", hint: "Large cap & multinational organizations", icon: Layers },
  { name: "Product Based", hint: "Product & SaaS companies", icon: Briefcase },
  { name: "Service Based", hint: "IT services & consulting firms", icon: Building2 },
  { name: "Startup or Small Scale Industries", hint: "High-growth startups & SMBs", icon: TrendingUp }
];

export default function Categories() {
  const { data: companies = [] } = useCompanies();
  const [params, setParams] = useSearchParams();
  const active = params.get("cat") ?? "All";

  const counts = useMemo(() => {
    const map: Record<string, number> = { "All": companies.length };
    companies.forEach(c => {
      const key = mapCategory(c.category);
      map[key] = (map[key] ?? 0) + 1;
    });
    return map;
  }, [companies]);

  const list = useMemo(
    () => active === "All" ? companies : companies.filter(c => mapCategory(c.category) === active),
    [companies, active]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Categories"
        title="Companies by Category"
        description="Explore companies grouped by their primary category and discover recruitment partners suited to your placement needs."
      />

      <div className="grid gap-3 mb-8 sm:grid-cols-2 lg:grid-cols-5">
        {MAIN_CATEGORIES.map(({ name: cat, hint, icon: Icon }) => {
          const count = counts[cat] ?? 0;
          return (
            <button
              key={cat}
              onClick={() => setParams(cat === "All" ? {} : { cat })}
              className={`relative group rounded-2xl border transition-all duration-300 p-4 text-left overflow-hidden ${
                active === cat
                  ? "bg-gradient-to-br from-brand/20 to-brand/10 border-brand/40 shadow-glow"
                  : "bg-surface border-border hover:border-brand/30 hover:shadow-md"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {Icon && <Icon className={`h-5 w-5 mb-2 transition-colors ${
                  active === cat ? "text-brand" : "text-muted-foreground group-hover:text-brand"
                }`} />}
                <div className="font-semibold text-sm line-clamp-1">{cat}</div>
                <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{hint}</div>
                <div className={`mt-3 text-2xl font-display font-bold transition-colors ${
                  active === cat ? "text-brand" : "text-foreground"
                }`}>{count}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{count === 1 ? "partner" : "partners"}</div>
              </div>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState title={`No companies in "${active}"`} />
      ) : (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{active}</h2>
              <p className="text-sm text-muted-foreground mt-1">{list.length} {list.length === 1 ? "company" : "companies"} available for placement</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map(c => <CompanyCard key={String(c.company_id)} company={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
