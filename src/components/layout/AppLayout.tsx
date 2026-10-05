import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  Target,
  ListChecks,
  Map,
  FolderGit2,
  Briefcase,
  LineChart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { usePrism } from '../../context/PrismContext';
import { PrismIcon } from '../common/PrismLogo';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, highlight: false },
      { to: '/next-actions', label: 'Next Actions', icon: ListChecks, highlight: true },
      { to: '/skills', label: 'Skills', icon: Cpu, highlight: false },
      { to: '/gaps', label: 'Skill Gaps', icon: Target, highlight: false },
      { to: '/roadmap', label: 'Roadmap', icon: Map, highlight: false }
    ]
  },
  {
    label: 'My Work',
    items: [
      { to: '/projects', label: 'Projects', icon: FolderGit2, highlight: false },
      { to: '/opportunities', label: 'Opportunities', icon: Briefcase, highlight: false }
    ]
  },
  {
    label: 'Insights',
    items: [{ to: '/analytics', label: 'Analytics', icon: LineChart, highlight: false }]
  },
  {
    label: 'Account',
    items: [{ to: '/profile', label: 'Profile', icon: User, highlight: false }]
  }
];

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview / Dashboard',
  '/skills': 'Overview / My Skills',
  '/gaps': 'Overview / Skill Gaps',
  '/next-actions': 'Overview / Next Actions',
  '/recommendations': 'Overview / Next Actions',
  '/roadmap': 'Overview / Career Roadmap',
  '/projects': 'My Work / Projects',
  '/opportunities': 'My Work / Opportunities',
  '/analytics': 'Insights / Career Analytics',
  '/profile': 'Insights / Profile & Settings'
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { student, readiness, gaps, theme, toggleTheme, logout, resetDemoData } = usePrism();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const highPriorityGapsCount = Math.max(1, gaps.filter((g) => g.priority === 'High').length);
  const breadcrumb = ROUTE_TITLES[location.pathname] || 'PRISM Workspace';

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
          >
            <PrismIcon size={22} />
            <span>PRISM</span>
          </NavLink>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            {student.year}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto" aria-label="Sidebar Navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : item.highlight
                            ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/70 hover:bg-blue-100/80'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.highlight && (
                        <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-600/15 dark:bg-blue-400/20">
                          GPS
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Career Readiness Summary & Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Career Readiness
              </span>
              <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                {readiness}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${readiness}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Next milestone:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                85%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 leading-snug">
              {highPriorityGapsCount} skills away from Internship Ready
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
            <NavLink
              to="/profile"
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {(student.name || 'S').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {student.name || 'Student'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {student.careerGoal}
                </p>
              </div>
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[82vw] bg-white dark:bg-slate-900 h-full flex flex-col justify-between border-r border-slate-200 dark:border-slate-800">
            <div className="h-14 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
              >
                <PrismIcon size={20} />
                <span>PRISM</span>
              </NavLink>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`
                          }
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Career Readiness</span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  {readiness}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${readiness}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {highPriorityGapsCount} skills away from your next milestone
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Bar Contract (Workspace) */}
        <header className="sticky top-0 z-20 h-14 sm:h-16 px-4 sm:px-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              {breadcrumb}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={resetDemoData}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap"
              title="Reset demo profile to initial 72% state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <NavLink
              to="/next-actions"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
            >
              Next Actions
            </NavLink>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
