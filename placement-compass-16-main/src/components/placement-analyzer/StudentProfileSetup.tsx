import React from "react";
import { StudentProfile } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Code2, Cpu, Sparkles, Briefcase } from "lucide-react";

interface Props {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
}

export default function StudentProfileSetup({ profile, onChange }: Props) {
  const updateField = (field: keyof StudentProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  const handleArrayAdd = (field: 'skills' | 'certifications' | 'frameworks' | 'tools', value: string) => {
    const cleaned = value.trim();
    if (cleaned && !profile[field].some(s => s.toLowerCase() === cleaned.toLowerCase())) {
      updateField(field, [...profile[field], cleaned]);
    }
  };

  const handleArrayRemove = (field: 'skills' | 'certifications' | 'frameworks' | 'tools', value: string) => {
    updateField(field, profile[field].filter(s => s !== value));
  };

  const renderArrayInput = (
    label: string,
    field: 'skills' | 'certifications' | 'frameworks' | 'tools',
    placeholder: string
  ) => {
    return (
      <div className="space-y-2">
        <Label>{label} (Press Enter to add)</Label>
        <Input 
          placeholder={placeholder} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value) {
              e.preventDefault();
              handleArrayAdd(field, e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
        <div className="flex flex-wrap gap-1.5 mt-2 min-h-[30px] p-2 border border-dashed rounded-md bg-slate-50/50">
          {profile[field].length > 0 ? (
            profile[field].map((val, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                onClick={() => handleArrayRemove(field, val)}
              >
                {val} &times;
              </Badge>
            ))
          ) : (
            <span className="text-[10px] text-slate-400 italic">None added</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Academic Information */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Academic Information</CardTitle>
            <CardDescription>Enter your grades, CGPA, and department details.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName"
              value={profile.fullName} 
              onChange={(e) => updateField('fullName', e.target.value)} 
              placeholder="e.g. Sai Kumar" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Select value={profile.department} onValueChange={(val) => updateField('department', val)}>
              <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Information Science">Information Science</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Year & Semester</Label>
            <Select value={profile.yearSemester} onValueChange={(val) => updateField('yearSemester', val)}>
              <SelectTrigger><SelectValue placeholder="Select Year/Semester" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3rd Semester">2nd Year - 3rd Semester</SelectItem>
                <SelectItem value="4th Semester">2nd Year - 4th Semester</SelectItem>
                <SelectItem value="5th Semester">3rd Year - 5th Semester</SelectItem>
                <SelectItem value="6th Semester">3rd Year - 6th Semester</SelectItem>
                <SelectItem value="7th Semester">4th Year - 7th Semester</SelectItem>
                <SelectItem value="8th Semester">4th Year - 8th Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="backlogs">Active Backlogs</Label>
            <Input 
              id="backlogs"
              type="number"
              min={0}
              value={profile.backlogs} 
              onChange={(e) => updateField('backlogs', parseInt(e.target.value) || 0)} 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tenth">10th Percentage (%)</Label>
            <Input 
              id="tenth"
              type="number"
              min={0}
              max={100}
              value={profile.tenthPercentage} 
              onChange={(e) => updateField('tenthPercentage', parseFloat(e.target.value) || 0)} 
              placeholder="e.g. 85.5"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twelfth">12th Percentage (%)</Label>
            <Input 
              id="twelfth"
              type="number"
              min={0}
              max={100}
              value={profile.twelfthPercentage} 
              onChange={(e) => updateField('twelfthPercentage', parseFloat(e.target.value) || 0)} 
              placeholder="e.g. 88.2"
            />
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="flex justify-between text-sm">
              <Label>Current CGPA</Label>
              <span className="font-semibold text-blue-600">{profile.cgpa.toFixed(2)}</span>
            </div>
            <Slider 
              value={[profile.cgpa]} 
              min={0} max={10} step={0.1}
              onValueChange={(vals) => updateField('cgpa', vals[0])} 
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Technical Readiness */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Technical Readiness</CardTitle>
            <CardDescription>Specify your analytical scores and communication indicators.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Coding Confidence</Label>
            <Select value={profile.codingConfidence} onValueChange={(val) => updateField('codingConfidence', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low Confidence</SelectItem>
                <SelectItem value="Medium">Medium Confidence</SelectItem>
                <SelectItem value="High">High Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Communication Level</Label>
            <Select value={profile.communicationLevel} onValueChange={(val) => updateField('communicationLevel', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Average">Average</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="flex justify-between text-sm">
              <Label>DSA Score (out of 100)</Label>
              <span className="font-semibold text-blue-600">{profile.dsaScore}/100</span>
            </div>
            <Slider 
              value={[profile.dsaScore]} 
              min={0} max={100} step={1}
              onValueChange={(vals) => updateField('dsaScore', vals[0])} 
            />
          </div>
          <div className="space-y-3 md:col-span-2">
            <div className="flex justify-between text-sm">
              <Label>Aptitude Score (out of 100)</Label>
              <span className="font-semibold text-blue-600">{profile.aptitudeScore}/100</span>
            </div>
            <Slider 
              value={[profile.aptitudeScore]} 
              min={0} max={100} step={1}
              onValueChange={(vals) => updateField('aptitudeScore', vals[0])} 
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Skills & Technologies */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Skills & Technologies</CardTitle>
            <CardDescription>Manage languages, frameworks, and developer tools.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="prefLang">Preferred Programming Language</Label>
            <Input 
              id="prefLang"
              value={profile.preferredLanguage} 
              onChange={(e) => updateField('preferredLanguage', e.target.value)} 
              placeholder="e.g. Java, Python, C++" 
            />
          </div>
          <div className="hidden md:block"></div>
          {renderArrayInput("Technical Skills", "skills", "e.g. React, Node.js, SQL")}
          {renderArrayInput("Frameworks", "frameworks", "e.g. Express, Next.js, Django")}
          {renderArrayInput("Developer Tools", "tools", "e.g. Git, Docker, Kubernetes")}
        </CardContent>
      </Card>

      {/* 4. Experience & Certifications */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Experience & Certifications</CardTitle>
            <CardDescription>Enter completed projects, internships, and badges.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="projectsCount">Projects Completed</Label>
              <Input 
                id="projectsCount"
                type="number"
                min={0}
                value={profile.projectsCount} 
                onChange={(e) => updateField('projectsCount', parseInt(e.target.value) || 0)} 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="internshipsCount">Internships Completed</Label>
              <Input 
                id="internshipsCount"
                type="number"
                min={0}
                value={profile.internshipCount} 
                onChange={(e) => updateField('internshipCount', parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
          {renderArrayInput("Professional Certifications", "certifications", "e.g. AWS Developer, Google Data Analyst")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
              <div>
                <Label htmlFor="hackathon" className="font-semibold block cursor-pointer">Hackathon Participation</Label>
                <span className="text-[10px] text-slate-500">Have you participated in any competitive hackathons?</span>
              </div>
              <Switch 
                id="hackathon"
                checked={profile.hackathonParticipation} 
                onCheckedChange={(val) => updateField('hackathonParticipation', val)} 
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
              <div>
                <Label htmlFor="openSource" className="font-semibold block cursor-pointer">Open Source Contributions</Label>
                <span className="text-[10px] text-slate-500">Do you contribute to public GitHub repositories?</span>
              </div>
              <Switch 
                id="openSource"
                checked={profile.openSourceContribution} 
                onCheckedChange={(val) => updateField('openSourceContribution', val)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Career Preferences */}
      <Card className="border border-slate-100 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-lg">Career Preferences</CardTitle>
            <CardDescription>Define your target roles and salary expectations.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="prefRole">Preferred Role</Label>
            <Input 
              id="prefRole"
              value={profile.preferredRole} 
              onChange={(e) => updateField('preferredRole', e.target.value)} 
              placeholder="e.g. Software Engineer" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Preferred Company Type</Label>
            <Select value={profile.preferredCompanyType} onValueChange={(val) => updateField('preferredCompanyType', val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Product">Product Company</SelectItem>
                <SelectItem value="Service">Service Company</SelectItem>
                <SelectItem value="Startup">Startup / Scale-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="careerDomain">Career Domain</Label>
            <Input 
              id="careerDomain"
              value={profile.careerDomain} 
              onChange={(e) => updateField('careerDomain', e.target.value)} 
              placeholder="e.g. Web Development" 
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="expPkg">Expected Package</Label>
            <Input 
              id="expPkg"
              value={profile.expectedPackage} 
              onChange={(e) => updateField('expectedPackage', e.target.value)} 
              placeholder="e.g. 10 LPA" 
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="placementGoal">Placement Goal</Label>
            <Input 
              id="placementGoal"
              value={profile.placementGoal} 
              onChange={(e) => updateField('placementGoal', e.target.value)} 
              placeholder="e.g. Tier-1 Product Company or FinTech Unicorn" 
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
