// Resume Analyzer Utility
// Analyzes resumes and matches them with job opportunities

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  softSkills: string[];
  totalYearsExperience: number;
  primaryDomain?: string;
  careerObjective?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: number; // in years
  responsibilities: string[];
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  graduationYear: number;
  major: string;
  gpa?: number;
}

export interface JobOpportunity {
  jobTitle: string;
  company?: string;
  requiredSkills: string[];
  experienceRequired: number;
  educationRequired: string;
  jobDescription: string;
  industry: string;
  salaryRange?: string;
  responsibilities?: string[];
}

export interface JobMatch {
  job: JobOpportunity;
  compatibilityScore: number;
  scoreBreakdown: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    industryMatch: number;
  };
  matchingSkills: string[];
  skillGaps: string[];
  whyThisJobFits: string;
  preparationSteps: string[];
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  totalExperience: string;
  primaryDomain: string;
  seniority: "Entry" | "Mid" | "Senior" | "Executive";
  education?: string;
  extractedText?: string;
  extractedSkills: {
    sections: { name: string; skills: string[] }[];
    softSkills: string[];
    languages: string[];
    certifications: string[];
  };
}

export interface AnalysisResult {
  candidateProfile: CandidateProfile;
  topMatches: JobMatch[];
  careerInsights: {
    strongestPath: string;
    recommendedSkills: string[];
    uniqueStrengths: string[];
    expectedSalaryRange: string;
  };
  overallAssessment: string;
}

// Calculate years of experience
function calculateExperience(experiences: WorkExperience[]): number {
  return experiences.reduce((total, exp) => total + exp.duration, 0);
}

// Determine seniority level
function determineSeniority(yearsExperience: number): "Entry" | "Mid" | "Senior" | "Executive" {
  if (yearsExperience < 2) return "Entry";
  if (yearsExperience < 5) return "Mid";
  if (yearsExperience < 10) return "Senior";
  return "Executive";
}

// Calculate skill match percentage
function calculateSkillMatch(
  candidateSkills: string[],
  requiredSkills: string[],
): { matched: number; percentage: number; matchedSkills: string[] } {
  const normalizeSkill = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const matchesSkill = (candidate: string, required: string) => {
    const normCandidate = normalizeSkill(candidate);
    const normRequired = normalizeSkill(required);
    if (!normCandidate || !normRequired) return false;
    if (normCandidate === normRequired) return true;
    if (normCandidate.split(" ").every((word) => normRequired.split(" ").includes(word)))
      return true;
    if (normRequired.split(" ").every((word) => normCandidate.split(" ").includes(word)))
      return true;
    const requiredPattern = new RegExp(`\\b${escapeRegExp(normRequired)}\\b`);
    const candidatePattern = new RegExp(`\\b${escapeRegExp(normCandidate)}\\b`);
    return requiredPattern.test(normCandidate) || candidatePattern.test(normRequired);
  };

  const matchedSkills = requiredSkills.filter((req) =>
    candidateSkills.some((c) => matchesSkill(c, req)),
  );

  return {
    matched: matchedSkills.length,
    percentage:
      requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 0,
    matchedSkills,
  };
}

// Calculate experience match score
function calculateExperienceMatch(candidateYears: number, requiredYears: number): number {
  // If candidate has no experience, return zero experience score
  if (candidateYears <= 0) return 0;
  // If the job doesn't specify experience, scale modestly by candidate years (cap at 30)
  if (requiredYears <= 0) return Math.min(10 + candidateYears * 2, 30);
  // Full marks if candidate meets or exceeds requirement
  if (candidateYears >= requiredYears) return 30;
  // Otherwise, proportional score
  const ratio = candidateYears / requiredYears;
  return Math.round(ratio * 30);
}

// Calculate education match score
function calculateEducationMatch(candidateDegrees: string[], requiredEducation: string): number {
  const normalizedRequired = requiredEducation.toLowerCase();
  const degreeLevels: { [key: string]: number } = {
    phd: 15,
    masters: 15,
    master: 15,
    bachelor: 15,
    bachelors: 15,
    "b.tech": 15,
    diploma: 10,
    associate: 10,
    certificate: 5,
    "high school": 2,
  };

  let maxScore = 0;
  candidateDegrees.forEach((degree) => {
    const normalizedDegree = degree.toLowerCase();
    Object.entries(degreeLevels).forEach(([key, score]) => {
      if (normalizedDegree.includes(key)) {
        maxScore = Math.max(maxScore, score);
      }
    });
  });

  // Check if required education is met
  Object.entries(degreeLevels).forEach(([key, score]) => {
    if (normalizedRequired.includes(key)) {
      if (maxScore >= score) {
        return; // meets requirement
      } else {
        maxScore = Math.max(maxScore, Math.round(score * 0.7));
      }
    }
  });

  return Math.min(maxScore, 15);
}

// Calculate industry match
function calculateIndustryMatch(
  candidateExperience: WorkExperience[],
  jobIndustry: string,
): number {
  const normalizedJobIndustry = jobIndustry.toLowerCase();

  let matchCount = 0;
  candidateExperience.forEach((exp) => {
    if (
      exp.skills.some((skill) => normalizedJobIndustry.includes(skill.toLowerCase())) ||
      exp.title.toLowerCase().includes(normalizedJobIndustry)
    ) {
      matchCount++;
    }
  });

  // Score based on matches
  if (matchCount > 0) return 15;
  if (candidateExperience.length > 0) return 7; // Some experience in related field
  return 0;
}

// Identify skill gaps
function identifySkillGaps(candidateSkills: string[], requiredSkills: string[]): string[] {
  const normalizeSkill = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 ]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const matchesSkill = (candidate: string, required: string) => {
    const normCandidate = normalizeSkill(candidate);
    const normRequired = normalizeSkill(required);
    if (!normCandidate || !normRequired) return false;
    if (normCandidate === normRequired) return true;
    if (normCandidate.split(" ").every((word) => normRequired.split(" ").includes(word)))
      return true;
    if (normRequired.split(" ").every((word) => normCandidate.split(" ").includes(word)))
      return true;
    const requiredPattern = new RegExp(`\\b${escapeRegExp(normRequired)}\\b`);
    const candidatePattern = new RegExp(`\\b${escapeRegExp(normCandidate)}\\b`);
    return requiredPattern.test(normCandidate) || candidatePattern.test(normRequired);
  };

  return requiredSkills.filter((req) => !candidateSkills.some((c) => matchesSkill(c, req)));
}

// Generate career insights
function generateCareerInsights(resume: ResumeData): {
  strongestPath: string;
  recommendedSkills: string[];
  uniqueStrengths: string[];
} {
  const skillFrequency: { [key: string]: number } = {};

  // Count skill occurrences
  resume.skills.forEach((skill) => {
    skillFrequency[skill.toLowerCase()] = (skillFrequency[skill.toLowerCase()] || 0) + 1;
  });

  resume.experience.forEach((exp) => {
    exp.skills.forEach((skill) => {
      skillFrequency[skill.toLowerCase()] = (skillFrequency[skill.toLowerCase()] || 0) + 1;
    });
  });

  // Get top skills
  const topSkills = Object.entries(skillFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  // Determine strongest path
  let strongestPath = resume.primaryDomain || "Technology";
  if (resume.experience.length > 0) {
    const titles = resume.experience.map((e) => e.title);
    if (
      titles.some((t) => t.toLowerCase().includes("lead") || t.toLowerCase().includes("senior"))
    ) {
      strongestPath += " → Leadership Track";
    } else if (
      titles.some(
        (t) => t.toLowerCase().includes("architect") || t.toLowerCase().includes("engineer"),
      )
    ) {
      strongestPath += " → Technical Track";
    } else if (
      titles.some(
        (t) => t.toLowerCase().includes("analyst") || t.toLowerCase().includes("consultant"),
      )
    ) {
      strongestPath += " → Strategic Track";
    }
  }

  // Recommended skills to learn
  const recommendedSkills = [
    "Cloud Technologies (AWS/Azure/GCP)",
    "Data Analytics & AI/ML",
    "Leadership & Management",
  ];

  // Unique strengths
  const uniqueStrengths = [
    `${resume.totalYearsExperience}+ years of proven experience`,
    `Expertise in ${topSkills.slice(0, 2).join(" and ")}`,
    "Cross-functional collaboration proven through experience",
  ];

  return {
    strongestPath,
    recommendedSkills,
    uniqueStrengths,
  };
}

// Main analysis function
export function analyzeResume(resume: ResumeData, jobs: JobOpportunity[]): AnalysisResult {
  // Build candidate profile
  const candidateProfile: CandidateProfile = {
    name: resume.name || "Information not provided",
    email: resume.email || "Information not provided",
    phone: resume.phone || "Information not provided",
    totalExperience: `${resume.totalYearsExperience} years`,
    primaryDomain: resume.primaryDomain || "Information not provided",
    seniority: determineSeniority(resume.totalYearsExperience),
    extractedSkills: {
      sections: [{ name: "Technical Skills", skills: resume.skills.slice(0, 10) }],
      softSkills: resume.softSkills,
      languages: [],
      certifications: resume.certifications,
    },
  };

  // Match with jobs
  const matches: JobMatch[] = jobs.map((job) => {
    const skillMatch = calculateSkillMatch(resume.skills, job.requiredSkills);
    const experienceMatch = calculateExperienceMatch(
      resume.totalYearsExperience,
      job.experienceRequired,
    );
    const educationMatch = calculateEducationMatch(
      resume.education.map((e) => e.degree),
      job.educationRequired,
    );
    const industryMatch = calculateIndustryMatch(resume.experience, job.industry);

    const totalScore =
      skillMatch.percentage * 0.4 +
      experienceMatch * 0.3 +
      educationMatch * 0.15 +
      industryMatch * 0.15;
    const compatibilityScore = Math.round(totalScore);

    const skillGaps = identifySkillGaps(resume.skills, job.requiredSkills);

    // Generate "Why This Job Fits" explanation
    let whyThisJobFits = "";
    if (compatibilityScore >= 80) {
      whyThisJobFits = `Excellent match! You have strong alignment with this role, possessing most of the required skills and relevant experience. This position would be a natural progression in your career.`;
    } else if (compatibilityScore >= 70) {
      whyThisJobFits = `Strong match for your profile. Your experience and skills closely align with job requirements. With minor upskilling, you'd be well-positioned for this role.`;
    } else if (compatibilityScore >= 60) {
      whyThisJobFits = `Moderate match. You have foundational skills for this role and growth potential. Consider targeted skill development to increase your competitiveness.`;
    } else {
      whyThisJobFits = `This is a stretch role. While you have some relevant experience, you'd need significant skill development. Great opportunity for career growth if willing to invest in learning.`;
    }

    // Generate preparation steps
    const preparationSteps: string[] = [];
    if (skillGaps.length > 0) {
      preparationSteps.push(`Master these key skills: ${skillGaps.slice(0, 3).join(", ")}`);
    }
    if (resume.totalYearsExperience < job.experienceRequired) {
      preparationSteps.push(
        `Gain ${job.experienceRequired - resume.totalYearsExperience} more years of relevant experience`,
      );
    }
    preparationSteps.push("Review the job description and prepare examples from your experience");

    if (preparationSteps.length === 0) {
      preparationSteps.push(
        "You're well-prepared! Focus on polishing your portfolio and interview skills",
      );
    }

    return {
      job,
      compatibilityScore,
      scoreBreakdown: {
        skillsMatch: Math.round(skillMatch.percentage * 0.4),
        experienceMatch,
        educationMatch,
        industryMatch,
      },
      matchingSkills: skillMatch.matchedSkills,
      skillGaps,
      whyThisJobFits,
      preparationSteps,
    };
  });

  // Sort by compatibility score
  matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  const topMatches = matches.slice(0, 5);

  // Generate career insights
  const careerInsights = generateCareerInsights(resume);

  // Expected salary range (simplified calculation)
  const seniority = determineSeniority(resume.totalYearsExperience);
  const baseSalary = { Entry: 30, Mid: 50, Senior: 80, Executive: 120 }[seniority] || 50;
  const expectedSalaryRange = `$${baseSalary}K - $${baseSalary + 30}K annually`;

  // Overall assessment
  const avgScore =
    topMatches.length > 0
      ? Math.round(topMatches.reduce((sum, m) => sum + m.compatibilityScore, 0) / topMatches.length)
      : 0;

  let overallAssessment = "";
  if (avgScore >= 75) {
    overallAssessment = `You are highly marketable in your field! With an average compatibility score of ${avgScore}%, you have excellent prospects for career advancement. Your strong technical foundation and relevant experience position you well for senior roles. Focus on continuous learning and expanding your network to unlock even more opportunities.`;
  } else if (avgScore >= 60) {
    overallAssessment = `You have solid career positioning with an average match score of ${avgScore}%. You possess the core competencies for your field and have clear growth opportunities. Invest in upskilling in emerging technologies and consider roles that leverage your strongest areas while building new expertise.`;
  } else {
    overallAssessment = `Your profile shows promise, though there's room for growth (average score: ${avgScore}%). Consider gaining more specialized experience and developing additional technical skills. Strategic learning and targeted career moves will significantly improve your market position.`;
  }

  return {
    candidateProfile,
    topMatches,
    careerInsights: {
      strongestPath: careerInsights.strongestPath,
      recommendedSkills: careerInsights.recommendedSkills,
      uniqueStrengths: careerInsights.uniqueStrengths,
      expectedSalaryRange,
    },
    overallAssessment,
  };
}

// Format analysis result for display
export function formatAnalysisResult(result: AnalysisResult): string {
  let output = "";

  output += "\n**CANDIDATE PROFILE**\n";
  output += `Name: ${result.candidateProfile.name}\n`;
  output += `Email: ${result.candidateProfile.email}\n`;
  output += `Phone: ${result.candidateProfile.phone}\n`;
  output += `Total Experience: ${result.candidateProfile.totalExperience}\n`;
  output += `Primary Domain: ${result.candidateProfile.primaryDomain}\n`;
  output += `Seniority: ${result.candidateProfile.seniority}\n`;

  output += "\n**EXTRACTED SKILLS**\n";
  const allTechnical = result.candidateProfile.extractedSkills.sections.flatMap((s) => s.skills);
  output += `Technical: ${allTechnical.join(", ")}\n`;
  output += `Soft Skills: ${result.candidateProfile.extractedSkills.softSkills.join(", ")}\n`;
  output += `Languages: ${result.candidateProfile.extractedSkills.languages?.join(", ") || "None identified"}\n`;
  output += `Certifications: ${result.candidateProfile.extractedSkills.certifications.join(", ") || "None provided"}\n`;

  output += "\n**TOP 5 JOB MATCHES**\n";
  result.topMatches.forEach((match, index) => {
    output += `\n${index + 1}. ${match.job.jobTitle}${match.job.company ? ` - ${match.job.company}` : ""}\n`;
    output += `   Compatibility Score: ${match.compatibilityScore}/100\n`;
    output += `\n   Score Breakdown:\n`;
    output += `   - Skills Match: ${match.scoreBreakdown.skillsMatch}/40\n`;
    output += `   - Experience Match: ${match.scoreBreakdown.experienceMatch}/30\n`;
    output += `   - Education Match: ${match.scoreBreakdown.educationMatch}/15\n`;
    output += `   - Industry Match: ${match.scoreBreakdown.industryMatch}/15\n`;
    output += `\n   ✅ Matching Skills: ${match.matchingSkills.join(", ") || "None"}\n`;
    output += `   ❌ Skill Gaps: ${match.skillGaps.join(", ") || "None"}\n`;
    output += `\n   Why This Job Fits:\n   ${match.whyThisJobFits}\n`;
    output += `\n   Preparation Steps:\n`;
    match.preparationSteps.forEach((step) => {
      output += `   - ${step}\n`;
    });
  });

  output += "\n**CAREER INSIGHTS**\n";
  output += `Strongest Career Path: ${result.careerInsights.strongestPath}\n`;
  output += `Recommended Skills to Learn: ${result.careerInsights.recommendedSkills.join(", ")}\n`;
  output += `Unique Strengths: ${result.careerInsights.uniqueStrengths.join(", ")}\n`;
  output += `Expected Salary Range: ${result.careerInsights.expectedSalaryRange}\n`;

  output += "\n**OVERALL ASSESSMENT**\n";
  output += result.overallAssessment + "\n";

  return output;
}
