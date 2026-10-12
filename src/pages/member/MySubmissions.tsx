import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Archive,
  Eye,
  Edit2,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Calendar,
  X,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WebsiteContent, ContentStatus } from '../../types';

export const MySubmissions: React.FC = () => {
  const { user, websiteContents, updateContent, addToast } = useApp();

  // Filter only submissions by current user (or all if admin)
  const isUserAdmin = (user?.role || '').toLowerCase() === 'admin' || (user?.role || '').toLowerCase() === 'administrator';
  const myContents = isUserAdmin
    ? websiteContents
    : websiteContents.filter(
        (c) =>
          c.authorId === user?.id ||
          c.authorEmail.toLowerCase() === (user?.email || '').toLowerCase()
      );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');

  // Preview & Edit modal states
  const [previewContent, setPreviewContent] = useState<WebsiteContent | null>(null);
  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editFullDesc, setEditFullDesc] = useState('');

  const filteredContents = myContents.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (item: WebsiteContent) => {
    setEditingContent(item);
    setEditTitle(item.title);
    setEditShortDesc(item.shortDescription);
    setEditFullDesc(item.fullDescription);
  };

  const handleSaveEdit = (resubmit: boolean) => {
    if (!editingContent) return;
    if (!editTitle.trim() || !editShortDesc.trim()) {
      addToast('Required Fields Missing', 'Please fill in Title and Short Description.', 'error');
      return;
    }

    const newStatus: ContentStatus = resubmit ? 'Pending Review' : editingContent.status;

    updateContent(editingContent.id, {
      title: editTitle.trim(),
      shortDescription: editShortDesc.trim(),
      fullDescription: editFullDesc.trim() || editShortDesc.trim(),
      status: newStatus,
    });

    if (resubmit) {
      addToast('Resubmitted for Review', `"${editTitle}" has been updated and queued for administrator approval.`, 'success');
    } else {
      addToast('Changes Saved', `"${editTitle}" updated successfully.`, 'info');
    }

    setEditingContent(null);
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Globe className="w-3 h-3" /> Published Live
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <CheckCircle2 className="w-3 h-3" /> Approved (Queued)
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Under Admin Review
          </span>
        );
      case 'Changes Requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <AlertCircle className="w-3 h-3" /> Changes Requested
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
            Draft
          </span>
        );
      case 'Archived':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700/30 text-slate-400 border border-slate-600/30">
            <Archive className="w-3 h-3" /> Archived
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
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Member Work Portfolio</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">My Work</h1>
          <p className="text-sm text-slate-300 mt-1">
            Track approval status, respond to editorial feedback, edit drafts, and view your live published articles.
          </p>
        </div>

        <NavLink
          to="/member/add-content"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Website Information</span>
        </NavLink>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel bg-[#0b0e20] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search my posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'Published', 'Pending Review', 'Changes Requested', 'Draft', 'Rejected'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-[#12152d] border border-white/5'
                }`}
              >
                {tab === 'all' ? 'All Posts' : tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Submissions Grid */}
      {filteredContents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel bg-[#090c1e] border border-white/10 space-y-4">
          <FileText className="w-12 h-12 mx-auto text-slate-500 opacity-40" />
          <div>
            <h3 className="text-lg font-bold text-white">No submissions found</h3>
            <p className="text-xs text-slate-400 mt-1">You haven't submitted any content matching this filter.</p>
          </div>
          <NavLink
            to="/member/add-content"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Post</span>
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-panel bg-[#090c1e] border border-white/10 hover:border-cyan-500/30 transition-all shadow-xl overflow-hidden flex flex-col group"
            >
              {/* Cover image banner */}
              {item.coverImage ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/40 relative">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                      {item.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-white/5 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 text-cyan-300 border border-white/10">
                    {item.category}
                  </span>
                </div>
              )}

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>

                {/* Prominent Feedback Banner if Changes Requested or Rejected */}
                {item.status === 'Changes Requested' && item.adminFeedback && (
                  <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> Admin Feedback:
                    </span>
                    <p className="text-xs text-purple-200 italic leading-snug">"{item.adminFeedback}"</p>
                  </div>
                )}

                {item.status === 'Rejected' && item.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" /> Rejection Justification:
                    </span>
                    <p className="text-xs text-rose-200 italic leading-snug">"{item.rejectionReason}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewContent(item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-all"
                    title="Preview layout"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  {/* Can edit drafts or items needing changes */}
                  {(item.status === 'Draft' || item.status === 'Changes Requested') && (
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs font-bold hover:brightness-110 flex items-center gap-1 shadow-md transition-all"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{item.status === 'Changes Requested' ? 'Edit & Resubmit' : 'Edit Draft'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1. PREVIEW MODAL */}
      {previewContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl glass-panel bg-[#0d1024] border border-cyan-500/30 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                {previewContent.category}
              </span>
              <button onClick={() => setPreviewContent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {previewContent.coverImage && (
                <img
                  src={previewContent.coverImage}
                  alt=""
                  className="rounded-2xl w-full aspect-video object-cover border border-white/10 shadow-lg"
                />
              )}

              <div>
                <h2 className="text-2xl font-black text-white">{previewContent.title}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Submitted {new Date(previewContent.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 italic">
                "{previewContent.shortDescription}"
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#10142e] p-4 rounded-xl border border-white/5">
                {previewContent.fullDescription}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#090b1a] flex justify-end">
              <button
                onClick={() => setPreviewContent(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT MODAL */}
      {editingContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl glass-panel bg-[#0d1024] border border-purple-500/40 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-purple-400" />
                <span>Edit Submission</span>
              </h3>
              <button onClick={() => setEditingContent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editShortDesc}
                  onChange={(e) => setEditShortDesc(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Full Description</label>
                <textarea
                  rows={6}
                  value={editFullDesc}
                  onChange={(e) => setEditFullDesc(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingContent(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(false)}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs font-bold"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSaveEdit(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:brightness-110 text-white text-xs font-bold shadow-lg"
              >
                Resubmit for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
