import React from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { ReadinessChart } from '../components/charts/ReadinessChart';
import { generateCareerInsight, calculateReadinessBreakdown } from '../services/aiService';

export const AnalyticsPage: React.FC = () => {
  const { analytics, student, profileStrength } = usePrism();
  const dynamicInsight = generateCareerInsight(student);
  const readinessPillars = calculateReadinessBreakdown(student);

  const completedActionsCount = student.nextActions.filter((a) => a.completed).length;
  const totalActionsCount = student.nextActions.length;
  const strongOrOnTrackSkills = student.skills.filter((s) => s.score >= 60).length;

  const metrics = [
    { label: 'Career Readiness', value: `${analytics.currentReadiness}%`, unit: `target ${analytics.targetReadiness}%` },
    { label: 'Skill Growth', value: `${strongOrOnTrackSkills}/${student.skills.length}`, unit: 'on track' },
    { label: 'Project Growth', value: analytics.projectsCompleted, unit: 'completed' },
    { label: 'Learning Progress', value: analytics.learningHours, unit: 'hrs logged' },
    { label: 'Action Completion', value: `${completedActionsCount}/${totalActionsCount}`, unit: 'completed' },
    { label: 'Profile Strength', value: `${profileStrength}%`, unit: 'verified' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Career Analytics &amp; Progress
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Are you actually getting closer to your {student.careerGoal} goal?
        </p>
      </div>

      {/* PRISM INSIGHT Box (Section 14) */}
      <section
        aria-label="PRISM Insight"
        className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/70 space-y-2"
      >
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 dark:text-blue-300 uppercase">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>PRISM INSIGHT</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
          &ldquo;{dynamicInsight}&rdquo;
        </p>
      </section>

      {/* Top Readiness & 5-Pillar Breakdown Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>
                You&apos;ve improved your readiness by {analytics.fourMonthImprovement}% over the last four months.
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              PRISM Career Readiness: {analytics.currentReadiness}%
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Demo estimate based on your profile, skills, projects and career goal.
            </p>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Month 1 (48%) → Month 2 (57%) → Month 3 (64%) → Month 4 ({analytics.currentReadiness}%)
            </p>
          </div>

          <div className="flex items-center gap-8 shrink-0 font-mono tabular-nums">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
              <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {analytics.currentReadiness}%
              </p>
            </div>
            <div className="pl-8 border-l border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Target</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                {analytics.targetReadiness}%
              </p>
            </div>
          </div>
        </div>

        {/* 5-Pillar Breakdown */}
        <div className="pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {readinessPillars.map((pillar) => (
            <div
              key={pillar.name}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {pillar.name}
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {pillar.score}%
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {pillar.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Career Readiness Over Time
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Measured from completed projects, verified skill improvements, and roadmap milestones
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            +{analytics.fourMonthImprovement}% total gain
          </span>
        </div>

        <div className="mt-6">
          <ReadinessChart data={analytics.history} target={analytics.targetReadiness} />
        </div>
      </section>

      {/* 6 Core Progress Counters */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-1.5 font-mono tabular-nums">
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{m.value}</span>
            </div>
            <p className="mt-0.5 text-[11px] font-mono text-slate-400">{m.unit}</p>
          </div>
        ))}
      </section>

      {/* Strengths vs Needs Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2>Strengths</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {analytics.strengths.map((str) => (
              <li
                key={str}
                className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-200"
              >
                <span className="font-medium">{str}</span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  Consistent edge
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your Python proficiency (82%) and willingness to build practical apps give you a head start over peers who only watch lectures.
          </p>
        </section>

        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2>Needs Attention</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {analytics.needsAttention.map((item) => (
              <li
                key={item}
                className="flex items-center justify-between text-sm text-slate-800 dark:text-slate-200"
              >
                <span className="font-medium">{item}</span>
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  Priority focus
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Machine Learning and Deep Learning are the main blockers between your current 72% score and the 85% target for AI/ML interviews.
          </p>
        </section>
      </div>
    </div>
  );
};
