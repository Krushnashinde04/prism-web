import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff, Lock, ArrowRight, ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../services/authService';

interface OtherUserLoginFormProps {
  onLogin: (identifier: string, password: string, remember: boolean) => Promise<void>;
  onGuestLogin: () => Promise<void>;
  onBack: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  errorMessage: string;
}

export const OtherUserLoginForm: React.FC<OtherUserLoginFormProps> = ({
  onLogin,
  onGuestLogin,
  onBack,
  onForgotPassword,
  isLoading,
  errorMessage,
}) => {
  const [identifier, setIdentifier] = useState('PRISM-000UEC0000');
  const [password, setPassword] = useState('Student@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(identifier, password, rememberMe);
  };

  const handleUseDemo = () => {
    setIdentifier(DEMO_ACCOUNTS.student.email);
    setPassword(DEMO_ACCOUNTS.student.password);
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="glass-panel bg-[#0d0f24]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
        {/* Top Edge Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Roles</span>
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-300 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
              <span>Student & Scholar Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Other Users Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Sign in as an enrolled collegiate scholar or visitor.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 p-[1.5px] shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[#0a0c1a] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Direct Entrance: No Login Required */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/15 to-cyan-500/20 border border-purple-500/30 text-center shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-300 mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Direct Access Available (No Login Required)</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Open and explore PRISM directly as a student scholar without entering any password or login credentials.
          </p>
          <button
            type="button"
            onClick={() => onLogin(DEMO_ACCOUNTS.student.email, DEMO_ACCOUNTS.student.password, true)}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:brightness-110 shadow-xl shadow-purple-600/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Opening Platform...</span>
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Open Directly Without Login →</span>
              </>
            )}
          </button>
        </div>

        {/* Divider for Custom Sign In */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#0d0f24] text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
            Or Sign In With Custom ID
          </span>
        </div>

        {/* Quick Demo Pill */}
        <div className="mb-5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="font-mono text-[11px]">student@prism.edu / Student@2026!</span>
          </div>
          <button
            type="button"
            onClick={handleUseDemo}
            className="text-[11px] font-bold text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors ml-2"
          >
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Student ID or Registered Email
              </label>
              <button
                type="button"
                onClick={() => setIdentifier('PRISM-000UEC0000')}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-mono transition-colors underline"
              >
                Use PRISM-000UEC0000
              </button>
            </div>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="PRISM-000UEC0000 or student@prism.edu"
                className="w-full bg-[#12142a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports college roll number format like <span className="text-cyan-300 font-mono">PRISM-000UEC0000</span>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#12142a] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-[#12142a] text-purple-600 focus:ring-purple-500/40"
              />
              <span className="text-xs text-slate-300">Remember credentials</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Student Portal 2026</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-xl shadow-purple-600/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Authenticating Student Account...</span>
              </div>
            ) : (
              <>
                <span>Sign In as Student / User</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider for Guest Option */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#0d0f24] text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
            Or Visitor Access
          </span>
        </div>

        {/* Explore as Guest Option */}
        <button
          type="button"
          onClick={onGuestLogin}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-2 group"
        >
          <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span>Explore as Guest (Public Read-Only Access)</span>
        </button>
      </div>
    </div>
  );
};
