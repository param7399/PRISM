export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillCategory = 'Programming' | 'Core CS' | 'AI / ML' | 'Frontend & Tools' | 'Soft Skills';

export type SkillStatus = 'Strong' | 'On Track' | 'Growing' | 'Needs Work' | 'Beginner';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  score: number;
  targetScore: number;
  status: SkillStatus;
  whyItMatters: string;
  topicsToLearn: string[];
  suggestedProject: string;
  estimatedDays: string;
}

export interface SkillGap {
  id: string;
  skillId: string;
  skillName: string;
  category: SkillCategory;
  currentScore: number;
  targetScore: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  impactScore: number; // 1-100
  isQuickWin: boolean;
  whyItMatters: string;
  whatToLearn: string[];
  suggestedProject: string;
  estimatedTime: string;
}

export type ProjectStatus = 'Completed' | 'In Progress' | 'Recommended';

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  problem: string;
  solution: string;
  technologies: string[];
  skillsDemonstrated: string[];
  status: ProjectStatus;
  progress: number;
  githubUrl?: string;
  demoUrl?: string;
  matchPercentage?: number;
  whyRecommended?: string;
  estimatedTime?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readinessBoost?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verificationStatus?: 'Verified (Demo)' | 'Pending';
  credentialUrl?: string;
  skillsCovered: string[];
}

export interface ActionHistory {
  id: string;
  title: string;
  period: 'Today' | 'Yesterday' | 'This Week';
  timestamp: string;
  category: ActionCategory;
  impactNote?: string;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export interface Achievement {
  id: string;
  title: string;
  category: 'Hackathon' | 'Competition' | 'Achievement' | 'Leadership';
  date: string;
  description: string;
}

export type ActionCategory = 'Learn' | 'Build' | 'Practice' | 'Profile' | 'Career' | 'Opportunity';

export type ActionStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface NextAction {
  id: string;
  title: string;
  timeframe: 'today' | 'week' | 'month' | 'quickwin';
  priority: 'High' | 'Medium' | 'Low';
  category: ActionCategory;
  status: ActionStatus;
  progress: number;
  skill: string;
  skillBoost: number;
  whyNow: string;
  impact: 'High' | 'Medium' | 'Small';
  impactLabel?: string;
  estimatedTime: string;
  expectedReadinessGain: number;
  completed: boolean;
  inRoadmap: boolean;
  actionScore: number; // e.g. 92 out of 100
  scoreBreakdown: {
    careerRelevance: number; // out of 40
    skillGapImpact: number; // out of 30
    currentSkillFit: number; // out of 20
    timeEfficiency: number; // out of 10
  };
  whyReasons: string[];
  metrics: {
    goalMatch: number;
    gapImpact: number;
    skillFit: number;
    difficultyFit: number;
  };
}

export interface DailyTask {
  id: string;
  title: string;
  duration: string;
  skill: string;
  status: ActionStatus;
  readinessGain: number;
  skillGain: number;
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'Skill' | 'Project' | 'Action';
  description: string;
  whyUseful: string;
  estimatedTime: string;
  readinessBoost: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
}

export interface RoadmapStage {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  status: 'Completed' | 'Current' | 'Upcoming';
  items: RoadmapItem[];
}

export type OpportunityCategory = 'Internships' | 'Hackathons' | 'Competitions' | 'Scholarships' | 'Certifications';

export interface OpportunitySkillRequirement {
  name: string;
  met: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  matchPercentage: number;
  skills: OpportunitySkillRequirement[];
  deadline: string;
  rewardOrStipend: string;
  location: string;
  whyMatch: string;
  whatMissing: string;
  applied?: boolean;
  saved?: boolean;
}

export interface MonthlyReadinessPoint {
  month: string;
  readiness: number;
  target: number;
  hours: number;
}

export interface AnalyticsData {
  currentReadiness: number;
  targetReadiness: number;
  monthlyIncrease: number;
  fourMonthImprovement: number;
  learningHours: number;
  projectsCompleted: number;
  certificatesEarned: number;
  dsaProblemsSolved: number;
  applicationsSubmitted: number;
  history: MonthlyReadinessPoint[];
  strengths: string[];
  needsAttention: string[];
  insightMessage: string;
}

export interface Student {
  name: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  careerGoal: string;
  bio: string;
  interests: string[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
  roadmap: RoadmapStage[];
  nextActions: NextAction[];
  dailyTasks: DailyTask[];
  opportunities: Opportunity[];
  actionHistory: ActionHistory[];
  customPriorityActionId?: string;
  dsaSolvedCount: number;
  learningHoursTotal: number;
  applicationsCount: number;
  notificationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'milestone';
}
