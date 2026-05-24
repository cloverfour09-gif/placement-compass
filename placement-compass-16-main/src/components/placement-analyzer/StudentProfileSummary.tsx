import React from "react";
import { StudentProfile } from "./types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit3, RefreshCw, Trash2, Calendar, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  profile: StudentProfile;
  completeness: number;
  onEdit: () => void;
  onReset: () => void;
  onRefresh: () => void;
}

export default function StudentProfileSummary({ profile, completeness, onEdit, onReset, onRefresh }: Props) {
  const formatTimestamp = (ts?: string) => {
    if (!ts) return "Never";
    return new Date(ts).toLocaleString();
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Profile Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-800">{profile.fullName || "Un-named Profile"}</h3>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Updated: {formatTimestamp(profile.updatedAt)}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {profile.department} · {profile.yearSemester}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 shadow-sm transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </button>
          
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-4 py-2 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Analysis
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 rounded-lg px-4 py-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Reset Profile
          </button>
        </div>
      </div>

      {/* Completeness Bar */}
      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Completeness</span>
          <span className="text-sm font-bold text-blue-600">{completeness}%</span>
        </div>
        <Progress value={completeness} className="h-2.5 bg-slate-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Academics & Technical Readiness */}
        <div className="space-y-6">
          
          {/* Academic Info Grid */}
          <div className="border border-slate-100 bg-white rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Records</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CGPA</span>
                <span className="text-sm font-bold text-slate-800">{profile.cgpa.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Backlogs</span>
                <span className={`text-sm font-bold ${profile.backlogs > 0 ? 'text-red-500' : 'text-slate-800'}`}>
                  {profile.backlogs}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">10th Score</span>
                <span className="text-sm font-bold text-slate-800">{profile.tenthPercentage || "—"}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">12th Score</span>
                <span className="text-sm font-bold text-slate-800">{profile.twelfthPercentage || "—"}%</span>
              </div>
            </div>
          </div>

          {/* Technical Scores Grid */}
          <div className="border border-slate-100 bg-white rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technical Readiness</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">DSA Score</span>
                <span className="text-sm font-bold text-slate-800">{profile.dsaScore}/100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Aptitude Score</span>
                <span className="text-sm font-bold text-slate-800">{profile.aptitudeScore}/100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Coding Confidence</span>
                <span className="text-sm font-bold text-slate-800">{profile.codingConfidence}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Communication Level</span>
                <span className="text-sm font-bold text-slate-800">{profile.communicationLevel}</span>
              </div>
            </div>
          </div>

          {/* Skills & Technologies */}
          <div className="border border-slate-100 bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Skills & Technologies</h4>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Preferred Coding Language</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{profile.preferredLanguage || "—"}</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Skills</span>
              <div className="flex flex-wrap gap-1">
                {profile.skills.map((s, i) => (
                  <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{s}</Badge>
                ))}
                {profile.skills.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Frameworks</span>
              <div className="flex flex-wrap gap-1">
                {profile.frameworks.map((f, i) => (
                  <Badge key={i} variant="outline" className="bg-purple-50 text-purple-700 border-purple-100">{f}</Badge>
                ))}
                {profile.frameworks.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Developer Tools</span>
              <div className="flex flex-wrap gap-1">
                {profile.tools.map((t, i) => (
                  <Badge key={i} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">{t}</Badge>
                ))}
                {profile.tools.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Experience & Preferences */}
        <div className="space-y-6">
          
          {/* Projects & Internships */}
          <div className="border border-slate-100 bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience & Achievements</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Projects Completed</span>
                <span className="text-sm font-bold text-slate-800">{profile.projectsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Internships Completed</span>
                <span className="text-sm font-bold text-slate-800">{profile.internshipCount}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Certifications</span>
              <div className="flex flex-wrap gap-1">
                {profile.certifications.map((c, i) => (
                  <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">{c}</Badge>
                ))}
                {profile.certifications.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-2">
                {profile.hackathonParticipation ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-300" />
                )}
                <span className="text-xs text-slate-600">Hackathons</span>
              </div>
              <div className="flex items-center gap-2">
                {profile.openSourceContribution ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-300" />
                )}
                <span className="text-xs text-slate-600">Open Source</span>
              </div>
            </div>
          </div>

          {/* Career Preferences */}
          <div className="border border-slate-100 bg-white rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Career Preferences</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Preferred Role</span>
                <span className="text-sm font-bold text-slate-800 truncate block" title={profile.preferredRole}>
                  {profile.preferredRole}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Company Type</span>
                <span className="text-sm font-bold text-slate-800">{profile.preferredCompanyType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Expected Package</span>
                <span className="text-sm font-bold text-slate-800">{profile.expectedPackage}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Career Domain</span>
                <span className="text-sm font-bold text-slate-800 truncate block" title={profile.careerDomain}>
                  {profile.careerDomain}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-50">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Placement Goal</span>
              <span className="text-sm font-semibold text-slate-700 block">{profile.placementGoal}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
