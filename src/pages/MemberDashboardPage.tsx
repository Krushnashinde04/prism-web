import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Layers,
  Sparkles,
  Ticket,
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Terminal,
  ExternalLink,
  MessageSquare,
  FileCode,
  BadgeCheck,
  FileText,
  Plus,
  Send,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MemberDashboardPage: React.FC = () => {
  const { user, teams, events, passes, announcements, websiteContents } = useApp();

  const myTeams = teams.filter((t) => t.status === 'member');
  const primaryTeam = myTeams[0] || teams[0];
  const myRegisteredEvents = events.filter((e) => e.isRegistered);

  // Submissions by this member
  const mySubmissions = websiteContents.filter(
    (c) =>
      c.authorId === user?.id ||
      c.authorEmail.toLowerCase() === (user?.email || '').toLowerCase()
  );
  const myPublished = mySubmissions.filter((c) => c.status === 'Published');
  const myPending = mySubmissions.filter((c) => c.status === 'Pending Review');
  const myChangesRequested = mySubmissions.filter((c) => c.status === 'Changes Requested');

  // Permitted member engineering sprints and internal tasks
  const memberSprints = [
    {
      id: 'sp_01',
      title: 'PRISM Core Cloud Orchestration Sprint',
      team: 'Technical Team',
      deadline: 'Oct 28, 2026',
      status: 'In Progress',
      progress: 68,
      lead: 'Aria Patel',
      tags: ['Docker', 'Kubernetes', 'FastAPI'],
    },
    {
      id: 'sp_02',
      title: 'TechFest Hardware Rover Telemetry Module',
      team: 'Technical Team',
      deadline: 'Nov 04, 2026',
      status: 'Active Review',
      progress: 90,
      lead: 'Dr. Marcus Thorne',
      tags: ['ESP32', 'C++', 'WebSocket'],
    },
    {
      id: 'sp_03',
      title: 'Collegiate Hackathon Check-In Scanner Testing',
      team: 'Technical Team',
      deadline: 'Nov 12, 2026',
      status: 'Scheduled',
      progress: 35,
      lead: 'Alex Vance',
      tags: ['WebRTC', 'QR-Audit'],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Member Profile & Team Affiliation Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel bg-gradient-to-r from-blue-950/40 via-[#0a0d24] to-cyan-950/30 border border-cyan-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-bold">
              <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified PRISM Core Member Clearance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Member Workspace
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Welcome back to your member command center. Author website content, collaborate on technical sprints, and manage collegiate initiatives.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Member'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{user?.name}</span>
              <span className="text-xs text-cyan-300 font-mono font-semibold">{user?.studentId}</span>
              <span className="text-xs text-slate-300">
                {primaryTeam ? primaryTeam.name : 'Technical Team'} • Core Engineer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRISM Member Content Studio Highlight Card */}
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-purple-950/30 via-[#0e122b] to-cyan-950/30 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Content Publisher
            </span>
            <span className="text-xs text-slate-400">• Direct Platform Powers</span>
          </div>
          <h2 className="text-xl font-bold text-white">Author & Publish to the PRISM Website</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            As a PRISM Member, you can create announcements, campus events, workshop guides, and team activities. Posts are reviewed by the Admin Council and automatically published to live website pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NavLink
            to="/member/submissions"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-300" />
            <span>My Work ({mySubmissions.length})</span>
          </NavLink>

          <NavLink
            to="/member/add-content"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website Information</span>
          </NavLink>
        </div>
      </div>

      {/* 3. Quick Member Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Assigned Team</span>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>{primaryTeam ? primaryTeam.name : 'Technical Team'}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Lead: {primaryTeam?.lead || 'Dr. Marcus Thorne'}</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">My Work</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>{mySubmissions.length} Articles</span>
          </div>
          <p className="text-[11px] text-cyan-300 font-semibold mt-1">
            {myPublished.length} Live • {myPending.length} In Review
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Active Sprints</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span>{memberSprints.length} In Progress</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-semibold mt-1">All deadlines on track</p>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Profile Status</span>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Active Member</span>
          </div>
          <NavLink to="/settings" className="text-[11px] text-purple-300 hover:underline mt-1 inline-block">
            Edit profile settings →
          </NavLink>
        </div>
      </div>

      {/* 4. Permitted Team Activities & Sprints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl glass-panel border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-white">Permitted Team Activities & Sprints</h3>
              <p className="text-xs text-slate-400">Current engineering work packages and deliverables.</p>
            </div>
            <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Q4 Session
            </span>
          </div>

          <div className="space-y-4">
            {memberSprints.map((sprint) => (
              <div
                key={sprint.id}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                      {sprint.team}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">{sprint.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Sprint Lead: {sprint.lead} • Due {sprint.deadline}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-1 rounded-lg">
                    {sprint.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Sprint Milestone Progress</span>
                    <span className="font-mono text-white">{sprint.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${sprint.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    {sprint.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <NavLink to="/teams" className="text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1">
                    <span>Team Workspace</span>
                    <ExternalLink className="w-3 h-3" />
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Team Communications & Shortcuts */}
        <div className="space-y-6">
          {/* Internal Sync Channels */}
          <div className="rounded-3xl glass-panel border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Member Channels</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <a
                href="#sync-tech"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">#tech-sprints</span>
                  <span className="text-slate-400 text-[11px]">Daily async standup</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </a>

              <a
                href="#sync-hardware"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">#lab-equipment-booking</span>
                  <span className="text-slate-400 text-[11px]">Hardware bench checkouts</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </a>

              <a
                href="#sync-announcements"
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <div>
                  <span className="font-bold text-white block">#core-announcements</span>
                  <span className="text-slate-400 text-[11px]">Faculty & council alerts</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </a>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-3xl glass-panel border border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-[#0d102b] p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Member Privileges</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Publish news & workshop tutorials</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Access to 24/7 Advanced Robotics Lab</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>Direct faculty mentor consultation hours</span>
              </li>
            </ul>

            <div className="pt-2">
              <NavLink
                to="/events"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md flex items-center justify-center gap-2"
              >
                <span>Browse All Collegiate Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
