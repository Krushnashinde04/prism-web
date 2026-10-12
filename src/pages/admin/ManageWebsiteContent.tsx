import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Archive,
  ArrowUpRight,
  Clock,
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WebsiteContent, ContentStatus, ContentCategory } from '../../types';

export const ManageWebsiteContent: React.FC = () => {
  const {
    websiteContents,
    approveContent,
    requestContentChanges,
    rejectContent,
    publishContent,
    unpublishContent,
    archiveContent,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ContentCategory>('all');

  // Modal states
  const [previewContent, setPreviewContent] = useState<WebsiteContent | null>(null);
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<WebsiteContent | null>(null);

  // Form states
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredContents = websiteContents.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenChangesModal = (item: WebsiteContent) => {
    setSelectedContent(item);
    setFeedbackNotes('');
    setChangesModalOpen(true);
  };

  const handleConfirmChanges = () => {
    if (!selectedContent) return;
    if (!feedbackNotes.trim()) {
      addToast('Feedback Required', 'Please specify what changes are required before returning to member.', 'error');
      return;
    }
    requestContentChanges(selectedContent.id, feedbackNotes.trim());
    setChangesModalOpen(false);
    setSelectedContent(null);
  };

  const handleOpenRejectModal = (item: WebsiteContent) => {
    setSelectedContent(item);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedContent) return;
    if (!rejectionReason.trim()) {
      addToast('Reason Required', 'Please provide a formal rejection reason.', 'error');
      return;
    }
    rejectContent(selectedContent.id, rejectionReason.trim());
    setRejectModalOpen(false);
    setSelectedContent(null);
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'Published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <Globe className="w-3 h-3" /> Published
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Pending Review
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
            <XCircle className="w-3 h-3" /> Rejected
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Editorial & Publishing Pipeline</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Manage Website Content</h1>
          <p className="text-sm text-slate-300 mt-1">
            Review submissions from PRISM members, approve posts, and publish directly to live website pages.
          </p>
        </div>

        {/* Quick summary metrics */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl glass-card border border-amber-500/30 bg-amber-950/20">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Pending Review</span>
            <span className="text-xl font-black text-amber-400">
              {websiteContents.filter((c) => c.status === 'Pending Review').length}
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl glass-card border border-emerald-500/30 bg-emerald-950/20">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Live Published</span>
            <span className="text-xl font-black text-emerald-400">
              {websiteContents.filter((c) => c.status === 'Published').length}
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
            placeholder="Search content by title, member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Changes Requested">Changes Requested</option>
              <option value="Approved">Approved</option>
              <option value="Published">Published (Live)</option>
              <option value="Draft">Drafts</option>
              <option value="Rejected">Rejected</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-[#12152d] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="College Announcements">Announcements</option>
            <option value="News">News</option>
            <option value="Events">Events</option>
            <option value="Programs">Programs</option>
            <option value="Team Activities">Team Activities</option>
            <option value="Achievements">Achievements</option>
            <option value="Workshops">Workshops</option>
            <option value="Competitions">Competitions</option>
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="rounded-2xl glass-panel bg-[#090c1e] border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#10142e] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Content Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Submitted By</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-50" />
                    <p className="font-semibold">No content items found</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the filter or search query.</p>
                  </td>
                </tr>
              ) : (
                filteredContents.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{item.shortDescription}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-200">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-white text-xs">{item.authorName}</p>
                        <p className="text-[11px] text-slate-400">{item.authorRole || 'Member'}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(item.status)}
                        {item.status === 'Changes Requested' && item.adminFeedback && (
                          <p className="text-[10px] text-purple-300 line-clamp-1 italic">
                            "{item.adminFeedback}"
                          </p>
                        )}
                        {item.status === 'Rejected' && item.rejectionReason && (
                          <p className="text-[10px] text-rose-300 line-clamp-1 italic">
                            "{item.rejectionReason}"
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Preview button */}
                        <button
                          onClick={() => setPreviewContent(item)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                          title="Preview Submission"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Pending Review Actions */}
                        {item.status === 'Pending Review' && (
                          <>
                            <button
                              onClick={() => approveContent(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1"
                              title="Approve for publishing"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleOpenChangesModal(item)}
                              className="px-2 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-all"
                              title="Request changes"
                            >
                              Request Changes
                            </button>
                            <button
                              onClick={() => handleOpenRejectModal(item)}
                              className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs border border-rose-500/30 transition-all"
                              title="Reject content"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Approved Action -> Publish */}
                        {item.status === 'Approved' && (
                          <button
                            onClick={() => publishContent(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                            title="Publish immediately to public website"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span>Publish Live</span>
                          </button>
                        )}

                        {/* Published Actions -> Unpublish */}
                        {item.status === 'Published' && (
                          <button
                            onClick={() => unpublishContent(item.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
                            title="Take down from public site"
                          >
                            Unpublish
                          </button>
                        )}

                        {/* Archive button */}
                        {item.status !== 'Archived' && (
                          <button
                            onClick={() => archiveContent(item.id)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-all"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. PREVIEW MODAL */}
      {previewContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl glass-panel bg-[#0d1024] border border-cyan-500/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                  {previewContent.category}
                </span>
                <span className="text-xs text-slate-400">Preview Layout</span>
              </div>
              <button
                onClick={() => setPreviewContent(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {previewContent.coverImage && (
                <div className="rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-lg">
                  <img
                    src={previewContent.coverImage}
                    alt={previewContent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-black text-white">{previewContent.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>By {previewContent.authorName}</span>
                  <span>•</span>
                  <span>{new Date(previewContent.createdAt).toLocaleDateString()}</span>
                  {previewContent.relatedTeam && (
                    <>
                      <span>•</span>
                      <span className="text-purple-300 font-semibold">{previewContent.relatedTeam}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Event / Workshop specific meta if applicable */}
              {(previewContent.eventDate || previewContent.venue) && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  {previewContent.eventDate && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{previewContent.eventDate} {previewContent.eventTime ? `at ${previewContent.eventTime}` : ''}</span>
                    </div>
                  )}
                  {previewContent.venue && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>{previewContent.venue}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Descriptions */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-sm text-purple-200 italic">
                  "{previewContent.shortDescription}"
                </div>

                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#10142e] p-5 rounded-2xl border border-white/5">
                  {previewContent.fullDescription}
                </div>
              </div>

              {previewContent.externalLink && (
                <a
                  href={previewContent.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>External Resource / Registration Link</span>
                </a>
              )}
            </div>

            {/* Bottom bar with quick actions */}
            <div className="p-4 border-t border-white/10 bg-[#090b1a] flex items-center justify-between">
              <div>{getStatusBadge(previewContent.status)}</div>
              <div className="flex items-center gap-2">
                {previewContent.status === 'Pending Review' && (
                  <button
                    onClick={() => {
                      approveContent(previewContent.id);
                      setPreviewContent(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all"
                  >
                    Approve Content
                  </button>
                )}
                {previewContent.status === 'Approved' && (
                  <button
                    onClick={() => {
                      publishContent(previewContent.id);
                      setPreviewContent(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    Publish to Website Now
                  </button>
                )}
                <button
                  onClick={() => setPreviewContent(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REQUEST CHANGES MODAL */}
      {changesModalOpen && selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-[#0d1024] border border-purple-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-purple-400">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Request Content Changes</h3>
              </div>
              <button onClick={() => setChangesModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Provide actionable guidance for <strong className="text-white">{selectedContent.authorName}</strong> to revise their post.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Requested Adjustments / Feedback <span className="text-purple-400">*</span>
              </label>
              <textarea
                rows={4}
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="e.g. Please update the cover poster resolution, verify the workshop room number, and shorten the headline..."
                className="w-full bg-[#14172f] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setChangesModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmChanges}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REJECT MODAL */}
      {rejectModalOpen && selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel bg-[#0d1024] border border-rose-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Reject Content Submission</h3>
              </div>
              <button onClick={() => setRejectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              State why this submission cannot be published to the college platform.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Rejection Reason <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="State policy non-compliance, event cancellation, or duplicate submission..."
                className="w-full bg-[#14172f] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
