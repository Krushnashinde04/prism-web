import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Search,
  Sparkles,
  Ticket,
  ChevronDown,
  CheckCircle2,
  X,
  Clock,
  AlertTriangle,
  Info,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    theme,
    toggleTheme,
    setMobileSidebarOpen,
    announcements,
    passes,
    sidebarCollapsed,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    switchTabRole,
  } = useApp();

  const navigate = useNavigate();
  const roleLower = (user?.role || 'student').toLowerCase();
  const isAdmin = roleLower === 'admin' || roleLower === 'administrator';
  const isMember = roleLower === 'member' || roleLower === 'team lead';

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationTab, setNotificationTab] = useState<'alerts' | 'announcements'>('alerts');

  return (
    <header
      className={`sticky top-0 z-30 h-20 bg-[#07080f]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Page Breadcrumb/Badge */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-all"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Campus Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-medium">PRISM Campus Live</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Spring Session 2026</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, teams, workshops, passes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101222]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/40 transition-all"
            />
            {searchQuery && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                Press Enter
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions & Student summary */}
        <div className="flex items-center gap-3">
          {/* Quick Passes Shortcut */}
          <NavLink
            to="/payments-and-passes"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all group"
            title="My Digital Passes"
          >
            <Ticket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Passes</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/30 rounded-full text-[10px]">
              {passes.length}
            </span>
          </NavLink>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-purple-400" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((prev) => !prev)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all relative"
              title="Announcements & Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse border border-[#07080f]">
                  {unreadNotificationCount}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </button>

            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel bg-[#0d0f22]/98 border border-purple-500/30 rounded-2xl shadow-2xl p-4 z-50 animate-scale-up">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">Notifications</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Mark Read</span>
                        </button>
                      )}
                      <span className="text-[10px] text-purple-300 font-mono bg-purple-500/20 px-2 py-0.5 rounded-full">
                        {unreadNotificationCount} Unread
                      </span>
                    </div>
                  </div>

                  {/* Tabs: Platform Alerts vs Campus Broadcasts */}
                  <div className="flex items-center gap-1 my-2 p-1 bg-[#12152e] rounded-xl border border-white/5 text-xs">
                    <button
                      onClick={() => setNotificationTab('alerts')}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                        notificationTab === 'alerts'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      System Alerts ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotificationTab('announcements')}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                        notificationTab === 'announcements'
                          ? 'bg-purple-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Broadcasts ({announcements.length})
                    </button>
                  </div>

                  {/* TAB 1: Real System & Role Notifications */}
                  {notificationTab === 'alerts' && (
                    <div className="py-1 divide-y divide-white/5 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center">No notifications at this time.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`py-2.5 px-2 rounded-xl transition-colors cursor-pointer ${
                              !n.read ? 'bg-purple-500/10 hover:bg-purple-500/15' : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  n.type === 'danger'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : n.type === 'success'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : n.type === 'warning'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                }`}
                              >
                                {n.type}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <h5 className="text-xs font-semibold text-white mt-1 leading-snug">
                              {n.title}
                            </h5>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>

                            {n.link && (
                              <NavLink
                                to={n.link}
                                onClick={() => setNotificationsOpen(false)}
                                className="inline-block mt-1 text-[11px] text-cyan-400 hover:underline font-semibold"
                              >
                                View Action →
                              </NavLink>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* TAB 2: Campus Broadcasts */}
                  {notificationTab === 'announcements' && (
                    <div className="py-1 divide-y divide-white/5 max-h-72 overflow-y-auto">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="py-2.5 hover:bg-white/[0.03] px-2 rounded-lg transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                ann.category === 'Urgent'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : ann.category === 'Campus'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              }`}
                            >
                              {ann.category}
                            </span>
                            <span className="text-[11px] text-slate-400">{ann.date}</span>
                          </div>
                          <h5 className="text-xs font-semibold text-white mt-1 leading-snug">
                            {ann.title}
                          </h5>
                          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                            {ann.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 text-center">
                    <NavLink
                      to="/"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-block py-1"
                    >
                      Campus Broadcast Board →
                    </NavLink>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Tab Role Switcher (Allows testing Admin, Member, and Student simultaneously in different tabs) */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => {
                switchTabRole('admin');
                navigate('/admin');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isAdmin
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Set this browser tab to Admin role"
            >
              🛡️ Admin
            </button>
            <button
              type="button"
              onClick={() => {
                switchTabRole('member');
                navigate('/member');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isMember
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Set this browser tab to PRISM Member role"
            >
              👥 Member
            </button>
            <button
              type="button"
              onClick={() => {
                switchTabRole('student');
                navigate('/');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                !isAdmin && !isMember
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Set this browser tab to Student / Other User"
            >
              🎓 Other / Student
            </button>
          </div>

          {/* Student Profile avatar mini chip */}
          <NavLink
            to="/settings"
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-white/10 group"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={user?.name || 'User'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
              }}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/30 group-hover:ring-purple-400 transition-all"
            />
            <div className="hidden lg:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {user?.name || 'Student'}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    (user?.role || '').toLowerCase().includes('admin')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : (user?.role || '').toLowerCase().includes('member')
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : (user?.role || '').toLowerCase().includes('guest')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}
                >
                  {(user?.role || '').toLowerCase().includes('admin')
                    ? 'ADMIN'
                    : (user?.role || '').toLowerCase().includes('member')
                    ? 'MEMBER'
                    : (user?.role || '').toLowerCase().includes('guest')
                    ? 'GUEST'
                    : 'STUDENT'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {user?.department?.split('&')[0] || 'Engineering'}
              </span>
            </div>
            <ChevronDown className="hidden lg:block w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </NavLink>
        </div>
      </div>
    </header>
  );
};
