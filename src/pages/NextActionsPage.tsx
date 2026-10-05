import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  Plus,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { usePrism, VALID_NEXT_ACTION_FILTERS } from '../context/PrismContext';
import { ActionStatus, NextAction } from '../types';
import { WhyRecommendationModal } from '../components/dashboard/WhyRecommendationModal';

export const NextActionsPage: React.FC = () => {
  const {
    student,
    readiness,
    nextBestAction,
    prioritizedActions,
    nextActionsFilter: selectedCategory,
    setNextActionsFilter: setSelectedCategory,
    lastActionChange,
    dismissActionChange,
    updateActionStatus,
    updateDailyTaskStatus,
    startNextAction,
    addItemToRoadmap
  } = usePrism();

  const [selectedForWhy, setSelectedForWhy] = useState<NextAction | null>(null);

  // Filter actions by selected category
  const categoryFiltered =
    selectedCategory === 'All'
      ? prioritizedActions
      : prioritizedActions.filter((a) => a.category === selectedCategory);

  // Weekly focus actions (3-5 main actions; if a specific category is selected, include all matching actions in that category)
  const weeklyActions =
    selectedCategory === 'All'
      ? categoryFiltered.filter((a) => a.timeframe !== 'quickwin').slice(0, 5)
      : categoryFiltered;

  // Quick wins (10-30 min profile & practice actions)
  const quickWins = prioritizedActions.filter((a) => a.timeframe === 'quickwin');

  const dailyTasks = student.dailyTasks || [];

  // Milestone calculation: Become Internship Ready (Target 85%)
  const milestoneTarget = 85;
  const milestoneRemaining = Math.max(0, milestoneTarget - readiness);
  const milestoneProgress = Math.min(100, Math.round((readiness / milestoneTarget) * 100));

  const mlScore = student.skills.find((s) => s.name === 'Machine Learning')?.score ?? 45;
  const dsaScore = student.skills.find((s) => s.name === 'DSA')?.score ?? 61;
  const hasCompletedAIProject = student.projects.some(
    (p) =>
      p.status === 'Completed' &&
      (p.technologies.includes('AI') ||
        p.technologies.includes('RAG') ||
        p.skillsDemonstrated.includes('Machine Learning'))
  );
  const resumeDone = student.nextActions.some(
    (a) => a.id === 'act-month-resume' && a.completed
  );
  const appliedInternships = student.applicationsCount >= 5;

  const milestoneSteps = [
    {
      label: '1. Improve Machine Learning',
      done: mlScore >= 52,
      isCurrentFocus: nextBestAction.id === 'act-ml-fundamentals'
    },
    {
      label: '2. Build one strong AI project',
      done: hasCompletedAIProject,
      isCurrentFocus:
        nextBestAction.id === 'act-week-classification' || nextBestAction.category === 'Build'
    },
    {
      label: '3. Improve DSA',
      done: dsaScore >= 70,
      isCurrentFocus: nextBestAction.skill === 'DSA'
    },
    {
      label: '4. Prepare resume',
      done: resumeDone,
      isCurrentFocus: nextBestAction.id === 'act-month-resume'
    },
    {
      label: '5. Start internship applications',
      done: appliedInternships,
      isCurrentFocus: nextBestAction.category === 'Opportunity'
    }
  ];

  const allCompleted = prioritizedActions.every((a) => a.completed);

  return (
    <div className="space-y-10">
      {/* 1. PAGE HEADER */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            What should I do next?
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            PRISM prioritizes the actions that will move you closest to your career goal.
          </p>
        </div>

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
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-emerald-100/60 dark:hover:bg-slate-800 self-end sm:self-center"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Context Strip: Career Goal · Career Readiness · Current Focus */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          <div className="pt-2 sm:pt-0 sm:px-2 first:pl-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">Career Goal</p>
            <p className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {student.careerGoal}
            </p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-6">
            <p className="text-xs text-slate-500 dark:text-slate-400">Career Readiness</p>
            <p className="mt-1 text-lg sm:text-xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {readiness}%
            </p>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-6">
            <p className="text-xs text-slate-500 dark:text-slate-400">Current Focus</p>
            <p className="mt-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {nextBestAction.skill || 'Machine Learning'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY NEXT BEST ACTION + ACTION SCORE */}
      <section aria-label="Primary Next Best Action">
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-600/80 dark:border-blue-500/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  NEXT BEST ACTION
                </span>
                <span aria-hidden="true">·</span>
                <span>Category: {nextBestAction.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  Priority: {nextBestAction.priority}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">Estimated time: {nextBestAction.estimatedTime}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  Expected impact: +{nextBestAction.expectedReadinessGain}% readiness
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {nextBestAction.title}
              </h2>

              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Why now?</p>
                <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {nextBestAction.whyNow}
                </p>
              </div>
            </div>

            {/* Action Score Box (92/100 breakdown) */}
            <div className="lg:w-72 shrink-0 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-baseline justify-between border-b border-slate-200/70 dark:border-slate-700 pb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Next Action Score
                </span>
                <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {nextBestAction.actionScore}/100
                </span>
              </div>
              <div className="space-y-1 text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                <div className="flex justify-between">
                  <span>Career relevance</span>
                  <span>40%</span>
                </div>
                <div className="flex justify-between">
                  <span>Skill gap impact</span>
                  <span>30%</span>
                </div>
                <div className="flex justify-between">
                  <span>Current skill fit</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Time efficiency</span>
                  <span>10%</span>
                </div>
                <div className="pt-1 border-t border-slate-200/70 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Total Match</span>
                  <span>{nextBestAction.actionScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons & Status Selector */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => startNextAction(nextBestAction.id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
              >
                <Play className="w-4 h-4" />
                <span>Start Action</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedForWhy(nextBestAction)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span>Why this?</span>
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
            </div>

            {/* Action Status Segmented Control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
              {(['Not Started', 'In Progress', 'Completed'] as ActionStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateActionStatus(nextBestAction.id, st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                    nextBestAction.status === st
                      ? st === 'Completed'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {st === 'Completed' ? '✓ Completed' : st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PERSONALIZED DAILY FOCUS & "IF YOU ONLY HAVE ONE HOUR TODAY" */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 5 cols: Your Focus Today + 1-Hour Moment */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {/* TODAY'S FOCUS */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                TODAY&apos;S FOCUS
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>45 minutes</span>
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Complete: Machine Learning — Supervised Learning
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Reason:</strong> This directly addresses your highest-priority skill gap.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => startNextAction(nextBestAction.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Start
              </button>
            </div>
          </section>

          {/* IF I ONLY HAVE ONE HOUR TODAY */}
          <section className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-blue-400">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>If I only have one hour today...</span>
              </span>
              <span className="text-slate-400">45–60 minutes</span>
            </div>
            <h3 className="text-lg font-bold">Solve 5 DSA problems</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Reason:</strong> Your DSA readiness is below the
              target for your career goal, and this is a useful action you can complete today.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => updateDailyTaskStatus('daily-dsa-5', 'In Progress')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                Start
              </button>
            </div>
          </section>
        </div>

        {/* Right 7 cols: GOOD THINGS TO DO TODAY (Checklist with Not Started / In Progress / Completed) */}
        <section className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Good things to do today
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Small daily wins that compound into higher career readiness.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {dailyTasks.filter((t) => t.status === 'Completed').length}/{dailyTasks.length} completed
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {dailyTasks.map((task) => {
                const isDone = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <p
                        className={`text-sm font-semibold ${
                          isDone
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isDone ? '✓ ' : '□ '}
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {task.duration} · Boosts {task.skill} (+{task.skillGain}%) · +{task.readinessGain}% readiness
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto shrink-0">
                      {(['Not Started', 'In Progress', 'Completed'] as ActionStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateDailyTaskStatus(task.id, st)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                              task.status === st
                                ? st === 'Completed'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Completing any daily action immediately updates your skill score and recalculates readiness.
          </p>
        </section>
      </div>

      {/* 4. ACTION CATEGORIES FILTER + YOUR FOCUS THIS WEEK */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Focus This Week
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritized by PRISM&apos;s skill dependency chain (Python → NumPy/Pandas → ML → Projects → Internships).
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter actions by category"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl w-fit"
          >
            {VALID_NEXT_ACTION_FILTERS.map((cat) => {
              const count =
                cat === 'All'
                  ? prioritizedActions.filter((a) => a.timeframe !== 'quickwin').length
                  : prioritizedActions.filter((a) => a.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`font-mono text-[10px] tabular-nums ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {weeklyActions.length === 0 || allCompleted ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center max-w-lg mx-auto space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedCategory === 'All'
                ? "You're all caught up."
                : `No pending ${selectedCategory} actions right now.`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {selectedCategory === 'All'
                ? "PRISM doesn't think you need another task right now. Keep building and check back after your next progress update."
                : `You have no active tasks in the ${selectedCategory} category right now. Switch back to All to view your prioritized weekly actions.`}
            </p>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Show All Categories
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {weeklyActions.map((action, index) => {
              const isDone = action.status === 'Completed';
              return (
                <article
                  key={action.id}
                  className={`rounded-2xl p-6 bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                    isDone
                      ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {index + 1}. {action.category.toUpperCase()}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>{action.impactLabel || `${action.impact} Impact`}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="font-mono">{action.estimatedTime}</span>
                      </div>
                      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                        Score: {action.actionScore}/100
                      </span>
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold ${
                        isDone
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isDone ? '✓ ' : ''}
                      {action.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {action.whyNow}
                    </p>

                    {/* Skill Gained & Progress Bar */}
                    <div className="pt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Skill gained:{' '}
                          <strong className="text-slate-800 dark:text-slate-200">
                            {action.skill} (+{action.skillBoost}%)
                          </strong>
                        </span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          {action.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isDone ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${action.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Status selector + Why this? */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                      {(['Not Started', 'In Progress', 'Completed'] as ActionStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateActionStatus(action.id, st)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                              action.status === st
                                ? st === 'Completed'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedForWhy(action)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why this?</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. QUICK WINS + 6. YOUR NEXT MILESTONE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 cols: Quick Wins (10–30 minutes) */}
        <section className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-baseline justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Wins</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                10–30 minute improvements that strengthen your profile without overwhelming you.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Small / Medium Impact</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {quickWins.map((qw) => {
              const isDone = qw.completed;
              return (
                <div
                  key={qw.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isDone
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {qw.title}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Est. {qw.estimatedTime} · Impact: {qw.impact} · +{qw.expectedReadinessGain}% readiness
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateActionStatus(qw.id, isDone ? 'Not Started' : 'Completed')
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white'
                    }`}
                  >
                    {isDone ? '✓ Completed' : 'Complete'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right 6 cols: YOUR NEXT MILESTONE */}
        <section className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                <Target className="w-3.5 h-3.5" />
                <span>NEXT MILESTONE</span>
              </div>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                Internship Ready
              </h2>
            </div>

            <div className="flex items-center gap-4 text-right font-mono text-xs tabular-nums">
              <div>
                <p className="text-slate-400">Current</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{readiness}%</p>
              </div>
              <div>
                <p className="text-slate-400">Target</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {milestoneTarget}%
                </p>
              </div>
              <div>
                <p className="text-slate-400">Remaining</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  {milestoneRemaining}%
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Milestone progress</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                {milestoneProgress}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
              Actions needed:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm">
              {milestoneSteps.map((step) => (
                <li
                  key={step.label}
                  className={`flex items-center justify-between py-2 px-3.5 rounded-xl border ${
                    step.done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/70 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : step.isCurrentFocus
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 text-slate-900 dark:text-white font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{step.label}</span>
                  <span className="font-mono text-xs">
                    {step.done
                      ? '✓ Done'
                      : step.isCurrentFocus
                      ? '★ Next Best Action'
                      : 'In queue'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {milestoneRemaining === 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Milestone reached! You are now at 85%+ Internship Readiness.</span>
            </div>
          )}
        </section>
      </div>

      {selectedForWhy && (
        <WhyRecommendationModal
          isOpen={Boolean(selectedForWhy)}
          onClose={() => setSelectedForWhy(null)}
          action={selectedForWhy}
          onStartAction={() => startNextAction(selectedForWhy.id)}
        />
      )}
    </div>
  );
};
