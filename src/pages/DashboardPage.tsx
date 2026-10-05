import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  Info,
  Play,
  Plus,
  Sparkles,
  X,
  Zap
} from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { WhyRecommendationModal } from '../components/dashboard/WhyRecommendationModal';
import { SkillLevelProgress } from '../components/dashboard/SkillLevelProgress';
import { SkillRadar } from '../components/charts/SkillRadar';
import { Modal } from '../components/common/Modal';
import {
  generateCareerInsight,
  calculateProfileStrengthBreakdown
} from '../services/aiService';

export const DashboardPage: React.FC = () => {
  const {
    student,
    readiness,
    profileStrength,
    gaps,
    nextBestAction,
    prioritizedActions,
    matchedOpportunities,
    lastActionChange,
    dismissActionChange,
    startNextAction,
    addItemToRoadmap,
    toggleNextActionComplete
  } = usePrism();

  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [profileStrengthModalOpen, setProfileStrengthModalOpen] = useState(false);
  const navigate = useNavigate();

  const strengthBreakdown = calculateProfileStrengthBreakdown(student);
  const historyGroups: ('Today' | 'Yesterday' | 'This Week')[] = ['Today', 'Yesterday', 'This Week'];

  const getSkillScore = (name: string, fallback: number) => {
    const found = student.skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    return found ? found.score : fallback;
  };

  const highlightedSkills = [
    { tier: 'Strong', name: 'Python', score: getSkillScore('Python', 82), barClass: 'bg-emerald-600' },
    { tier: 'Good', name: 'SQL', score: getSkillScore('SQL', 68), barClass: 'bg-blue-600' },
    { tier: 'Growing', name: 'DSA', score: getSkillScore('DSA', 61), barClass: 'bg-blue-500' },
    { tier: 'Needs Work', name: 'Machine Learning', score: getSkillScore('Machine Learning', 45), barClass: 'bg-amber-500' },
    { tier: 'Beginner', name: 'LLMs', score: getSkillScore('LLMs', 20), barClass: 'bg-red-500' }
  ];

  // Top 3 things to focus on this week
  const threeThingsThisWeek = prioritizedActions
    .filter((a) => a.timeframe !== 'quickwin')
    .slice(0, 3);

  const currentStage =
    student.roadmap.find((st) => st.status === 'Current') || student.roadmap[2];
  const topOpportunities = matchedOpportunities.slice(0, 2);
  const mentorInsight = generateCareerInsight(student);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Sunday, October 4, 2026 · {student.college}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {student.name?.trim()
              ? `Good afternoon, ${student.name.trim()} 👋`
              : 'Good afternoon 👋'}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Here&apos;s what I&apos;d focus on next.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span>{student.degree}</span>
          <span aria-hidden="true"> · </span>
          <span>{student.branch}</span>
          <span aria-hidden="true"> · </span>
          <span>{student.year}</span>
        </div>
      </div>

      {/* Top 4 Key Indicators */}
      <section
        aria-label="Key Career Readiness Metrics"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800"
      >
        <div className="pt-2 sm:pt-0 sm:px-2 first:pl-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Career Goal</p>
          <p className="mt-1.5 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {student.careerGoal}
          </p>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Change target role →
          </button>
        </div>

        <div className="pt-2 sm:pt-0 sm:px-6">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              PRISM Career Readiness
            </p>
            <span
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-help"
              title="A demo readiness estimate based on your current profile and selected career goal."
              aria-label="A demo readiness estimate based on your current profile and selected career goal."
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {readiness}%
            </span>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
              +{Math.max(8, readiness - 64)}% this month
            </span>
          </div>
          <div className="mt-2.5 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${readiness}%` }}
            />
          </div>
        </div>

        <div className="pt-4 lg:pt-0 sm:px-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Profile Strength</p>
          <button
            type="button"
            onClick={() => setProfileStrengthModalOpen(true)}
            className="mt-1.5 text-left group flex items-baseline gap-2"
          >
            <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 tabular-nums transition-colors">
              {profileStrength}%
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:underline">
              Why {profileStrength}%?
            </span>
          </button>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {student.projects.filter((p) => p.status !== 'Recommended').length} active projects ·{' '}
            {student.skills.length} skills
          </p>
        </div>

        <div className="pt-4 lg:pt-0 sm:px-6">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Important Skill Gaps
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {gaps.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">identified</span>
          </div>
          <Link
            to="/gaps"
            className="mt-1.5 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            View missing skills →
          </Link>
        </div>
      </section>

      {/* Live PRISM Loop Demonstration Banner when an action is completed */}
      {lastActionChange && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span>YOUR NEXT ACTION CHANGED</span>
              {lastActionChange.skillChange && (
                <>
                  <span>·</span>
                  <span>{lastActionChange.skillChange}</span>
                </>
              )}
              <span>·</span>
              <span>
                Career Readiness: {lastActionChange.readinessFrom}% → {lastActionChange.readinessTo}%
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Completed &ldquo;{lastActionChange.previousTitle}&rdquo; → Next up:{' '}
              <span className="text-blue-600 dark:text-blue-400">{lastActionChange.newTitle}</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">{lastActionChange.reason}</p>
          </div>
          <button
            type="button"
            onClick={dismissActionChange}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 self-end sm:self-center"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Focal Card: YOUR NEXT BEST ACTION + 3 THINGS TO FOCUS ON */}
      <section aria-label="Your Next Best Action and Weekly Focus" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Your Next Best Action
          </h2>
          <Link
            to="/next-actions"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all actions →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Primary Next Best Action (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border-2 border-blue-600/80 dark:border-blue-500/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    NEXT BEST ACTION
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    Priority: {nextBestAction.priority.toUpperCase()}
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span>Skill gap: {nextBestAction.skill}</span>
                </div>
                <div className="font-mono tabular-nums">
                  <span>Estimated time: {nextBestAction.estimatedTime}</span>
                  <span aria-hidden="true"> · </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{nextBestAction.expectedReadinessGain}% readiness
                  </span>
                </div>
              </div>

              <h3 className="mt-3 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {nextBestAction.title}
              </h3>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Why now?</p>
                <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {nextBestAction.whyNow}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => startNextAction(nextBestAction.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
                >
                  <Play className="w-4 h-4" />
                  <span>{nextBestAction.status === 'In Progress' ? 'In Progress' : 'Start This'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWhyModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Why This?</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    addItemToRoadmap(
                      nextBestAction.title,
                      nextBestAction.skill,
                      nextBestAction.whyNow
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Roadmap</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleNextActionComplete(nextBestAction.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{nextBestAction.completed ? 'Completed' : 'Complete'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3 Things To Focus On This Week (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  THIS WEEK · 3 THINGS TO FOCUS ON
                </p>
              </div>

              <div className="mt-4 space-y-3.5">
                {threeThingsThisWeek.map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => toggleNextActionComplete(act.id)}
                    className="w-full text-left flex items-start gap-2.5 group"
                  >
                    {act.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold leading-snug ${
                          act.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}
                      >
                        {act.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {act.category} · {act.estimatedTime} · +{act.expectedReadinessGain}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/next-actions"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View all actions →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* "If you do only one thing today..." synchronized with decision engine */}
      <section className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <Zap className="w-3.5 h-3.5" />
            <span>If you do only one thing today...</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white">
            {nextBestAction.title}
          </p>
          <p className="text-xs text-slate-300">
            Focus on {nextBestAction.skill} ({nextBestAction.estimatedTime}) for an expected +{nextBestAction.expectedReadinessGain}% readiness boost.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => startNextAction(nextBestAction.id)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap"
          >
            Start Now
          </button>
          <Link
            to="/next-actions"
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors whitespace-nowrap"
          >
            Open Next Actions
          </Link>
        </div>
      </section>

      {/* Skill Level Progress Bar Component (Tracks Skill & Project Progression) */}
      <SkillLevelProgress />

      {/* Two-Column Section: YOUR SKILLS + CURRENT ROADMAP & MENTOR NOTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 columns: Clean Skill Overview */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Skills</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Where you stand across key building blocks for {student.careerGoal}
              </p>
            </div>
            <Link
              to="/skills"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              <span>View all skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-6 space-y-5">
            {highlightedSkills.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between text-sm">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {' '}
                      · {item.tier}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                    {item.score}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.barClass} rounded-full transition-all duration-300`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {mentorInsight}
            </p>
          </div>
        </section>

        {/* Right 5 columns: Active Roadmap Stage & Top Opportunities */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Roadmap Stage */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current Roadmap Stage</p>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {currentStage.number}. {currentStage.title}
                </h2>
              </div>
              <Link
                to="/roadmap"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Full roadmap →
              </Link>
            </div>
            <div className="mt-4 space-y-2.5">
              {currentStage.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span
                    className={
                      item.completed
                        ? 'text-slate-500 line-through'
                        : 'text-slate-800 dark:text-slate-200 font-medium'
                    }
                  >
                    {item.completed ? '✓ ' : '○ '}
                    {item.title}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.completed ? 'Done' : 'Up next'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Matched Opportunities Preview */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Matched Opportunities
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Filtered for your current profile
                </p>
              </div>
              <Link
                to="/opportunities"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                See all →
              </Link>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {topOpportunities.map((opp) => (
                <div key={opp.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {opp.title}
                    </p>
                    <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 tabular-nums">
                      {opp.matchPercentage}% match
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {opp.rewardOrStipend} · Deadline: {opp.deadline}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Lower Grid: Skill Radar vs Target Role + Activity History Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Skill Shape vs. {student.careerGoal} Target
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Solid blue shows your current standing; dashed gray shows the target benchmark for {student.careerGoal}.
              </p>
            </div>
            <Link
              to="/gaps"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              Analyze all {gaps.length} skill gaps →
            </Link>
          </div>

          <div className="mt-4">
            <SkillRadar skills={student.skills} />
          </div>
        </section>

        {/* Action History Timeline (Today / Yesterday / This Week) */}
        <section className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Activity History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Updates automatically as you complete actions and build projects
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {historyGroups.map((period) => {
              const items = (student.actionHistory || []).filter((h) => h.period === period);
              if (items.length === 0) return null;
              return (
                <div key={period} className="space-y-2">
                  <p className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {period}
                  </p>
                  <ul className="space-y-2">
                    {items.slice(0, 4).map((item) => (
                      <li
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-2 text-xs"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                            ✓
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {item.title}
                          </span>
                        </div>
                        {item.impactNote && (
                          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 shrink-0 tabular-nums">
                            {item.impactNote}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <WhyRecommendationModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        action={nextBestAction}
        onStartAction={() => startNextAction(nextBestAction.id)}
      />

      {/* Profile Strength Breakdown Modal */}
      <Modal
        isOpen={profileStrengthModalOpen}
        onClose={() => setProfileStrengthModalOpen(false)}
        title={`Profile Strength: ${profileStrength}%`}
        subtitle="Deterministic breakdown of your current profile evidence"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            PRISM calculates Profile Strength from your mapped skills, real project evidence, verified certificates, achievements, and career goal clarity.
          </p>
          <div className="space-y-3">
            {strengthBreakdown.items.map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.label}
                  </span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                    {item.score} / {item.max} pts
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="pt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setProfileStrengthModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Got it
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
