import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, HelpCircle, RefreshCw } from 'lucide-react';
import { usePrism } from '../context/PrismContext';

const HOW_IT_WORKS_STEPS = [
  {
    number: '01 —',
    title: 'Build Your Profile',
    description: 'Tell PRISM about your skills, projects, interests and career goal.'
  },
  {
    number: '02 —',
    title: 'Understand Your Skills',
    description: 'PRISM maps what you currently know across programming, core CS, and domain tracks.'
  },
  {
    number: '03 —',
    title: 'Find Your Gaps',
    description: 'PRISM compares your current profile with your target career.'
  },
  {
    number: '04 —',
    title: 'Choose Your Next Action',
    description: 'PRISM identifies the single highest-impact action to take right now.'
  },
  {
    number: '05 —',
    title: 'Complete It',
    description: 'Learn, build, practice or apply with clear milestones.'
  },
  {
    number: '06 —',
    title: 'Recalculate',
    description: 'Your progress changes your profile and your next recommendation.'
  }
];

const FEATURES_LIST = [
  {
    title: 'Skill Intelligence',
    description: 'Understand where you currently stand across programming, core CS, and AI/ML without guesswork.',
    outcome: 'Know your real baseline vs target role'
  },
  {
    title: 'Skill Gap Analysis',
    description: 'See what is holding you back and which missing skill will improve your readiness the most.',
    outcome: 'Ranked by career impact & time to close'
  },
  {
    title: 'Next Best Action',
    description: 'Know what deserves your attention right now instead of drowning in 20 competing suggestions.',
    outcome: 'One high-impact priority at a time'
  },
  {
    title: 'Career Roadmap',
    description: "Understand how today's action connects to your long-term goal across seven structured stages.",
    outcome: 'Step-by-step path from foundation to offer'
  },
  {
    title: 'Project Intelligence',
    description: 'Know which projects will actually strengthen your profile and provide real proof of work.',
    outcome: 'Turn theory into verifiable GitHub proof'
  },
  {
    title: 'Opportunity Matching',
    description: 'Find opportunities that fit your current profile — and see what prerequisites to finish first.',
    outcome: 'Apply where you have a real match'
  },
  {
    title: 'Progress Analytics',
    description: 'See whether your actions are actually improving your readiness month over month.',
    outcome: 'Measurable readiness trajectory'
  }
];

const STUDENT_OVERLOAD_ITEMS = [
  'Hundreds of courses',
  'Thousands of tutorials',
  'Endless career advice',
  'Multiple technologies',
  'Certifications',
  'Hackathons',
  'Projects',
  'Internships'
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo } = usePrism();

  const handleOpenDashboard = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Bar Contract: Zone 1 (Single wordmark), Zone 2 (4 nav links), Zone 3 (2 primary actions) */}
      <header className="sticky top-0 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xs border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            PRISM
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#product" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              How it works
            </a>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              Features
            </a>
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-4">
              CAREER INTELLIGENCE FOR STUDENTS
            </p>
            <h1
              className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Know where you are.{' '}
              <span className="font-editorial italic font-normal text-blue-600 dark:text-blue-400">
                Know what to do next.
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              PRISM looks at your skills, projects and career goals to figure out what you should
              focus on next. Don&apos;t just learn more. Know what to do next.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors whitespace-nowrap"
              >
                <span>Build My Career Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Realistic Dashboard Preview */}
          <div id="product" className="mt-14 sm:mt-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Browser/Workspace Header Bar */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-800 dark:text-slate-200">PRISM Career Workspace</span>
                <span aria-hidden="true">·</span>
                <span>3rd Year B.Tech CS</span>
                <span aria-hidden="true">·</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">Goal: AI / ML Engineer</span>
              </div>
              <button
                type="button"
                onClick={handleOpenDashboard}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                Get Started →
              </button>
            </div>

            {/* Preview Content Grid */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Career Goal</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                    AI / ML Engineer
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Target readiness: 85%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Career Readiness</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      72%
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +8% this month
                    </span>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Profile Strength</p>
                  <p className="mt-1 text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    78%
                  </p>
                  <p className="mt-1 text-xs text-slate-500">2 projects · 12 mapped skills</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Skill Gaps</p>
                  <p className="mt-1 text-2xl font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    6
                  </p>
                  <p className="mt-1 text-xs text-slate-500">2 high-priority bottlenecks</p>
                </div>
              </div>

              {/* Main Preview Columns: Next Best Action + Skill Gaps / Roadmap / Opportunities */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left 7 cols: Next Best Action */}
                <div className="lg:col-span-7 p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Your Next Best Action
                    </span>
                    <span>Priority: High · Est. 7 days · +6% Readiness</span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                    Complete Machine Learning Fundamentals
                  </h2>
                  <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    You already have a good Python foundation (82%) and have built programming
                    projects. Machine Learning (45%) is currently the biggest missing piece between
                    your profile and an AI/ML Engineer role.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/onboarding')}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Build My Career Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/next-actions')}
                      className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                    >
                      See weekly plan →
                    </button>
                  </div>
                </div>

                {/* Right 5 cols: Gaps, Roadmap & Opportunity snapshot */}
                <div className="lg:col-span-5 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
                      <span>Top Skill Gaps to Close</span>
                      <span className="font-mono">Current → Target</span>
                    </div>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">1. Machine Learning</span>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">45% → 80% (Gap: 35%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">2. Deep Learning</span>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">25% → 80% (Gap: 55%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-800 dark:text-slate-200 font-medium">3. LLMs &amp; RAG</span>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">20% → 75% (Gap: 55%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Current Roadmap Stage: </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">03. Machine Learning</span>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">89% Internship Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LANDING PAGE PROBLEM SECTION & WHY PRISM */}
        <section id="about" className="py-16 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-200/80 dark:border-slate-800 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                The Student Reality
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                The problem isn&apos;t lack of information.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Students already have access to everything — yet still feel stuck because nothing tells them what matters most for their specific profile right now:
              </p>
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {STUDENT_OVERLOAD_ITEMS.map((item) => (
                  <div
                    key={item}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    · {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 p-7 sm:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-5">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                The Real Question
              </p>
              <blockquote className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                &ldquo;What should I focus on right now?&rdquo;
              </blockquote>
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <p className="text-sm font-mono font-bold text-blue-400">PRISM</p>
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                  PRISM reduces the noise and gives you one clear next step. Your career shouldn&apos;t be a guessing game.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Without PRISM */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Without PRISM</span>
              </div>
              <blockquote className="mt-4 text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                &ldquo;I have learned a lot.
                <br />
                But am I actually ready?&rdquo;
              </blockquote>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                <li>· Watching random tutorials without knowing if they help your target role</li>
                <li>· Starting 5 side projects that don&apos;t close your real skill gaps</li>
                <li>· Applying to 50 internships blindly without checking what skills are missing</li>
              </ul>
            </div>

            {/* With PRISM */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-600/80 dark:border-blue-500/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Check className="w-4 h-4" />
                <span>With PRISM</span>
              </div>
              <blockquote className="mt-4 text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug">
                &ldquo;I know what I&apos;m missing.
                <br />
                And I know what to do next.&rdquo;
              </blockquote>
              <ul className="mt-6 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                <li>· Clear baseline score across Programming, Core CS, and AI/ML</li>
                <li>· One prioritized Next Best Action with transparent impact reasoning</li>
                <li>· Direct link between what you build this week and your career readiness</li>
              </ul>
            </div>
          </div>
        </section>

        {/* HOW PRISM WORKS (6 steps + Circular Loop) */}
        <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-200/80 dark:border-slate-800 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">How PRISM works</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                A continuous career intelligence loop.
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                Every action you complete updates your profile, recalculates your readiness, and determines your next best move.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-xs font-mono font-semibold text-blue-700 dark:text-blue-300 self-start md:self-auto">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Continuous Recalculation Loop</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {step.number}
                  </span>
                  <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual PRISM Loop Strip */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              THE PRISM DECISION LOOP
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {[
                'Student Profile',
                'Career Goal',
                'Current Skills',
                'Skill Gaps',
                'PRISM Decision Engine',
                'Next Best Action (Learn · Build · Practice)',
                'Action Completed',
                'Readiness Recalculated',
                'New Next Best Action ↺'
              ].map((node, index, arr) => (
                <React.Fragment key={node}>
                  <span
                    className={`px-3 py-1.5 rounded-lg border ${
                      node.includes('Next Best Action')
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {node}
                  </span>
                  {index < arr.length - 1 && (
                    <span className="text-slate-400" aria-hidden="true">
                      →
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES (6 features) */}
        <section id="features" className="py-16 sm:py-20 px-4 sm:px-8 max-w-6xl mx-auto border-t border-slate-200/80 dark:border-slate-800">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Features</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Built like a personal career GPS, not a course marketplace.
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_LIST.map((feat, idx) => (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    0{idx + 1}. Capability
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <p className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {feat.outcome}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final Landing CTA */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="p-8 sm:p-12 rounded-2xl bg-slate-900 dark:bg-slate-900 text-white border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Stop guessing what to learn next.
              </h2>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                Build your PRISM profile and get a clearer direction for your career.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors whitespace-nowrap"
              >
                Build My Career Profile
              </button>
              <a
                href="#how-it-works"
                className="px-5 py-3.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors whitespace-nowrap"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="py-10 px-4 sm:px-8 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">PRISM</span>
            <span aria-hidden="true"> · </span>
            <span>Personal Reality &amp; Intelligent Skill Mapping</span>
          </div>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => navigate('/auth')} className="hover:text-slate-900 dark:hover:text-white">
              Sign In
            </button>
            <button type="button" onClick={() => navigate('/onboarding')} className="hover:text-slate-900 dark:hover:text-white">
              Build My Career Profile
            </button>
            <button type="button" onClick={handleOpenDashboard} className="hover:text-slate-900 dark:hover:text-white">
              Get Started
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
