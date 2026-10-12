import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  MapPin,
  Award,
  CheckCircle2,
  User,
  GraduationCap,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Program } from '../types';
import { Modal } from '../components/ui/Modal';

export const ProgramsPage: React.FC = () => {
  const { programs, enrollProgram } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProgram, setActiveModalProgram] = useState<Program | null>(null);

  const categories = ['All', 'Technical', 'Workshop', 'Bootcamp', 'Cultural'];

  const filteredPrograms = programs.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-panel bg-gradient-to-r from-[#0f122e] via-[#12163b] to-[#1a1038] border border-blue-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs text-blue-300 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Academic & Skill Enhancement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Workshops & Programs
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Gain verified credits, certificates of mastery, and practical lab experience through expert-led bootcamps, quantum computing series, and autonomous systems workshops.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search programs or mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101222] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
      </div>

      {/* Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map((prog) => {
          const percentFull = Math.min(100, Math.round((prog.enrolledCount / prog.maxCapacity) * 100));

          return (
            <div
              key={prog.id}
              className="rounded-3xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-all duration-300 group shadow-xl"
            >
              {/* Program Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1124] via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                  {prog.category}
                </span>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-slate-200 border border-white/10">
                  {prog.duration}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-2 mt-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{prog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span className="truncate">{prog.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate text-slate-300">{prog.instructor}</span>
                    </div>
                  </div>

                  {/* Enrollment Capacity Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Enrollment</span>
                      <span className="text-blue-300 font-semibold font-mono">
                        {prog.enrolledCount}/{prog.maxCapacity} Seats ({percentFull}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentFull}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setActiveModalProgram(prog)}
                    className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    Curriculum Details
                  </button>

                  {prog.isEnrolled ? (
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => enrollProgram(prog.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                    >
                      Enroll Free
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="p-12 text-center rounded-3xl glass-panel">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No programs found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try checking another category or clearing your search term.
          </p>
        </div>
      )}

      {/* Program Details Modal */}
      {activeModalProgram && (
        <Modal
          isOpen={!!activeModalProgram}
          onClose={() => setActiveModalProgram(null)}
          title={activeModalProgram.title}
          subtitle={`Led by ${activeModalProgram.instructor} • ${activeModalProgram.duration}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={activeModalProgram.image}
                alt={activeModalProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1f] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/40 text-blue-200 text-xs font-mono border border-blue-400/30">
                  {activeModalProgram.category}
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Program Syllabus & Curriculum
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {activeModalProgram.longDescription || activeModalProgram.description}
              </p>

              <div className="space-y-2">
                {activeModalProgram.curriculum.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3 text-xs text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 font-mono flex items-center justify-center font-bold flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites & Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400">
                  Prerequisites
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeModalProgram.prerequisites}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Accreditation
                </span>
                <p className="text-xs text-emerald-300 font-semibold">
                  Verified PRISM Digital Credential & 2.0 Academic Credits
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalProgram(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
              >
                Close
              </button>
              {activeModalProgram.isEnrolled ? (
                <span className="px-5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrolled In Session</span>
                </span>
              ) : (
                <button
                  onClick={() => {
                    enrollProgram(activeModalProgram.id);
                    setActiveModalProgram(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-transform"
                >
                  Confirm Registration Free
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
