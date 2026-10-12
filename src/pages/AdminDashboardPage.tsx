import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldCheck,
  Users2,
  CalendarDays,
  CreditCard,
  Bell,
  Settings,
  Plus,
  Trash2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  Ticket,
  Sliders,
  Send,
  Layers,
  UserX,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  UserPlus,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const {
    user,
    users,
    teams,
    events,
    programs,
    payments,
    passes,
    announcements,
    membershipRequests,
    websiteContents,
    auditLogs,
    deleteTeam,
    addTeam,
    publishAnnouncement,
    approveMembershipRequest,
    approveContent,
    publishContent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'announcements' | 'settings'>('overview');

  // Announcement publisher state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'Campus' | 'Urgent' | 'Academic' | 'Festival'>('Campus');
  const [annImportant, setAnnImportant] = useState(false);

  // New Team Modal / Form state
  const [newTeamOpen, setNewTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamTagline, setTeamTagline] = useState('');
  const [teamCategory, setTeamCategory] = useState<'Technical' | 'Media' | 'Documentation' | 'Management'>('Technical');

  // Website Settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowGuestRegistrations, setAllowGuestRegistrations] = useState(true);
  const [ssoEnforced, setSsoEnforced] = useState(false);

  // 8 Mandatory Database Statistics
  const totalUsers = users.length;
  const totalPrismMembers = users.filter((u) => u.role.toLowerCase() === 'member' || u.role.toLowerCase() === 'team lead').length;
  const activeMembers = users.filter((u) => (u.role.toLowerCase() === 'member' || u.role.toLowerCase() === 'team lead') && u.status === 'active').length;
  const blockedUsers = users.filter((u) => u.status === 'blocked').length;
  const pendingMembershipRequests = membershipRequests.filter((r) => r.status === 'pending').length;
  const pendingContentSubmissions = websiteContents.filter((c) => c.status === 'Pending Review').length;
  const publishedAnnouncements = announcements.length;
  const upcomingEvents = events.filter((e) => e.status === 'Upcoming').length;

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    publishAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      category: annCategory,
      isImportant: annImportant,
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnImportant(false);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    addTeam({
      name: teamName.trim(),
      shortName: teamName.split(' ')[0],
      category: teamCategory,
      tagline: teamTagline.trim() || 'Accelerating Student Innovation & Collaboration',
      description: 'An official university student collective operating under the PRISM Innovation Network.',
      logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      lead: user?.name || 'Dr. Marcus Thorne',
      leadRole: 'Faculty Sponsor',
      established: '2026',
      badgeColor: 'purple',
      badgeEmoji: '⚡',
      tags: ['Collegiate', teamCategory, 'Innovation'],
      recentActivities: [
        {
          title: 'Inaugural Team Charter Established',
          date: 'Just now',
          description: 'Official chapter recognized by the PRISM Executive Council.',
        },
      ],
      announcements: ['Welcome to all new team members!'],
    });

    setTeamName('');
    setTeamTagline('');
    setNewTeamOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* 1. Executive Admin Header */}
      <div className="relative overflow-hidden rounded-3xl glass-panel bg-gradient-to-r from-rose-950/40 via-[#0e1124] to-purple-950/30 border border-rose-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Platform Executive Command Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Complete administrative authority over users, PRISM members, editorial review, and platform governance.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Admin'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-rose-500/40 shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{user?.name}</span>
              <span className="text-xs text-rose-300 font-mono font-semibold">ROOT ADMINISTRATOR</span>
              <span className="text-xs text-slate-400">Security Clearance Level 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Executive Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <NavLink
          to="/admin/users"
          className="p-3.5 rounded-2xl glass-card bg-[#0e1124] border border-white/10 hover:border-purple-500/40 flex flex-col items-center text-center gap-2 group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Manage Users</span>
        </NavLink>

        <NavLink
          to="/admin/create-member"
          className="p-3.5 rounded-2xl glass-card bg-[#0e1124] border border-white/10 hover:border-cyan-500/40 flex flex-col items-center text-center gap-2 group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Create Member</span>
        </NavLink>

        <NavLink
          to="/admin/membership-requests"
          className="p-3.5 rounded-2xl glass-card bg-[#0e1124] border border-white/10 hover:border-amber-500/40 flex flex-col items-center text-center gap-2 group transition-all relative"
        >
          {pendingMembershipRequests > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Requests ({pendingMembershipRequests})</span>
        </NavLink>

        <NavLink
          to="/admin/content"
          className="p-3.5 rounded-2xl glass-card bg-[#0e1124] border border-white/10 hover:border-emerald-500/40 flex flex-col items-center text-center gap-2 group transition-all relative"
        >
          {pendingContentSubmissions > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Content Review</span>
        </NavLink>

        <NavLink
          to="/admin/reports"
          className="p-3.5 rounded-2xl glass-card bg-[#0e1124] border border-white/10 hover:border-blue-500/40 flex flex-col items-center text-center gap-2 group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">Reports</span>
        </NavLink>

        <NavLink
          to="/admin/logs"
          className="p-3.5 rounded-2xl glass-card bg-[#0e1124] border border-white/10 hover:border-rose-500/40 flex flex-col items-center text-center gap-2 group transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">Audit Logs</span>
        </NavLink>
      </div>

      {/* 3. The 8 Mandatory Database Statistics Cards */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Platform Telemetry (Database Records)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Users */}
          <NavLink
            to="/admin/users"
            className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 hover:border-purple-500/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalUsers}</div>
            <p className="text-[11px] text-purple-300 font-semibold mt-1">Platform population</p>
          </NavLink>

          {/* Card 2: Total PRISM Members */}
          <NavLink
            to="/admin/users"
            className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 hover:border-cyan-500/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total PRISM Members</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalPrismMembers}</div>
            <p className="text-[11px] text-cyan-300 font-semibold mt-1">Authorized contributors</p>
          </NavLink>

          {/* Card 3: Active Members */}
          <NavLink
            to="/admin/users"
            className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 hover:border-emerald-500/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Members</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{activeMembers}</div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">In good standing</p>
          </NavLink>

          {/* Card 4: Blocked Users */}
          <NavLink
            to="/admin/users"
            className="p-5 rounded-2xl glass-card border border-rose-500/20 bg-rose-950/20 hover:border-rose-500/50 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Blocked Users</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserX className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400">{blockedUsers}</div>
            <p className="text-[11px] text-rose-300 font-semibold mt-1">Sessions terminated</p>
          </NavLink>

          {/* Card 5: Pending Membership Requests */}
          <NavLink
            to="/admin/membership-requests"
            className="p-5 rounded-2xl glass-card border border-amber-500/20 bg-amber-950/20 hover:border-amber-500/50 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Pending Member Requests</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingMembershipRequests}</div>
            <p className="text-[11px] text-amber-300 font-semibold mt-1">Awaiting admission review</p>
          </NavLink>

          {/* Card 6: Pending Content Submissions */}
          <NavLink
            to="/admin/content"
            className="p-5 rounded-2xl glass-card border border-purple-500/20 bg-purple-950/20 hover:border-purple-500/50 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Pending Submissions</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300">{pendingContentSubmissions}</div>
            <p className="text-[11px] text-purple-300 font-semibold mt-1">Awaiting publication approval</p>
          </NavLink>

          {/* Card 7: Published Announcements */}
          <NavLink
            to="/"
            className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 hover:border-blue-500/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Announcements</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{publishedAnnouncements}</div>
            <p className="text-[11px] text-blue-300 font-semibold mt-1">Live on Home Page</p>
          </NavLink>

          {/* Card 8: Upcoming Events */}
          <NavLink
            to="/events"
            className="p-5 rounded-2xl glass-card border border-white/10 bg-[#0e1124]/90 hover:border-cyan-500/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Events</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{upcomingEvents}</div>
            <p className="text-[11px] text-cyan-300 font-semibold mt-1">Campus schedule synchronized</p>
          </NavLink>
        </div>
      </div>

      {/* 4. Tabbed Sub-Modules */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        {(['overview', 'announcements', 'teams', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'overview' ? 'Operational Hub' : tab === 'teams' ? 'Manage Collegiate Teams' : tab}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Pending Membership Requests Widget */}
          <div className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Pending Student Applications</h3>
              </div>
              <NavLink to="/admin/membership-requests" className="text-xs text-cyan-400 hover:underline">
                View All ({pendingMembershipRequests})
              </NavLink>
            </div>

            {membershipRequests.filter((r) => r.status === 'pending').length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No pending membership applications.</p>
            ) : (
              <div className="space-y-3">
                {membershipRequests
                  .filter((r) => r.status === 'pending')
                  .slice(0, 3)
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{req.applicantName || req.userName}</h4>
                        <p className="text-[11px] text-slate-400">
                          {req.studentId} • {req.preferredTeam || req.appliedTeam}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <NavLink
                          to="/admin/membership-requests"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500/25"
                        >
                          Review
                        </NavLink>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Pending Content Submissions Widget */}
          <div className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white">Pending Content Submissions</h3>
              </div>
              <NavLink to="/admin/content" className="text-xs text-purple-400 hover:underline">
                View All ({pendingContentSubmissions})
              </NavLink>
            </div>

            {websiteContents.filter((c) => c.status === 'Pending Review').length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No content submissions pending review.</p>
            ) : (
              <div className="space-y-3">
                {websiteContents
                  .filter((c) => c.status === 'Pending Review')
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {item.category} • by {item.authorName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => approveContent(item.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500/25"
                        >
                          Approve
                        </button>
                        <NavLink
                          to="/admin/content"
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10"
                        >
                          Details
                        </NavLink>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: ANNOUNCEMENTS PUBLISHER */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handlePublishAnnouncement}
            className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Send className="w-4 h-4 text-purple-400" />
              <span>Broadcast Campus Announcement</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Headline</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g. Campus Wi-Fi 6 Upgrade Completed Across All Wings"
                className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value as any)}
                className="w-full bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Campus">Campus Notice</option>
                <option value="Urgent">Urgent Alert</option>
                <option value="Academic">Academic Notice</option>
                <option value="Festival">Festival & Cultural</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Announcement Body</label>
              <textarea
                rows={4}
                required
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Detailed text of the announcement..."
                className="w-full bg-[#12152d] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="annImportant"
                checked={annImportant}
                onChange={(e) => setAnnImportant(e.target.checked)}
                className="rounded border-white/20 text-purple-600 focus:ring-0"
              />
              <label htmlFor="annImportant" className="text-xs text-slate-300">
                Mark as high-priority banner
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:brightness-110 transition-all"
            >
              Broadcast Announcement
            </button>
          </form>

          {/* List of active announcements */}
          <div className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Live Campus Broadcasts ({announcements.length})</span>
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ann.title}</span>
                    <span className="text-[10px] text-cyan-300 font-mono">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-300">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEAMS */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Active Collegiate Teams ({teams.length})</h3>
            <button
              onClick={() => setNewTeamOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Team</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl glass-panel bg-[#090c1e] border border-white/10 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{t.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {t.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{t.tagline}</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <span className="text-slate-400">Lead: {t.lead}</span>
                  <span className="text-cyan-300 font-mono font-bold">{t.memberCount} Scholars</span>
                </div>
              </div>
            ))}
          </div>

          {/* Create Team Modal */}
          {newTeamOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
              <form
                onSubmit={handleCreateTeam}
                className="w-full max-w-md rounded-3xl glass-panel bg-[#0d1024] border border-purple-500/30 p-6 space-y-4"
              >
                <h3 className="text-lg font-bold text-white">Register Collegiate Team</h3>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. AI & Robotics Guild"
                    className="w-full bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={teamCategory}
                    onChange={(e) => setTeamCategory(e.target.value as any)}
                    className="w-full bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Media">Media</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={teamTagline}
                    onChange={(e) => setTeamTagline(e.target.value)}
                    placeholder="e.g. Building next-gen autonomous systems"
                    className="w-full bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setNewTeamOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                  >
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-6 max-w-2xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Platform Governance & Security Controls</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white">Maintenance Mode</h4>
                <p className="text-[11px] text-slate-400">Lock non-admin logins for scheduled infrastructure upgrades</p>
              </div>
              <button
                onClick={() => setMaintenanceMode((prev) => !prev)}
                className={`w-11 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-rose-600' : 'bg-slate-700'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white">Guest Registration Allowed</h4>
                <p className="text-[11px] text-slate-400">Allow prospective students to inspect campus events as guests</p>
              </div>
              <button
                onClick={() => setAllowGuestRegistrations((prev) => !prev)}
                className={`w-11 h-6 rounded-full transition-colors relative ${allowGuestRegistrations ? 'bg-cyan-600' : 'bg-slate-700'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    allowGuestRegistrations ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <h4 className="text-xs font-bold text-white">Enforce Institutional SSO</h4>
                <p className="text-[11px] text-slate-400">Require @prism.edu academic email verification</p>
              </div>
              <button
                onClick={() => setSsoEnforced((prev) => !prev)}
                className={`w-11 h-6 rounded-full transition-colors relative ${ssoEnforced ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    ssoEnforced ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
