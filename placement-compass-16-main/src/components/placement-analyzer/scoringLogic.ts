import { StudentProfile, ReadinessResult } from "./types";
import { Company } from "@/types/company";

// Helper to determine the hiring category dynamically
export const getCompanyCategory = (company: Company): "Product" | "Service" | "Startup" => {
  const cat = (company.category || "").toLowerCase();
  const name = (company.name || "").toLowerCase();
  
  if (
    name.includes("amazon") || 
    name.includes("microsoft") || 
    name.includes("google") || 
    name.includes("openai") || 
    name.includes("deepmind") || 
    name.includes("adobe") ||
    name.includes("oracle") ||
    name.includes("nvidia") ||
    name.includes("uber") ||
    name.includes("shopee") ||
    name.includes("swiggy") ||
    name.includes("zepto") ||
    name.includes("atlassian") ||
    name.includes("nutanix") ||
    name.includes("cloudera") ||
    name.includes("guidewire") ||
    name.includes("snowflake") ||
    name.includes("palantir") ||
    name.includes("cisco") ||
    name.includes("volvo") ||
    name.includes("amadeus") ||
    name.includes("salesforce")
  ) {
    return "Product";
  }

  if (cat.includes("product") || cat.includes("saas") || cat.includes("software as a service") || cat.includes("enterprise software")) {
    return "Product";
  }
  if (cat.includes("service") || cat.includes("consulting") || cat.includes("outsourcing") || cat.includes("it services")) {
    return "Service";
  }
  if (cat.includes("startup") || cat.includes("scale-up") || cat.includes("unicorn") || cat.includes("emerging") || cat.includes("fintech") || cat.includes("healthtech")) {
    return "Startup";
  }
  if (cat.includes("enterprise") || cat.includes("public")) {
    return "Product";
  }
  return "Product";
};

// Helper to determine difficulty dynamically
export const getCompanyDifficulty = (company: Company): "Hard" | "Medium" | "Easy" => {
  const category = getCompanyCategory(company);
  const brandValueStr = String(company.brand_value || "").toLowerCase();
  
  if (
    brandValueStr.includes("premium") || 
    brandValueStr.includes("very high") || 
    brandValueStr.includes("excellent") || 
    brandValueStr.includes("extremely") ||
    brandValueStr.includes("iconic") ||
    category === "Product"
  ) {
    return "Hard";
  }
  
  if (category === "Service" || brandValueStr.includes("low") || brandValueStr.includes("mass")) {
    return "Easy";
  }
  
  return "Medium";
};

// Helper to determine minimum CGPA dynamically
export const getCompanyMinCgpa = (company: Company): number => {
  const category = getCompanyCategory(company);
  const difficulty = getCompanyDifficulty(company);
  
  if (category === "Product") {
    return difficulty === "Hard" ? 8.0 : 7.5;
  } else if (category === "Startup") {
    return 7.0;
  } else {
    return 6.5; // Service
  }
};

export const calculateReadiness = (profile: StudentProfile): ReadinessResult => {
  // Weights:
  // CGPA = 20%, DSA = 25%, Aptitude = 20%, Projects = 10%, Internships = 10%, Certifications = 5%, Communication = 10%

  const cgpaScore = (profile.cgpa / 10) * 100 * 0.20;
  const dsaScore = profile.dsaScore * 0.25;
  const aptScore = profile.aptitudeScore * 0.20;
  const projScore = Math.min(profile.projectsCount * 5, 10);
  const internScore = Math.min(profile.internshipCount * 10, 10);
  const certScore = Math.min(profile.certifications.length * 2.5, 5);

  let commScore = 0;
  if (profile.communicationLevel === "Excellent") commScore = 10;
  else if (profile.communicationLevel === "Good") commScore = 7.5;
  else if (profile.communicationLevel === "Average") commScore = 5;
  else commScore = 2.5;

  const totalScore = Math.round(cgpaScore + dsaScore + aptScore + projScore + internScore + certScore + commScore);

  let level: "Beginner" | "Intermediate" | "Advanced" = "Beginner";
  let probability: "Low" | "Medium" | "High" = "Low";

  if (totalScore >= 80) {
    level = "Advanced";
    probability = "High";
  } else if (totalScore >= 60) {
    level = "Intermediate";
    probability = "Medium";
  } else {
    level = "Beginner";
    probability = "Low";
  }

  // Generate comprehensive dynamic strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Aptitude strengths/weaknesses
  if (profile.aptitudeScore > 75) {
    strengths.push("Strong aptitude performance");
  } else if (profile.aptitudeScore < 50) {
    weaknesses.push("Aptitude needs significant improvement");
  }

  // Communication strengths/weaknesses
  // Excellent/Good is > 70 equivalent
  const isCommGoodOrExcellent = profile.communicationLevel === "Excellent" || profile.communicationLevel === "Good";
  if (isCommGoodOrExcellent) {
    strengths.push("Good communication skills");
  } else if (profile.communicationLevel === "Poor") {
    weaknesses.push("Communication skills critically weak");
  }

  // Projects strengths/weaknesses
  if (profile.projectsCount >= 3) {
    strengths.push("Strong project exposure");
  } else if (profile.projectsCount < 1) {
    weaknesses.push("No project experience - critical gap");
  }

  // Internships strengths/weaknesses
  if (profile.internshipCount >= 1) {
    strengths.push("Industry exposure through internships");
  } else if (profile.internshipCount === 0) {
    weaknesses.push("No internship experience");
  }

  // Certifications strengths/weaknesses
  if (profile.certifications.length >= 2) {
    strengths.push("Certified in multiple technologies");
  } else if (profile.certifications.length < 2) {
    weaknesses.push("Low certification profile");
  }

  // Cloud skills weaknesses
  const cloudKeywords = ["aws", "azure", "gcp", "cloud", "kubernetes", "docker", "devops"];
  const hasCloudSkills = profile.skills.some(skill => 
    cloudKeywords.some(keyword => skill.toLowerCase().includes(keyword))
  );
  if (!hasCloudSkills) {
    weaknesses.push("Missing cloud technologies");
  }

  // Hackathon
  if (profile.hackathonParticipation) {
    strengths.push("Hackathon experience shows competitive spirit");
  }

  // Open source
  if (profile.openSourceContribution) {
    strengths.push("Open source contributions demonstrate initiative");
  }

  // Skills breadth
  if (profile.skills.length >= 5) {
    strengths.push("Diverse technical skill set");
  } else if (profile.skills.length < 3) {
    weaknesses.push("Very few technical skills listed");
  }

  // DSA strengths/weaknesses
  if (profile.dsaScore >= 80) {
    strengths.push("Strong algorithmic thinking");
  } else if (profile.dsaScore < 60) {
    weaknesses.push("DSA improvement required");
  }

  // CGPA
  if (profile.cgpa >= 9.0) {
    strengths.push("Outstanding academic record");
  } else if (profile.cgpa < 6.5) {
    weaknesses.push("CGPA below most company cutoffs");
  }

  return {
    score: totalScore,
    level,
    probability,
    strengths,
    weaknesses,
  };
};

// Extract required skills from company tech_stack or skill_relevance
export const getCompanyRequiredSkills = (company: Company): string[] => {
  const skills = new Set<string>();

  const parseString = (str: string) => {
    // Split by semicolon, comma, or newline
    str.split(/[;,]/).forEach(s => {
      const trimmed = s.trim();
      // Filter out meta-text like "highly relevant (...)" or "none" or empty
      if (trimmed && !trimmed.toLowerCase().startsWith("highly relevant") && trimmed.toLowerCase() !== "none") {
        skills.add(trimmed);
      }
    });
  };

  if (Array.isArray(company.tech_stack)) {
    company.tech_stack.forEach(s => parseString(s));
  } else if (typeof company.tech_stack === "string") {
    parseString(company.tech_stack);
  }

  if (Array.isArray(company.skill_relevance)) {
    company.skill_relevance.forEach(s => parseString(s));
  } else if (typeof company.skill_relevance === "string") {
    parseString(company.skill_relevance);
  }

  return Array.from(skills);
};

export const calculateCompanyMatch = (
  profile: StudentProfile,
  company: Company
): {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  difficulty: string;
  eligibility: string;
  recruiterImpression: string;
  placementProbability: string;
  compatibilityLevel: string;
} => {
  const reqSkills = getCompanyRequiredSkills(company);
  const studentSkills = profile.skills.map(s => s.trim().toLowerCase());

  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  reqSkills.forEach(req => {
    const reqCleaned = req.trim().toLowerCase();
    if (reqCleaned.length > 0) {
      if (studentSkills.some(s => s === reqCleaned || s.includes(reqCleaned) || reqCleaned.includes(s))) {
        matchingSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }
  });

  // --- Skill match component (30%) ---
  const skillMatchRatio = reqSkills.length > 0
    ? (matchingSkills.length / reqSkills.length) * 100
    : 100;

  // --- CGPA match component (15%) ---
  const requiredCgpa = getCompanyMinCgpa(company);
  const cgpaMatch = profile.cgpa >= requiredCgpa
    ? 100
    : (profile.cgpa / requiredCgpa) * 100;

  // --- DSA match component (15%) ---
  const dsaMatch = profile.dsaScore;

  // --- Aptitude match component (10%) ---
  const aptitudeMatch = profile.aptitudeScore;

  // --- Projects match component (10%) ---
  const projectsMatch = Math.min(profile.projectsCount * 50, 100); // 1 = 50%, 2+ = 100%

  // --- Internships match component (10%) ---
  const internshipsMatch = Math.min(profile.internshipCount * 50, 100); // 1 = 50%, 2+ = 100%

  // --- Communication match component (10%) ---
  let communicationMatch = 0;
  if (profile.communicationLevel === "Excellent") communicationMatch = 100;
  else if (profile.communicationLevel === "Good") communicationMatch = 75;
  else if (profile.communicationLevel === "Average") communicationMatch = 50;
  else communicationMatch = 20;

  // Weighted formula: skill(30%) + cgpa(15%) + dsa(15%) + aptitude(10%) + projects(10%) + internships(10%) + communication(10%)
  const finalMatch = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        skillMatchRatio * 0.30 +
        cgpaMatch * 0.15 +
        dsaMatch * 0.15 +
        aptitudeMatch * 0.10 +
        projectsMatch * 0.10 +
        internshipsMatch * 0.10 +
        communicationMatch * 0.10
      )
    )
  );

  // --- Difficulty ---
  const difficulty = getCompanyDifficulty(company);

  // --- Eligibility Check ---
  // Product / Hard: CGPA >= 8.0, backlogs === 0, DSA >= 70, Aptitude >= 70
  // Medium: CGPA >= 7.0, backlogs === 0, DSA >= 55, Aptitude >= 60
  // Service / Easy: CGPA >= 6.0, backlogs === 0, DSA >= 40, Aptitude >= 50
  
  let requiredDSA = 40;
  let requiredApt = 50;
  if (difficulty === "Hard") {
    requiredDSA = 70;
    requiredApt = 70;
  } else if (difficulty === "Medium") {
    requiredDSA = 55;
    requiredApt = 60;
  }

  let eligibility = "Eligible";
  if (profile.backlogs > 0) {
    eligibility = "Not Eligible";
  } else if (profile.cgpa < (requiredCgpa - 1.0)) {
    eligibility = "Not Eligible";
  } else if (profile.dsaScore < (requiredDSA - 20) || profile.aptitudeScore < (requiredApt - 20)) {
    eligibility = "Not Eligible";
  } else if (profile.cgpa < requiredCgpa || profile.dsaScore < requiredDSA || profile.aptitudeScore < requiredApt) {
    eligibility = "Partially Eligible";
  }

  // --- Placement probability ---
  let placementProbability = "Medium";
  if (finalMatch >= 80 && eligibility === "Eligible") {
    placementProbability = "High";
  } else if (finalMatch < 50 || eligibility === "Not Eligible") {
    placementProbability = "Low";
  }

  // Compatibility Level
  let compatibilityLevel = "Low";
  if (finalMatch >= 80) compatibilityLevel = "Excellent";
  else if (finalMatch >= 60) compatibilityLevel = "Good";
  else if (finalMatch >= 40) compatibilityLevel = "Average";

  // --- Recruiter impression for this company ---
  const readiness = calculateReadiness(profile);
  const recruiterImpression = generateRecruiterImpression(profile, readiness);

  return {
    matchPercentage: finalMatch,
    matchingSkills,
    missingSkills,
    difficulty,
    eligibility,
    recruiterImpression,
    placementProbability,
    compatibilityLevel,
  };
};

export const generateRecruiterImpression = (
  profile: StudentProfile,
  readiness: ReadinessResult
): string => {
  const parts: string[] = [];

  // Technical foundation
  if (profile.dsaScore >= 80 && profile.aptitudeScore >= 80) {
    parts.push("Excellent analytical thinking and technical problem-solving capabilities.");
  } else if (profile.dsaScore >= 60 && profile.aptitudeScore >= 60) {
    parts.push("Good analytical thinking and solid foundation in technical concepts.");
  } else {
    parts.push("Technical readiness and analytical foundations require further development.");
  }

  // Communication
  if (profile.communicationLevel === "Excellent" || profile.communicationLevel === "Good") {
    parts.push("Strong communication and presentation skills observed.");
  } else {
    parts.push("Communication skills need enhancement for structured technical interviews.");
  }

  // Summary & Recommendation
  if (readiness.score >= 80) {
    parts.push("Highly recommended for top-tier product engineering roles. Demonstrates excellent placement readiness across all key dimensions.");
  } else if (readiness.score >= 60) {
    parts.push("Good communication and analytical thinking, but technical readiness for top-tier product companies requires improvement before final rounds.");
  } else {
    parts.push("Requires focused training in data structures, algorithms, and core engineering concepts to be competitive for product roles.");
  }

  return parts.join(" ");
};

export const calculateProfileCompleteness = (profile: StudentProfile): number => {
  let score = 0;

  // 1. Academic Details (20% total)
  if (profile.fullName && profile.fullName.trim().length > 0) score += 3;
  if (profile.department && profile.department.trim().length > 0) score += 3;
  if (profile.yearSemester && profile.yearSemester.trim().length > 0) score += 3;
  if (profile.cgpa > 0) score += 3;
  if (profile.backlogs >= 0) score += 2;
  if (profile.tenthPercentage > 0) score += 3;
  if (profile.twelfthPercentage > 0) score += 3;

  // 2. Technical Readiness (20% total)
  if (profile.dsaScore > 0) score += 5;
  if (profile.aptitudeScore > 0) score += 5;
  if (profile.codingConfidence && profile.codingConfidence.trim().length > 0) score += 5;
  if (profile.communicationLevel && profile.communicationLevel !== "Poor") score += 5;
  else if (profile.communicationLevel === "Poor") score += 2;

  // 3. Skills & Technologies (20% total)
  score += Math.min(profile.skills.length * 1.0, 5); // 1% per skill up to 5%
  score += Math.min(profile.frameworks.length * 2.5, 5); // 2.5% per framework up to 5%
  score += Math.min(profile.tools.length * 2.5, 5); // 2.5% per tool up to 5%
  if (profile.preferredLanguage && profile.preferredLanguage.trim().length > 0) score += 5;

  // 4. Experience & Certifications (20% total)
  score += Math.min(profile.projectsCount * 2, 4); // 2% per project up to 4%
  score += Math.min(profile.internshipCount * 4, 4); // 4% per internship up to 4%
  score += Math.min(profile.certifications.length * 2, 4); // 2% per cert up to 4%
  if (profile.hackathonParticipation) score += 4;
  if (profile.openSourceContribution) score += 4;

  // 5. Career Preferences (20% total)
  if (profile.preferredRole && profile.preferredRole.trim().length > 0) score += 4;
  if (profile.preferredCompanyType && profile.preferredCompanyType.trim().length > 0) score += 4;
  if (profile.careerDomain && profile.careerDomain.trim().length > 0) score += 4;
  if (profile.expectedPackage && profile.expectedPackage.trim().length > 0) score += 4;
  if (profile.placementGoal && profile.placementGoal.trim().length > 0) score += 4;

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const calculateInterviewReadiness = (profile: StudentProfile): number => {
  // DSA contribution: dsaScore * 0.35
  const dsaContribution = profile.dsaScore * 0.35;

  // Aptitude contribution: aptitudeScore * 0.20
  const aptitudeContribution = profile.aptitudeScore * 0.20;

  // Communication: Excellent=25, Good=20, Average=12, Poor=5
  let commValue = 5;
  if (profile.communicationLevel === "Excellent") commValue = 25;
  else if (profile.communicationLevel === "Good") commValue = 20;
  else if (profile.communicationLevel === "Average") commValue = 12;

  // Projects: min(projectsCount * 7, 20)
  const projValue = Math.min(profile.projectsCount * 7, 20);

  const total = dsaContribution + aptitudeContribution + commValue + projValue;

  return Math.max(0, Math.min(100, Math.round(total)));
};

export const calculateATSReadiness = (
  profile: StudentProfile,
  companies: Company[]
): number => {
  // Take top 10 companies
  const topCompanies = companies.slice(0, 10);

  // Collect all unique skills from those companies
  const allRequiredSkills = new Set<string>();
  topCompanies.forEach(company => {
    const skills = getCompanyRequiredSkills(company);
    skills.forEach(s => allRequiredSkills.add(s.toLowerCase()));
  });

  const totalUniqueSkills = allRequiredSkills.size;
  if (totalUniqueSkills === 0) return 100;

  const studentSkills = profile.skills.map(s => s.trim().toLowerCase());

  let matchedCount = 0;
  allRequiredSkills.forEach(req => {
    if (studentSkills.some(s => s === req || s.includes(req) || req.includes(s))) {
      matchedCount++;
    }
  });

  const ats = (matchedCount / totalUniqueSkills) * 100;
  return Math.max(0, Math.min(100, Math.round(ats)));
};
