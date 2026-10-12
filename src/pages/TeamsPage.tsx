import React, { useState } from 'react';
import {
  Users2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  UserPlus,
  UserCheck,
  Calendar,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Team, TeamCategory } from '../types';
import { Modal } from '../components/ui/Modal';

export const TeamsPage: React.FC = () => {
  const { teams, joinTeam, leaveTeam } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalTeam, setActiveModalTeam] = useState<Team | null>(null);

  const categories = [
    { label: 'All Teams', emoji: '✨', value: 'All' },
    { label: 'Technical Team', emoji: '🔴', value: 'Technical' },
    { label: 'Media Team', emoji: '🟡', value: 'Media' },
    { label: 'Documentation Team', emoji: '🟢', value: 'Documentation' },
    { label: 'Management Team', emoji: '🔵', value: 'Management' },
  ];

  const filteredTeams = teams.filter((t) => {
    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/20';
      case 'Media':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/20';
      case 'Documentation':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20';
      case 'Management':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/20';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    }
  };

  const getCardHoverClass = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'hover:border-rose-500/60 hover:shadow-rose-500/20';
      case 'Media':
        return 'hover:border-amber-500/60 hover:shadow-amber-500/20';
      case 'Documentation':
        return 'hover:border-emerald-500/60 hover:shadow-emerald-500/20';
      case 'Management':
        return 'hover:border-blue-500/60 hover:shadow-blue-500/20';
      default:
        return 'hover:border-cyan-500/50 hover:shadow-cyan-500/20';
    }
  };

  const getButtonClass = (category: string) => {
    switch (category) {
      case 'Technical':
        return 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30';
      case 'Media':
        return 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30';
      case 'Documentation':
        return 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30';
      case 'Management':
        return 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30';
      default:
        return 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl glass-panel bg-gradient-to-r from-[#0d1029] via-[#101332] to-[#0a182b] border border-cyan-500/20 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 font-semibold">
            <Users2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official College Teams</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            PRISM Campus Teams
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Collaborate in our specialized core wings: 🔴 Technical Team, 🟡 Media Team, 🟢 Documentation Team, and 🔵 Management Team. Join squads, lead initiatives, and build high-impact collegiate solutions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-600/30 border border-white/20'
                  : 'bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams by skill or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101222] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className={`rounded-3xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 group shadow-2xl ${getCardHoverClass(
              team.category
            )}`}
          >
            {/* Banner & Logo */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={team.banner}
                alt={team.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1124] via-black/40 to-transparent" />
              <span
                className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full backdrop-blur-md text-xs font-bold border flex items-center gap-1.5 shadow-lg ${getCategoryBadgeClass(
                  team.category
                )}`}
              >
                <span>{team.badgeEmoji}</span>
                <span>{team.category} Wing</span>
              </span>
            </div>

            {/* Content Info */}
            <div className="p-6 pt-0 flex-1 flex flex-col justify-between relative">
              {/* Floating Club Crest */}
              <div className="-mt-10 mb-3 relative z-10 flex items-end justify-between">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#0e1124] shadow-2xl"
                />
                <span className="text-xs text-slate-300 font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{team.memberCount} Members</span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{team.badgeEmoji}</span>
                  <h3 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {team.name}
                  </h3>
                </div>
                <p className="text-xs text-cyan-400 font-semibold italic mt-1">
                  "{team.tagline}"
                </p>
                <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                  {team.description}
                </p>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {team.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-200 text-[11px] font-mono border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveModalTeam(team)}
                  className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  View Team Details
                </button>

                {team.status === 'member' ? (
                  <button
                    onClick={() => leaveTeam(team.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 group/leave"
                  >
                    <UserCheck className="w-3.5 h-3.5 group-hover/leave:hidden" />
                    <span className="group-hover/leave:hidden">Joined Member</span>
                    <span className="hidden group-hover/leave:inline">Leave Team</span>
                  </button>
                ) : team.status === 'pending' ? (
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Join Pending</span>
                  </button>
                ) : (
                  <button
                    onClick={() => joinTeam(team.id)}
                    className={`px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${getButtonClass(
                      team.category
                    )}`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Join Team</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="p-12 text-center rounded-3xl glass-panel">
          <Users2 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No teams matched your filter</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try choosing a different team category or clearing the search query.
          </p>
        </div>
      )}

      {/* Team Details Modal */}
      {activeModalTeam && (
        <Modal
          isOpen={!!activeModalTeam}
          onClose={() => setActiveModalTeam(null)}
          title={`${activeModalTeam.badgeEmoji || ''} ${activeModalTeam.name}`}
          subtitle={`Department Category: ${activeModalTeam.category} Wing • Active Since ${activeModalTeam.established}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Banner & Profile */}
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img
                src={activeModalTeam.banner}
                alt={activeModalTeam.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1f] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3.5">
                <img
                  src={activeModalTeam.logo}
                  alt={activeModalTeam.name}
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/20 shadow-xl"
                />
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span>{activeModalTeam.badgeEmoji}</span>
                    <span>{activeModalTeam.name}</span>
                  </h4>
                  <p className="text-xs text-cyan-300 font-mono">
                    {activeModalTeam.memberCount} Active Scholars & Leads
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Mission & Strategic Role
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed">
                {activeModalTeam.description}
              </p>
            </div>

            {/* Leadership & Mentors */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Team Leadership & Mentorship
                </span>
                <p className="text-sm font-bold text-white mt-0.5">{activeModalTeam.lead}</p>
                <p className="text-xs text-slate-400">{activeModalTeam.leadRole}</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Official PRISM Wing
              </span>
            </div>

            {/* Recent Activities */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                Recent Projects & Deliverables
              </h5>
              <div className="space-y-3">
                {activeModalTeam.recentActivities.map((act, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{act.title}</span>
                      <span className="text-[11px] text-purple-300 font-mono">{act.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Club Announcements */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                Team Announcements
              </h5>
              <ul className="space-y-2">
                {activeModalTeam.announcements.map((ann, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-cyan-500/5 p-2.5 rounded-xl border border-cyan-500/10"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                    <span>{ann}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setActiveModalTeam(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
              >
                Close
              </button>
              {activeModalTeam.status === 'member' ? (
                <button
                  onClick={() => {
                    leaveTeam(activeModalTeam.id);
                    setActiveModalTeam(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold border border-rose-500/30 transition-all"
                >
                  Leave Team
                </button>
              ) : (
                <button
                  onClick={() => {
                    joinTeam(activeModalTeam.id);
                    setActiveModalTeam(null);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all ${getButtonClass(
                    activeModalTeam.category
                  )}`}
                >
                  Join {activeModalTeam.name}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
