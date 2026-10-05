import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Circle, Zap } from 'lucide-react';
import { usePrism } from '../context/PrismContext';

export const RoadmapPage: React.FC = () => {
  const { student, readiness, nextBestAction, toggleRoadmapItem, toggleNextActionComplete } = usePrism();

  const getMatchingStageId = () => {
    const skillLower = (nextBestAction.skill || '').toLowerCase();
    if (nextBestAction.category === 'Build') return 'stage-06';
    if (nextBestAction.category === 'Career' || nextBestAction.category === 'Opportunity') return 'stage-07';
    if (skillLower.includes('python') || skillLower.includes('git')) return 'stage-01';
    if (skillLower.includes('machine learning')) return 'stage-03';
    if (skillLower.includes('deep learning')) return 'stage-04';
    if (skillLower.includes('generative') || skillLower.includes('llm')) return 'stage-05';
    return 'stage-03';
  };

  const activeStageForNextAction = getMatchingStageId();

  const totalItems = student.roadmap.reduce((acc, st) => acc + st.items.length, 0);
  const completedItems = student.roadmap.reduce(
    (acc, st) => acc + st.items.filter((i) => i.completed).length,
    0
  );
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
            Target Path: {student.careerGoal}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Career Roadmap
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Your step-by-step path from current baseline to internship and placement readiness. Click any topic to mark it completed.
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Roadmap Milestones Completed
          </p>
          <p className="mt-0.5 text-xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
            {completedItems} / {totalItems} ({overallProgress}%) · Readiness {readiness}%
          </p>
        </div>
      </div>

      {/* Vertical Stage Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-800 space-y-8">
        {student.roadmap.map((stage) => {
          const isCurrent = stage.status === 'Current';
          const isCompleted = stage.status === 'Completed';

          return (
            <div key={stage.id} className="relative">
              {/* Timeline Node Indicator */}
              <div
                className={`absolute -left-[33px] sm:-left-[41px] top-6 w-4 h-4 rounded-full border-2 ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-100 dark:ring-blue-950'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                }`}
              />

              <section
                className={`rounded-2xl p-6 transition-all ${
                  isCurrent
                    ? 'bg-white dark:bg-slate-900 border-2 border-blue-600/80 dark:border-blue-500/80 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        Stage {stage.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : isCurrent
                            ? 'text-blue-600 dark:text-blue-400 font-semibold'
                            : 'text-slate-400'
                        }
                      >
                        {stage.status}
                      </span>
                    </div>
                    <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {stage.number} {stage.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {stage.subtitle}
                    </p>
                  </div>

                  <div className="text-xs font-mono text-slate-500 tabular-nums">
                    {stage.items.filter((i) => i.completed).length}/{stage.items.length} done
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stage.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleRoadmapItem(stage.id, item.id)}
                      className={`p-3.5 rounded-xl text-left border transition-colors flex items-start gap-3 ${
                        item.completed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60'
                          : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-blue-400'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.completed ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold ${
                            item.completed
                              ? 'text-slate-700 dark:text-slate-300'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Highlight current Next Best Action inside its matching Roadmap Stage */}
                {stage.id === activeStageForNextAction && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span>CURRENT NEXT BEST ACTION IN THIS STAGE</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {nextBestAction.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {nextBestAction.estimatedTime} · +{nextBestAction.expectedReadinessGain}% readiness impact
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleNextActionComplete(nextBestAction.id)}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
                      >
                        {nextBestAction.completed ? 'Completed' : 'Complete Action'}
                      </button>
                      <Link
                        to="/next-actions"
                        className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            </div>
          );
        })}
      </div>
    </div>
  );
};
