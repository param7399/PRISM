import React from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { NextAction } from '../../types';
import { usePrism } from '../../context/PrismContext';

interface WhyRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: NextAction;
  onStartAction: () => void;
}

export const WhyRecommendationModal: React.FC<WhyRecommendationModalProps> = ({
  isOpen,
  onClose,
  action,
  onStartAction
}) => {
  const { student } = usePrism();

  const targetSkillObj =
    student.skills.find((s) => s.name.toLowerCase() === (action.skill || '').toLowerCase()) ||
    student.skills.find((s) => s.name === 'Machine Learning');

  const currentScore = targetSkillObj ? targetSkillObj.score : 45;
  const targetScore = targetSkillObj ? targetSkillObj.targetScore : 80;
  const gapScore = Math.max(0, targetScore - currentScore);
  const completedProjectsCount = student.projects.filter(
    (p) => p.status !== 'Recommended'
  ).length;

  const reasons =
    action.whyReasons && action.whyReasons.length > 0
      ? action.whyReasons
      : [
          'You already know Python',
          'You have programming project experience',
          'Machine Learning is required for your selected career',
          'Closing this gap will significantly improve your readiness'
        ];

  const scoreBreakdown = action.scoreBreakdown || {
    careerRelevance: 38,
    skillGapImpact: 27,
    currentSkillFit: 18,
    timeEfficiency: 9
  };

  const metrics = action.metrics || {
    goalMatch: 94,
    gapImpact: 89,
    skillFit: 82,
    difficultyFit: 78
  };

  const prismConsidered = [
    'Career goal',
    'Current skill level',
    'Existing projects',
    'Skill gap',
    'Roadmap position',
    'Estimated effort'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Why is PRISM recommending this?"
      subtitle={action.title}
      maxWidthClass="max-w-xl"
    >
      <div className="space-y-6">
        {/* Plain Language Explanation */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">
            HERE&apos;S WHY PRISM CHOSE THIS
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
            You already know Python and have built projects. {action.skill || 'Machine Learning'} is the next logical step toward your selected career.
          </p>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {action.whyNow}
          </p>
        </div>

        {/* 4 Decision Metrics: Career relevance 94%, Skill gap impact 89%, Current skill fit 82%, Time efficiency 78% */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] text-slate-500">Career relevance</p>
            <p className="mt-1 text-lg font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {metrics.goalMatch}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] text-slate-500">Skill gap impact</p>
            <p className="mt-1 text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {metrics.gapImpact}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] text-slate-500">Current skill fit</p>
            <p className="mt-1 text-lg font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {metrics.skillFit}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] text-slate-500">Time efficiency</p>
            <p className="mt-1 text-lg font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {metrics.difficultyFit}%
            </p>
          </div>
        </div>

        {/* Current / Target / Gap Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <div>
            <p className="text-[11px] text-slate-500">Current</p>
            <p className="mt-1 text-base font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {currentScore}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Target</p>
            <p className="mt-1 text-base font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {targetScore}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Gap</p>
            <p className="mt-1 text-base font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {gapScore}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Priority</p>
            <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {action.priority}
            </p>
          </div>
          <div className="col-span-3 sm:col-span-1">
            <p className="text-[11px] text-slate-500">Projects active</p>
            <p className="mt-1 text-base font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {completedProjectsCount}
            </p>
          </div>
        </div>

        {/* What PRISM considered + Specific Reasons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5">
              What PRISM considered
            </h3>
            <ul className="space-y-1.5">
              {prismConsidered.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2.5">
              Profile signals matched
            </h3>
            <ul className="space-y-1.5">
              {reasons.map((reason) => (
                <li
                  key={reason}
                  className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                >
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next Action Score Breakdown */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Next Action Score Breakdown
            </span>
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {action.actionScore || 92}/100 ({action.actionScore || 92}%)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Career relevance (40%):</span>
              <span className="font-semibold">{scoreBreakdown.careerRelevance}/40</span>
            </div>
            <div className="flex justify-between">
              <span>Skill gap impact (30%):</span>
              <span className="font-semibold">{scoreBreakdown.skillGapImpact}/30</span>
            </div>
            <div className="flex justify-between">
              <span>Current skill fit (20%):</span>
              <span className="font-semibold">{scoreBreakdown.currentSkillFit}/20</span>
            </div>
            <div className="flex justify-between">
              <span>Time efficiency (10%):</span>
              <span className="font-semibold">{scoreBreakdown.timeEfficiency}/10</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expected readiness gain:{' '}
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              +{action.expectedReadinessGain}%
            </span>
          </p>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onStartAction();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Start Action
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
