import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, Lock, ArrowRight, Zap } from 'lucide-react';
import { Student } from '../../types';

export type JourneyNodeState = 'Completed' | 'In Progress' | 'Needs Attention' | 'Locked / Future';

interface JourneyNode {
  id: string;
  title: string;
  subtitle: string;
  skillKey: string;
  state: JourneyNodeState;
  scoreText: string;
  whyItMatters: string;
  recommendedStep: string;
}

interface SkillJourneyGraphProps {
  student: Student;
  onPrioritizeNode?: (skillName: string, recommendedStep: string, whyItMatters: string) => void;
}

export const SkillJourneyGraph: React.FC<SkillJourneyGraphProps> = ({
  student,
  onPrioritizeNode
}) => {
  const getSkillScore = (name: string) =>
    student.skills.find((s) => s.name.toLowerCase() === name.toLowerCase())?.score ?? 0;

  const pythonScore = getSkillScore('Python');
  const sqlScore = getSkillScore('SQL');
  const mlScore = getSkillScore('Machine Learning');
  const dlScore = getSkillScore('Deep Learning');
  const llmScore = getSkillScore('LLMs');
  const genaiScore = getSkillScore('Generative AI');

  const hasCompletedAIProject = student.projects.some(
    (p) =>
      p.status === 'Completed' &&
      (p.technologies.includes('RAG') ||
        p.technologies.includes('AI') ||
        p.skillsDemonstrated.includes('Machine Learning') ||
        p.skillsDemonstrated.includes('LLMs'))
  );

  const hasInProgressAIProject = student.projects.some(
    (p) =>
      p.status === 'In Progress' &&
      (p.technologies.includes('RAG') ||
        p.technologies.includes('AI') ||
        p.skillsDemonstrated.includes('Generative AI'))
  );

  const nodes: JourneyNode[] = [
    {
      id: 'node-python',
      title: 'Python',
      subtitle: 'Core Language & Scripting',
      skillKey: 'Python',
      state: pythonScore >= 75 ? 'Completed' : pythonScore >= 50 ? 'In Progress' : 'Needs Attention',
      scoreText: `${pythonScore}%`,
      whyItMatters: 'Foundation for data manipulation, ML libraries, and backend APIs.',
      recommendedStep: 'Build a FastAPI Model Serving Microservice'
    },
    {
      id: 'node-data',
      title: 'Data Handling',
      subtitle: 'NumPy, Pandas & SQL',
      skillKey: 'SQL',
      state: sqlScore >= 65 ? 'Completed' : sqlScore >= 45 ? 'In Progress' : 'Needs Attention',
      scoreText: `${sqlScore}%`,
      whyItMatters: 'Clean feature pipelines and SQL queries power every reliable ML model.',
      recommendedStep: 'Analytical Feature Store Queries on PostgreSQL'
    },
    {
      id: 'node-ml',
      title: 'Machine Learning',
      subtitle: 'Supervised & Evaluation',
      skillKey: 'Machine Learning',
      state:
        mlScore >= 70
          ? 'Completed'
          : mlScore >= 52
          ? 'In Progress'
          : 'Needs Attention',
      scoreText: `${mlScore}%`,
      whyItMatters: 'Machine Learning is a core requirement for your AI/ML career goal.',
      recommendedStep:
        mlScore < 52 ? 'Complete ML Fundamentals' : 'Build an Image Classification Project'
    },
    {
      id: 'node-dl',
      title: 'Deep Learning',
      subtitle: 'Neural Nets & PyTorch',
      skillKey: 'Deep Learning',
      state:
        dlScore >= 65
          ? 'Completed'
          : dlScore >= 40
          ? 'In Progress'
          : mlScore >= 52
          ? 'Needs Attention'
          : 'Locked / Future',
      scoreText: `${dlScore}%`,
      whyItMatters: 'Understanding neural architectures and training loops unlocks modern AI roles.',
      recommendedStep: 'Train a Custom CNN in PyTorch'
    },
    {
      id: 'node-llms',
      title: 'LLMs',
      subtitle: 'Transformers & Prompting',
      skillKey: 'LLMs',
      state:
        llmScore >= 65
          ? 'Completed'
          : llmScore >= 35
          ? 'In Progress'
          : mlScore >= 52
          ? 'Needs Attention'
          : 'Locked / Future',
      scoreText: `${llmScore}%`,
      whyItMatters: 'Working with context windows, embeddings, and tool calling is essential for GenAI roles.',
      recommendedStep: 'Document Q&A Pipeline with Citation Grounding'
    },
    {
      id: 'node-rag',
      title: 'RAG',
      subtitle: 'Embeddings & Retrieval',
      skillKey: 'Generative AI',
      state:
        genaiScore >= 65
          ? 'Completed'
          : genaiScore >= 35 || hasInProgressAIProject
          ? 'In Progress'
          : 'Locked / Future',
      scoreText: `${genaiScore}%`,
      whyItMatters: 'Retrieval-Augmented Generation grounds LLM outputs in real documents.',
      recommendedStep: 'Build an AI Study Assistant with RAG'
    },
    {
      id: 'node-projects',
      title: 'GenAI Projects',
      subtitle: 'End-to-End Proof',
      skillKey: 'Generative AI',
      state: hasCompletedAIProject
        ? 'Completed'
        : hasInProgressAIProject
        ? 'In Progress'
        : 'Needs Attention',
      scoreText: hasCompletedAIProject ? 'Proven' : '1 In Progress',
      whyItMatters: 'Projects are proof that you can actually apply what you learn.',
      recommendedStep: 'Complete & Deploy EcoLearn AI Quiz Module'
    },
    {
      id: 'node-internship',
      title: 'Internship',
      subtitle: `${student.careerGoal} Role`,
      skillKey: 'Machine Learning',
      state:
        mlScore >= 65 && hasCompletedAIProject
          ? 'In Progress'
          : 'Locked / Future',
      scoreText: 'Target 85%',
      whyItMatters: 'Your ultimate milestone: landing an AI/ML internship with strong project proof.',
      recommendedStep: 'Prepare for AI/ML Research & Product Intern role'
    }
  ];

  const [selectedId, setSelectedId] = useState<string>('node-ml');
  const activeNode = nodes.find((n) => n.id === selectedId) || nodes[2];

  const getBadgeStyle = (state: JourneyNodeState) => {
    switch (state) {
      case 'Completed':
        return {
          border: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20',
          badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-950/60',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        };
      case 'In Progress':
        return {
          border: 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20',
          badge: 'text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-950/60',
          icon: <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        };
      case 'Needs Attention':
        return {
          border: 'border-amber-400 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20',
          badge: 'text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        };
      default:
        return {
          border: 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 opacity-80',
          badge: 'text-slate-600 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800',
          icon: <Lock className="w-4 h-4 text-slate-400 shrink-0" />
        };
    }
  };

  return (
    <section
      aria-label="Interactive Career Dependency Skill Graph"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <p className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
            SKILL INTELLIGENCE GRAPH · CAREER DEPENDENCY PATH
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
            Your {student.careerGoal} Progression Chain
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            PRISM unlocks advanced topics only after foundational prerequisites are in place. Click any stage to inspect.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            Completed
          </span>
          <span className="inline-flex items-center gap-1.5 text-blue-700 dark:text-blue-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            In Progress
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Needs Attention
          </span>
          <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            Locked / Future
          </span>
        </div>
      </div>

      {/* Journey Chain Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {nodes.map((node, index) => {
          const style = getBadgeStyle(node.state);
          const isSelected = node.id === activeNode.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedId(node.id)}
              className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                style.border
              } ${
                isSelected
                  ? 'ring-2 ring-blue-600 dark:ring-blue-500 shadow-xs'
                  : 'hover:border-blue-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    0{index + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${style.badge}`}
                  >
                    {node.state}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {node.title}
                  </h3>
                  {style.icon}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {node.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Standing</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {node.scoreText}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Node Inspector Bar */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">
              {activeNode.title}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
              {activeNode.state} ({activeNode.scoreText})
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              Recommended: <strong className="text-slate-800 dark:text-slate-200">{activeNode.recommendedStep}</strong>
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeNode.whyItMatters}
          </p>
        </div>

        {onPrioritizeNode && activeNode.state !== 'Completed' && (
          <button
            type="button"
            onClick={() =>
              onPrioritizeNode(
                activeNode.skillKey,
                activeNode.recommendedStep,
                activeNode.whyItMatters
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 self-start sm:self-center whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Focus on {activeNode.title} Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  );
};
