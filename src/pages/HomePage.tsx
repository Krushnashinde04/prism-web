import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  Users2,
  BookOpen,
  Ticket,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QRCodeComponent } from '../components/ui/QRCodeComponent';

export const HomePage: React.FC = () => {
  const {
    user,
    events,
    programs,
    teams,
    payments,
    passes,
    announcements,
    enrollProgram,
    registerForEvent,
  } = useApp();

  const myTeams = teams.filter((t) => t.status === 'member');
  const upcomingEvents = events.slice(0, 3);
  const featuredPrograms = programs.slice(0, 2);
  const myRegisteredEvents = events.filter((e) => e.isRegistered);
  const recentPayments = payments.slice(0, 4);
  const activePass = passes[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Personalized Greeting Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel bg-gradient-to-r from-purple-900/40 via-[#0e1124] to-cyan-900/30 border border-purple-500/20 p-6 sm:p-10 shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs text-purple-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Academic Year 2026 • Spring Session</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {user?.name || 'Scholar'}!
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Your college command center is synced. You have{' '}
              <span className="text-cyan-300 font-bold">{myRegisteredEvents.length} active event registrations</span>,{' '}
              <span className="text-purple-300 font-bold">{passes.length} digital passes</span> ready, and{' '}
              <span className="text-emerald-300 font-bold">{myTeams.length} joined teams</span>.
            </p>
          </div>

          {/* Quick Profile Mini Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md self-start md:self-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user?.name || 'Student'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-lg"
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{user?.name}</span>
              <span className="text-xs text-slate-400 font-mono">{user?.studentId}</span>
              <span className="text-xs text-purple-300 font-medium">{user?.department}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick-Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Explore Events */}
        <NavLink
          to="/events"
          className="group relative p-5 rounded-2xl glass-card hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-transparent border border-white/10 hover:border-purple-500/40 transition-all duration-300 overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
            Explore Events
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            TechFests, Hackathons, Stargazing, and Cultural Galas.
          </p>
        </NavLink>

        {/* Card 2: Join a Team */}
        <NavLink
          to="/teams"
          className="group relative p-5 rounded-2xl glass-card hover:bg-gradient-to-br hover:from-cyan-900/30 hover:to-transparent border border-white/10 hover:border-cyan-500/40 transition-all duration-300 overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Users2 className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
            Join a Team
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Collaborate in Technical, Media, Documentation, and Management teams.
          </p>
        </NavLink>

        {/* Card 3: View Programs */}
        <NavLink
          to="/programs"
          className="group relative p-5 rounded-2xl glass-card hover:bg-gradient-to-br hover:from-blue-900/30 hover:to-transparent border border-white/10 hover:border-blue-500/40 transition-all duration-300 overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
            View Programs
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Hands-on bootcamps, Quantum Computing, and AI swarms.
          </p>
        </NavLink>

        {/* Card 4: My Passes */}
        <NavLink
          to="/payments-and-passes"
          className="group relative p-5 rounded-2xl glass-card hover:bg-gradient-to-br hover:from-emerald-900/30 hover:to-transparent border border-white/10 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Ticket className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold">
              {passes.length} Ready
            </span>
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            My Passes
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Digital QR tickets, check-in barcodes & receipt downloads.
          </p>
        </NavLink>
      </div>

      {/* 3. Main Split Section: Active Digital Pass & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Digital Pass Card (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-cyan-400" />
              <span>Active Digital Pass</span>
            </h2>
            <NavLink
              to="/payments-and-passes"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              All Passes ({passes.length}) →
            </NavLink>
          </div>

          {activePass ? (
            <div className="relative rounded-3xl glass-panel bg-gradient-to-b from-[#13162e] to-[#0c0d1c] border border-cyan-500/30 p-6 shadow-2xl overflow-hidden group">
              {/* Ticket Edge Notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07080f] border-r border-white/10" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07080f] border-l border-white/10" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  {activePass.tier}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  {activePass.checkInStatus}
                </span>
              </div>

              <div className="py-4">
                <h4 className="text-base font-bold text-white leading-tight">
                  {activePass.eventTitle}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                  <CalendarDays className="w-3.5 h-3.5 text-purple-400" />
                  <span>{activePass.eventDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span className="truncate">{activePass.venue}</span>
                </div>
              </div>

              {/* QR Code Matrix */}
              <div className="flex flex-col items-center justify-center py-3 bg-black/30 rounded-2xl border border-white/5 my-2">
                <QRCodeComponent value={activePass.registrationNumber} size={110} />
                <span className="font-mono text-xs font-bold text-slate-300 mt-2 tracking-wider">
                  {activePass.registrationNumber}
                </span>
              </div>

              <div className="pt-3 border-t border-dashed border-white/15 flex items-center justify-between text-xs text-slate-400">
                <span>Attendee: {activePass.studentName}</span>
                <NavLink
                  to="/payments-and-passes"
                  className="text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  View Details →
                </NavLink>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl glass-panel text-center">
              <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No active passes yet</p>
              <NavLink
                to="/events"
                className="mt-3 inline-block px-4 py-2 text-xs font-bold text-white bg-purple-600 rounded-xl"
              >
                Register for an Event
              </NavLink>
            </div>
          )}

          {/* Quick Payment Status Box */}
          <div className="rounded-2xl glass-card p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Payment Summary
              </span>
              <NavLink to="/payments-and-passes" className="text-xs text-purple-400 font-semibold">
                History
              </NavLink>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <span className="text-xs text-slate-300">Total Transactions</span>
              <span className="text-sm font-bold text-white">{payments.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <span className="text-xs text-slate-300">Successful Cleared</span>
              <span className="text-sm font-bold text-emerald-400">
                {payments.filter((p) => p.status === 'Successful').length}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Events & Featured Programs (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-purple-400" />
                  <span>Upcoming College Events</span>
                </h2>
                <p className="text-xs text-slate-400">Curated campus competitions and keynotes</p>
              </div>
              <NavLink
                to="/events"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                Explore All Events →
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl glass-card border border-white/10 overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col shadow-lg"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={evt.poster}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1124] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-white/10 uppercase tracking-wider">
                      {evt.category}
                    </span>
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-600/80 backdrop-blur-md text-[11px] font-bold text-white">
                      {evt.fee === 0 ? 'FREE' : `$${evt.fee}`}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          {evt.date}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {evt.registeredCount} / {evt.capacity} registered
                      </span>
                      {evt.isRegistered ? (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => registerForEvent(evt.id)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                        >
                          Register Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Programs and Workshops */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>Featured Programs & Workshops</span>
                </h2>
                <p className="text-xs text-slate-400">Skill certifications and advanced labs</p>
              </div>
              <NavLink
                to="/programs"
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
              >
                View All Programs →
              </NavLink>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="rounded-2xl glass-card border border-white/10 p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                        {prog.category}
                      </span>
                      <span className="text-xs text-slate-400">{prog.duration}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white hover:text-blue-300 transition-colors">
                      {prog.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="text-xs text-slate-400">
                      Instructor: <span className="text-slate-300 font-medium">{prog.instructor}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {prog.enrolledCount}/{prog.maxCapacity} Enrolled
                    </span>
                    {prog.isEnrolled ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                        Enrolled
                      </span>
                    ) : (
                      <button
                        onClick={() => enrollProgram(prog.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                      >
                        Enroll Free
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: My Teams & Campus Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* My Teams Section (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users2 className="w-5 h-5 text-cyan-400" />
              <span>My Teams & Communities</span>
            </h2>
            <NavLink to="/teams" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Browse All Teams ({teams.length}) →
            </NavLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myTeams.map((team) => (
              <div
                key={team.id}
                className="p-5 rounded-2xl glass-card border border-white/10 hover:border-cyan-500/30 transition-all flex items-start gap-4"
              >
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{team.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex-shrink-0">
                      Active Member
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {team.tagline}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{team.memberCount} Members</span>
                    <NavLink
                      to="/teams"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Team Hub →
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* College Announcements & Notifications (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Campus Notices</span>
            </h2>
          </div>

          <div className="rounded-2xl glass-panel p-4 divide-y divide-white/10 border border-white/10 space-y-3">
            {announcements.slice(0, 3).map((ann) => (
              <div key={ann.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ann.category === 'Urgent'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <h5 className="text-xs font-bold text-white leading-snug">{ann.title}</h5>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
