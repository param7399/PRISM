import React, { useState, useMemo } from 'react';
import { ArrowUpRight, Plus, Zap } from 'lucide-react';
import { usePrism } from '../context/PrismContext';

type GapFilter = 'impact' | 'largest' | 'quick';

export const SkillGapsPage: React.FC = () => {
  const { student, readiness, gaps, nextBestAction, addItemToRoadmap, makeSkillNextAction, updateSkillLevel } = usePrism();
  const [filter, setFilter] = useState<GapFilter>('impact');

  const filteredGaps = useMemo(() => {
    const copy = [...gaps];
    if (filter === 'largest') {
      return copy.sort((a, b) => b.gap - a.gap);
    }
    if (filter === 'quick') {
      return copy.filter((g) => g.isQuickWin || g.gap <= 35).sort((a, b) => a.gap - b.gap);
    }
    return copy.sort((a, b) => b.impactScore - a.impactScore);
  }, [gaps, filter]);

  const handlePracticeBoost = (skillId: string, currentScore: number) => {
    const existing = student.skills.find((s) => s.id === skillId);
    if (!existing) return;
    const nextScore = Math.min(existing.targetScore, currentScore + 10);
    const nextLevel =
      nextScore >= 75 ? 'Advanced' : nextScore >= 55 ? 'Intermediate' : 'Beginner';
    updateSkillLevel(skillId, nextLevel, nextScore);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            What am I missing for my target career?
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            PRISM groups your missing skills into Critical, Important, and Minor gaps for {student.careerGoal}.
          </p>
        </div>

        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setFilter('impact')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filter === 'impact'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Highest Impact
          </button>
          <button
            type="button"
            onClick={() => setFilter('largest')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filter === 'largest'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Largest Gap
          </button>
          <button
            type="button"
            onClick={() => setFilter('quick')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filter === 'quick'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Quick Wins
          </button>
        </div>
      </div>

      {/* Top Goal & Readiness Banner + Critical / Important / Minor Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target Role Benchmark</p>
            <h2 className="mt-0.5 text-xl font-bold text-slate-900 dark:text-white">
              {student.careerGoal}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your biggest gap is {gaps[0]?.skillName || 'Machine Learning'}. Closing your Critical Gaps first will push your readiness past 80%.
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Current Readiness</p>
            <p className="mt-0.5 text-2xl sm:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {readiness}%
            </p>
          </div>
        </div>

        {/* Critical / Important / Minor Gaps Summary */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/70 dark:border-red-900/50 flex items-center justify-between">
            <div>
              <p className="font-bold text-red-700 dark:text-red-400">Critical Gaps</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">Core blockers for {student.careerGoal}</p>
            </div>
            <span className="text-lg font-mono font-bold text-red-700 dark:text-red-400 tabular-nums">
              {gaps.filter((g) => g.priority === 'High').length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 flex items-center justify-between">
            <div>
              <p className="font-bold text-amber-700 dark:text-amber-400">Important Gaps</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">Strengthens technical interview depth</p>
            </div>
            <span className="text-lg font-mono font-bold text-amber-700 dark:text-amber-400 tabular-nums">
              {gaps.filter((g) => g.priority === 'Medium').length}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">Minor Gaps</p>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">Polish &amp; secondary tools</p>
            </div>
            <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
              {gaps.filter((g) => g.priority === 'Low').length}
            </span>
          </div>
        </div>
      </div>

      {/* Ranked Gap List */}
      <div className="space-y-5">
        {filteredGaps.map((gapItem, index) => {
          const priorityLabel =
            gapItem.priority === 'High'
              ? 'Critical Gap'
              : gapItem.priority === 'Medium'
              ? 'Important Gap'
              : 'Minor Gap';

          const priorityColor =
            gapItem.priority === 'High'
              ? 'text-red-600 dark:text-red-400 font-semibold'
              : gapItem.priority === 'Medium'
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400';

          const canBoost = student.skills.some((s) => s.id === gapItem.skillId);

          return (
            <article
              key={gapItem.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5"
            >
              {/* Top line */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      0{index + 1}.
                    </span>
                    <span>{gapItem.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className={priorityColor}>{priorityLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Est. {gapItem.estimatedTime}</span>
                  </div>
                  <h3 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-white">
                    {gapItem.skillName}
                  </h3>
                </div>

                {/* Current / Target / Gap metrics */}
                <div className="flex items-center gap-5 font-mono text-xs sm:text-sm tabular-nums">
                  <div>
                    <span className="text-slate-400">Current: </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {gapItem.currentScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Target: </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {gapItem.targetScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Gap: </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {gapItem.gap}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual progress visual */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${gapItem.currentScore}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-200">Why it matters: </strong>
                  {gapItem.whyItMatters}
                </p>
              </div>

              {/* What to learn + Recommended Action */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                <div className="lg:col-span-7">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Topics to cover
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {gapItem.whatToLearn.join(' · ')}
                  </p>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Recommended Action
                    </p>
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      {gapItem.suggestedProject}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        makeSkillNextAction(
                          gapItem.skillName,
                          gapItem.suggestedProject,
                          gapItem.whyItMatters
                        )
                      }
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                        nextBestAction.skill.toLowerCase() === gapItem.skillName.toLowerCase()
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>
                        {nextBestAction.skill.toLowerCase() === gapItem.skillName.toLowerCase()
                          ? 'Current Next Best Action'
                          : 'Make This My Next Action'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        addItemToRoadmap(
                          `${gapItem.skillName}: ${gapItem.suggestedProject}`,
                          gapItem.skillName,
                          gapItem.whyItMatters
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Roadmap</span>
                    </button>

                    {canBoost && (
                      <button
                        type="button"
                        onClick={() => handlePracticeBoost(gapItem.skillId, gapItem.currentScore)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                      >
                        <span>Log Progress (+10%)</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
