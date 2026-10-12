import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  Info,
  ShieldCheck,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminAuditLog } from '../../types';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'danger'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetUserOrContent || log.target || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (sev: AdminAuditLog['severity']) => {
    switch (sev) {
      case 'danger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> High Alert
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> Warning
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Info className="w-3 h-3 text-cyan-400" /> Standard
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Immutable Security Trail</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Activity Logs</h1>
          <p className="text-sm text-slate-300 mt-1">
            Chronological audit trail of all administrative interventions, account bans, role changes, and content publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl glass-card border border-white/10 bg-[#0d1024]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Recorded Audits</span>
            <span className="text-xl font-black text-white">{auditLogs.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-[#0b0e20] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, target, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-rose-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex bg-[#12152d] p-1 rounded-xl border border-white/10">
            {(['all', 'info', 'warning', 'danger'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  severityFilter === sev
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#10142e] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Admin Operator</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Operational Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Activity className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-50" />
                    <p className="font-semibold">No audit records match the current query</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div>
                        <span className="font-bold text-white text-xs">{log.adminName || log.performedBy}</span>
                        <p className="text-[10px] text-slate-400">{log.adminEmail}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-white text-xs bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono text-cyan-300 text-xs font-semibold">
                        {log.targetUserOrContent || log.target}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">{getSeverityBadge(log.severity)}</td>

                    <td className="py-3.5 px-4 text-xs text-slate-300 max-w-md">
                      <p className="line-clamp-2">{log.details}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
