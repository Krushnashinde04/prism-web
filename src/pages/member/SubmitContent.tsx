import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileEdit,
  Sparkles,
  Save,
  Send,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Code,
  Eye,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContentCategory } from '../../types';

export const SubmitContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, teams, submitContent, addToast } = useApp();

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ContentCategory>('College Announcements');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80');
  const [additionalImages, setAdditionalImages] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState('');
  const [relatedTeam, setRelatedTeam] = useState(teams[0]?.name || 'Technical Team');
  const [externalLink, setExternalLink] = useState('');

  // Editor mode: edit vs live preview
  const [previewMode, setPreviewMode] = useState(false);

  // Cover image preset picker
  const coverPresets = [
    { label: 'Tech & Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Campus & Announcement', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Workshop & Lab', url: 'https://images.unsplash.com/photo-1517976487502-5bfb04d1efc9?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Space & OrbitX', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Rich-Text Markdown helpers
  const applyFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('fullDescriptionTextarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = fullDescription.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      fullDescription.substring(0, start) +
      replacement +
      fullDescription.substring(end);

    setFullDescription(newContent);
  };

  const handleSave = (status: 'Draft' | 'Pending Review') => {
    if (!title.trim() || !shortDescription.trim()) {
      addToast('Required Fields Missing', 'Please enter a Content Title and Short Description.', 'error');
      return;
    }

    try {
      const extraImagesArray = additionalImages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      submitContent({
        title: title.trim(),
        category,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim() || shortDescription.trim(),
        coverImage,
        additionalImages: extraImagesArray,
        eventDate: eventDate || undefined,
        eventTime: eventTime || undefined,
        venue: venue || undefined,
        relatedTeam,
        externalLink: externalLink || undefined,
        status,
      });

      if (status === 'Draft') {
        addToast('Draft Saved', `"${title}" has been saved in your drafts.`, 'info');
      } else {
        addToast('Submitted for Review', `"${title}" is now awaiting Administrator approval.`, 'success');
      }

      navigate('/member/submissions');
    } catch (err: any) {
      addToast('Submission Error', err.message || 'Failed to submit content.', 'error');
    }
  };

  const isEventOrWorkshop =
    category === 'Events' ||
    category === 'Workshops' ||
    category === 'Competitions' ||
    category === 'Programs';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PRISM Member Editorial Studio</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Add Website Information</h1>
          <p className="text-sm text-slate-300 mt-1">
            Author and publish news, team updates, workshops, or campus events directly through the web platform.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave('Draft')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-300" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('Pending Review')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit for Approval</span>
          </button>
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="rounded-3xl glass-panel bg-[#090c1e] border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <FileEdit className="w-4 h-4 text-cyan-400" />
            <span>Post Metadata & Category</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Content Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex 2026: Annual Intercollegiate Hackathon Open"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ContentCategory)}
                className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-semibold"
              >
                <option value="College Announcements">College Announcements</option>
                <option value="News">Campus News</option>
                <option value="Events">College Events</option>
                <option value="Programs">Programs & Bootcamps</option>
                <option value="Team Activities">Team Activities</option>
                <option value="Achievements">Achievements & Accolades</option>
                <option value="Workshops">Workshops</option>
                <option value="Competitions">Competitions</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Short Description / Executive Summary <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="A concise 1-2 sentence overview shown on cards, cards feeds, and notifications..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-[#12152d] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Section 2: Rich Text Body Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Full Description (Rich-Text Editor)</span>
            </h3>

            {/* Toggle Preview Button */}
            <button
              type="button"
              onClick={() => setPreviewMode((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                previewMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{previewMode ? 'Back to Editor' : 'Live Preview'}</span>
            </button>
          </div>

          {!previewMode ? (
            <div className="space-y-2">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#12152d] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => applyFormatting('**', '**')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('*', '*')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('### ', '')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Heading"
                >
                  <Heading className="w-4 h-4" />
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button
                  type="button"
                  onClick={() => applyFormatting('- ', '')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('> ', '')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Quote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('`', '`')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
                  title="Inline Code"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>

              <textarea
                id="fullDescriptionTextarea"
                rows={9}
                placeholder="Write detailed announcements, schedules, speaker biographies, or requirements..."
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full bg-[#12152d] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-slate-500 font-sans leading-relaxed focus:outline-none focus:border-purple-400"
              />
            </div>
          ) : (
            /* Live Preview Mode */
            <div className="p-6 rounded-2xl bg-[#12152d]/60 border border-purple-500/30 min-h-[200px] text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-3">
              <h2 className="text-xl font-bold text-white">{title || 'Content Title Preview'}</h2>
              <p className="text-purple-300 italic">{shortDescription || 'Executive summary...'}</p>
              <div className="pt-2 border-t border-white/10 text-slate-300">
                {fullDescription || 'Full article contents will appear here in formatted typography...'}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Visual Poster & Images */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Cover Poster & Media Gallery</span>
          </h3>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 block">Cover Image / Poster URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold">Or select thematic poster:</span>
              {coverPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    coverImage === preset.url
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Poster Preview */}
            {coverImage && (
              <div className="rounded-2xl overflow-hidden aspect-[21/9] max-h-48 border border-white/10 shadow-lg relative">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Additional Gallery Images (Comma-separated URLs)
            </label>
            <input
              type="text"
              placeholder="https://image1.jpg, https://image2.jpg"
              value={additionalImages}
              onChange={(e) => setAdditionalImages(e.target.value)}
              className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Section 4: Schedule, Venue & Logistics (When applicable) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Event & Workshop Schedule (Optional)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Time</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 04:00 PM EST"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Venue / Lab Room</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. PRISM Innovation Hall B"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Related Team / Committee</label>
              <select
                value={relatedTeam}
                onChange={(e) => setRelatedTeam(e.target.value)}
                className="w-full bg-[#12152d] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">External Resource / Registration URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full bg-[#12152d] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Submission Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Submissions are queued for administrator verification before going live on the platform.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSave('Draft')}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4 text-slate-300" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('Pending Review')}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit for Approval</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
