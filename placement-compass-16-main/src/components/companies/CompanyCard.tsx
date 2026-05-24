import { useState } from "react";
import type { Company } from "@/types/company";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string" && v.length) return v.split(",").map(s => s.trim());
  return [];
}

function extractLogoUrl(raw: string | null | undefined): string | null {
  if (!raw || raw === "null") return null;
  const firstPart = raw.split(';')[0].trim();
  const urlOnly = firstPart.split(' ')[0].trim();
  if (!urlOnly.startsWith('http')) return null;
  return urlOnly;
}

export function CompanyCard({ company }: { company: Company }) {
  const [imgError, setImgError] = useState(false);
  const sectors = asArray(company.focus_sectors).slice(0, 2);
  const logoSrc = extractLogoUrl(company.logo_url);
  const brandValueNum = Number(company.brand_value) || 0;
  const ratingColor = brandValueNum >= 80 ? "text-emerald-500" : brandValueNum >= 60 ? "text-amber-500" : "text-slate-400";
  
  return (
    <Link
      to={`/company/${company.company_id}`}
      className="group block rounded-2xl border border-border bg-surface hover:bg-surface-muted p-6 hover:shadow-elevated hover:border-brand/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden relative"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand/5 to-transparent rounded-full -mr-8 -mt-8 group-hover:from-brand/10 transition-all" />
      
      {/* Header with logo and badge */}
      <div className="flex items-start justify-between gap-3 mb-4 relative z-10">
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-soft/60 to-brand-soft/30 border border-brand/20 grid place-items-center overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
          {logoSrc && !imgError ? (
            <img src={logoSrc} alt={company.name || 'Company'} className="h-full w-full object-cover" onError={() => setImgError(true)} />
          ) : (
            <Building2 className="h-6 w-6 text-brand/50" />
          )}
        </div>
        {company.category && (
          <Badge variant="secondary" className="rounded-lg text-[10px] font-semibold whitespace-nowrap">
            {company.category}
          </Badge>
        )}
      </div>

      {/* Company name and short name */}
      <div className="mb-4 relative z-10">
        <h3 className="font-display text-base font-semibold line-clamp-2 leading-snug group-hover:text-brand transition-colors">
          {company.name}
        </h3>
        {company.short_name && (
          <div className="text-xs text-muted-foreground font-mono mt-1 opacity-70">
            {company.short_name}
          </div>
        )}
      </div>

      {/* Brand value or hiring status */}
      {(brandValueNum > 0 || company.hiring_velocity) && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50 relative z-10">
          {brandValueNum > 0 && (
            <div className={`flex items-center gap-1.5 ${ratingColor}`}>
              <span className="text-xs font-semibold">Rating</span>
              <span className="text-sm font-bold">{Math.round(brandValueNum)}</span>
            </div>
          )}
          {company.hiring_velocity && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`px-2 py-1 rounded-full font-medium ${
                String(company.hiring_velocity).toLowerCase() === 'high' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : String(company.hiring_velocity).toLowerCase() === 'medium'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {company.hiring_velocity} hiring
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 relative z-10">
        <Stat icon={<Users className="h-3.5 w-3.5" />} label="Size" value={company.employee_size ?? '—'} />
        <Stat icon={<TrendingUp className="h-3.5 w-3.5" />} label="Growth" value={company.yoy_growth_rate ? `${company.yoy_growth_rate}%` : '—'} />
        <Stat label="Status" value={company.profitability_status?.substring(0, 8) ?? '—'} />
      </div>

      {/* Focus sectors */}
      {sectors.length > 0 && (
        <div className="mt-auto pt-4 border-t border-border/50 relative z-10">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Focus areas</p>
          <div className="flex flex-wrap gap-1.5">
            {sectors.map(s => (
              <span key={s} className="inline-flex items-center text-[10px] px-2.5 py-1 rounded-lg bg-brand/8 text-brand/80 font-medium border border-brand/10 hover:bg-brand/12 transition-colors">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-widest font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-semibold text-foreground text-sm line-clamp-1">
        {String(value)}
      </div>
    </div>
  );
}
