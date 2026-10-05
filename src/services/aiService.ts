import {
  Student,
  SkillGap,
  NextAction,
  Recommendation,
  RoadmapStage,
  Opportunity,
  AnalyticsData,
  SkillLevel,
  SkillStatus
} from '../types';

export function getStatusFromScore(score: number, targetScore: number): SkillStatus {
  const diff = targetScore - score;
  if (score >= 74 || diff <= 5) return 'Strong';
  if (score >= 62) return 'On Track';
  if (score >= 52) return 'Growing';
  if (score >= 38) return 'Needs Work';
  return 'Beginner';
}

export function getScoreFromLevel(level: SkillLevel, currentScore?: number): number {
  if (level === 'Advanced') return currentScore && currentScore >= 75 ? currentScore : 82;
  if (level === 'Intermediate') return currentScore && currentScore >= 55 && currentScore < 75 ? currentScore : 65;
  return currentScore && currentScore < 50 ? currentScore : 35;
}

/**
 * Deterministically calculates career readiness percentage (base 72% for initial state).
 */
export function calculateCareerReadiness(student: Student): number {
  const skills = student.skills;
  if (!skills.length) return 45;

  let totalRatio = 0;
  let totalWeight = 0;

  for (const s of skills) {
    const isCoreGoalSkill =
      s.category === 'AI / ML' || s.name === 'Python' || s.name === 'DSA' || s.name === 'SQL';
    const weight = isCoreGoalSkill ? 1.4 : 0.9;
    const ratio = Math.min(1.08, s.score / Math.max(1, s.targetScore));
    totalRatio += ratio * weight;
    totalWeight += weight;
  }

  const skillComponent = (totalRatio / totalWeight) * 100;

  const completedProjects = student.projects.filter((p) => p.status === 'Completed').length;
  const inProgressProjects = student.projects.filter((p) => p.status === 'In Progress').length;
  const projectBonus = completedProjects * 3 + inProgressProjects * 1.5;

  const totalRoadmapItems = student.roadmap.reduce((acc, st) => acc + st.items.length, 0);
  const completedRoadmapItems = student.roadmap.reduce(
    (acc, st) => acc + st.items.filter((i) => i.completed).length,
    0
  );
  const roadmapBonus = totalRoadmapItems > 0 ? (completedRoadmapItems / totalRoadmapItems) * 8 : 0;

  const completedActions = student.nextActions.filter((a) => a.completed).length;
  const completedDaily = (student.dailyTasks || []).filter((d) => d.status === 'Completed').length;
  const actionBonus = completedActions * 2.1 + completedDaily * 1;

  const raw = skillComponent * 0.88 + projectBonus + roadmapBonus + actionBonus + 5.6;
  return Math.max(35, Math.min(98, Math.round(raw)));
}

export interface ProfileStrengthBreakdown {
  total: number;
  items: { label: string; score: number; max: number; note: string }[];
}

export function calculateProfileStrengthBreakdown(student: Student): ProfileStrengthBreakdown {
  const total = calculateProfileStrength(student);
  const completedProjects = student.projects.filter((p) => p.status === 'Completed').length;
  const inProgressProjects = student.projects.filter((p) => p.status === 'In Progress').length;
  return {
    total,
    items: [
      {
        label: 'Career Goal & Academic Clarity',
        score: student.careerGoal && student.college ? 15 : 8,
        max: 15,
        note: `${student.careerGoal} · ${student.year} ${student.degree}`
      },
      {
        label: 'Mapped Technical Skills',
        score: Math.min(25, Math.round(student.skills.length * 2)),
        max: 25,
        note: `${student.skills.length} skills mapped across 5 categories`
      },
      {
        label: 'Project Evidence (Proof of Work)',
        score: Math.min(30, completedProjects * 14 + inProgressProjects * 8),
        max: 30,
        note: `${completedProjects} completed, ${inProgressProjects} in progress`
      },
      {
        label: 'Certifications & Verified Credentials',
        score: Math.min(15, student.certificates.length * 6),
        max: 15,
        note: `${student.certificates.length} verified certificates`
      },
      {
        label: 'Hackathons & Achievements',
        score: Math.min(15, student.achievements.length * 6),
        max: 15,
        note: `${student.achievements.length} recorded achievements`
      }
    ]
  };
}

/**
 * Deterministically calculates profile strength percentage (base 78% for initial state).
 */
export function calculateProfileStrength(student: Student): number {
  let score = 40;
  if (student.name && student.college && student.careerGoal) score += 12;
  score += Math.min(18, student.skills.length * 1.5);

  const completedProjects = student.projects.filter((p) => p.status === 'Completed').length;
  const inProgressProjects = student.projects.filter((p) => p.status === 'In Progress').length;
  score += Math.min(18, completedProjects * 6 + inProgressProjects * 4);

  score += Math.min(8, student.certificates.length * 4);
  score += Math.min(8, student.achievements.length * 3);
  score += Math.min(6, student.interests.length * 1);

  const completedProfileActions = student.nextActions.filter(
    (a) => a.completed && a.category === 'Profile'
  ).length;
  score += completedProfileActions * 2;

  return Math.max(40, Math.min(99, Math.round(score - 12)));
}

/**
 * Calculates ranked skill gaps for the student's target career goal.
 */
export function calculateSkillGaps(student: Student): SkillGap[] {
  const gaps: SkillGap[] = [];

  for (const skill of student.skills) {
    const gapVal = Math.max(0, skill.targetScore - skill.score);
    if (gapVal >= 10) {
      const priority: 'High' | 'Medium' | 'Low' =
        gapVal >= 35 || (skill.category === 'AI / ML' && gapVal >= 25)
          ? 'High'
          : gapVal >= 15
          ? 'Medium'
          : 'Low';

      const impactScore =
        skill.name === 'Machine Learning'
          ? 96
          : skill.name === 'Deep Learning'
          ? 94
          : skill.name === 'LLMs'
          ? 91
          : skill.name === 'Generative AI'
          ? 89
          : skill.name === 'DSA'
          ? 84
          : 72;

      gaps.push({
        id: `gap-${skill.id}`,
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        currentScore: skill.score,
        targetScore: skill.targetScore,
        gap: gapVal,
        priority,
        impactScore,
        isQuickWin: gapVal <= 22 || skill.estimatedDays.includes('4') || skill.estimatedDays.includes('7'),
        whyItMatters: skill.whyItMatters,
        whatToLearn: skill.topicsToLearn,
        suggestedProject: skill.suggestedProject,
        estimatedTime: skill.estimatedDays
      });
    }
  }

  const hasSystemDesign = student.skills.some((s) => s.name.toLowerCase().includes('system design'));
  if (!hasSystemDesign) {
    gaps.push({
      id: 'gap-system-design',
      skillId: 'skill-system-design',
      skillName: 'System Design & Model Serving',
      category: 'Core CS',
      currentScore: 30,
      targetScore: 75,
      gap: 45,
      priority: 'Medium',
      impactScore: 81,
      isQuickWin: false,
      whyItMatters:
        'Training a model in a notebook is only half the job. Knowing how to wrap models in APIs, handle latency, and structure databases makes your projects production-ready.',
      whatToLearn: [
        'REST APIs & FastAPI Model Serving',
        'Caching & Rate Limiting',
        'Vector Database Indexing',
        'Docker Basics for ML'
      ],
      suggestedProject: 'Containerize an ML Inference API with FastAPI & Docker',
      estimatedTime: '6–8 days'
    });
  }

  return gaps.sort((a, b) => b.impactScore - a.impactScore);
}

/**
 * Intelligent dependency-aware prioritization for Next Best Actions.
 * Dependency chain:
 * Python -> NumPy/Pandas -> Machine Learning -> Deep Learning -> LLMs -> RAG -> Generative AI Project -> Internship Applications
 */
export function generateNextBestActions(student: Student): NextAction[] {
  const getSkill = (name: string) =>
    student.skills.find((s) => s.name.toLowerCase() === name.toLowerCase());

  const pythonScore = getSkill('Python')?.score ?? 0;
  const mlScore = getSkill('Machine Learning')?.score ?? 0;
  const dsaScore = getSkill('DSA')?.score ?? 0;
  const mlFundamentalsDone = student.nextActions.some(
    (a) => a.id === 'act-ml-fundamentals' && a.completed
  );
  const hasCompletedMLProject = student.projects.some(
    (p) =>
      p.status === 'Completed' &&
      (p.skillsDemonstrated.includes('Machine Learning') ||
        p.technologies.includes('Scikit-Learn') ||
        p.technologies.includes('RAG'))
  );

  // Adjust action scores deterministically based on dependency chain
  const prioritized = student.nextActions.map((action) => {
    let dynamicScore = action.actionScore;
    let dynamicWhyNow = action.whyNow;

    if (student.customPriorityActionId && action.id === student.customPriorityActionId && !action.completed) {
      dynamicScore = 98;
    } else if (pythonScore < 60 && action.skill === 'Python') {
      dynamicScore = 97;
    } else if (pythonScore >= 60 && mlScore < 52 && !mlFundamentalsDone && action.id === 'act-ml-fundamentals') {
      dynamicScore = 92;
    } else if ((mlScore >= 52 || mlFundamentalsDone) && !hasCompletedMLProject && action.id === 'act-week-classification') {
      dynamicScore = 95;
      dynamicWhyNow =
        'Your fundamentals have improved. Now the best way to strengthen your profile is to prove the skill through a project.';
    } else if (mlScore >= 60 && hasCompletedMLProject && action.category === 'Opportunity') {
      dynamicScore = 96;
    } else if (dsaScore < 65 && action.skill === 'DSA') {
      dynamicScore = Math.max(dynamicScore, 85);
    }

    return {
      ...action,
      actionScore: dynamicScore,
      whyNow: dynamicWhyNow
    };
  });

  // Sort uncompleted first by actionScore descending, then completed
  return prioritized.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.actionScore - a.actionScore;
  });
}

/**
 * Returns the single #1 highest-priority Next Best Action based on dependency chain.
 */
export function generateNextBestAction(student: Student): NextAction {
  const allPrioritized = generateNextBestActions(student);
  const topUncompleted = allPrioritized.find(
    (a) => !a.completed && a.timeframe !== 'quickwin'
  );
  if (topUncompleted) return topUncompleted;
  return allPrioritized[0];
}

/**
 * Generates contextual recommendations based on current profile state.
 */
export function generateRecommendations(student: Student): Recommendation[] {
  const gaps = calculateSkillGaps(student);
  return gaps.slice(0, 4).map((g) => ({
    id: `rec-${g.id}`,
    title: `Close ${g.skillName} Gap (${g.currentScore}% → ${g.targetScore}%)`,
    type: 'Skill',
    description: `Focus on ${g.whatToLearn.slice(0, 3).join(', ')} and build "${g.suggestedProject}".`,
    whyUseful: g.whyItMatters,
    estimatedTime: g.estimatedTime,
    readinessBoost: g.priority === 'High' ? 6 : 3
  }));
}

/**
 * Evaluates and updates roadmap stage statuses based on item completion.
 */
export function generateCareerRoadmap(student: Student): RoadmapStage[] {
  let foundCurrent = false;
  return student.roadmap.map((stage) => {
    const allDone = stage.items.every((i) => i.completed);
    const someDone = stage.items.some((i) => i.completed);
    if (allDone) {
      return { ...stage, status: 'Completed' };
    }
    if (someDone || !foundCurrent) {
      foundCurrent = true;
      return { ...stage, status: 'Current' };
    }
    return { ...stage, status: 'Upcoming' };
  });
}

/**
 * Re-evaluates opportunity match scores deterministically against student's current skill scores.
 */
export function matchOpportunities(student: Student): Opportunity[] {
  const skillMap = new Map<string, number>();
  student.skills.forEach((s) => skillMap.set(s.name.toLowerCase(), s.score));

  const mlScore = skillMap.get('machine learning') ?? 45;
  const dlScore = skillMap.get('deep learning') ?? 25;
  const genaiScore = skillMap.get('generative ai') ?? 30;
  const hasRagProject = student.projects.some(
    (p) =>
      p.status !== 'Recommended' &&
      (p.technologies.includes('RAG') || p.name.toLowerCase().includes('study assistant'))
  );

  return student.opportunities.map((opp) => {
    const updatedSkills = opp.skills.map((req) => {
      if (req.name === 'Machine Learning') return { ...req, met: mlScore >= 55 };
      if (req.name === 'Deep Learning') return { ...req, met: dlScore >= 50 };
      if (req.name === 'RAG') return { ...req, met: genaiScore >= 50 || hasRagProject };
      return req;
    });

    const metCount = updatedSkills.filter((s) => s.met).length;
    const bonus = Math.max(0, Math.round((mlScore - 45) * 0.25 + (genaiScore - 30) * 0.2));
    const adjustedMatch = Math.min(98, opp.matchPercentage + bonus);

    return {
      ...opp,
      skills: updatedSkills,
      matchPercentage: metCount === updatedSkills.length ? Math.max(94, adjustedMatch) : adjustedMatch
    };
  });
}

/**
 * Generates human-friendly career insight and full analytics summary.
 */
export function generateCareerInsight(student: Student): string {
  const readiness = calculateCareerReadiness(student);
  const mlSkill = student.skills.find((s) => s.name === 'Machine Learning');
  const pythonSkill = student.skills.find((s) => s.name === 'Python');
  const mlFundamentalsDone = student.nextActions.some(
    (a) => a.id === 'act-ml-fundamentals' && a.completed
  );

  if (mlFundamentalsDone || (mlSkill && mlSkill.score >= 52)) {
    return `Your recent progress has shifted your next recommendation from learning to building. With Machine Learning at ${mlSkill?.score ?? 52}% and readiness at ${readiness}%, your biggest opportunity right now is turning your ML knowledge into a real project.`;
  }

  if (mlSkill && mlSkill.score < 52) {
    return `You're strong in programming (Python ${pythonSkill?.score ?? 82}%), but your AI project and ML experience (${mlSkill.score}%) is still limited. You don't need another general programming course right now — focus on Machine Learning fundamentals.`;
  }
  return `Nice momentum! Your Machine Learning foundation is getting stronger, and your readiness is now at ${readiness}%. Focus on shipping your next AI project.`;
}

export function analyzeStudentProfile(student: Student): {
  readiness: number;
  profileStrength: number;
  gaps: SkillGap[];
  nextBestAction: NextAction;
  prioritizedActions: NextAction[];
  analytics: AnalyticsData;
} {
  const readiness = calculateCareerReadiness(student);
  const profileStrength = calculateProfileStrength(student);
  const gaps = calculateSkillGaps(student);
  const prioritizedActions = generateNextBestActions(student);
  const nextBestAction = generateNextBestAction(student);

  const completedProjects = student.projects.filter((p) => p.status === 'Completed').length;
  const fourMonthImprovement = readiness - 48;

  const analytics: AnalyticsData = {
    currentReadiness: readiness,
    targetReadiness: 85,
    monthlyIncrease: Math.max(8, readiness - 64),
    fourMonthImprovement,
    learningHours: student.learningHoursTotal,
    projectsCompleted: completedProjects,
    certificatesEarned: student.certificates.length,
    dsaProblemsSolved: student.dsaSolvedCount,
    applicationsSubmitted: student.applicationsCount,
    history: [
      { month: 'Month 1', readiness: 48, target: 85, hours: 28 },
      { month: 'Month 2', readiness: 57, target: 85, hours: 34 },
      { month: 'Month 3', readiness: 64, target: 85, hours: 38 },
      { month: 'Month 4', readiness: readiness, target: 85, hours: 42 }
    ],
    strengths: ['Python', 'Projects', 'Problem Solving'],
    needsAttention: ['Machine Learning', 'Communication', 'Deep Learning'],
    insightMessage: `You've improved your readiness by ${fourMonthImprovement}% in the last 4 months.`
  };

  return {
    readiness,
    profileStrength,
    gaps,
    nextBestAction,
    prioritizedActions,
    analytics
  };
}
