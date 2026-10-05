import React, { useState, useEffect } from 'react';
import { RefreshCw, Sun, Moon, Monitor, Plus, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePrism } from '../context/PrismContext';
import { CAREER_GOALS } from '../data/mockData';
import { ThemePreference } from '../types';

const RECALC_STEPS = [
  'Looking at your updated profile...',
  'Recalculating skill gaps...',
  'Updating readiness...',
  'Choosing your next action...'
];

export const ProfilePage: React.FC = () => {
  const {
    student,
    profileStrength,
    readiness,
    nextBestAction,
    themePreference,
    setThemePreference,
    updateProfileInfo,
    recalculateProfile,
    resetDemoData,
    addCertificate
  } = usePrism();

  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [degree, setDegree] = useState(student.degree);
  const [branch, setBranch] = useState(student.branch);
  const [year, setYear] = useState(student.year);
  const [careerGoal, setCareerGoal] = useState(student.careerGoal);
  const [bio, setBio] = useState(student.bio);

  useEffect(() => {
    setName(student.name);
    setCollege(student.college);
    setDegree(student.degree);
    setBranch(student.branch);
    setYear(student.year);
    setCareerGoal(student.careerGoal);
    setBio(student.bio);
  }, [
    student.name,
    student.college,
    student.degree,
    student.branch,
    student.year,
    student.careerGoal,
    student.bio
  ]);

  // Recalculation step-by-step loading state (Section 40 & 44)
  const [recalcStepIndex, setRecalcStepIndex] = useState<number | null>(null);
  const [recalcCompleteBanner, setRecalcCompleteBanner] = useState(false);

  // Add certificate inputs
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');

  // Add interest input
  const [newInterest, setNewInterest] = useState('');

  const handleRecalculateAnimated = () => {
    if (recalcStepIndex !== null) return;
    setRecalcCompleteBanner(false);
    setRecalcStepIndex(0);
    setTimeout(() => setRecalcStepIndex(1), 350);
    setTimeout(() => setRecalcStepIndex(2), 700);
    setTimeout(() => setRecalcStepIndex(3), 1050);
    setTimeout(() => {
      setRecalcStepIndex(null);
      setRecalcCompleteBanner(true);
      recalculateProfile();
    }, 1450);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileInfo({
      name: name.trim() || student.name,
      college: college.trim() || student.college,
      degree: degree.trim() || student.degree,
      branch: branch.trim() || student.branch,
      year,
      careerGoal,
      bio
    });
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;
    addCertificate({
      title: certTitle.trim(),
      issuer: certIssuer.trim() || 'Verified Issuer',
      date: 'October 2026',
      credentialId: certCredentialId.trim() || `CERT-${Date.now().toString().slice(-5)}`,
      verificationStatus: 'Verified (Demo)',
      skillsCovered: ['Machine Learning']
    });
    setCertTitle('');
    setCertIssuer('');
    setCertCredentialId('');
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (!student.interests.includes(newInterest.trim())) {
      updateProfileInfo({
        interests: [...student.interests, newInterest.trim()]
      });
    }
    setNewInterest('');
  };

  const removeInterest = (item: string) => {
    updateProfileInfo({
      interests: student.interests.filter((i) => i !== item)
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {student.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              {student.degree} {student.branch} · {student.year}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {student.college} · Career Goal:{' '}
              <strong className="text-blue-600 dark:text-blue-400">{student.careerGoal}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-3">
          <div className="sm:text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Profile completeness:{' '}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {profileStrength}%
            </span>
            <span className="text-xs text-slate-400"> · Readiness: </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {readiness}%
            </span>
          </div>

          <button
            type="button"
            onClick={handleRecalculateAnimated}
            disabled={recalcStepIndex !== null}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors self-start sm:self-auto whitespace-nowrap disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${recalcStepIndex !== null ? 'animate-spin' : ''}`} />
            <span>
              {recalcStepIndex !== null
                ? RECALC_STEPS[recalcStepIndex]
                : 'Recalculate My PRISM Profile'}
            </span>
          </button>
        </div>
      </div>

      {/* Step-by-Step Recalculation Progress or Completion Banner */}
      {recalcStepIndex !== null && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {RECALC_STEPS[recalcStepIndex]}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step {recalcStepIndex + 1} of {RECALC_STEPS.length} · Evaluating skills, projects, and dependencies
              </p>
            </div>
          </div>
        </div>
      )}

      {recalcCompleteBanner && recalcStepIndex === null && (
        <div
          role="status"
          className="p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                PRISM Profile Recalculated · Readiness {readiness}%
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Next Best Action: {nextBestAction.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {nextBestAction.whyNow}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setRecalcCompleteBanner(false)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 self-end sm:self-center"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Personal Info + Career Goal & Skills/Projects/Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 columns: Personal Information & Career Goal Form */}
        <form
          onSubmit={handleSavePersonal}
          className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5"
        >
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Personal Information &amp; Career Goal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep your academic standing and target role up to date.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                College
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Degree
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Branch / Specialization
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Career Goal
            </label>
            <select
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              {CAREER_GOALS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Short Summary
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Right 5 columns: Skills, Projects, Certificates, Interests, Preferences */}
        <div className="lg:col-span-5 space-y-6">
          {/* Skills & Projects Snapshot */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Skills &amp; Projects Summary
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Mapped Skills ({student.skills.length}): </strong>
              {student.skills.map((s) => `${s.name} (${s.level})`).join(' · ')}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
              <strong>Projects ({student.projects.length}): </strong>
              {student.projects.map((p) => `${p.name} (${p.status})`).join(' · ')}
            </p>
          </section>

          {/* Certificates */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Certificates</h2>
              <span className="text-[11px] font-mono text-slate-400">Supporting Evidence</span>
            </div>
            {student.certificates.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">No certificates yet.</p>
                <p>That&apos;s okay. Projects and real skills matter too.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="text-xs pb-3 border-b border-slate-100 dark:border-slate-800 last:border-none last:pb-0 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {cert.title}
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        {cert.issuer} · {cert.date}
                      </p>
                      {cert.credentialId && (
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                          Credential ID: {cert.credentialId}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{cert.verificationStatus || 'Verified (Demo)'}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddCert} className="pt-2 flex flex-col gap-2">
              <input
                type="text"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="Certificate name..."
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="Issuer (e.g. Coursera)"
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={certCredentialId}
                  onChange={(e) => setCertCredentialId(e.target.value)}
                  placeholder="Credential ID (optional)"
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <button
                type="submit"
                className="self-end px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                + Add Certificate
              </button>
            </form>
          </section>

          {/* Interests */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Click to remove interest"
                >
                  {interest} ×
                </button>
              ))}
            </div>
            <form onSubmit={handleAddInterest} className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add an interest (e.g. Research)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </section>

          {/* Preferences, Theme (Light / Dark / System) & Reset Demo Data */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Preferences, Theme &amp; Demo Controls
            </h2>

            <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Appearance Theme
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ] as { value: ThemePreference; label: string; icon: React.FC<{ className?: string }> }[]
                ).map((opt) => {
                  const Icon = opt.icon;
                  const active = themePreference === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setThemePreference(opt.value)}
                      className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Action &amp; Milestone Notifications
              </span>
              <input
                type="checkbox"
                checked={student.notificationsEnabled}
                onChange={(e) =>
                  updateProfileInfo({ notificationsEnabled: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Weekly Sunday Readiness Summary
              </span>
              <input
                type="checkbox"
                checked={student.weeklyDigestEnabled}
                onChange={(e) =>
                  updateProfileInfo({ weeklyDigestEnabled: e.target.checked })
                }
                className="rounded border-slate-300 text-blue-600"
              />
            </label>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Reset Demo State
                </p>
                <p className="text-[11px] text-slate-500">
                  Restore initial 72% readiness demo profile
                </p>
              </div>
              <button
                type="button"
                onClick={resetDemoData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
