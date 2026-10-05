import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CheckCircle2,
  FolderGit2,
  Layers,
  Plus,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { usePrism } from '../../context/PrismContext';
import { SkillCategory, SkillLevel } from '../../types';

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Level 1 · Explorer', min: 0, max: 40 },
  { level: 2, title: 'Level 2 · Foundation Builder', min: 40, max: 58 },
  { level: 3, title: 'Level 3 · Applied Developer', min: 58, max: 72 },
  { level: 4, title: 'Level 4 · Rising AI/ML Engineer', min: 72, max: 85 },
  { level: 5, title: 'Level 5 · Career-Ready Engineer', min: 85, max: 100 }
];

export const SkillLevelProgress: React.FC = () => {
  const { student, readiness, updateSkillLevel, updateProjectStatus } = usePrism();
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);

  // Calculate overall skill mastery score across all skills + project contribution
  const avgSkillScore =
    student.skills.length > 0
      ? Math.round(
          student.skills.reduce((sum, s) => sum + s.score, 0) / student.skills.length
        )
      : 50;

  const completedProjects = student.projects.filter((p) => p.status === 'Completed');
  const inProgressProjects = student.projects.filter((p) => p.status === 'In Progress');

  const projectMasteryBonus = Math.min(
    18,
    completedProjects.length * 5 + inProgressProjects.length * 2
  );
  const overallSkillMastery = Math.min(100, Math.round(avgSkillScore * 0.85 + projectMasteryBonus));

  const currentTier =
    LEVEL_THRESHOLDS.find(
      (t) => overallSkillMastery >= t.min && overallSkillMastery < t.max
    ) || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const nextTier =
    LEVEL_THRESHOLDS.find((t) => t.level === currentTier.level + 1) || currentTier;

  const tierProgressPercent =
    currentTier.max > currentTier.min
      ? Math.min(
          100,
          Math.max(
            5,
            Math.round(
              ((overallSkillMastery - currentTier.min) /
                (currentTier.max - currentTier.min)) *
                100
            )
          )
        )
      : 100;

  const categories: ('All' | SkillCategory)[] = [
    'All',
    'AI / ML',
    'Programming',
    'Core CS',
    'Frontend & Tools'
  ];

  const displayedSkills =
    selectedCategory === 'All'
      ? student.skills.slice(0, 6)
      : student.skills.filter((s) => s.category === selectedCategory);

  const handleQuickBoost = (skillId: string, currentScore: number) => {
    const nextScore = Math.min(96, currentScore + 5);
    const nextLevel: SkillLevel =
      nextScore >= 75 ? 'Advanced' : nextScore >= 55 ? 'Intermediate' : 'Beginner';
    setLastUpdatedId(skillId);
    updateSkillLevel(skillId, nextLevel, nextScore);
    setTimeout(() => setLastUpdatedId(null), 1800);
  };

  const handleCycleLevel = (skillId: string, currentLevel: SkillLevel) => {
    const nextLevel: SkillLevel =
      currentLevel === 'Beginner'
        ? 'Intermediate'
        : currentLevel === 'Intermediate'
        ? 'Advanced'
        : 'Beginner';
    const nextScore =
      nextLevel === 'Advanced' ? 84 : nextLevel === 'Intermediate' ? 66 : 40;
    setLastUpdatedId(skillId);
    updateSkillLevel(skillId, nextLevel, nextScore);
    setTimeout(() => setLastUpdatedId(null), 1800);
  };

  return (
    <section
      aria-label="Skill Level Progression Tracker"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6"
    >
      {/* Top Header & Current Skill Level Tier */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
            <Layers className="w-4 h-4" />
            <span>Skill Level &amp; Project Progression</span>
          </div>
          <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {currentTier.title}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tracks how your skill levels and completed projects move you toward {student.careerGoal} readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono tabular-nums">
          <div>
            <p className="text-xs text-slate-400">Overall Skill Mastery</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {overallSkillMastery}%
            </p>
          </div>
          <div className="pl-6 border-l border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">Projects Shipped</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {completedProjects.length}
              <span className="text-xs font-normal text-slate-500 ml-1">
                (+{projectMasteryBonus}% boost)
              </span>
            </p>
          </div>
          <div className="pl-6 border-l border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">Career Readiness</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {readiness}%
            </p>
          </div>
        </div>
      </div>

      {/* Master Skill Level Progress Bar with Milestone Markers */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Progression to {nextTier.title}
          </span>
          <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            {overallSkillMastery} / {nextTier.max} pts ({tierProgressPercent}% of current level)
          </span>
        </div>

        {/* Segmented Multi-Layer Progress Bar */}
        <div
          className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5"
          role="progressbar"
          aria-valuenow={overallSkillMastery}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall Skill Level Progress"
        >
          {/* Base skills contribution */}
          <div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-l-full transition-all duration-300"
            style={{ width: `${Math.max(10, overallSkillMastery - projectMasteryBonus)}%` }}
            title={`Skill Proficiency Base: ${overallSkillMastery - projectMasteryBonus}%`}
          />
          {/* Project completion bonus contribution */}
          <div
            className="h-full bg-emerald-500 rounded-r-full transition-all duration-300"
            style={{ width: `${projectMasteryBonus}%` }}
            title={`Project Completion Boost: +${projectMasteryBonus}%`}
          />
        </div>

        {/* Milestone Scale Labels */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-0.5">
          <span>0% Beginner</span>
          <span>40% Foundation</span>
          <span>58% Applied</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            72% Rising AI/ML
          </span>
          <span>85%+ Career-Ready</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block" />
            <span>Verified Skill Score ({overallSkillMastery - projectMasteryBonus}%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span>Project Proof Bonus (+{projectMasteryBonus}%)</span>
          </span>
        </div>
      </div>

      {/* Category Filter & Interactive Skill Level Bars */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link
            to="/skills"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
          >
            Manage all {student.skills.length} skills →
          </Link>
        </div>

        {/* Individual Skill Level Progress Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedSkills.map((skill) => {
            const isRecentlyUpdated = lastUpdatedId === skill.id;
            const percentOfTarget = Math.min(
              100,
              Math.round((skill.score / Math.max(1, skill.targetScore)) * 100)
            );

            const barColor =
              skill.level === 'Advanced'
                ? 'bg-emerald-600'
                : skill.level === 'Intermediate'
                ? 'bg-blue-600'
                : 'bg-amber-500';

            // Find projects that demonstrate this skill
            const linkedProjects = student.projects.filter(
              (p) =>
                p.status !== 'Recommended' &&
                (p.skillsDemonstrated.includes(skill.name) ||
                  p.technologies.includes(skill.name))
            );

            return (
              <div
                key={skill.id}
                className={`p-4 rounded-xl border transition-all duration-150 ${
                  isRecentlyUpdated
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {skill.name}
                      </h3>
                      {isRecentlyUpdated && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-3 h-3" />
                          <span>Updated!</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Level:{' '}
                      <strong className="text-slate-700 dark:text-slate-200">
                        {skill.level}
                      </strong>
                      <span aria-hidden="true"> · </span>
                      <span>{skill.status}</span>
                    </p>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {skill.score}%
                    </span>
                    <span className="text-xs text-slate-400"> / {skill.targetScore}%</span>
                  </div>
                </div>

                {/* Skill Progress Bar with Target Marker */}
                <div className="mt-3 space-y-1.5">
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-300`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>
                      {linkedProjects.length > 0
                        ? `Backed by: ${linkedProjects.map((p) => p.name).join(', ')}`
                        : 'No completed project proof yet'}
                    </span>
                    <span className="font-mono tabular-nums">{percentOfTarget}% of target</span>
                  </div>
                </div>

                {/* Quick Interactive Skill Progression Controls */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCycleLevel(skill.id, skill.level)}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Switch Level ({skill.level})
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickBoost(skill.id, skill.score)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Practice (+5%)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project-to-Skill Progression Footer Strip */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            {inProgressProjects.length > 0 ? (
              <span>
                <strong>In-Progress Project:</strong> {inProgressProjects[0].name} (
                {inProgressProjects[0].progress}%). Completing it will boost{' '}
                <strong>{inProgressProjects[0].skillsDemonstrated.join(', ')}</strong> by +8%.
              </span>
            ) : (
              <span>
                All active projects completed! Start the recommended{' '}
                <strong>AI Study Assistant</strong> project to boost LLMs &amp; Generative AI.
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {inProgressProjects.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                updateProjectStatus(inProgressProjects[0].id, 'Completed', 100)
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Complete {inProgressProjects[0].name} (+Skills)</span>
            </button>
          ) : (
            <Link
              to="/projects"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Next Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
