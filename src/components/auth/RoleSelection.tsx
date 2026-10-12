import React from 'react';
import { ShieldCheck, Users, GraduationCap, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { RoleCard } from './RoleCard';

interface RoleSelectionProps {
  onSelectRole: (role: 'admin' | 'member' | 'student') => void;
  onSelectGuest: () => void;
  onDirectStudentAccess?: () => void;
  isGuestLoading?: boolean;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectRole,
  onSelectGuest,
  onDirectStudentAccess,
  isGuestLoading = false,
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 animate-fade-in">
      {/* Three Large Login Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {/* Option 1: Admin Login */}
        <RoleCard
          id="admin"
          title="Admin Login"
          badge="Executive"
          badgeColor="text-rose-400 bg-rose-500/10 border-rose-500/30"
          description="Manage the complete PRISM platform, configure security, manage teams, and access comprehensive analytics."
          buttonText="Continue as Admin"
          icon={ShieldCheck}
          iconGradient="from-rose-500 via-purple-600 to-indigo-600"
          borderHover="hover:border-rose-500/50"
          glowColor="hover:shadow-rose-500/15"
          permissions={[
            'Manage PRISM members & role access',
            'Add, edit, and remove campus teams',
            'Publish platform announcements & view reports',
          ]}
          onClick={() => onSelectRole('admin')}
        />

        {/* Option 2: PRISM Member */}
        <RoleCard
          id="member"
          title="PRISM Member"
          badge="Core Team"
          badgeColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
          description="Access your technical teams, collaborative sprints, member activities, and engineering workspace."
          buttonText="Continue as Member"
          icon={Users}
          iconGradient="from-blue-600 via-cyan-500 to-indigo-600"
          borderHover="hover:border-cyan-500/50"
          glowColor="hover:shadow-cyan-500/15"
          permissions={[
            'View assigned team, sprint goals & role',
            'Participate in permitted team activities',
            'Access valid event passes & team announcements',
          ]}
          onClick={() => onSelectRole('member')}
        />

        {/* Option 3: Other Users (Direct Access - No Login) */}
        <RoleCard
          id="student"
          title="Other Users / Students"
          badge="Direct Access"
          badgeColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
          description="Access the PRISM platform directly without any login credentials or password required. Explore teams, events, and campus life instantly."
          buttonText="Open Directly (No Login) →"
          icon={GraduationCap}
          iconGradient="from-purple-600 via-pink-600 to-cyan-500"
          borderHover="hover:border-purple-500/50"
          glowColor="hover:shadow-purple-500/15"
          permissions={[
            'Instant direct access without login credentials',
            'Explore public programs & flagship events',
            'Register for workshops & claim QR digital tickets',
          ]}
          onClick={() => {
            if (onDirectStudentAccess) {
              onDirectStudentAccess();
            } else {
              onSelectRole('student');
            }
          }}
        />
      </div>

      {/* Guest Explorer Option */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all bg-[#0d0f22]/70 backdrop-blur-md">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white">
              Visiting PRISM for the first time?
            </h4>
            <p className="text-xs text-slate-400">
              Browse public events, tech hackathons, and student teams without signing in.
            </p>
          </div>
        </div>

        <button
          onClick={onSelectGuest}
          disabled={isGuestLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          {isGuestLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
              <span>Launching Guest Mode...</span>
            </div>
          ) : (
            <>
              <span>Explore as Guest</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Testing & Demo Fast Credentials Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Demo Authentication Profiles Ready For Instant Evaluation</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
            Admin: admin@prism.edu / Admin@2026!
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Member: member@prism.edu / Member@2026!
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20">
            Student: student@prism.edu (or PRISM-000UEC0000) / Student@2026!
          </span>
        </div>
      </div>
    </div>
  );
};
