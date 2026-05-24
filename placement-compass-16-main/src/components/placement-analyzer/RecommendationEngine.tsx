import React from "react";
import { ReadinessResult, StudentProfile } from "./types";

interface Props {
  readiness: ReadinessResult;
  matches: any[];
  profile: StudentProfile;
}

export default function RecommendationEngine({ readiness, matches, profile }: Props) {
  const missingSkillCounts: Record<string, number> = {};
  matches.slice(0, 5).forEach(m => {
    m.missingSkills.forEach((s: string) => {
      missingSkillCounts[s] = (missingSkillCounts[s] || 0) + 1;
    });
  });

  const topMissingSkills = Object.entries(missingSkillCounts)
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0]);

  // --- Column 1: Dynamic Action Plan ---
  const actionItems: string[] = [];
  const weakLower = readiness.weaknesses.map(w => w.toLowerCase());

  if (weakLower.some(w => w.includes("dsa") || w.includes("data structure") || w.includes("algorithm"))) {
    actionItems.push("Sharpen DSA by solving 2-3 problems daily on LeetCode or GeeksForGeeks.");
  }
  if (weakLower.some(w => w.includes("communication") || w.includes("soft skill") || w.includes("verbal"))) {
    actionItems.push("Practice mock interviews and group discussions to improve communication.");
  }
  if (weakLower.some(w => w.includes("project"))) {
    actionItems.push("Build at least 2 full-stack projects with deployed demos.");
  }
  if (weakLower.some(w => w.includes("certification") || w.includes("certif"))) {
    actionItems.push("Get certified in at least one cloud platform (AWS/Azure/GCP).");
  }
  if (weakLower.some(w => w.includes("internship"))) {
    actionItems.push("Apply for summer internships to gain industry experience.");
  }
  if (weakLower.some(w => w.includes("aptitude") || w.includes("quantitative"))) {
    actionItems.push("Practice quantitative aptitude daily using IndiaBix or PrepInsta.");
  }
  if (weakLower.some(w => w.includes("cgpa") || w.includes("grade") || w.includes("academic"))) {
    actionItems.push("Focus on improving semester grades to raise CGPA above 7.0.");
  }
  if (profile.skills.length < 3) {
    actionItems.push("Learn at least 3-5 in-demand technologies for your target role.");
  }

  // Ensure at least 3 items
  if (actionItems.length === 0) {
    actionItems.push(
      "Continue strengthening your core skills with advanced-level challenges.",
      "Mentor peers and contribute to open-source to build leadership experience.",
      "Prepare behavioral interview stories using the STAR framework."
    );
  } else if (actionItems.length === 1) {
    actionItems.push(
      "Mentor peers and contribute to open-source to build leadership experience.",
      "Prepare behavioral interview stories using the STAR framework."
    );
  } else if (actionItems.length === 2) {
    actionItems.push("Prepare behavioral interview stories using the STAR framework.");
  }

  // --- Column 2: Dynamic Roadmap ---
  const shortTerm: string[] = [];
  if (topMissingSkills.length > 0) {
    shortTerm.push(`Start learning: ${topMissingSkills.slice(0, 3).join(", ")}.`);
  }
  if (profile.dsaScore < 60) {
    shortTerm.push("Begin daily DSA practice starting from arrays and strings.");
  }
  shortTerm.push("Review and update your resume with quantifiable achievements.");

  const mediumTerm: string[] = [];
  if (profile.projectsCount < 2) {
    mediumTerm.push("Complete 1-2 mini projects using target company technologies.");
  }
  if (profile.certifications.length === 0) {
    mediumTerm.push("Complete one relevant certification on Coursera or Udemy.");
  }
  if (profile.internshipCount < 1) {
    mediumTerm.push("Apply for virtual internships on Internshala or LinkedIn.");
  }
  if (mediumTerm.length === 0) {
    mediumTerm.push("Deepen expertise in your strongest skills with advanced coursework.");
  }

  const longTerm: string[] = [];
  const projectsNeeded = Math.max(0, 3 - profile.projectsCount);
  longTerm.push(`Build a portfolio with ${projectsNeeded > 0 ? projectsNeeded : "more"} projects.`);
  if (matches.length > 0) {
    longTerm.push(`Prepare company-specific interview prep for ${matches[0].company?.name || matches[0].company}.`);
  }
  longTerm.push("Track placement readiness score weekly and aim for 80+.");

  // --- Column 3: Dynamic AI Signals ---
  const topCompany = matches.length > 0 ? matches[0] : null;
  const topCompanyName = topCompany ? (topCompany.company?.name || topCompany.company) : null;
  const topMatchPct = topCompany ? topCompany.matchPercentage : 0;

  const nextUpSkill = topMissingSkills[0] || (profile.skills.length > 0 ? profile.skills[0] : "Cloud Services");
  const nextUpText = `Build a project using company target tech: ${nextUpSkill}.`;

  // Determine weakest dimension for focus area
  let focusAreaText = "Improve resume keywords & storytelling.";
  if (readiness.weaknesses.length > 0) {
    const firstWeak = readiness.weaknesses[0];
    focusAreaText = `Strengthen your weakest area: ${firstWeak}.`;
  }

  // Recruiter tip based on profile
  let recruiterTipText: string;
  if (profile.communicationLevel === "Poor" || profile.communicationLevel === "Average") {
    recruiterTipText = "Recruiters value communication — practice articulating your projects clearly.";
  } else if (profile.projectsCount < 2) {
    recruiterTipText = "Showcase at least 2 well-documented projects on your resume to stand out.";
  } else if (profile.certifications.length === 0) {
    recruiterTipText = "Adding a certification signals initiative — recruiters notice this.";
  } else {
    recruiterTipText = "Your profile is well-rounded — highlight leadership and teamwork in interviews.";
  }

  // Best bet signal
  const bestBetText = topCompanyName
    ? `Best match: ${topCompanyName} at ${topMatchPct}% compatibility.`
    : "Expand your skill set to unlock more company matches.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Column 1: Action Plan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Action Plan</h2>
        <p className="text-[11px] text-slate-500 mb-6">Guided next steps to improve placement readiness.</p>
        
        <div className="space-y-3">
          {actionItems.map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-blue-500 mt-0.5 text-xs">⚑</span>
              <p className="text-xs font-medium text-slate-600">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Roadmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Roadmap</h2>
        <p className="text-[11px] text-slate-500 mb-6">Short, medium and long-term milestones.</p>
        
        <div className="space-y-4">
          <div className="border border-blue-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-3">
              <span className="text-lg leading-none">✦</span> Short-term
            </div>
            <ul className="space-y-2 text-[11px] text-slate-500 ml-1">
              {shortTerm.map((item, idx) => (
                <li key={idx} className="flex gap-2"><span>•</span> {item}</li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-3">
              <span className="text-lg leading-none">✦</span> Medium-term
            </div>
            <ul className="space-y-2 text-[11px] text-slate-500 ml-1">
              {mediumTerm.map((item, idx) => (
                <li key={idx} className="flex gap-2"><span>•</span> {item}</li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-3">
              <span className="text-lg leading-none">✦</span> Long-term
            </div>
            <ul className="space-y-2 text-[11px] text-slate-500 ml-1">
              {longTerm.map((item, idx) => (
                <li key={idx} className="flex gap-2"><span>•</span> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Column 3: AI Signals */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
        <h2 className="text-sm font-bold text-slate-900 mb-1">AI Signals</h2>
        <p className="text-[11px] text-slate-500 mb-6">Insights that highlight priority actions.</p>
        
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">Next up</p>
            <p className="text-xs font-bold text-slate-800">{nextUpText}</p>
          </div>
          
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">Focus area</p>
            <p className="text-xs font-bold text-slate-800">{focusAreaText}</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">Recruiter tip</p>
            <p className="text-xs font-bold text-slate-800">{recruiterTipText}</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">Best bet</p>
            <p className="text-xs font-bold text-slate-800">{bestBetText}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
