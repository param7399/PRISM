import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { PrismIcon } from '../components/common/PrismLogo';

export const AuthPage: React.FC = () => {
  const { student, loginDemo, loginWithDetails } = usePrism();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState(student.email);
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [year, setYear] = useState(student.year);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid college or personal email address.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Please enter a password (at least 4 characters).');
      return;
    }

    if (activeTab === 'signup') {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      loginWithDetails(name, email, college, year, false);
      navigate('/onboarding');
    } else {
      loginWithDetails(name.trim() || student.name, email, college, year, true);
      navigate('/dashboard');
    }
  };

  const handleGoogleAuth = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4 py-8">
      {/* Top link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <PrismIcon size={22} />
          <span>PRISM</span>
        </Link>
        <Link
          to="/"
          className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Back to home
        </Link>
      </div>

      {/* Main Auth Box */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'signin' ? 'Welcome back to PRISM' : 'Create your PRISM account'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Know where you are. Know what to do next.
            </p>
          </div>

          {/* Segmented Control Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError('');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {forgotMessage && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300">
              {forgotMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {activeTab === 'signup' && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
              />
            </div>

            {activeTab === 'signup' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="auth-college" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    College
                  </label>
                  <input
                    id="auth-college"
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="Enter your college"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label htmlFor="auth-year" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Year
                  </label>
                  <select
                    id="auth-year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'signin' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setForgotMessage('Demo mode: Click "Try Demo" below or click Sign In directly.')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2"
            >
              <span>{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Try Demo</span>
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        PRISM · Personal Reality &amp; Intelligent Skill Mapping
      </p>
    </div>
  );
};
