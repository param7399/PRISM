import React, { useState } from 'react';
import { Plus, ExternalLink, Github, FolderGit2, CheckCircle2 } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { Project, ProjectStatus } from '../types';
import { Modal } from '../components/common/Modal';

type TabFilter = 'All' | ProjectStatus;

export const ProjectsPage: React.FC = () => {
  const { student, addProject, updateProjectStatus, addItemToRoadmap, addProjectToNextActions } = usePrism();
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Add project form state
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [techInput, setTechInput] = useState('Python, Scikit-Learn, Machine Learning');
  const [status, setStatus] = useState<'Completed' | 'In Progress'>('Completed');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const filteredProjects =
    activeTab === 'All'
      ? student.projects
      : student.projects.filter((p) => p.status === activeTab);

  const activeModalProject = selectedProject
    ? student.projects.find((p) => p.id === selectedProject.id) || selectedProject
    : null;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const technologies = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      name: name.trim(),
      shortDescription:
        shortDescription.trim() ||
        'Practical student engineering project built to close key skill gaps.',
      problem:
        problem.trim() ||
        'Needed hands-on implementation proof beyond theoretical coursework.',
      solution:
        solution.trim() ||
        `Built and tested using ${technologies.join(', ')} with clean evaluation metrics.`,
      technologies: technologies.length ? technologies : ['Python', 'Machine Learning'],
      skillsDemonstrated: technologies.length ? technologies : ['Python', 'Machine Learning'],
      status,
      progress: status === 'Completed' ? 100 : 50,
      githubUrl: githubUrl.trim() || 'https://github.com/demo-student/ml-project',
      demoUrl: demoUrl.trim() || undefined,
      difficulty: 'Intermediate',
      readinessBoost: 5
    });

    setName('');
    setShortDescription('');
    setProblem('');
    setSolution('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Projects
          </h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Projects are proof that you can actually use what you learn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Interactive Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl w-fit">
        {(['All', 'Completed', 'In Progress', 'Recommended'] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center max-w-md mx-auto">
          <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            You haven&apos;t added a project yet.
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Start with something you&apos;ve already built.
          </p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isRecommended = project.status === 'Recommended';
            const statusTextClass =
              project.status === 'Completed'
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                : project.status === 'In Progress'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-amber-600 dark:text-amber-400 font-semibold';

            return (
              <div
                key={project.id}
                className={`rounded-2xl p-6 bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                  isRecommended
                    ? 'border-blue-300 dark:border-blue-800'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className={statusTextClass}>
                      {project.status}
                      {project.matchPercentage ? ` · ${project.matchPercentage}% Match` : ''}
                    </span>
                    <span className="font-mono text-slate-500 tabular-nums">
                      {isRecommended
                        ? `Est. ${project.estimatedTime || '7 days'}`
                        : `${project.progress}% complete`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="mt-2 text-left group"
                  >
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </h2>
                  </button>

                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Unboxed technology metadata with typographic separators */}
                  <p className="mt-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                    {project.technologies.join(' · ')}
                  </p>

                  {isRecommended && project.whyRecommended && (
                    <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      &ldquo;{project.whyRecommended}&rdquo;
                    </p>
                  )}

                  {!isRecommended && (
                    <div className="mt-4 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          project.status === 'Completed' ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Details
                    </button>
                    {isRecommended && (
                      <>
                        <button
                          type="button"
                          onClick={() => addProjectToNextActions(project.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
                        >
                          Add to Next Actions
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateProjectStatus(project.id, 'In Progress', 25);
                            addItemToRoadmap(project.name, 'Portfolio', project.shortDescription);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                        >
                          Start Project
                        </button>
                      </>
                    )}
                    {project.status === 'In Progress' && (
                      <button
                        type="button"
                        onClick={() => updateProjectStatus(project.id, 'Completed', 100)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {activeModalProject && (
        <Modal
          isOpen={Boolean(activeModalProject)}
          onClose={() => setSelectedProject(null)}
          title={activeModalProject.name}
          subtitle={`${activeModalProject.status}${
            activeModalProject.matchPercentage ? ` · ${activeModalProject.matchPercentage}% Match` : ''
          }`}
          maxWidthClass="max-w-xl"
        >
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Problem</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalProject.problem}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-200">Solution</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeModalProject.solution}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Technologies
                </h4>
                <p className="mt-1 text-xs font-mono text-slate-600 dark:text-slate-400">
                  {activeModalProject.technologies.join(' · ')}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Skills demonstrated
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {activeModalProject.skillsDemonstrated.join(' · ')}
                </p>
              </div>
            </div>

            {activeModalProject.status === 'Recommended' ? (
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Why PRISM recommends this
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeModalProject.whyRecommended}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                  <span>Estimated time: {activeModalProject.estimatedTime || '8–10 days'}</span>
                  <span>Difficulty: {activeModalProject.difficulty || 'Intermediate'}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    +{activeModalProject.readinessBoost || 6}% Readiness
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="font-mono font-semibold">{activeModalProject.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${activeModalProject.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs">
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 hover:underline"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                {activeModalProject.demoUrl && (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {activeModalProject.status === 'Recommended' && (
                  <button
                    type="button"
                    onClick={() => {
                      addItemToRoadmap(
                        activeModalProject.name,
                        'Portfolio',
                        activeModalProject.whyRecommended
                      );
                      updateProjectStatus(activeModalProject.id, 'In Progress', 20);
                      setSelectedProject(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Add to Roadmap &amp; Start
                  </button>
                )}
                {activeModalProject.status === 'In Progress' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateProjectStatus(activeModalProject.id, 'Completed', 100);
                      setSelectedProject(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Mark as 100% Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add a Project"
        subtitle="Adding a Machine Learning or AI project will automatically boost your related skills and readiness."
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Image Classification Pipeline"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Python, Machine Learning, Scikit-Learn"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Short Summary
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="What does this project do?"
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Completed' | 'In Progress')}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                GitHub URL (optional)
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Project &amp; Recalculate
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
