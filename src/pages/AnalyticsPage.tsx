import React from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { ReadinessChart } from '../components/charts/ReadinessChart';
import { generateCareerInsight } from '../services/aiService';

export const AnalyticsPage: React.FC = () => {
  const { analytics, student } = usePrism();
  const dynamicInsight = generateCareerInsight(student);

  const metrics = [
    { label: 'Learning Hours', value: analytics.learningHours, unit: 'hrs' },
    { label: 'Projects Completed', value: analytics.projectsCompleted, unit: 'shipped' },
    { label: 'Certificates', value: analytics.certificatesEarned, unit: 'earned' },
    { label: 'DSA Problems', value: analytics.dsaProblemsSolved, unit: 'solved' },
    { label: 'Applications', value: analytics.applicationsSubmitted, unit: 'sent' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Your Progress
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Are you actually getting closer?
        </p>
      </div>

      {/* Top Readiness & Insight Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>
              You&apos;ve improved your readiness by {analytics.fourMonthImprovement}% over the last four months.
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            4-Month Trajectory for {student.careerGoal}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Month 1 (48%) → Month 2 (57%) → Month 3 (64%) → Month 4 ({analytics.currentReadiness}%)
          </p>
          <p className="pt-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{dynamicInsight}</span>
          </p>
        </div>

        <div className="flex items-center gap-8 shrink-0 font-mono tabular-nums">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Career Readiness</p>
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

      {/* 5 Key Counters */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-1.5 font-mono tabular-nums">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{m.value}</span>
              <span className="text-xs text-slate-400">{m.unit}</span>
            </div>
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
