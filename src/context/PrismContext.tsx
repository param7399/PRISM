import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Student,
  SkillLevel,
  Project,
  Certificate,
  Achievement,
  SkillGap,
  NextAction,
  ActionCategory,
  ActionStatus,
  ActionHistory,
  ThemePreference,
  AnalyticsData,
  Opportunity,
  ToastNotification,
  SkillCategory
} from '../types';
import { INITIAL_STUDENT } from '../data/mockData';
import {
  analyzeStudentProfile,
  getScoreFromLevel,
  getStatusFromScore,
  generateCareerRoadmap,
  matchOpportunities
} from '../services/aiService';

export type NextActionsFilter = 'All' | ActionCategory;

export const VALID_NEXT_ACTION_FILTERS: NextActionsFilter[] = [
  'All',
  'Learn',
  'Build',
  'Practice',
  'Profile',
  'Career',
  'Opportunity'
];

export interface ActionChangeNotice {
  previousTitle: string;
  newTitle: string;
  reason: string;
  skillChange?: string;
  readinessFrom: number;
  readinessTo: number;
}

interface PrismContextType {
  student: Student;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  theme: 'light' | 'dark';
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  nextActionsFilter: NextActionsFilter;
  setNextActionsFilter: (category: NextActionsFilter) => void;
  lastActionChange: ActionChangeNotice | null;
  dismissActionChange: () => void;
  readiness: number;
  profileStrength: number;
  gaps: SkillGap[];
  nextBestAction: NextAction;
  prioritizedActions: NextAction[];
  analytics: AnalyticsData;
  matchedOpportunities: Opportunity[];
  toasts: ToastNotification[];
  loginDemo: () => void;
  loginWithDetails: (name: string, email: string, college?: string, year?: string, skipOnboarding?: boolean) => void;
  logout: () => void;
  completeOnboarding: (updatedPartial: Partial<Student>) => void;
  toggleTheme: () => void;
  updateSkillLevel: (skillId: string, level: SkillLevel, customScore?: number) => void;
  addNewSkill: (name: string, category: SkillCategory, level: SkillLevel) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProjectStatus: (projectId: string, status: Project['status'], progress: number) => void;
  addCertificate: (cert: Omit<Certificate, 'id'>) => void;
  addAchievement: (ach: Omit<Achievement, 'id'>) => void;
  toggleRoadmapItem: (stageId: string, itemId: string) => void;
  addItemToRoadmap: (title: string, stageTitleHint?: string, description?: string) => void;
  toggleNextActionComplete: (actionId: string) => void;
  updateActionStatus: (actionId: string, status: ActionStatus) => void;
  updateDailyTaskStatus: (taskId: string, status: ActionStatus) => void;
  startNextAction: (actionId: string) => void;
  makeSkillNextAction: (skillName: string, suggestedProject?: string, whyItMatters?: string) => void;
  addProjectToNextActions: (projectId: string) => void;
  addOpportunityToNextActions: (oppId: string) => void;
  applyToOpportunity: (oppId: string) => void;
  updateProfileInfo: (info: Partial<Student>) => void;
  recalculateProfile: () => void;
  resetDemoData: () => void;
  addToast: (title: string, description?: string, type?: ToastNotification['type']) => void;
  dismissToast: (id: string) => void;
}

const PrismContext = createContext<PrismContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENT: 'prism_student_v4',
  AUTH: 'prism_auth_v4',
  ONBOARDING: 'prism_onboarded_v4',
  THEME: 'prism_theme_v4',
  NEXT_ACTIONS_FILTER: 'prism_next_actions_filter_v4'
};

export const PrismProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STUDENT,
          ...parsed,
          dailyTasks: parsed.dailyTasks || INITIAL_STUDENT.dailyTasks,
          nextActions: parsed.nextActions || INITIAL_STUDENT.nextActions,
          actionHistory: parsed.actionHistory || INITIAL_STUDENT.actionHistory
        };
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_STUDENT;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (themePreference === 'system') {
      if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
    return themePreference;
  }, [themePreference]);

  const setThemePreference = useCallback((pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, pref);
    } catch {
      // ignore
    }
  }, []);

  const [lastActionChange, setLastActionChange] = useState<ActionChangeNotice | null>(null);
  const dismissActionChange = useCallback(() => setLastActionChange(null), []);

  const [nextActionsFilter, setNextActionsFilterState] = useState<NextActionsFilter>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEXT_ACTIONS_FILTER);
      if (saved && VALID_NEXT_ACTION_FILTERS.includes(saved as NextActionsFilter)) {
        return saved as NextActionsFilter;
      }
    } catch {
      // ignore
    }
    return 'All';
  });

  const setNextActionsFilter = useCallback((category: NextActionsFilter) => {
    setNextActionsFilterState(category);
    try {
      localStorage.setItem(STORAGE_KEYS.NEXT_ACTIONS_FILTER, category);
    } catch {
      // ignore
    }
  }, []);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((title: string, description?: string, type: ToastNotification['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
    } catch {
      // ignore
    }
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(hasCompletedOnboarding));
    } catch {
      // ignore
    }
  }, [hasCompletedOnboarding]);

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const analysis = useMemo(() => analyzeStudentProfile(student), [student]);
  const matchedOpportunities = useMemo(() => matchOpportunities(student), [student]);

  const toggleTheme = useCallback(() => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light';
    setThemePreference(next);
  }, [resolvedTheme, setThemePreference]);

  const loginDemo = useCallback(() => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
    addToast('Logged into demo profile', 'All skills, projects, and career intelligence loaded.', 'success');
  }, [addToast]);

  const loginWithDetails = useCallback(
    (name: string, email: string, college?: string, year?: string, skipOnboarding = false) => {
      setStudent((prev) => ({
        ...prev,
        name: name.trim() || prev.name,
        email: email.trim() || prev.email,
        college: college?.trim() || prev.college,
        year: year?.trim() || prev.year
      }));
      setIsAuthenticated(true);
      setHasCompletedOnboarding(skipOnboarding);
      if (skipOnboarding) {
        const displayName = name.trim() || student.name;
        addToast(
          displayName ? `Welcome back, ${displayName}!` : 'Welcome back!',
          'Your career readiness dashboard is ready.',
          'success'
        );
      }
    },
    [addToast, student.name]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    addToast('Signed out', 'You can sign back in or use the Demo Account anytime.', 'info');
  }, [addToast]);

  const completeOnboarding = useCallback(
    (updatedPartial: Partial<Student>) => {
      setStudent((prev) => {
        const merged = { ...prev, ...updatedPartial };
        return {
          ...merged,
          roadmap: generateCareerRoadmap(merged)
        };
      });
      setIsAuthenticated(true);
      setHasCompletedOnboarding(true);
      addToast('Your PRISM profile is ready.', 'Here is where you stand and what to focus on next.', 'milestone');
    },
    [addToast]
  );

  const updateSkillLevel = useCallback(
    (skillId: string, level: SkillLevel, customScore?: number) => {
      const oldReadiness = analyzeStudentProfile(student).readiness;
      const updatedSkills = student.skills.map((s) => {
        if (s.id !== skillId) return s;
        const newScore = customScore !== undefined ? customScore : getScoreFromLevel(level);
        return {
          ...s,
          level,
          score: newScore,
          status: getStatusFromScore(newScore, s.targetScore)
        };
      });
      const nextStudent = { ...student, skills: updatedSkills };
      const newReadiness = analyzeStudentProfile(nextStudent).readiness;
      const diff = newReadiness - oldReadiness;

      setStudent(nextStudent);
      if (diff > 0) {
        addToast('Skill updated.', `Nice! Your career readiness increased by ${diff}% (now ${newReadiness}%).`, 'milestone');
      } else {
        addToast('Skill updated.', `Career readiness recalculated at ${newReadiness}%.`, 'info');
      }
    },
    [student, addToast]
  );

  const addNewSkill = useCallback(
    (name: string, category: SkillCategory, level: SkillLevel) => {
      const score = getScoreFromLevel(level);
      const targetScore = 78;
      const newSkill = {
        id: `skill-${Date.now()}`,
        name,
        category,
        level,
        score,
        targetScore,
        status: getStatusFromScore(score, targetScore),
        whyItMatters: `${name} strengthens your ${student.careerGoal} profile and expands the projects you can build.`,
        topicsToLearn: ['Core Fundamentals', 'Practical Implementation', 'Real-World Integration'],
        suggestedProject: `Build a practical ${name} mini-project`,
        estimatedDays: '5–7 days'
      };
      const oldReadiness = analyzeStudentProfile(student).readiness;
      const nextStudent = { ...student, skills: [...student.skills, newSkill] };
      const newReadiness = analyzeStudentProfile(nextStudent).readiness;
      const diff = Math.max(1, newReadiness - oldReadiness);

      setStudent(nextStudent);
      addToast('Skill added to profile.', `Readiness recalculated (+${diff}%).`, 'success');
    },
    [student, addToast]
  );

  const addProject = useCallback(
    (projectData: Omit<Project, 'id'>) => {
      const oldReadiness = analyzeStudentProfile(student).readiness;
      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`
      };

      const techLower = projectData.technologies.map((t) => t.toLowerCase());
      const updatedSkills = student.skills.map((skill) => {
        const isUsed = techLower.some(
          (t) =>
            skill.name.toLowerCase().includes(t) ||
            (t.includes('ml') && skill.name === 'Machine Learning') ||
            (t.includes('machine learning') && skill.name === 'Machine Learning') ||
            (t.includes('rag') && (skill.name === 'Generative AI' || skill.name === 'LLMs'))
        );
        if (isUsed) {
          const boostedScore = Math.min(95, skill.score + (projectData.status === 'Completed' ? 10 : 5));
          const newLevel: SkillLevel =
            boostedScore >= 75 ? 'Advanced' : boostedScore >= 55 ? 'Intermediate' : 'Beginner';
          return {
            ...skill,
            score: boostedScore,
            level: newLevel,
            status: getStatusFromScore(boostedScore, skill.targetScore)
          };
        }
        return skill;
      });

      const nextStudent: Student = {
        ...student,
        skills: updatedSkills,
        projects: [newProject, ...student.projects]
      };
      const newReadiness = analyzeStudentProfile(nextStudent).readiness;
      const diff = Math.max(2, newReadiness - oldReadiness);

      setStudent(nextStudent);
      addToast(
        'Project added.',
        `Your profile changed. Career readiness increased by ${diff}% (now ${newReadiness}%).`,
        'milestone'
      );
    },
    [student, addToast]
  );

  const updateProjectStatus = useCallback(
    (projectId: string, status: Project['status'], progress: number) => {
      const oldReadiness = analyzeStudentProfile(student).readiness;
      const targetProj = student.projects.find((p) => p.id === projectId);

      const updatedProjects = student.projects.map((p) =>
        p.id === projectId ? { ...p, status, progress } : p
      );

      let updatedSkills = student.skills;
      if (targetProj && status === 'Completed') {
        updatedSkills = student.skills.map((s) => {
          if (targetProj.skillsDemonstrated.includes(s.name)) {
            const nextScore = Math.min(92, s.score + 8);
            return {
              ...s,
              score: nextScore,
              level: nextScore >= 75 ? 'Advanced' : nextScore >= 55 ? 'Intermediate' : s.level,
              status: getStatusFromScore(nextScore, s.targetScore)
            };
          }
          return s;
        });
      }

      const nextStudent = {
        ...student,
        projects: updatedProjects,
        skills: updatedSkills
      };
      const newReadiness = analyzeStudentProfile(nextStudent).readiness;
      const diff = newReadiness - oldReadiness;

      setStudent(nextStudent);
      if (status === 'Completed') {
        addToast(
          'Project marked as Completed!',
          diff > 0
            ? `Nice! Your readiness increased by ${diff}% from shipping ${targetProj?.name}.`
            : `${targetProj?.name} is now part of your completed portfolio.`,
          'milestone'
        );
      } else if (status === 'In Progress') {
        addToast('Project started.', 'Added to your active projects and roadmap.', 'success');
      }
    },
    [student, addToast]
  );

  const addCertificate = useCallback(
    (cert: Omit<Certificate, 'id'>) => {
      const nextCert: Certificate = { ...cert, id: `cert-${Date.now()}` };
      setStudent((prev) => ({
        ...prev,
        certificates: [nextCert, ...prev.certificates]
      }));
      addToast('Certificate added.', 'Profile strength updated.', 'success');
    },
    [addToast]
  );

  const addAchievement = useCallback(
    (ach: Omit<Achievement, 'id'>) => {
      const nextAch: Achievement = { ...ach, id: `ach-${Date.now()}` };
      setStudent((prev) => ({
        ...prev,
        achievements: [nextAch, ...prev.achievements]
      }));
      addToast('Achievement added.', 'Your profile strength increased.', 'success');
    },
    [addToast]
  );

  const toggleRoadmapItem = useCallback(
    (stageId: string, itemId: string) => {
      const oldReadiness = analyzeStudentProfile(student).readiness;
      const rawStages = student.roadmap.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          items: stage.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      });

      const nextStudent = {
        ...student,
        roadmap: generateCareerRoadmap({ ...student, roadmap: rawStages }),
        learningHoursTotal: student.learningHoursTotal + 3
      };
      const newReadiness = analyzeStudentProfile(nextStudent).readiness;
      const diff = newReadiness - oldReadiness;

      setStudent(nextStudent);
      if (diff > 0) {
        addToast('Roadmap updated.', `Nice! Your readiness increased by ${diff}%.`, 'milestone');
      } else {
        addToast('Roadmap progress saved.', 'Your career path has been updated.', 'info');
      }
    },
    [student, addToast]
  );

  const addItemToRoadmap = useCallback(
    (title: string, stageTitleHint?: string, description?: string) => {
      setStudent((prev) => {
        const alreadyExists = prev.roadmap.some((st) =>
          st.items.some((i) => i.title.toLowerCase() === title.toLowerCase())
        );
        if (alreadyExists) {
          return prev;
        }

        const targetStageIndex = prev.roadmap.findIndex((st) =>
          stageTitleHint
            ? st.title.toLowerCase().includes(stageTitleHint.toLowerCase())
            : st.status === 'Current'
        );
        const idx = targetStageIndex >= 0 ? targetStageIndex : 2;

        const updatedStages = prev.roadmap.map((st, index) => {
          if (index !== idx) return st;
          return {
            ...st,
            items: [
              ...st.items,
              {
                id: `rm-custom-${Date.now()}`,
                title,
                completed: false,
                description: description || 'Added from PRISM recommendations'
              }
            ]
          };
        });

        return {
          ...prev,
          roadmap: generateCareerRoadmap({ ...prev, roadmap: updatedStages })
        };
      });
      addToast('Added to your roadmap.', `"${title}" is now tracked in your Career Roadmap.`, 'success');
    },
    [addToast]
  );

  const updateActionStatus = useCallback(
    (actionId: string, status: ActionStatus) => {
      const oldAnalysis = analyzeStudentProfile(student);
      const oldReadiness = oldAnalysis.readiness;
      const targetAction = student.nextActions.find((a) => a.id === actionId);
      if (!targetAction) return;

      const wasCompleted = targetAction.completed;
      const willComplete = status === 'Completed';
      const nextProgress =
        status === 'Completed' ? 100 : status === 'In Progress' ? Math.max(50, targetAction.progress) : 0;

      const updatedActions = student.nextActions.map((a) =>
        a.id === actionId
          ? {
              ...a,
              status,
              completed: willComplete,
              progress: nextProgress
            }
          : a
      );

      let updatedSkills = student.skills;
      let skillChangeNote = '';

      if (willComplete && !wasCompleted && targetAction.skill) {
        updatedSkills = student.skills.map((s) => {
          if (s.name.toLowerCase() === targetAction.skill.toLowerCase()) {
            const oldScore = s.score;
            const nextScore = Math.min(96, s.score + (targetAction.skillBoost || 7));
            skillChangeNote = `${s.name}: ${oldScore}% → ${nextScore}%`;
            return {
              ...s,
              score: nextScore,
              level: nextScore >= 75 ? 'Advanced' : nextScore >= 55 ? 'Intermediate' : s.level,
              status: getStatusFromScore(nextScore, s.targetScore)
            };
          }
          return s;
        });
      }

      // If Machine Learning Fundamentals was completed, mark Supervised Learning in Roadmap Stage 03 as completed too
      const updatedRoadmap =
        willComplete && !wasCompleted && actionId === 'act-ml-fundamentals'
          ? generateCareerRoadmap({
              ...student,
              roadmap: student.roadmap.map((st) =>
                st.id === 'stage-03'
                  ? {
                      ...st,
                      items: st.items.map((item) =>
                        item.id === 'rm-supervised' ? { ...item, completed: true } : item
                      )
                    }
                  : st
              )
            })
          : student.roadmap;

      const newHistoryEntry: ActionHistory | null =
        willComplete && !wasCompleted
          ? {
              id: `hist-${Date.now()}`,
              title: `Completed: ${targetAction.title}`,
              period: 'Today',
              timestamp: 'Just now',
              category: targetAction.category,
              impactNote: skillChangeNote || `+${targetAction.expectedReadinessGain}% readiness`
            }
          : null;

      const nextStudent: Student = {
        ...student,
        nextActions: updatedActions,
        skills: updatedSkills,
        roadmap: updatedRoadmap,
        customPriorityActionId:
          student.customPriorityActionId === actionId ? undefined : student.customPriorityActionId,
        actionHistory: newHistoryEntry
          ? [newHistoryEntry, ...(student.actionHistory || [])]
          : student.actionHistory || [],
        dsaSolvedCount:
          willComplete && !wasCompleted && targetAction.skill === 'DSA'
            ? student.dsaSolvedCount + 15
            : student.dsaSolvedCount,
        learningHoursTotal:
          willComplete && !wasCompleted
            ? student.learningHoursTotal + 4
            : student.learningHoursTotal
      };

      const newAnalysis = analyzeStudentProfile(nextStudent);
      const newReadiness = newAnalysis.readiness;
      const diff = Math.max(1, newReadiness - oldReadiness);

      setStudent(nextStudent);

      if (willComplete && !wasCompleted) {
        const nextTop = newAnalysis.nextBestAction;
        if (nextTop && nextTop.id !== targetAction.id) {
          setLastActionChange({
            previousTitle: targetAction.title,
            newTitle: nextTop.title,
            reason: nextTop.whyNow,
            skillChange: skillChangeNote,
            readinessFrom: oldReadiness,
            readinessTo: newReadiness
          });
        }
        addToast(
          'Your next action changed.',
          `${skillChangeNote ? `${skillChangeNote} · ` : ''}Readiness ${oldReadiness}% → ${newReadiness}% (+${diff}%). Next up: ${newAnalysis.nextBestAction.title}`,
          'milestone'
        );
      } else if (status === 'In Progress') {
        addToast('Action in progress', `"${targetAction.title}" marked as In Progress.`, 'info');
      } else {
        addToast('Action status updated', `"${targetAction.title}" marked as ${status}.`, 'info');
      }
    },
    [student, addToast]
  );

  const toggleNextActionComplete = useCallback(
    (actionId: string) => {
      const targetAction = student.nextActions.find((a) => a.id === actionId);
      if (!targetAction) return;
      const nextStatus: ActionStatus = targetAction.completed ? 'Not Started' : 'Completed';
      updateActionStatus(actionId, nextStatus);
    },
    [student.nextActions, updateActionStatus]
  );

  const updateDailyTaskStatus = useCallback(
    (taskId: string, status: ActionStatus) => {
      const oldReadiness = analyzeStudentProfile(student).readiness;
      const targetTask = (student.dailyTasks || []).find((t) => t.id === taskId);
      if (!targetTask) return;

      const wasCompleted = targetTask.status === 'Completed';
      const willComplete = status === 'Completed';

      const updatedDaily = (student.dailyTasks || []).map((t) =>
        t.id === taskId ? { ...t, status } : t
      );

      let updatedSkills = student.skills;
      let skillChangeText = '';

      if (willComplete && !wasCompleted) {
        updatedSkills = student.skills.map((s) => {
          if (s.name.toLowerCase() === targetTask.skill.toLowerCase()) {
            const prevScore = s.score;
            const nextScore = Math.min(95, s.score + targetTask.skillGain);
            skillChangeText = `${s.name} ${prevScore}% → ${nextScore}%`;
            return {
              ...s,
              score: nextScore,
              level: nextScore >= 75 ? 'Advanced' : nextScore >= 55 ? 'Intermediate' : s.level,
              status: getStatusFromScore(nextScore, s.targetScore)
            };
          }
          return s;
        });
      }

      const nextStudent: Student = {
        ...student,
        dailyTasks: updatedDaily,
        skills: updatedSkills,
        dsaSolvedCount:
          willComplete && !wasCompleted && targetTask.skill === 'DSA'
            ? student.dsaSolvedCount + 5
            : student.dsaSolvedCount,
        learningHoursTotal:
          willComplete && !wasCompleted
            ? student.learningHoursTotal + 1
            : student.learningHoursTotal
      };

      const newReadiness = analyzeStudentProfile(nextStudent).readiness;
      const diff = Math.max(1, newReadiness - oldReadiness);

      setStudent(nextStudent);

      if (willComplete && !wasCompleted) {
        addToast(
          'Nice! You completed this action.',
          skillChangeText
            ? `${skillChangeText} · Career readiness increased by ${diff}%.`
            : `Career readiness increased by ${diff}%.`,
          'milestone'
        );
      } else {
        addToast('Today’s focus updated', `"${targetTask.title}" is now ${status}.`, 'info');
      }
    },
    [student, addToast]
  );

  const startNextAction = useCallback(
    (actionId: string) => {
      const action = student.nextActions.find((a) => a.id === actionId);
      setStudent((prev) => ({
        ...prev,
        nextActions: prev.nextActions.map((a) =>
          a.id === actionId
            ? {
                ...a,
                inRoadmap: true,
                status: a.status === 'Not Started' ? 'In Progress' : a.status,
                progress: Math.max(35, a.progress)
              }
            : a
        )
      }));
      if (action) {
        addItemToRoadmap(action.title, action.skill || 'Machine Learning', action.whyNow);
      }
    },
    [student.nextActions, addItemToRoadmap]
  );

  const makeSkillNextAction = useCallback(
    (skillName: string, suggestedProject?: string, whyItMatters?: string) => {
      setStudent((prev) => {
        const existingAction = prev.nextActions.find(
          (a) => !a.completed && a.skill.toLowerCase() === skillName.toLowerCase()
        );
        if (existingAction) {
          return {
            ...prev,
            customPriorityActionId: existingAction.id,
            actionHistory: [
              {
                id: `hist-${Date.now()}`,
                title: `Prioritized ${skillName} as Next Best Action`,
                period: 'Today',
                timestamp: 'Just now',
                category: existingAction.category,
                impactNote: 'Decision Engine Updated'
              },
              ...(prev.actionHistory || [])
            ]
          };
        }

        const newId = `act-custom-${Date.now()}`;
        const customAction: NextAction = {
          id: newId,
          title: suggestedProject
            ? `Close ${skillName} Gap: ${suggestedProject}`
            : `Master ${skillName} Fundamentals`,
          timeframe: 'week',
          priority: 'High',
          category: 'Learn',
          status: 'Not Started',
          progress: 0,
          skill: skillName,
          skillBoost: 8,
          whyNow:
            whyItMatters ||
            `You prioritized ${skillName} to directly close one of the key gaps for your ${prev.careerGoal} goal.`,
          impact: 'High',
          impactLabel: 'High Impact',
          estimatedTime: '6 days',
          expectedReadinessGain: 5,
          completed: false,
          inRoadmap: true,
          actionScore: 98,
          scoreBreakdown: {
            careerRelevance: 39,
            skillGapImpact: 29,
            currentSkillFit: 20,
            timeEfficiency: 10
          },
          whyReasons: [
            `Selected directly from your ${skillName} skill gap analysis`,
            `Aligned with your ${prev.careerGoal} target benchmark`,
            'Provides immediate readiness and portfolio progression'
          ],
          metrics: {
            goalMatch: 96,
            gapImpact: 92,
            skillFit: 88,
            difficultyFit: 85
          }
        };

        return {
          ...prev,
          customPriorityActionId: newId,
          nextActions: [customAction, ...prev.nextActions],
          actionHistory: [
            {
              id: `hist-${Date.now()}`,
              title: `Set "${customAction.title}" as Next Best Action`,
              period: 'Today',
              timestamp: 'Just now',
              category: 'Learn',
              impactNote: 'Priority #1'
            },
            ...(prev.actionHistory || [])
          ]
        };
      });
      addToast(
        'Updated your Next Best Action.',
        `PRISM now prioritizes ${skillName} as your #1 focus.`,
        'milestone'
      );
    },
    [addToast]
  );

  const addProjectToNextActions = useCallback(
    (projectId: string) => {
      const targetProj = student.projects.find((p) => p.id === projectId);
      if (!targetProj) return;

      const newId = `act-proj-${projectId}`;
      setStudent((prev) => {
        const exists = prev.nextActions.find((a) => a.id === newId || a.title.includes(targetProj.name));
        if (exists) {
          return {
            ...prev,
            customPriorityActionId: exists.id
          };
        }

        const primarySkill = targetProj.skillsDemonstrated[0] || 'Machine Learning';
        const newAction: NextAction = {
          id: newId,
          title: `Build ${targetProj.name}`,
          timeframe: 'week',
          priority: 'High',
          category: 'Build',
          status: 'Not Started',
          progress: 0,
          skill: primarySkill,
          skillBoost: 9,
          whyNow:
            targetProj.whyRecommended ||
            `Building ${targetProj.name} provides hands-on project proof for ${targetProj.skillsDemonstrated.join(', ')}.`,
          impact: 'High',
          impactLabel: 'High Impact',
          estimatedTime: targetProj.estimatedTime || '7 days',
          expectedReadinessGain: targetProj.readinessBoost || 6,
          completed: false,
          inRoadmap: true,
          actionScore: 96,
          scoreBreakdown: {
            careerRelevance: 39,
            skillGapImpact: 29,
            currentSkillFit: 19,
            timeEfficiency: 9
          },
          whyReasons: [
            `Demonstrates ${targetProj.skillsDemonstrated.join(', ')} in a real repository`,
            'Bridges the gap between theoretical knowledge and project evidence',
            `Increases readiness by +${targetProj.readinessBoost || 6}%`
          ],
          metrics: {
            goalMatch: targetProj.matchPercentage || 92,
            gapImpact: 91,
            skillFit: 86,
            difficultyFit: 84
          }
        };

        return {
          ...prev,
          customPriorityActionId: newId,
          nextActions: [newAction, ...prev.nextActions],
          actionHistory: [
            {
              id: `hist-${Date.now()}`,
              title: `Added project "${targetProj.name}" to Next Actions`,
              period: 'Today',
              timestamp: 'Just now',
              category: 'Build',
              impactNote: `+${targetProj.readinessBoost || 6}% est. readiness`
            },
            ...(prev.actionHistory || [])
          ]
        };
      });
      addToast(
        'Added to your Next Actions.',
        `"Build ${targetProj.name}" is now prioritized in your action queue.`,
        'success'
      );
    },
    [student.projects, addToast]
  );

  const addOpportunityToNextActions = useCallback(
    (oppId: string) => {
      const opp = student.opportunities.find((o) => o.id === oppId);
      if (!opp) return;

      const missingSkills = opp.skills.filter((s) => !s.met).map((s) => s.name);
      const focusSkill = missingSkills[0] || opp.skills[0]?.name || 'Machine Learning';
      const newId = `act-opp-${opp.id}`;

      setStudent((prev) => {
        const exists = prev.nextActions.find((a) => a.id === newId);
        if (exists) {
          return {
            ...prev,
            customPriorityActionId: exists.id
          };
        }

        const actionTitle =
          missingSkills.length > 0
            ? `Prepare for ${opp.title.replace(' (Demo Listing)', '')}: Close ${missingSkills.join(' & ')} Gap`
            : `Apply to ${opp.title.replace(' (Demo Listing)', '')}`;

        const newAction: NextAction = {
          id: newId,
          title: actionTitle,
          timeframe: 'week',
          priority: 'High',
          category: missingSkills.length > 0 ? 'Build' : 'Opportunity',
          status: 'Not Started',
          progress: 0,
          skill: focusSkill,
          skillBoost: 6,
          whyNow:
            missingSkills.length > 0
              ? `You're at ${opp.matchPercentage}% match for ${opp.organization}. ${opp.whatMissing}`
              : `You meet all skill prerequisites (${opp.matchPercentage}% match) — submit your application before ${opp.deadline}.`,
          impact: 'High',
          impactLabel: 'High Impact',
          estimatedTime: missingSkills.length > 0 ? '4 days' : '1 day',
          expectedReadinessGain: 4,
          completed: false,
          inRoadmap: true,
          actionScore: 94,
          scoreBreakdown: {
            careerRelevance: 38,
            skillGapImpact: 28,
            currentSkillFit: 19,
            timeEfficiency: 9
          },
          whyReasons: [
            opp.whyMatch,
            opp.whatMissing,
            `Deadline: ${opp.deadline} (${opp.rewardOrStipend})`
          ],
          metrics: {
            goalMatch: opp.matchPercentage,
            gapImpact: 88,
            skillFit: 86,
            difficultyFit: 85
          }
        };

        return {
          ...prev,
          customPriorityActionId: newId,
          nextActions: [newAction, ...prev.nextActions],
          actionHistory: [
            {
              id: `hist-${Date.now()}`,
              title: `Added preparation for ${opp.title.replace(' (Demo Listing)', '')} to Next Actions`,
              period: 'Today',
              timestamp: 'Just now',
              category: 'Opportunity',
              impactNote: `${opp.matchPercentage}% Match`
            },
            ...(prev.actionHistory || [])
          ]
        };
      });

      addToast(
        'Added to your Next Actions.',
        missingSkills.length > 0
          ? `Preparation step for ${opp.title.replace(' (Demo Listing)', '')} is now your top action.`
          : `Application for ${opp.title.replace(' (Demo Listing)', '')} added to Next Actions.`,
        'success'
      );
    },
    [student.opportunities, addToast]
  );

  const applyToOpportunity = useCallback(
    (oppId: string) => {
      setStudent((prev) => ({
        ...prev,
        applicationsCount: prev.applicationsCount + 1,
        opportunities: prev.opportunities.map((o) =>
          o.id === oppId ? { ...o, applied: true } : o
        )
      }));
      addToast('Tracked in your applications!', 'Application count updated in your Career Analytics.', 'success');
    },
    [addToast]
  );

  const updateProfileInfo = useCallback(
    (info: Partial<Student>) => {
      setStudent((prev) => ({
        ...prev,
        ...info
      }));
      addToast('Profile updated.', 'Your PRISM intelligence metrics have been refreshed.', 'success');
    },
    [addToast]
  );

  const recalculateProfile = useCallback(() => {
    const currentAnalysis = analyzeStudentProfile(student);
    addToast(
      'Profile recalculated.',
      `Readiness is ${currentAnalysis.readiness}% with ${currentAnalysis.gaps.length} prioritized gaps for ${student.careerGoal}.`,
      'milestone'
    );
  }, [student, addToast]);

  const resetDemoData = useCallback(() => {
    setStudent(INITIAL_STUDENT);
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
    setNextActionsFilterState('All');
    setLastActionChange(null);
    localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(INITIAL_STUDENT));
    localStorage.setItem(STORAGE_KEYS.NEXT_ACTIONS_FILTER, 'All');
    addToast('Demo reset to initial state', 'Initial 72% readiness demo profile restored.', 'info');
  }, [addToast]);

  return (
    <PrismContext.Provider
      value={{
        student,
        isAuthenticated,
        hasCompletedOnboarding,
        theme: resolvedTheme,
        themePreference,
        setThemePreference,
        nextActionsFilter,
        setNextActionsFilter,
        lastActionChange,
        dismissActionChange,
        readiness: analysis.readiness,
        profileStrength: analysis.profileStrength,
        gaps: analysis.gaps,
        nextBestAction: analysis.nextBestAction,
        prioritizedActions: analysis.prioritizedActions,
        analytics: analysis.analytics,
        matchedOpportunities,
        toasts,
        loginDemo,
        loginWithDetails,
        logout,
        completeOnboarding,
        toggleTheme,
        updateSkillLevel,
        addNewSkill,
        addProject,
        updateProjectStatus,
        addCertificate,
        addAchievement,
        toggleRoadmapItem,
        addItemToRoadmap,
        toggleNextActionComplete,
        updateActionStatus,
        updateDailyTaskStatus,
        startNextAction,
        makeSkillNextAction,
        addProjectToNextActions,
        addOpportunityToNextActions,
        applyToOpportunity,
        updateProfileInfo,
        recalculateProfile,
        resetDemoData,
        addToast,
        dismissToast
      }}
    >
      {children}
    </PrismContext.Provider>
  );
};

export const usePrism = (): PrismContextType => {
  const ctx = useContext(PrismContext);
  if (!ctx) {
    throw new Error('usePrism must be used within a PrismProvider');
  }
  return ctx;
};
