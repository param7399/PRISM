import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PrismIcon } from '../components/common/PrismLogo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto">
          <PrismIcon size={26} />
        </div>
        <div>
          <p className="text-xs font-mono text-blue-600 dark:text-blue-400">404 · Page Not Found</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Looks like this path isn&apos;t on your roadmap.
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Let&apos;s get you back to your career dashboard.
          </p>
        </div>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
