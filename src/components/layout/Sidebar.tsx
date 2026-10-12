import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  BookOpen,
  CalendarDays,
  Settings,
  Sparkles,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  ShieldCheck,
  UserPlus,
  Clock,
  FileText,
  BarChart3,
  Activity,
  FileEdit,
  PlusCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplyMembershipModal } from '../modals/ApplyMembershipModal';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    user,
    logout,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    passes,
    membershipRequests,
    websiteContents,
  } = useApp();

  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const roleLower = (user?.role || 'student').toLowerCase();
  const isAdmin = roleLower === 'admin' || roleLower === 'administrator';
  const isMember = roleLower === 'member' || roleLower === 'team lead';

  const pendingRequestsCount = membershipRequests.filter((r) => r.status === 'pending').length;
  const pendingContentCount = websiteContents.filter((c) => c.status === 'Pending Review').length;

  // 1. ADMIN NAVIGATION (12 Items Requested)
  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users2 },
    { name: 'Create PRISM Member', path: '/admin/create-member', icon: UserPlus },
    {
      name: 'Membership Requests',
      path: '/admin/membership-requests',
      icon: Clock,
      badge: pendingRequestsCount > 0 ? String(pendingRequestsCount) : undefined,
    },
    {
      name: 'Manage Website Content',
      path: '/admin/content',
      icon: FileText,
      badge: pendingContentCount > 0 ? String(pendingContentCount) : undefined,
    },
    { name: 'Manage Events', path: '/events', icon: CalendarDays },
    { name: 'Manage Programs', path: '/programs', icon: BookOpen },
    { name: 'Payments & Passes', path: '/payments-and-passes', icon: CreditCard },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Admin Activity Logs', path: '/admin/logs', icon: Activity },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // 2. PRISM MEMBER NAVIGATION
  const memberNavItems: NavItem[] = [
    { name: 'Member Workspace', path: '/member', icon: LayoutDashboard },
    { name: 'Add Website Information', path: '/member/add-content', icon: PlusCircle, badge: 'NEW' },
    { name: 'My Work', path: '/member/submissions', icon: FileText },
    { name: 'Teams', path: '/teams', icon: Users2 },
    { name: 'Programs', path: '/programs', icon: BookOpen },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'PRISM', path: '/prism', icon: Sparkles },
    { name: 'Payments & Passes', path: '/payments-and-passes', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // 3. STUDENT & GUEST NAVIGATION
  const studentNavItems: NavItem[] = [
    { name: 'Home Page', path: '/', icon: LayoutDashboard },
    { name: 'Teams', path: '/teams', icon: Users2 },
    { name: 'Programs', path: '/programs', icon: BookOpen },
    { name: 'Events', path: '/events', icon: CalendarDays },
    { name: 'PRISM', path: '/prism', icon: Sparkles },
    { name: 'Payments & Passes', path: '/payments-and-passes', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const currentNavItems = isAdmin ? adminNavItems : isMember ? memberNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#090b16]/95 border-r border-white/10 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Ambient glow accent behind sidebar */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10 relative z-10">
          <NavLink
            to={isAdmin ? '/admin' : isMember ? '/member' : '/'}
            onClick={() => setMobileSidebarOpen(false)}
            className="flex items-center gap-3 group"
          >
            {/* PRISM Emblem Logo */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0c1a] rounded-[10px] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyan-400 group-hover:text-purple-300 transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <line x1="12" y1="22" x2="12" y2="15.5" />
                  <polyline points="22 8.5 12 15.5 2 8.5" />
                </svg>
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  PRISM
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
                  {isAdmin ? 'ADMIN CONSOLE' : isMember ? 'MEMBER PORTAL' : 'COLLEGE PLATFORM'}
                </span>
              </div>
            )}
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all ml-auto"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto relative z-10 custom-scrollbar">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/' || item.path === '/admin' || item.path === '/member'}
                onClick={() => setMobileSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/30 via-blue-600/20 to-transparent text-white border-l-4 border-purple-500 font-bold shadow-lg shadow-purple-900/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                        isActive
                          ? 'text-purple-400 scale-110'
                          : 'group-hover:text-cyan-400 group-hover:scale-110'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      {isActive && (
                        <div className="absolute inset-0 bg-purple-500/30 blur-md rounded-full pointer-events-none" />
                      )}
                    </div>

                    {!sidebarCollapsed && (
                      <span className="truncate flex-1 tracking-wide">
                        {item.name}
                      </span>
                    )}

                    {!sidebarCollapsed && item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}

                    {!sidebarCollapsed && item.name === 'Payments & Passes' && passes.length > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {passes.length}
                      </span>
                    )}

                    {/* Tooltip on collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#121528] border border-purple-500/30 rounded-lg text-xs font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
                        {item.name}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Student "Apply for PRISM" Callout button if not admin or member */}
          {!isAdmin && !isMember && (
            <div className="pt-2">
              {!sidebarCollapsed ? (
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full mt-2 p-2.5 rounded-xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                    <span>Join PRISM Core</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Apply to join official collegiate teams & contribute content.
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full flex items-center justify-center p-2.5 rounded-xl hover:bg-white/5 text-cyan-400 relative group"
                  title="Apply for PRISM Membership"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </nav>

        {/* User Profile & Logout Section at Bottom */}
        <div className="p-3 border-t border-white/10 relative z-10 bg-[#070913]/60">
          {!sidebarCollapsed ? (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/settings"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name || 'User'}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                    }}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/40"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#090b16] rounded-full" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                      {user?.name || 'Student'}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isAdmin
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isMember
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : roleLower === 'guest'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {isAdmin ? 'ADMIN' : isMember ? 'MEMBER' : roleLower === 'guest' ? 'GUEST' : 'STUDENT'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 truncate">
                    {user?.studentId || 'PRISM-ID'}
                  </span>
                </div>
              </NavLink>

              <button
                onClick={logout}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <NavLink
                to="/settings"
                className="relative group p-1"
                title={user?.name || 'Profile'}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={user?.name || 'User'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                  }}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/40"
                />
              </NavLink>
              <button
                onClick={logout}
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Student Membership Application Modal */}
      <ApplyMembershipModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </>
  );
};
