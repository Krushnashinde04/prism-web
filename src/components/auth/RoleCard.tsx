import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface RoleCardProps {
  id: 'admin' | 'member' | 'student';
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  buttonText: string;
  icon: React.ElementType;
  iconGradient: string;
  borderHover: string;
  glowColor: string;
  permissions: string[];
  onClick: () => void;
  selected?: boolean;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  id,
  title,
  badge,
  badgeColor,
  description,
  buttonText,
  icon: Icon,
  iconGradient,
  borderHover,
  glowColor,
  permissions,
  onClick,
  selected = false,
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative text-left rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl border ${
        selected
          ? `bg-[#101432] border-purple-400 ring-2 ring-purple-500/50 shadow-2xl ${glowColor}`
          : `bg-[#0c0e22]/85 hover:bg-[#0f132e] border-white/10 ${borderHover} hover:-translate-y-1.5 hover:shadow-2xl ${glowColor}`
      }`}
    >
      {/* Ambient background glow inside the card */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />

      {/* Top Edge Gradient Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
          selected
            ? 'opacity-100 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400'
            : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500'
        }`}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header row with Icon and Badge */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={`w-14 h-14 rounded-2xl p-[1.5px] bg-gradient-to-br ${iconGradient} shadow-lg group-hover:scale-105 transition-transform duration-300`}
            >
              <div className="w-full h-full bg-[#090b1c] rounded-[14px] flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>

            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}
            >
              {badge}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-purple-200 transition-colors mb-2 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            {description}
          </p>

          {/* Key permissions preview */}
          <div className="space-y-2 mb-6 pt-3 border-t border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Core Capabilities:
            </span>
            <ul className="space-y-1.5">
              {permissions.slice(0, 3).map((perm, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{perm}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <div
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
              selected
                ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 shadow-purple-600/30'
                : 'bg-white/10 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 text-slate-100'
            }`}
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
