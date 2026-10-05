import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { CAREER_GOALS } from '../data/mockData';
import { SkillLevel, SkillCategory, Project } from '../types';
import { getScoreFromLevel, getStatusFromScore } from '../services/aiService';
import { PrismIcon } from '../components/common/PrismLogo';

const AVAILABLE_SKILL_CATALOG: { name: string; category: SkillCategory; target: number }[] = [
  { name: 'Python', category: 'Programming', target: 85 },
  { name: 'C++', category: 'Programming', target: 70 },
  { name: 'Java', category: 'Programming', target: 70 },
  { name: 'JavaScript', category: 'Programming', target: 65 },
  { name: 'React', category: 'Frontend & Tools', target: 65 },
  { name: 'SQL', category: 'Core CS', target: 75 },
  { name: 'DSA', category: 'Core CS', target: 80 },
  { name: 'Machine Learning', category: 'AI / ML', target: 80 },
  { name: 'Deep Learning', category: 'AI / ML', target: 80 },
  { name: 'Generative AI', category: 'AI / ML', target: 78 },
  { name: 'LLMs', category: 'AI / ML', target: 75 },
  { name: 'Git/GitHub', category: 'Core CS', target: 75 },
  { name: 'Cloud', category: 'Frontend & Tools', target: 70 },
  { name: 'Communication', category: 'Soft Skills', target: 80 }
];

const INTEREST_OPTIONS = [
  'Generative AI',
  'Machine Learning',
  'Software Development',
  'Hackathons',
  'Projects',
  'AI',
  'Web Development',
  'Data Science',
  'Startups',
  'Open Source',
  'Research'
];

const ANALYSIS_STEPS = [
  'Looking at your skills...',
  'Understanding your goal...',
  'Finding skill gaps...',
  'Building your roadmap...',
  'Finding your next step...',
  'Your PRISM profile is ready.'
];

export const OnboardingPage: React.FC = () => {
  const { student, completeOnboarding } = usePrism();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  // Step 1 state
  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [degree, setDegree] = useState(student.degree);
  const [branch, setBranch] = useState(student.branch);
  const [year, setYear] = useState(student.year);

  // Step 2 state
  const [careerGoal, setCareerGoal] = useState(student.careerGoal || 'AI / ML Engineer');
  const [customGoal, setCustomGoal] = useState('');

  // Step 3 state: map of skill name -> SkillLevel
  const [selectedSkills, setSelectedSkills] = useState<Record<string, SkillLevel>>(() => {
    const map: Record<string, SkillLevel> = {};
    student.skills.forEach((s) => {
      map[s.name] = s.level;
    });
    return map;
  });

  // Step 4 state: projects
  const [projects, setProjects] = useState<Project[]>(student.projects);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');
  const [newProjStatus, setNewProjStatus] = useState<'Completed' | 'In Progress'>('Completed');

  // Step 5 state: achievements & certificates
  const [certificates, setCertificates] = useState(student.certificates);
  const [achievements, setAchievements] = useState(student.achievements);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchCategory, setNewAchCategory] = useState<'Hackathon' | 'Competition' | 'Achievement'>('Hackathon');

  // Step 6 state: interests
  const [interests, setInterests] = useState<string[]>(student.interests);

  useEffect(() => {
    if (!isAnalyzing) return;
    if (analysisStepIndex < ANALYSIS_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setAnalysisStepIndex((prev) => prev + 1);
      }, 550);
      return () => clearTimeout(timer);
    } else {
      const finishTimer = setTimeout(() => {
        const existingMap = new Map(student.skills.map((s) => [s.name, s]));
        const finalSkills = Object.entries(selectedSkills).map(([skillName, level]) => {
          const existing = existingMap.get(skillName);
          if (existing) {
            const score = existing.level === level ? existing.score : getScoreFromLevel(level);
            return {
              ...existing,
              level,
              score,
              status: getStatusFromScore(score, existing.targetScore)
            };
          }
          const catalogEntry = AVAILABLE_SKILL_CATALOG.find((c) => c.name === skillName);
          const targetScore = catalogEntry?.target ?? 75;
          const score = getScoreFromLevel(level);
          return {
            id: `skill-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            name: skillName,
            category: catalogEntry?.category ?? 'Programming',
            level,
            score,
            targetScore,
            status: getStatusFromScore(score, targetScore),
            whyItMatters: `Important skill for your ${customGoal.trim() || careerGoal} trajectory.`,
            topicsToLearn: ['Core Fundamentals', 'Applied Practice', 'Project Integration'],
            suggestedProject: `Build a focused ${skillName} project`,
            estimatedDays: '5–7 days'
          };
        });

        completeOnboarding({
          name: name.trim() || student.name,
          college: college.trim() || student.college,
          degree: degree.trim() || student.degree,
          branch: branch.trim() || student.branch,
          year,
          careerGoal: customGoal.trim() || careerGoal,
          skills: finalSkills,
          projects,
          certificates,
          achievements,
          interests
        });
        navigate('/dashboard');
      }, 750);
      return () => clearTimeout(finishTimer);
    }
  }, [
    isAnalyzing,
    analysisStepIndex,
    completeOnboarding,
    navigate,
    name,
    college,
    degree,
    branch,
    year,
    careerGoal,
    customGoal,
    selectedSkills,
    projects,
    certificates,
    achievements,
    interests,
    student.name,
    student.college,
    student.degree,
    student.branch,
    student.skills
  ]);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      if (next[skillName]) {
        delete next[skillName];
      } else {
        next[skillName] = 'Beginner';
      }
      return next;
    });
  };

  const setSkillLevel = (skillName: string, level: SkillLevel) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skillName]: level
    }));
  };

  const handleAddProjectInOnboarding = () => {
    if (!newProjName.trim()) return;
    const techs = newProjTech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const created: Project = {
      id: `proj-onb-${Date.now()}`,
      name: newProjName.trim(),
      shortDescription: newProjDesc.trim() || 'Student engineering project built from scratch.',
      problem: 'Addressing a practical student workflow challenge.',
      solution: newProjDesc.trim() || 'Implemented end-to-end solution.',
      technologies: techs.length ? techs : ['Python'],
      skillsDemonstrated: techs.length ? techs : ['Python'],
      status: newProjStatus,
      progress: newProjStatus === 'Completed' ? 100 : 60,
      githubUrl: newProjGithub.trim() || undefined
    };
    setProjects((prev) => [created, ...prev]);
    setNewProjName('');
    setNewProjDesc('');
    setNewProjTech('');
    setNewProjGithub('');
  };

  const handleAddCertInOnboarding = () => {
    if (!newCertTitle.trim()) return;
    setCertificates((prev) => [
      ...prev,
      {
        id: `cert-onb-${Date.now()}`,
        title: newCertTitle.trim(),
        issuer: newCertIssuer.trim() || 'Online Credential',
        date: '2026',
        skillsCovered: ['Python']
      }
    ]);
    setNewCertTitle('');
    setNewCertIssuer('');
  };

  const handleAddAchInOnboarding = () => {
    if (!newAchTitle.trim()) return;
    setAchievements((prev) => [
      ...prev,
      {
        id: `ach-onb-${Date.now()}`,
        title: newAchTitle.trim(),
        category: newAchCategory,
        date: '2026',
        description: 'Added during PRISM onboarding.'
      }
    ]);
    setNewAchTitle('');
  };

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center mx-auto">
            <PrismIcon size={28} />
          </div>
          <div>
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
              PRISM Career Intelligence
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {ANALYSIS_STEPS[analysisStepIndex]}
            </h2>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${((analysisStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-2 text-left pt-2">
            {ANALYSIS_STEPS.map((label, idx) => (
              <div
                key={label}
                className={`flex items-center gap-2.5 text-xs transition-opacity duration-200 ${
                  idx <= analysisStepIndex
                    ? 'text-slate-800 dark:text-slate-200 font-medium opacity-100'
                    : 'text-slate-400 dark:text-slate-600 opacity-50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    idx < analysisStepIndex
                      ? 'bg-emerald-600 text-white'
                      : idx === analysisStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {idx < analysisStepIndex ? '✓' : idx + 1}
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <PrismIcon size={22} />
            <span>PRISM</span>
          </Link>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            Skip to Dashboard →
          </button>
        </div>

        {/* Step Counter & Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Step {step} of 6</span>
            <span className="font-mono tabular-nums">{Math.round((step / 6) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Step 01 · About You
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Let&apos;s start with where you are right now.
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter your academic details below to personalize your career intelligence profile.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Branch / Major
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Year
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setYear(yr)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors ${
                          year === yr
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Step 02 · Where Do You Want To Go?
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Pick your target career role.
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  PRISM measures your skill gaps against the real bar for this specific role.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {CAREER_GOALS.map((goal) => {
                  const isSelected = careerGoal === goal && !customGoal.trim();
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        setCareerGoal(goal);
                        setCustomGoal('');
                      }}
                      className={`p-4 rounded-xl text-left border transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'bg-slate-50/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm">{goal}</span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Or type a custom career goal:
                </label>
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g. Robotics Software Engineer, Product Engineer..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Step 03 · What Do You Know?
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Select your skills and honest proficiency level.
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Being honest about Beginner skills helps PRISM give you a realistic starting point.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_SKILL_CATALOG.map((item) => {
                  const active = Boolean(selectedSkills[item.name]);
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleSkill(item.name)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {active ? `✓ ${item.name}` : `+ ${item.name}`}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {Object.entries(selectedSkills).map(([skillName, level]) => (
                  <div
                    key={skillName}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800"
                  >
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {skillName}
                    </span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setSkillLevel(skillName, lvl)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            level === lvl
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Step 04 · What Have You Built?
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Add projects you have completed or started.
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Projects are proof that you can actually apply what you learn.
                </p>
              </div>

              <div className="space-y-2.5">
                {projects
                  .filter((p) => p.status !== 'Recommended')
                  .map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {proj.name}{' '}
                          <span className="text-xs font-normal text-slate-500">
                            · {proj.status}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {proj.technologies.join(' · ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProjects((prev) => prev.filter((p) => p.id !== proj.id))}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${proj.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Add another project
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="Project name"
                    className="px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={newProjTech}
                    onChange={(e) => setNewProjTech(e.target.value)}
                    placeholder="Technologies (comma separated, e.g. Python, ML)"
                    className="px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <input
                  type="text"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Short description of what it does"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={newProjStatus}
                      onChange={(e) => setNewProjStatus(e.target.value as 'Completed' | 'In Progress')}
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                    <input
                      type="text"
                      value={newProjGithub}
                      onChange={(e) => setNewProjGithub(e.target.value)}
                      placeholder="GitHub URL (optional)"
                      className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProjectInOnboarding}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Step 05 · What Have You Achieved?
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Certificates, hackathons &amp; milestones.
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add what you have so far — even one hackathon or coding milestone counts.
                </p>
              </div>

              <div className="space-y-2">
                {certificates.map((c) => (
                  <div
                    key={c.id}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">{c.title}</strong> · {c.issuer}
                    </span>
                    <span className="text-slate-400">Certificate</span>
                  </div>
                ))}
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">{a.title}</strong>
                    </span>
                    <span className="text-slate-400">{a.category}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-semibold">Add Certificate</p>
                  <input
                    type="text"
                    value={newCertTitle}
                    onChange={(e) => setNewCertTitle(e.target.value)}
                    placeholder="Certificate title"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={newCertIssuer}
                    onChange={(e) => setNewCertIssuer(e.target.value)}
                    placeholder="Issuer (e.g. Coursera, NPTEL)"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddCertInOnboarding}
                    className="w-full py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                  >
                    + Add Certificate
                  </button>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-semibold">Add Hackathon / Competition</p>
                  <input
                    type="text"
                    value={newAchTitle}
                    onChange={(e) => setNewAchTitle(e.target.value)}
                    placeholder="e.g. Smart Campus Hackathon Finalist"
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <select
                    value={newAchCategory}
                    onChange={(e) => setNewAchCategory(e.target.value as 'Hackathon' | 'Competition' | 'Achievement')}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Competition">Competition</option>
                    <option value="Achievement">Achievement</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAchInOnboarding}
                    className="w-full py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                  >
                    + Add Milestone
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Step 06 · What Interests You?
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  What kind of work excites you most?
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We use your interests to match you with relevant projects, hackathons, and internships.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {INTEREST_OPTIONS.map((item) => {
                  const selected = interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {selected ? `✓ ${item}` : item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step Navigation Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAnalyzing(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                <span>Build My PRISM Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
