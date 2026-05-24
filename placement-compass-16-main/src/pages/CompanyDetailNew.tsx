/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from "react-router-dom";
import { useCompany, useCompanies } from "@/hooks/useCompanies";
import { EmptyState } from "@/components/common/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Globe, Users, TrendingUp, Code2, Briefcase, Zap, MapPin, Building2, BarChart3, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import type { Company } from "@/types/company";

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

function StatsCard({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon?: any; trend?: 'up' | 'down' }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-surface/60 backdrop-blur-sm p-4 hover:border-brand/40 hover:bg-surface/80 transition-all">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-brand/60" />}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-display font-bold text-foreground">{value}</div>
        {trend && (
          <TrendingUp className={`h-4 w-4 ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`} />
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) {
  if (!value) return null;
  const strValue = Array.isArray(value) ? value.join(", ") : String(value);

  return (
    <div className="rounded-xl border border-border/50 bg-surface/40 backdrop-blur-sm p-4">
      <div className="flex items-start gap-3">
        {Icon && <Icon className="h-5 w-5 text-brand/60 mt-0.5 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
          <p className="text-sm text-foreground line-clamp-3">{strValue}</p>
        </div>
      </div>
    </div>
  );
}

function GridCards({ items }: { items: { label: string; value: any; icon?: any }[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.filter(i => i.value).map((item, idx) => (
        <InfoCard key={idx} {...item} />
      ))}
    </div>
  );
}

export default function CompanyDetail() {
  const { id } = useParams();
  const { data: company, isLoading } = useCompany(id);
  const { data: companies = [] } = useCompanies();
  const [imgError, setImgError] = React.useState(false);

  if (isLoading) {
    return <div className="h-96 rounded-2xl bg-gradient-to-br from-surface to-surface/50 border border-border animate-pulse" />;
  }

  if (!company) {
    return (
      <div>
        <Link to="/companies" className="inline-flex items-center text-sm text-brand mb-4 hover:text-brand/80 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to companies
        </Link>
        <EmptyState title="Company not found" description="This record is not yet available." />
      </div>
    );
  }

  const logoSrc = extractLogoUrl(company.logo_url);
  const brandValueNum = Number(company.brand_value) || 0;
  const techStack = asArray(company.tech_stack);
  const sectors = asArray(company.focus_sectors).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link to="/companies" className="inline-flex items-center text-sm text-brand hover:text-brand/80 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to companies
      </Link>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900/95 to-brand/10 p-8 border border-border/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand/10 to-transparent rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-brand/5 to-transparent rounded-full -ml-36 -mb-36 blur-3xl" />
        
        <div className="relative z-10">
          <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-start">
            {/* Logo */}
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-brand-soft/60 to-brand-soft/30 border border-brand/20 grid place-items-center overflow-hidden shadow-lg flex-shrink-0">
              {logoSrc && !imgError ? (
                <img src={logoSrc} alt={company.name || 'Company'} className="h-full w-full object-cover" onError={() => setImgError(true)} />
              ) : (
                <Building2 className="h-10 w-10 text-brand/60" />
              )}
            </div>

            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-display font-bold text-white">{company.name}</h1>
                {company.short_name && (
                  <span className="text-sm text-slate-300 font-mono">({company.short_name})</span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {company.category && (
                  <Badge className="bg-brand/20 text-brand border-brand/30 rounded-lg text-sm font-semibold px-3 py-1">
                    {company.category}
                  </Badge>
                )}
                {company.hiring_velocity && (
                  <Badge className={`${
                    String(company.hiring_velocity).toLowerCase() === 'high' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  } border rounded-lg text-sm font-semibold px-3 py-1`}>
                    {company.hiring_velocity} Hiring
                  </Badge>
                )}
                {brandValueNum > 0 && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border rounded-lg text-sm font-semibold px-3 py-1">
                    ⭐ {Math.round(brandValueNum)} Brand Value
                  </Badge>
                )}
              </div>

              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                {company.overview_text || company.core_value_proposition || "Premium recruitment partner providing comprehensive talent placement solutions."}
              </p>

              {company.website_url && (
                <a 
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand hover:text-brand/80 transition-colors text-sm font-medium"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Employee Size" value={company.employee_size ?? "—"} icon={Users} />
        <StatsCard label="Growth Rate" value={company.yoy_growth_rate ? `${company.yoy_growth_rate}%` : "—"} icon={TrendingUp} trend="up" />
        <StatsCard label="R&D Investment" value={company.r_and_d_investment ? `${company.r_and_d_investment}` : "—"} icon={Zap} />
        <StatsCard label="Founded" value={company.incorporation_year ?? "—"} icon={Briefcase} />
      </section>

      {/* Tabs Section */}
      <Tabs defaultValue="Overview" className="w-full">
        <div className="mb-6 overflow-x-auto">
          <TabsList className="bg-surface/40 backdrop-blur-sm border border-border/50 rounded-2xl p-1 inline-flex w-full">
            {['Overview', 'Hiring', 'Tech Stack', 'Culture', 'Finance', 'Growth', 'Innovation', 'Locations'].map(tab => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="data-[state=active]:bg-brand data-[state=active]:text-brand-foreground rounded-xl transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="Overview" className="space-y-6">
          <GridCards items={[
            { label: "Mission", value: company.mission_statement, icon: Briefcase },
            { label: "Vision", value: company.vision_statement, icon: Brain },
            { label: "Core Values", value: company.core_values },
            { label: "Value Proposition", value: company.core_value_proposition },
            { label: "Unique Differentiators", value: company.unique_differentiators },
            { label: "Competitive Advantages", value: company.competitive_advantages },
          ]} />
          <GridCards items={[
            { label: "Locations", value: company.office_locations, icon: MapPin },
            { label: "Operating Countries", value: company.operating_countries },
            { label: "Headquarters", value: company.headquarters_address },
          ]} />
        </TabsContent>

        {/* Hiring Tab */}
        <TabsContent value="Hiring" className="space-y-6">
          <GridCards items={[
            { label: "Hiring Velocity", value: company.hiring_velocity, icon: TrendingUp },
            { label: "Employee Turnover", value: company.employee_turnover },
            { label: "Avg Retention Tenure", value: company.avg_retention_tenure },
            { label: "Onboarding Quality", value: company.onboarding_quality },
            { label: "Learning Culture", value: company.learning_culture },
            { label: "Skill Relevance", value: company.skill_relevance },
          ]} />
        </TabsContent>

        {/* Tech Stack Tab */}
        <TabsContent value="Tech Stack" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {techStack.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-sm p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-brand mb-4">Core Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map(tech => (
                    <Badge key={tech} className="bg-brand/10 text-brand border-brand/20 border rounded-lg">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <GridCards items={[
              { label: "AI/ML Adoption", value: company.ai_ml_adoption_level, icon: Brain },
              { label: "Automation Level", value: company.automation_level, icon: Zap },
              { label: "Cybersecurity", value: company.cybersecurity_posture },
            ]} />
          </div>
        </TabsContent>

        {/* Culture Tab */}
        <TabsContent value="Culture" className="space-y-6">
          <GridCards items={[
            { label: "Work Culture", value: company.work_culture_summary },
            { label: "Psychological Safety", value: company.psychological_safety },
            { label: "Manager Quality", value: company.manager_quality },
            { label: "Diversity & Inclusion", value: company.diversity_inclusion_score },
            { label: "Typical Hours", value: company.typical_hours },
            { label: "Flexibility Level", value: company.flexibility_level },
            { label: "Leave Policy", value: company.leave_policy },
            { label: "Remote Policy", value: company.remote_policy_details },
            { label: "Sustainability/CSR", value: company.sustainability_csr },
          ]} />
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="Finance" className="space-y-6">
          <GridCards items={[
            { label: "Annual Revenue", value: company.annual_revenue },
            { label: "Annual Profit", value: company.annual_profit },
            { label: "Valuation", value: company.valuation },
            { label: "Profitability Status", value: company.profitability_status },
            { label: "Customer Lifetime Value", value: company.customer_lifetime_value },
            { label: "CAC/LTV Ratio", value: company.cac_ltv_ratio },
            { label: "Burn Rate", value: company.burn_rate },
            { label: "Runway", value: company.runway_months ? `${company.runway_months} months` : "—" },
          ]} />
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="Growth" className="space-y-6">
          <GridCards items={[
            { label: "YoY Growth Rate", value: company.yoy_growth_rate ? `${company.yoy_growth_rate}%` : "—" },
            { label: "Market Share", value: company.market_share_percentage },
            { label: "Net Promoter Score", value: company.net_promoter_score },
            { label: "TAM", value: company.tam },
            { label: "SAM", value: company.sam },
            { label: "SOM", value: company.som },
            { label: "Customer Concentration Risk", value: company.customer_concentration_risk },
            { label: "Future Projections", value: company.future_projections },
          ]} />
        </TabsContent>

        {/* Innovation Tab */}
        <TabsContent value="Innovation" className="space-y-6">
          <GridCards items={[
            { label: "R&D Investment", value: company.r_and_d_investment, icon: Zap },
            { label: "Intellectual Property", value: company.intellectual_property },
            { label: "Innovation Roadmap", value: company.innovation_roadmap },
            { label: "Product Pipeline", value: company.product_pipeline },
            { label: "Strategic Priorities", value: company.strategic_priorities },
            { label: "Benchmark vs Peers", value: company.benchmark_vs_peers },
          ]} />
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="Locations" className="space-y-6">
          <GridCards items={[
            { label: "Headquarters", value: company.headquarters_address, icon: MapPin },
            { label: "Office Count", value: company.office_count },
            { label: "Office Locations", value: company.office_locations },
            { label: "Operating Countries", value: company.operating_countries },
            { label: "Location Centrality", value: company.location_centrality },
            { label: "Public Transport Access", value: company.public_transport_access },
            { label: "Airport Commute", value: company.airport_commute_time },
            { label: "Area Safety", value: company.area_safety },
          ]} />
        </TabsContent>
      </Tabs>

      {/* Focus Sectors */}
      {sectors.length > 0 && (
        <section className="rounded-2xl border border-border/50 bg-surface/40 backdrop-blur-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-brand" />
            Focus Sectors
          </h2>
          <div className="flex flex-wrap gap-2">
            {sectors.map(sector => (
              <Badge key={sector} className="bg-brand/10 text-brand border-brand/20 border rounded-lg font-medium px-4 py-2">
                {sector}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import React from 'react';
