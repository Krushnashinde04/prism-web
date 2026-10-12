import React, { useState } from 'react';
import {
  Users2,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building,
  GraduationCap,
  MessageSquare,
  Sparkles,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MembershipRequest } from '../../types';

export const MembershipRequests: React.FC = () => {
  const { membershipRequests, approveMembershipRequest, rejectMembershipRequest, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Approve form state
  const [assignedTeam, setAssignedTeam] = useState('Technical Team');
  const [assignedDesignation, setAssignedDesignation] = useState('Core Member');

  // Reject form state
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredRequests = membershipRequests.filter((r) => {
    const matchesSearch =
      (r.applicantName || r.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.applicantEmail || r.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenApproveModal = (req: MembershipRequest) => {
    setSelectedRequest(req);
    setAssignedTeam(req.preferredTeam || 'Technical Team');
    setAssignedDesignation('Core Member');
    setApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (!selectedRequest) return;
    approveMembershipRequest(selectedRequest.id, assignedTeam, assignedDesignation);
    setApproveModalOpen(false);
    setSelectedRequest(null);
  };

  const handleOpenRejectModal = (req: MembershipRequest) => {
    setSelectedRequest(req);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      addToast('Reason Required', 'Please provide a feedback reason for the applicant.', 'error');
      return;
    }
    rejectMembershipRequest(selectedRequest.id, rejectionReason.trim());
    setRejectModalOpen(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: MembershipRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-bold mb-2">
            <Users2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Collegiate Admissions</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Membership Requests</h1>
          <p className="text-sm text-slate-300 mt-1">
            Review student applications for PRISM, assign official team tracks, and issue member privileges.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl glass-card border border-amber-500/30 bg-amber-950/20">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Pending Applications</span>
            <span className="text-xl font-black text-amber-400">
              {membershipRequests.filter((r) => r.status === 'pending').length}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl glass-card border border-emerald-500/30 bg-emerald-950/20">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Approved Members</span>
            <span className="text-xl font-black text-emerald-400">
              {membershipRequests.filter((r) => r.status === 'approved').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-[#0b0e20] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex bg-[#12152d] p-1 rounded-xl border border-white/10">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Grid / Cards */}
      {filteredRequests.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel bg-[#090c1e] border border-white/10">
          <Users2 className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-white">No membership applications found</h3>
          <p className="text-xs text-slate-400 mt-1">There are no requests matching the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="p-6 rounded-2xl glass-panel bg-[#090c1e] border border-white/10 hover:border-cyan-500/30 transition-all shadow-xl space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white">{req.applicantName || req.userName}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-cyan-300">{req.studentId}</span>
                    <span>•</span>
                    <span>{req.applicantEmail || req.userEmail}</span>
                  </div>
                </div>
                {getStatusBadge(req.status)}
              </div>

              {/* Department & Year details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                  <span className="text-white font-medium">{req.department}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Year</span>
                  <span className="text-white font-medium">{req.year}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Team</span>
                  <span className="text-cyan-300 font-semibold">{req.preferredTeam || req.appliedTeam}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted</span>
                  <span className="text-slate-300 font-medium">
                    {new Date(req.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Motivation */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300 block">Statement of Motivation:</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#12152d]/50 p-3 rounded-xl border border-white/5">
                  "{req.reason}"
                </p>
              </div>

              {/* Skills and Portfolio */}
              {req.skills && req.skills.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills / Focus:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {req.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-purple-500/15 text-purple-300 border border-purple-500/25"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {req.portfolioUrl && (
                <a
                  href={req.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Applicant Portfolio / GitHub</span>
                </a>
              )}

              {/* Resolution details if already processed */}
              {req.status === 'approved' && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Assigned to {req.assignedTeam} ({req.assignedDesignation})
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Approved by {req.reviewedBy} on {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString() : ''}
                  </p>
                </div>
              )}

              {req.status === 'rejected' && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Rejection Feedback
                  </p>
                  <p className="text-slate-300 text-[11px]">"{req.rejectionReason}"</p>
                </div>
              )}

              {/* Actions for Pending */}
              {req.status === 'pending' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => handleOpenRejectModal(req)}
                    className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleOpenApproveModal(req)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Assign Team</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* APPROVE MODAL */}
      {approveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-[#0d1024] border border-emerald-500/40 shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Approve PRISM Membership</h3>
              </div>
              <button
                onClick={() => setApproveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Grant <strong className="text-white">{selectedRequest.applicantName || selectedRequest.userName}</strong> official membership clearance and assign their team responsibility.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Assign to Team / Committee</label>
                <select
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full bg-[#14172f] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="Technical Team">Technical Team</option>
                  <option value="Media Team">Media Team</option>
                  <option value="Documentation Team">Documentation Team</option>
                  <option value="Management Team">Management Team</option>
                  <option value="OrbitX Space Collective">OrbitX Space Collective</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Assign Official Designation</label>
                <input
                  type="text"
                  value={assignedDesignation}
                  onChange={(e) => setAssignedDesignation(e.target.value)}
                  placeholder="e.g. Core Member, Research Associate"
                  className="w-full bg-[#14172f] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
              >
                Confirm Approval & Upgrade Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-[#0d1024] border border-rose-500/40 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Decline Application</h3>
              </div>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide constructive feedback to <strong className="text-white">{selectedRequest.applicantName || selectedRequest.userName}</strong>.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Reason for Rejection <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain requirements for next semester or areas of improvement..."
                className="w-full bg-[#14172f] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Decline Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
