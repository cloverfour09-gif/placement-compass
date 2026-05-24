export interface StudentProfile {
  fullName: string;
  department: string;
  yearSemester: string;
  cgpa: number;
  backlogs: number;
  tenthPercentage: number;
  twelfthPercentage: number;
  skills: string[];
  certifications: string[];
  preferredRole: string;
  preferredCompanyType: string;
  careerDomain: string;
  projectsCount: number;
  internshipCount: number;
  hackathonParticipation: boolean;
  openSourceContribution: boolean;
  communicationLevel: string; // 'Poor', 'Average', 'Good', 'Excellent'
  codingConfidence: string; // 'Low', 'Medium', 'High'
  aptitudeScore: number; // 0-100
  dsaScore: number; // 0-100
  expectedPackage: string;
  placementGoal: string;
  frameworks: string[];
  tools: string[];
  preferredLanguage: string;
  updatedAt?: string;
}

export const defaultProfile: StudentProfile = {
  fullName: "Sai Kumar",
  department: "Computer Science",
  yearSemester: "6th Semester",
  cgpa: 8.0,
  backlogs: 0,
  tenthPercentage: 85,
  twelfthPercentage: 85,
  skills: ["React", "Node.js", "Python", "SQL"],
  certifications: ["AWS Certified Developer"],
  preferredRole: "Software Engineer",
  preferredCompanyType: "Product",
  careerDomain: "Web Development",
  projectsCount: 2,
  internshipCount: 0,
  hackathonParticipation: false,
  openSourceContribution: false,
  communicationLevel: "Good",
  codingConfidence: "Medium",
  aptitudeScore: 70,
  dsaScore: 60,
  expectedPackage: "8 LPA",
  placementGoal: "Top Tier Product Company",
  frameworks: ["Express", "Next.js"],
  tools: ["Git", "VS Code", "Docker"],
  preferredLanguage: "TypeScript",
};

export interface ReadinessResult {
  score: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  probability: "Low" | "Medium" | "High";
  strengths: string[];
  weaknesses: string[];
}
