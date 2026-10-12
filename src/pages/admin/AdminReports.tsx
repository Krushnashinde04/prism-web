import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users2,
  FileText,
  Ticket,
  ShieldCheck,
  Download,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminReports: React.FC = () => {
  const { users, websiteContents, membershipRequests, passes, events, teams, addToast } = useApp();

  // Metrics calculation
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role.toLowerCase() === 'admin' || u.role.toLowerCase() === 'administrator').length;
  const memberCount = users.filter((u) => u.role.toLowerCase() === 'member' || u.role.toLowerCase() === 'team lead').length;
  const studentCount = users.filter((u) => u.role.toLowerCase() === 'student').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;

  const publishedContentCount = websiteContents.filter((c) => c.status === 'Published').length;
  const pendingContentCount = websiteContents.filter((c) => c.status === 'Pending Review').length;

  const approvedRequestsCount = membershipRequests.filter((r) => r.status === 'approved').length;
  const pendingRequestsCount = membershipRequests.filter((r) => r.status === 'pending').length;

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      platform: 'PRISM College Platform',
      metrics: {
        totalUsers,
        adminCount,
        memberCount,
        studentCount,
        blockedCount,
        publishedContentCount,
        pendingContentCount,
        approvedRequestsCount,
        pendingRequestsCount,
        digitalPassesIssued: passes.length,
        totalTeams: teams.length,
        totalEvents: events.length,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prism-platform-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast('Report Exported', 'PRISM platform audit report downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Collegiate Intelligence & Analytics</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Institutional Reports</h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time telemetry on platform population, editorial publishing throughput, and pass validation.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel bg-[#0d1024] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">User Population</span>
            <Users2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{totalUsers}</div>
          <p className="text-[11px] text-cyan-400 font-semibold">{memberCount} Verified PRISM Members</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-[#0d1024] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">Published Live Posts</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{publishedContentCount}</div>
          <p className="text-[11px] text-amber-400 font-semibold">{pendingContentCount} Pending Editorial Approval</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-[#0d1024] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">Membership Funnel</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">{approvedRequestsCount}</div>
          <p className="text-[11px] text-purple-300 font-semibold">{pendingRequestsCount} Pending Student Applications</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-[#0d1024] border border-white/10 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold">Digital Passes</span>
            <Ticket className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">{passes.length} Active</div>
          <p className="text-[11px] text-emerald-400 font-semibold">100% Cryptographically Signed</p>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Breakdown Progress Card */}
        <div className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>Role Distribution</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{totalUsers} Total Accounts</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Students</span>
                <span className="text-white font-mono font-bold">
                  {studentCount} ({Math.round((studentCount / totalUsers) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${(studentCount / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">PRISM Members (Core)</span>
                <span className="text-cyan-300 font-mono font-bold">
                  {memberCount} ({Math.round((memberCount / totalUsers) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ width: `${(memberCount / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Administrators</span>
                <span className="text-rose-300 font-mono font-bold">
                  {adminCount} ({Math.round((adminCount / totalUsers) * 100)}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                  style={{ width: `${(adminCount / totalUsers) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300 font-semibold">Blocked / Suspended</span>
                <span className="text-rose-400 font-mono font-bold">{blockedCount}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full"
                  style={{ width: `${(blockedCount / totalUsers) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Publishing Health Card */}
        <div className="p-6 rounded-3xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Publishing Velocity</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{websiteContents.length} Total Submissions</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Published Live</span>
              <span className="text-2xl font-black text-white">{publishedContentCount}</span>
              <p className="text-[11px] text-slate-400 mt-1">Live on platform pages</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Awaiting Review</span>
              <span className="text-2xl font-black text-white">{pendingContentCount}</span>
              <p className="text-[11px] text-slate-400 mt-1">Needs admin decision</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
              <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">Changes Requested</span>
              <span className="text-2xl font-black text-white">
                {websiteContents.filter((c) => c.status === 'Changes Requested').length}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">With author for edits</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
              <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Rejected Submissions</span>
              <span className="text-2xl font-black text-white">
                {websiteContents.filter((c) => c.status === 'Rejected').length}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Declined by policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
