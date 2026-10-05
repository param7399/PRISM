import React, { useState } from 'react';
import { Briefcase, Check, Plus } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { Opportunity, OpportunityCategory } from '../types';
import { Modal } from '../components/common/Modal';

const CATEGORIES: ('All' | OpportunityCategory)[] = [
  'All',
  'Internships',
  'Hackathons',
  'Competitions',
  'Scholarships',
  'Certifications'
];

export const OpportunitiesPage: React.FC = () => {
  const { matchedOpportunities, applyToOpportunity, addItemToRoadmap, addOpportunityToNextActions } = usePrism();
  const [selectedCategory, setSelectedCategory] = useState<'All' | OpportunityCategory>('All');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  const filtered =
    selectedCategory === 'All'
      ? matchedOpportunities
      : matchedOpportunities.filter((o) => o.category === selectedCategory);

  const activeOpp = selectedOpp
    ? matchedOpportunities.find((o) => o.id === selectedOpp.id) || selectedOpp
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Opportunities for You
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Not every opportunity is worth applying to. These match your current profile and portfolio evidence.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Demo Data Only · Matched to your real-time skill scores
        </span>
      </div>

      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center max-w-md mx-auto">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Nothing is a strong match right now.
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Improve your top skill gaps and check again.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((opp) => {
            const missingSkills = opp.skills.filter((s) => !s.met);
            return (
              <article
                key={opp.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {opp.category} · {opp.organization} · Demo Data
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0">
                      {opp.matchPercentage}% match
                    </span>
                  </div>

                  <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                    {opp.title}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                    <span>Type: {opp.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Stipend/Reward: {opp.rewardOrStipend}</span>
                    <span aria-hidden="true">·</span>
                    <span>Deadline: {opp.deadline}</span>
                  </div>

                  {/* Skills Checklist */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                      Required skills check:
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono">
                      {opp.skills.map((req) => (
                        <span
                          key={req.name}
                          className={
                            req.met
                              ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                              : 'text-amber-600 dark:text-amber-400'
                          }
                        >
                          {req.name} {req.met ? '✓' : '○'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Why match & What's missing */}
                  <div className="mt-4 space-y-2 text-xs leading-relaxed">
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">
                        Why you&apos;re a match:{' '}
                      </strong>
                      {opp.whyMatch}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong className="text-amber-700 dark:text-amber-400">
                        What you&apos;re missing:{' '}
                      </strong>
                      {opp.whatMissing}
                    </p>
                    {missingSkills.length > 0 && (
                      <p className="pt-1 font-medium text-amber-700 dark:text-amber-400">
                        &ldquo;You&apos;re close, but improve{' '}
                        {missingSkills.length === 1
                          ? `this skill (${missingSkills[0].name})`
                          : `these ${missingSkills.length} skills (${missingSkills.map((s) => s.name).join(' & ')})`}{' '}
                        first.&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">{opp.location}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => addOpportunityToNextActions(opp.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>
                        {missingSkills.length > 0
                          ? 'Add preparation steps to Next Actions'
                          : 'Add to Next Actions'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOpp(opp)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
                    >
                      View Opportunity
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Opportunity Detail Modal */}
      {activeOpp && (
        <Modal
          isOpen={Boolean(activeOpp)}
          onClose={() => setSelectedOpp(null)}
          title={activeOpp.title}
          subtitle={`${activeOpp.organization} · ${activeOpp.matchPercentage}% Profile Match`}
          maxWidthClass="max-w-lg"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs font-mono">
              <div>
                <p className="text-slate-400">Stipend / Prize</p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {activeOpp.rewardOrStipend}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Deadline</p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {activeOpp.deadline}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Skill Breakdown
              </h3>
              <div className="flex flex-wrap gap-3 text-xs font-mono">
                {activeOpp.skills.map((s) => (
                  <span
                    key={s.name}
                    className={
                      s.met
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-amber-600 dark:text-amber-400'
                    }
                  >
                    {s.name} {s.met ? '✓' : '○'}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Why you&apos;re a match
                </p>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeOpp.whyMatch}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  What you&apos;re missing
                </p>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeOpp.whatMissing}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  addItemToRoadmap(
                    `Prep for ${activeOpp.title}`,
                    'Career',
                    activeOpp.whatMissing
                  );
                  setSelectedOpp(null);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Add Prep to Roadmap
              </button>

              <button
                type="button"
                onClick={() => {
                  applyToOpportunity(activeOpp.id);
                  setSelectedOpp(null);
                }}
                disabled={activeOpp.applied}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeOpp.applied
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {activeOpp.applied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Application Logged</span>
                  </>
                ) : (
                  <span>Log Application (Demo)</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
