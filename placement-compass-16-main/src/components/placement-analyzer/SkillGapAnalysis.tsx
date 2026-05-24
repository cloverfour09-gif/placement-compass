import React, { useState } from "react";
import { StudentProfile } from "./types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, AlertTriangle, Plus, X } from "lucide-react";

interface Props {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  matches: any[];
}

export default function SkillGapAnalysis({ profile, onChange, matches }: Props) {
  const [skillInput, setSkillInput] = useState("");

  const handleSkillAdd = (skill: string) => {
    const cleaned = skill.trim();
    if (cleaned && !profile.skills.some(s => s.toLowerCase() === cleaned.toLowerCase())) {
      onChange({
        ...profile,
        skills: [...profile.skills, cleaned]
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillAdd(skillInput);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  // Extract and aggregate all required skills from matches
  const topCompanies = matches.slice(0, 10);
  const skillFrequency: Record<string, { count: number; companies: string[] }> = {};
  
  topCompanies.forEach(match => {
    const companyName = match.company.name || match.company.short_name;
    const reqSkills = match.company.tech_stack 
      ? (typeof match.company.tech_stack === "string" 
          ? match.company.tech_stack.split(/[;,]/).map((s: string) => s.trim()) 
          : Array.isArray(match.company.tech_stack) ? match.company.tech_stack : [])
      : [];

    const reqSkillsRelevance = match.company.skill_relevance 
      ? (typeof match.company.skill_relevance === "string" 
          ? match.company.skill_relevance.split(/[;,]/).map((s: string) => s.trim()) 
          : Array.isArray(match.company.skill_relevance) ? match.company.skill_relevance : [])
      : [];

    const allReqs = Array.from(new Set([...reqSkills, ...reqSkillsRelevance]))
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.toLowerCase().startsWith("highly relevant") && s.toLowerCase() !== "none");

    allReqs.forEach(skill => {
      const lower = skill.toLowerCase();
      // Find standard capitalization if possible
      const display = skill; 
      if (!skillFrequency[lower]) {
        skillFrequency[lower] = { count: 0, companies: [] };
      }
      if (!skillFrequency[lower].companies.includes(companyName)) {
        skillFrequency[lower].count += 1;
        skillFrequency[lower].companies.push(companyName);
      }
    });
  });

  const studentSkillsLower = profile.skills.map(s => s.trim().toLowerCase());

  // Determine missing skills
  const missingSkillsList = Object.entries(skillFrequency)
    .filter(([skillKey]) => !studentSkillsLower.includes(skillKey))
    .map(([skillKey, info]) => {
      // Find a nice display name
      const matchForDisplay = topCompanies
        .flatMap(m => {
          const tech = typeof m.company.tech_stack === "string" ? m.company.tech_stack.split(/[;,]/) : (m.company.tech_stack || []);
          const rel = typeof m.company.skill_relevance === "string" ? m.company.skill_relevance.split(/[;,]/) : (m.company.skill_relevance || []);
          return [...tech, ...rel];
        })
        .find(s => String(s).trim().toLowerCase() === skillKey);
        
      const displayName = matchForDisplay ? String(matchForDisplay).trim() : skillKey;

      let priority: "High" | "Medium" | "Low" = "Low";
      if (info.count >= 4) priority = "High";
      else if (info.count >= 2) priority = "Medium";

      return {
        key: skillKey,
        name: displayName,
        count: info.count,
        companies: info.companies,
        priority
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-semibold">Skill Gap Analysis & Missing Skills Engine</h2>
        <p className="text-muted-foreground">Compare your skills against targeted company requirements and dynamically build your roadmap.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Manage Current Skills */}
        <Card className="lg:col-span-1 border border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Your Skill Inventory</CardTitle>
            <CardDescription>Add or remove skills to update your placement readiness dynamically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill-input">Add Technical Skill</Label>
              <div className="flex gap-2">
                <Input
                  id="skill-input"
                  placeholder="e.g. React, Docker, Python..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => {
                    handleSkillAdd(skillInput);
                    setSkillInput("");
                  }}
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Active Skills ({profile.skills.length})</Label>
              <div className="flex flex-wrap gap-2 min-h-[100px] p-3 border rounded-lg bg-slate-50/50">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="px-2.5 py-1 text-xs gap-1.5 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      {skill}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed yet. Add skills to see compatibility.</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Missing Skills Engine */}
        <Card className="lg:col-span-2 border border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Missing Skills Engine
            </CardTitle>
            <CardDescription>These high-demand technologies are required by your best matched companies but missing from your profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {missingSkillsList.length > 0 ? (
              <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                {missingSkillsList.slice(0, 8).map((missing, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-sm truncate">{missing.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          missing.priority === "High" 
                            ? "bg-red-50 text-red-600 border border-red-100" 
                            : missing.priority === "Medium"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {missing.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        Required by: {missing.companies.slice(0, 3).join(", ")}{missing.companies.length > 3 ? ` +${missing.companies.length - 3} more` : ""}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSkillAdd(missing.name)}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-600 hover:text-white rounded-lg px-3 py-1.5 transition-all flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add to Profile
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                <h4 className="font-bold text-slate-800">No Skill Gaps Detected!</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  You possess all the key technical requirements for your top company opportunities.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
