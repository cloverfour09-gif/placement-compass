import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Company } from "@/types/company";
import { StudentProfile, defaultProfile } from "../../components/placement-analyzer/types";
import {
  calculateReadiness,
  calculateCompanyMatch,
  generateRecruiterImpression,
  calculateProfileCompleteness,
  calculateInterviewReadiness,
  calculateATSReadiness,
} from "../../components/placement-analyzer/scoringLogic";
import { Loader2, Target, CheckCircle2, Award, Zap, FileText, Briefcase, GraduationCap, LineChart, Save, X } from "lucide-react";
import StudentProfileSetup from "../../components/placement-analyzer/StudentProfileSetup";
import StudentProfileSummary from "../../components/placement-analyzer/StudentProfileSummary";
import CompanyMatchAnalysis from "../../components/placement-analyzer/CompanyMatchAnalysis";
import RecommendationEngine from "../../components/placement-analyzer/RecommendationEngine";
import EligibilityChecker from "../../components/placement-analyzer/EligibilityChecker";
import AnalyticsVisualizations from "../../components/placement-analyzer/AnalyticsVisualizations";
import SkillGapAnalysis from "../../components/placement-analyzer/SkillGapAnalysis";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const PROFILE_STORAGE_KEY = "placement_analyzer_profile";
const PROFILE_SAVED_KEY = "placement_analyzer_profile_saved";

/** Load profile from localStorage, returning null if not found */
const loadSavedProfile = (): StudentProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StudentProfile;
  } catch {
    return null;
  }
};

/** Persist profile to localStorage */
const persistProfile = (profile: StudentProfile) => {
  const stamped = { ...profile, updatedAt: new Date().toISOString() };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(stamped));
  localStorage.setItem(PROFILE_SAVED_KEY, "true");
  return stamped;
};

/** Clear saved profile from localStorage */
const clearSavedProfile = () => {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(PROFILE_SAVED_KEY);
};

export default function PlacementAnalyzer() {
  // --- Profile State ---
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // --- Company State ---
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Tab State ---
  const [activeTab, setActiveTab] = useState("recommendations");

  // --- Load saved profile on mount ---
  useEffect(() => {
    const saved = loadSavedProfile();
    if (saved) {
      setProfile(saved);
      setIsProfileSaved(true);
      setIsEditing(false);
    } else {
      // No saved profile → start in edit mode on profile tab
      setIsEditing(true);
      setActiveTab("profile");
    }
  }, []);

  // --- Fetch companies from Supabase ---
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase.from('company').select('*');
      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Analytics (memoized to recalculate when profile or companies change) ---
  const readiness = useMemo(() => calculateReadiness(profile), [profile]);

  const matches = useMemo(() =>
    companies.map(c => ({
      company: c,
      ...calculateCompanyMatch(profile, c),
    })).sort((a, b) => b.matchPercentage - a.matchPercentage),
    [profile, companies]
  );

  const recruiterImpression = useMemo(() => generateRecruiterImpression(profile, readiness), [profile, readiness]);
  const profileCompleteness = useMemo(() => calculateProfileCompleteness(profile), [profile]);
  const interviewReadiness = useMemo(() => calculateInterviewReadiness(profile), [profile]);
  const atsReadiness = useMemo(() => calculateATSReadiness(profile, companies), [profile, companies]);

  // --- Profile Actions ---
  const handleSaveProfile = useCallback(() => {
    const stamped = persistProfile(profile);
    setProfile(stamped);
    setIsProfileSaved(true);
    setIsEditing(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  }, [profile]);

  const handleEditProfile = useCallback(() => {
    setIsEditing(true);
    setActiveTab("profile");
  }, []);

  const handleCancelEdit = useCallback(() => {
    // Revert to saved version
    const saved = loadSavedProfile();
    if (saved) {
      setProfile(saved);
      setIsEditing(false);
    }
  }, []);

  const handleResetProfile = useCallback(() => {
    clearSavedProfile();
    setProfile({ ...defaultProfile });
    setIsProfileSaved(false);
    setIsEditing(true);
    setActiveTab("profile");
  }, []);

  const handleRefreshAnalysis = useCallback(() => {
    // Re-persist to trigger timestamp update, then recalc
    if (isProfileSaved) {
      const stamped = persistProfile(profile);
      setProfile(stamped);
    }
  }, [profile, isProfileSaved]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
        <span className="ml-2 text-muted-foreground">Loading Intelligence Engine...</span>
      </div>
    );
  }

  // --- Timeline data for chart ---
  const baseScore = Math.max(20, readiness.score - 25);
  const timelineData = [
    { name: 'W1', score: baseScore },
    { name: 'W2', score: Math.round(baseScore + (readiness.score - baseScore) * 0.3) },
    { name: 'W3', score: Math.round(baseScore + (readiness.score - baseScore) * 0.7) },
    { name: 'W4', score: readiness.score },
  ];

  // --- Profile status label ---
  const profileStatusLabel = !isProfileSaved
    ? "Not Saved"
    : isEditing
    ? "Editing..."
    : "Saved & Analyzed";

  const profileStatusColor = !isProfileSaved
    ? "bg-amber-50 text-amber-600"
    : isEditing
    ? "bg-blue-50 text-blue-600"
    : "bg-emerald-50 text-emerald-600";

  return (
    <div className="bg-[#f8f9fe] min-h-screen -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Save Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg">
            <CheckCircle2 className="w-4 h-4" />
            Profile saved & analysis updated!
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-blue-600 mb-2 uppercase">
            <Target className="w-4 h-4" /> AI Placement Readiness Analyzer
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Placement Readiness Analyzer</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Professional placement intelligence: compare your skills, CGPA, certifications and interests against company requirements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isProfileSaved && !isEditing && (
            <span className="text-[10px] font-medium text-slate-400">
              Last updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "N/A"}
            </span>
          )}
          <button
            onClick={handleRefreshAnalysis}
            className="text-xs font-medium bg-slate-900 text-white rounded-md px-3 py-1.5 shadow-sm hover:bg-slate-800 transition-colors"
          >
            Refresh View
          </button>
        </div>
      </div>

      {/* Top 60/40 Layout */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        
        {/* LEFT COLUMN: Main Analytics */}
        <div className="lg:w-[60%] bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-8">
            <span className="text-slate-800 bg-slate-100 px-3 py-1 rounded-full">AI readiness</span>
            <span>Placement match analytics • Strengths • Roadmap</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-8 items-center justify-between">
            {/* Stats Left */}
            <div className="flex gap-4 w-full md:w-auto">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Placement<br/>Readiness</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-slate-800">{readiness.score}</span>
                  <span className="text-sm font-medium text-slate-400 ml-1">/100</span>
                </div>
              </div>
              
              <div className="ml-4 border border-slate-200 rounded-xl p-4 min-w-[120px] flex flex-col items-center justify-center">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 text-center">Status</p>
                <span className="text-sm font-semibold text-slate-800 text-center">{readiness.level === 'Advanced' ? 'Placement Ready' : 'Needs Improvement'}</span>
              </div>
            </div>

            {/* Circular Chart Right */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-blue-600 drop-shadow-md transition-all duration-1000 ease-out"
                  strokeDasharray={`${readiness.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match Score</span>
                <span className="text-4xl font-bold text-slate-800 mt-1">{readiness.score}</span>
              </div>
            </div>
          </div>

          {/* Three Mini Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 mb-1">ATS readiness</span>
              <span className="text-xl font-bold text-slate-800">{atsReadiness}%</span>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 mb-1">Interview readiness</span>
              <span className="text-xl font-bold text-slate-800">{interviewReadiness}%</span>
            </div>
            <div className="border border-slate-100 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[11px] text-slate-500 mb-1">Company compatibility</span>
              <span className="text-xl font-bold text-slate-800">{matches[0]?.matchPercentage || 0}%</span>
              <span className="text-[10px] text-slate-400 truncate">{matches[0]?.company.name || 'N/A'}</span>
            </div>
          </div>

          {/* Three Insight Cards */}
          <div className="grid grid-cols-3 gap-3 mt-auto">
            <div className="border border-blue-100 bg-white rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-blue-600 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-[11px] font-bold tracking-wide">AI Insight</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {recruiterImpression.substring(0, 120)}...
              </p>
            </div>
            <div className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-blue-600 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[11px] font-bold tracking-wide">Strengths</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {readiness.strengths[0] || `Profile completeness at ${profileCompleteness}% — update skills and certifications to improve.`}
              </p>
            </div>
            <div className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-blue-600 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-[11px] font-bold tracking-wide">Priority Focus</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Focus on learning {matches[0]?.missingSkills[0] || 'industry skills'} to improve your compatibility with {matches[0]?.company.name || 'top companies'}.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Profile & Timeline */}
        <div className="lg:w-[40%] flex flex-col gap-6">
          
          {/* Student Profile Card — Syncs with live profile state */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-lg font-bold text-slate-900">Student Profile</h2>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${profileStatusColor}`}>
                {profileStatusLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">Personalized placement readiness summary.</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center font-bold text-white text-lg">
                {profile.fullName.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Student</div>
                <h3 className="font-bold text-slate-800 leading-tight">{profile.fullName || 'Sai Kumar'}</h3>
                <p className="text-[11px] text-slate-500">{profile.department} • {profile.yearSemester}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">CGPA: {profile.cgpa.toFixed(1)}</p>
              </div>
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${readiness.level === 'Advanced' ? 'bg-blue-50 text-blue-600' : readiness.level === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                  {readiness.level === 'Advanced' ? 'Placement Ready' : readiness.level === 'Intermediate' ? 'Needs Improvement' : 'Not Ready'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-slate-100 rounded-xl p-3">
                <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Skills</div>
                <div className="text-xs font-semibold text-slate-800">{profile.skills.length} Technologies</div>
              </div>
              <div className="border border-slate-100 rounded-xl p-3">
                <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Preferred Role</div>
                <div className="text-xs font-semibold text-slate-800">{profile.preferredRole}</div>
              </div>
              <div className="border border-slate-100 rounded-xl p-3">
                <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Preferred Domain</div>
                <div className="text-xs font-semibold text-slate-800 truncate" title={profile.careerDomain}>{profile.careerDomain}</div>
              </div>
              <div className="border border-slate-100 rounded-xl p-3">
                <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mb-1">Completeness</div>
                <div className="text-xs font-semibold text-slate-800">{profileCompleteness}%</div>
              </div>
            </div>

            {/* Profile Quick Actions */}
            {isProfileSaved && !isEditing && (
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={handleEditProfile}
                  className="flex-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-2 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleRefreshAnalysis}
                  className="flex-1 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg px-3 py-2 transition-colors"
                >
                  Re-Analyze
                </button>
              </div>
            )}
            {!isProfileSaved && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab("profile")}
                  className="w-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2.5 transition-colors shadow-sm"
                >
                  Setup Your Profile →
                </button>
              </div>
            )}
          </div>

          {/* Match Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Match Timeline</h2>
            <p className="text-[11px] text-slate-500 mb-4">Track placement progress week by week.</p>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Deep Dive Navigation */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="mb-4 md:mb-0">
            <h2 className="text-sm font-bold text-slate-900">Deep Dive</h2>
            <p className="text-[11px] text-slate-500">Switch between workflows for profile, skills, company matching and analytics.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'profile', label: 'Profile', icon: FileText },
              { id: 'skills', label: 'Skills', icon: Award },
              { id: 'company', label: 'Company', icon: Briefcase },
              { id: 'recommendations', label: 'Recommendations', icon: GraduationCap },
              { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
              { id: 'analytics', label: 'Analytics', icon: LineChart },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            
            {/* Show Summary when saved & not editing, otherwise show form */}
            {isProfileSaved && !isEditing ? (
              <StudentProfileSummary
                profile={profile}
                completeness={profileCompleteness}
                onEdit={handleEditProfile}
                onReset={handleResetProfile}
                onRefresh={handleRefreshAnalysis}
              />
            ) : (
              <div className="space-y-6">
                {/* Form Header with Save / Cancel actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {isProfileSaved ? "Edit Your Profile" : "Setup Your Profile"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isProfileSaved
                        ? "Modify your details and save to refresh all analytics."
                        : "Fill in your details to unlock intelligent placement analysis."}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isProfileSaved && (
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg px-4 py-2 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-5 py-2 shadow-sm transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isProfileSaved ? "Update Profile" : "Save Profile"}
                    </button>
                  </div>
                </div>

                {/* Profile completeness indicator during editing */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Completeness</span>
                    <span className={`text-sm font-bold ${profileCompleteness >= 80 ? 'text-emerald-600' : profileCompleteness >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {profileCompleteness}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ease-out ${
                        profileCompleteness >= 80 ? 'bg-emerald-500' : profileCompleteness >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${profileCompleteness}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {profileCompleteness < 50
                      ? "Fill in more details to unlock accurate placement predictions."
                      : profileCompleteness < 80
                      ? "Good progress! Add skills, certifications, and experience to improve accuracy."
                      : "Excellent profile! Your analysis will be highly accurate."}
                  </p>
                </div>

                {/* The actual form */}
                <StudentProfileSetup profile={profile} onChange={setProfile} />

                {/* Bottom Save Bar */}
                <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                  {isProfileSaved && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg px-5 py-2.5 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveProfile}
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2.5 shadow-sm transition-colors"
                  >
                    {isProfileSaved ? "Update & Re-Analyze" : "Save Profile & Analyze"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'company' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <CompanyMatchAnalysis matches={matches} />
          </div>
        )}

        {activeTab === 'recommendations' && (
          <RecommendationEngine readiness={readiness} matches={matches} profile={profile} />
        )}

        {activeTab === 'eligibility' && (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <EligibilityChecker matches={matches} />
           </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <AnalyticsVisualizations profile={profile} readiness={readiness} />
          </div>
        )}
        
        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
             <SkillGapAnalysis profile={profile} onChange={setProfile} matches={matches} />
          </div>
        )}
      </div>

    </div>
  );
}
