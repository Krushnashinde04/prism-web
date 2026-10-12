import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, User, ArrowRight, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../services/authService';

interface AdminLoginFormProps {
  onLogin: (identifier: string, password: string, remember: boolean) => Promise<void>;
  onBack: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  errorMessage: string;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onLogin,
  onBack,
  onForgotPassword,
  isLoading,
  errorMessage,
}) => {
  const [username, setUsername] = useState('admin@prism.edu');
  const [password, setPassword] = useState('Admin@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password, rememberMe);
  };

  const handleUseDemo = () => {
    setUsername(DEMO_ACCOUNTS.admin.email);
    setPassword(DEMO_ACCOUNTS.admin.password);
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      <div className="glass-panel bg-[#0d0f24]/95 border border-rose-500/30 rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
        {/* Top Edge Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-500" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Executive Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Login
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Authenticate with your root or faculty administrator credentials.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 p-[1.5px] shadow-lg flex-shrink-0">
            <div className="w-full h-full bg-[#0a0c1a] rounded-[14px] flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-rose-400" />
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

        {/* Quick Demo Pill */}
        <div className="mb-5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="font-mono text-[11px]">admin@prism.edu / Admin@2026!</span>
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Admin Username or Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@prism.edu or admin"
                className="w-full bg-[#12142a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Admin Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
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
                className="w-full bg-[#12142a] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
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
                className="w-4 h-4 rounded border-slate-700 bg-[#12142a] text-rose-600 focus:ring-rose-500/40"
              />
              <span className="text-xs text-slate-300">Keep session active</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">Protected by 256-bit SSL</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-xl shadow-rose-600/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Authorizing Executive Token...</span>
              </div>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
