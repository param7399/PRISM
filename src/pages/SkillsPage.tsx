import React, { useState } from 'react';
import { Plus, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { Skill, SkillCategory, SkillLevel } from '../types';
import { Modal } from '../components/common/Modal';
import { evaluateSkillEvidence } from '../services/aiService';
import { SkillJourneyGraph } from '../components/skills/SkillJourneyGraph';

const CATEGORIES: SkillCategory[] = [
  'Programming',
  'Core CS',
  'AI / ML',
  'Frontend & Tools',
  'Soft Skills'
];

export const SkillsPage: React.FC = () => {
  const { student, updateSkillLevel, addNewSkill, addItemToRoadmap, makeSkillNextAction } = usePrism();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [addSkillModalOpen, setAddSkillModalOpen] = useState(false);

  // Add new skill form state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('AI / ML');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Beginner');

  // Keep modal skill synced with latest state
  const activeModalSkill = selectedSkill
    ? student.skills.find((s) => s.id === selectedSkill.id) || selectedSkill
    : null;

  const activeModalEval = activeModalSkill
    ? evaluateSkillEvidence(student, activeModalSkill)
    : null;

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addNewSkill(newSkillName.trim(), newSkillCategory, newSkillLevel);
    setNewSkillName('');
    setAddSkillModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Skills &amp; Evidence
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            PRISM separates what you know from what you have actually proven with projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddSkillModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Interactive Career Journey Skill Graph */}
      <SkillJourneyGraph
        student={student}
        onPrioritizeNode={(skillName, recommendedStep, whyItMatters) =>
          makeSkillNextAction(skillName, recommendedStep, whyItMatters)
        }
      />

      {/* Categories & Skill Cards */}
      <div className="space-y-10">
        {CATEGORIES.map((category) => {
          const categorySkills = student.skills.filter((s) => s.category === category);
          if (categorySkills.length === 0) return null;

          return (
            <section key={category} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{category}</h2>
                <span className="text-xs font-mono text-slate-500 tabular-nums">
                  {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categorySkills.map((skill) => {
                  const intel = evaluateSkillEvidence(student, skill);

                  const statusColor =
                    skill.status === 'Strong'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : skill.status === 'On Track' || skill.status === 'Growing'
                      ? 'text-blue-600 dark:text-blue-400'
                      : skill.status === 'Needs Work'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400';

                  const barColor =
                    skill.status === 'Strong'
                      ? 'bg-emerald-600'
                      : skill.status === 'On Track' || skill.status === 'Growing'
                      ? 'bg-blue-600'
                      : skill.status === 'Needs Work'
                      ? 'bg-amber-500'
                      : 'bg-red-500';

                  const evidenceColor =
                    intel.evidenceLevel === 'Strong'
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : intel.evidenceLevel === 'Moderate'
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-amber-600 dark:text-amber-400 font-semibold';

                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => setSelectedSkill(skill)}
                      className="text-left p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/70 dark:hover:border-blue-500/70 transition-all duration-150 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {skill.name}
                          </h3>
                          <span className={`text-xs font-mono font-bold tabular-nums ${statusColor}`}>
                            {skill.score}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2.5 space-y-1">
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${barColor} rounded-full transition-all duration-300`}
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                        </div>

                        {/* Structured Metadata Grid: Level, Career relevance, Evidence, Gap */}
                        <div className="mt-3.5 grid grid-cols-2 gap-y-1.5 gap-x-3 text-xs">
                          <div>
                            <span className="text-slate-400 dark:text-slate-500">Knowledge: </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {skill.level}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-500">Evidence: </span>
                            <span className={evidenceColor}>{intel.evidenceLevel}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-500">Relevance: </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {intel.careerRelevance}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 dark:text-slate-500">Gap: </span>
                            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                              {intel.gapSeverity} ({intel.gapPercent}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                        <span className="truncate">
                          <strong className="text-slate-800 dark:text-slate-200">Recommended: </strong>
                          {intel.recommendedAction}
                        </span>
                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Skill Detail Modal */}
      {activeModalSkill && activeModalEval && (
        <Modal
          isOpen={Boolean(activeModalSkill)}
          onClose={() => setSelectedSkill(null)}
          title={activeModalSkill.name}
          subtitle={`${activeModalSkill.category} · Relevance: ${activeModalEval.careerRelevance}`}
          maxWidthClass="max-w-xl"
        >
          <div className="space-y-6">
            {/* Current / Target / Gap row */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
                <p className="mt-1 text-xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {activeModalSkill.score}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target</p>
                <p className="mt-1 text-xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {activeModalSkill.targetScore}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gap ({activeModalEval.gapSeverity})</p>
                <p className="mt-1 text-xl font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {activeModalEval.gapPercent}%
                </p>
              </div>
            </div>

            {/* Knowledge vs Practical Evidence Box (Section 7) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Knowledge vs. Practical Evidence</span>
                </div>
                <div className="font-mono">
                  <span>Knowledge: <strong>{activeModalEval.knowledgeLevel}</strong></span>
                  <span aria-hidden="true"> · </span>
                  <span>Practical Evidence: <strong>{activeModalEval.evidenceLevel}</strong></span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalEval.knowledgeVsProofNote}
              </p>
            </div>

            {/* Interactive Skill Level / Score Recalculation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Update your current level (triggers live profile recalculation)
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => {
                  const scoreForLvl = lvl === 'Beginner' ? 45 : lvl === 'Intermediate' ? 65 : 84;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => updateSkillLevel(activeModalSkill.id, lvl, scoreForLvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                        activeModalSkill.level === lvl
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lvl} (~{scoreForLvl}%)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Why it matters */}
            <div>
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Why it matters
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalSkill.whyItMatters}
              </p>
            </div>

            {/* What you should learn */}
            <div>
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                What you should learn
              </h3>
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {activeModalSkill.topicsToLearn.map((topic) => (
                  <li
                    key={topic}
                    className="py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800"
                  >
                    · {topic}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Project & Time */}
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  Suggested project · Estimated: {activeModalSkill.estimatedDays}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                  {activeModalSkill.suggestedProject}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    makeSkillNextAction(
                      activeModalSkill.name,
                      activeModalSkill.suggestedProject,
                      activeModalSkill.whyItMatters
                    );
                    setSelectedSkill(null);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
                >
                  Make This My Next Action
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addItemToRoadmap(
                      `${activeModalSkill.name}: ${activeModalSkill.suggestedProject}`,
                      activeModalSkill.name,
                      `Close ${activeModalSkill.name} gap (${activeModalSkill.score}% → ${activeModalSkill.targetScore}%)`
                    );
                    setSelectedSkill(null);
                  }}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  Add to Roadmap
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Skill Modal */}
      <Modal
        isOpen={addSkillModalOpen}
        onClose={() => setAddSkillModalOpen(false)}
        title="Add a Skill to Your Profile"
        subtitle="PRISM will immediately recalculate your readiness and skill gaps."
      >
        <form onSubmit={handleAddSkillSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Skill Name
            </label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. PyTorch, Docker, FastAPI, System Design"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Current Proficiency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setNewSkillLevel(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                    newSkillLevel === lvl
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddSkillModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save &amp; Recalculate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
