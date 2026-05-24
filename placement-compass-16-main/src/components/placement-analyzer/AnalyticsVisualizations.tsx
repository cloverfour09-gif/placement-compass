import React from "react";
import { StudentProfile, ReadinessResult } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

interface Props {
  profile: StudentProfile;
  readiness: ReadinessResult;
}

export default function AnalyticsVisualizations({ profile, readiness }: Props) {
  
  const skillData = [
    { subject: 'CGPA', A: (profile.cgpa / 10) * 100, fullMark: 100 },
    { subject: 'DSA', A: profile.dsaScore, fullMark: 100 },
    { subject: 'Aptitude', A: profile.aptitudeScore, fullMark: 100 },
    { subject: 'Projects', A: Math.min((profile.projectsCount / 4) * 100, 100), fullMark: 100 },
    { subject: 'Communication', A: profile.communicationLevel === 'Excellent' ? 100 : profile.communicationLevel === 'Good' ? 75 : profile.communicationLevel === 'Average' ? 50 : 25, fullMark: 100 },
    { subject: 'Internships', A: Math.min((profile.internshipCount / 2) * 100, 100), fullMark: 100 },
  ];

  const trendData = [
    { name: 'Semester 3', score: 40 },
    { name: 'Semester 4', score: 55 },
    { name: 'Semester 5', score: Math.max(55, readiness.score - 10) },
    { name: 'Current', score: readiness.score },
    { name: 'Target', score: Math.min(100, readiness.score + 15) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Performance Analytics</h2>
        <p className="text-muted-foreground">Visual breakdown of your competencies and projected growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Radar Chart for Skills */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Skill Radar</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <PolarAngleAxis dataKey="subject" className="text-xs font-medium fill-slate-500" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs fill-slate-400" />
                <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart for Readiness Trend */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Readiness Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="text-xs fill-slate-500" axisLine={false} tickLine={false} />
                <YAxis className="text-xs fill-slate-500" axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {
                    trendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === trendData.length - 1 ? '#10b981' : index === trendData.length - 2 ? '#3b82f6' : '#94a3b8'} />
                    ))
                  }
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
