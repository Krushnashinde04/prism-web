import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  UserRole,
  Team,
  Program,
  CollegeEvent,
  PaymentRecord,
  DigitalPass,
  Announcement,
  UserAccount,
  MembershipRequest,
  WebsiteContent,
  AdminAuditLog,
  AppNotification,
} from '../types';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import {
  INITIAL_USER,
  INITIAL_ADMIN_USER,
  INITIAL_MEMBER_USER,
  INITIAL_TEAMS,
  INITIAL_PROGRAMS,
  INITIAL_EVENTS,
  INITIAL_PAYMENTS,
  INITIAL_PASSES,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  toasts: ToastMessage[];
  teams: Team[];
  programs: Program[];
  events: CollegeEvent[];
  payments: PaymentRecord[];
  passes: DigitalPass[];
  announcements: Announcement[];
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;

  // Database Collections
  users: UserAccount[];
  membershipRequests: MembershipRequest[];
  websiteContents: WebsiteContent[];
  publishedContents: WebsiteContent[];
  auditLogs: AdminAuditLog[];
  notifications: AppNotification[];
  unreadNotificationCount: number;

  // Core Actions
  login: (emailOrId: string, password: string, remember: boolean) => Promise<boolean>;
  loginWithRole: (
    targetRole: 'admin' | 'member' | 'student',
    identifier: string,
    password?: string,
    remember?: boolean
  ) => Promise<{ success: boolean; redirectPath: string; error?: string }>;
  loginAsGuest: () => Promise<string>;
  logout: () => void;
  switchTabRole: (role: 'admin' | 'member' | 'student') => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  updatePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  toggleTheme: () => void;
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  joinTeam: (teamId: string) => void;
  leaveTeam: (teamId: string) => void;
  deleteTeam: (teamId: string) => void;
  addTeam: (team: Omit<Team, 'id' | 'memberCount' | 'status'>) => void;
  publishAnnouncement: (ann: Omit<Announcement, 'id' | 'date'>) => void;
  enrollProgram: (programId: string) => void;
  registerForEvent: (eventId: string, paymentMethod?: string) => Promise<DigitalPass | null>;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  setMobileSidebarOpen: (open: boolean) => void;

  // Admin User Powers
  blockUser: (userId: string, reason: string) => void;
  unblockUser: (userId: string) => void;
  suspendUser: (userId: string, days: number, reason: string) => void;
  createMember: (memberData: Omit<UserAccount, 'id' | 'role' | 'joinedDate'>) => UserAccount;

  // Membership Applications
  submitMembershipRequest: (req: Omit<MembershipRequest, 'id' | 'status' | 'submittedAt'>) => void;
  approveMembershipRequest: (id: string, team: string, designation: string) => void;
  rejectMembershipRequest: (id: string, reason: string) => void;

  // Member & Admin Content Workflow
  submitContent: (contentData: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'authorEmail' | 'authorRole'>) => WebsiteContent;
  updateContent: (id: string, updates: Partial<WebsiteContent>) => void;
  approveContent: (id: string) => void;
  requestContentChanges: (id: string, feedback: string) => void;
  rejectContent: (id: string, reason: string) => void;
  publishContent: (id: string) => void;
  unpublishContent: (id: string) => void;
  archiveContent: (id: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to determine the session for THIS specific browser tab
const getInitialUserForCurrentTab = (): StudentProfile => {
  // 1. Look for tab-isolated session in sessionStorage
  try {
    const tabSaved = sessionStorage.getItem('prism_user');
    if (tabSaved) {
      const parsed = JSON.parse(tabSaved);
      if (parsed && parsed.role) return parsed;
    }
  } catch {}

  // 2. Tab URL detection: If tab is opened directly to /admin or /member,
  // initialize this tab with that role so multiple tabs can coexist simultaneously!
  try {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/admin')) {
      return INITIAL_ADMIN_USER;
    }
    if (path.startsWith('/member')) {
      return INITIAL_MEMBER_USER;
    }
  } catch {}

  // 3. Fallback to localStorage (if student/other) or default student
  try {
    const globalSaved = localStorage.getItem('prism_user');
    if (globalSaved) {
      const parsed = JSON.parse(globalSaved);
      if (parsed && parsed.role && parsed.role.toLowerCase() !== 'admin' && parsed.role.toLowerCase() !== 'member') {
        return parsed;
      }
    }
  } catch {}

  return INITIAL_USER;
};

const getInitialAuthForCurrentTab = (): boolean => {
  try {
    const tabAuth = sessionStorage.getItem('prism_auth');
    if (tabAuth !== null) {
      return JSON.parse(tabAuth);
    }
  } catch {}
  return true;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user profile (isolated per browser tab)
  const [user, setUser] = useState<StudentProfile | null>(getInitialUserForCurrentTab);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuthForCurrentTab);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('prism_theme');
    return (savedTheme as 'dark' | 'light') || 'dark';
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('prism_teams');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((t: any) => t.id === 'team_technical' || t.id === 'team_media')) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_TEAMS;
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem('prism_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [events, setEvents] = useState<CollegeEvent[]>(() => {
    const saved = localStorage.getItem('prism_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('prism_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [passes, setPasses] = useState<DigitalPass[]>(() => {
    const saved = localStorage.getItem('prism_passes');
    if (saved) {
      try {
        const parsed: DigitalPass[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (
            !p.studentId ||
            p.studentId.includes('2024-8842') ||
            p.studentId === 'PRISM-125UEE1005' ||
            p.studentId === 'PRISM-000ABC0000'
          ) {
            return { ...p, studentId: 'PRISM-000UEC0000' };
          }
          return p;
        });
      } catch {}
    }
    return INITIAL_PASSES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('prism_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // DATABASE STATE COLLECTIONS
  const [users, setUsers] = useState<UserAccount[]>(() => dbService.getUsers());
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>(() => dbService.getMembershipRequests());
  const [websiteContents, setWebsiteContents] = useState<WebsiteContent[]>(() => dbService.getContents());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => dbService.getAuditLogs());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => dbService.getNotifications());

  const publishedContents = websiteContents.filter((c) => c.status === 'Published');
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Sync state to tab-isolated sessionStorage so each browser tab maintains its own independent session
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('prism_user', JSON.stringify(user));
      if (user.role && user.role.toLowerCase() === 'student') {
        localStorage.setItem('prism_user', JSON.stringify(user));
      }
    } else {
      sessionStorage.removeItem('prism_user');
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('prism_auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('prism_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('prism_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('prism_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('prism_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('prism_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('prism_passes', JSON.stringify(passes));
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('prism_announcements', JSON.stringify(announcements));
  }, [announcements]);

  // ACTIVE SESSION INVALIDATION FOR BLOCKED USERS
  useEffect(() => {
    if (user && isAuthenticated) {
      const dbUser = dbService.getUserByEmailOrStudentId(user.email);
      if (dbUser && dbUser.status === 'blocked') {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('prism_auth');
        localStorage.removeItem('prism_user');
        addToast(
          'Account Terminated',
          `Your session has been terminated by the Administrator. Reason: ${dbUser.blockReason || 'Policy violation'}`,
          'error'
        );
      }
    }
  }, [users, isAuthenticated]);

  // Toast Helpers
  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    addToast('Theme Updated', `Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 'info');
  };

  // Auth: Role-Based Authentication
  const loginWithRole = async (
    targetRole: 'admin' | 'member' | 'student',
    identifier: string,
    password?: string,
    remember: boolean = false
  ): Promise<{ success: boolean; redirectPath: string; error?: string }> => {
    const res = await authService.authenticate(targetRole, identifier, password);

    if (!res.success || !res.user) {
      addToast('Authentication Failed', res.error || 'Please check your credentials', 'error');
      return { success: false, redirectPath: '/login', error: res.error };
    }

    setUser(res.user);
    setIsAuthenticated(true);
    sessionStorage.setItem('prism_user', JSON.stringify(res.user));
    sessionStorage.setItem('prism_auth', JSON.stringify(true));

    if (remember) {
      localStorage.setItem('prism_remembered_login', identifier);
    }

    addToast(
      `Welcome to PRISM, ${res.user.name}!`,
      `Signed in as ${targetRole === 'admin' ? 'Administrator' : targetRole === 'member' ? 'PRISM Member' : 'Student'}`,
      'success'
    );

    return { success: true, redirectPath: res.redirectPath };
  };

  const loginAsGuest = async (): Promise<string> => {
    const res = await authService.authenticateGuest();
    if (res.user) {
      setUser(res.user);
    }
    setIsAuthenticated(true);
    addToast('Guest Mode Activated', 'Exploring PRISM platform in visitor read-only mode', 'info');
    return res.redirectPath;
  };

  const login = async (emailOrId: string, password: string, remember: boolean): Promise<boolean> => {
    const res = await loginWithRole('student', emailOrId, password, remember);
    return res.success;
  };

  const switchTabRole = (role: 'admin' | 'member' | 'student') => {
    let targetUser = INITIAL_USER;
    if (role === 'admin') targetUser = INITIAL_ADMIN_USER;
    if (role === 'member') targetUser = INITIAL_MEMBER_USER;

    setUser(targetUser);
    setIsAuthenticated(true);
    sessionStorage.setItem('prism_user', JSON.stringify(targetUser));
    sessionStorage.setItem('prism_auth', JSON.stringify(true));
    addToast('Tab Role Active', `Active in this tab as ${targetUser.name} (${targetUser.role.toUpperCase()})`, 'info');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem('prism_auth');
    sessionStorage.removeItem('prism_user');
    localStorage.removeItem('prism_auth');
    localStorage.removeItem('prism_user');
    addToast('Logged Out', 'You have signed out in this browser tab', 'info');
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    if (!user) return;
    const newUser = { ...user, ...updated };
    setUser(newUser);
    if (user.id) {
      dbService.updateUser(user.id, updated, user.name);
      setUsers(dbService.getUsers());
    }
    addToast('Profile Updated', 'Your profile details have been saved', 'success');
  };

  const updatePassword = async (currentPass: string, _newPass: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 600));
    if (!currentPass) {
      addToast('Error', 'Please enter your current password', 'error');
      return false;
    }
    addToast('Password Changed', 'Security credentials updated successfully', 'success');
    return true;
  };

  const joinTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const newStatus = t.status === 'none' ? 'member' : t.status === 'pending' ? 'member' : 'none';
          const newCount = newStatus === 'member' ? t.memberCount + 1 : t.memberCount;
          return { ...t, status: newStatus, memberCount: newCount };
        }
        return t;
      })
    );
    const target = teams.find((t) => t.id === teamId);
    addToast('Team Membership', `You have joined ${target?.name || 'the team'}!`, 'success');
  };

  const leaveTeam = (teamId: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, status: 'none', memberCount: Math.max(0, t.memberCount - 1) } : t))
    );
    const target = teams.find((t) => t.id === teamId);
    addToast('Team Left', `You have left ${target?.name || 'the team'}`, 'info');
  };

  const deleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    dbService.logAudit({
      action: 'Team Deleted',
      category: 'Team Operations',
      target: teamId,
      details: 'Collegiate team removed from platform.',
      severity: 'warning',
      adminEmail: user?.email || 'admin@prism.edu',
      performedBy: user?.name || 'Administrator',
    });
    setAuditLogs(dbService.getAuditLogs());
    addToast('Team Removed', 'The collegiate team has been removed from PRISM', 'info');
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'memberCount' | 'status'>) => {
    const newTeam: Team = {
      ...teamData,
      id: 'team_' + Date.now(),
      memberCount: 1,
      status: 'none',
    };
    setTeams((prev) => [newTeam, ...prev]);
    dbService.logAudit({
      action: 'New Team Created',
      category: 'Team Operations',
      target: newTeam.name,
      details: `Created new team: ${newTeam.name} (${newTeam.category}).`,
      severity: 'info',
      adminEmail: user?.email || 'admin@prism.edu',
      performedBy: user?.name || 'Administrator',
    });
    setAuditLogs(dbService.getAuditLogs());
    addToast('New Team Created', `"${newTeam.name}" has been registered`, 'success');
  };

  const publishAnnouncement = (annData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      id: 'ann_' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...annData,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    dbService.logAudit({
      action: 'Announcement Broadcasted',
      category: 'Content Moderation',
      target: newAnn.title,
      details: `Broadcasted platform announcement: "${newAnn.title}" (${newAnn.category}).`,
      severity: 'info',
      adminEmail: user?.email || 'admin@prism.edu',
      performedBy: user?.name || 'Administrator',
    });
    setAuditLogs(dbService.getAuditLogs());
    addToast('Announcement Broadcasted', `"${newAnn.title}" is now visible to all scholars`, 'success');
  };

  /* ------------------- ADMIN USER MANAGEMENT POWERS ------------------- */

  const blockUser = (userId: string, reason: string) => {
    try {
      const adminEmail = user?.email || 'admin@prism.edu';
      const adminName = user?.name || 'Administrator';
      dbService.blockUser(userId, reason, adminEmail, adminName);
      setUsers(dbService.getUsers());
      setAuditLogs(dbService.getAuditLogs());
      setNotifications(dbService.getNotifications());
      addToast('User Blocked', `Account has been blocked. Reason: ${reason}`, 'info');
    } catch (e: any) {
      addToast('Error', e.message || 'Unable to block user', 'error');
    }
  };

  const unblockUser = (userId: string) => {
    try {
      const adminEmail = user?.email || 'admin@prism.edu';
      const adminName = user?.name || 'Administrator';
      dbService.unblockUser(userId, adminEmail, adminName);
      setUsers(dbService.getUsers());
      setAuditLogs(dbService.getAuditLogs());
      setNotifications(dbService.getNotifications());
      addToast('User Unblocked', 'User account access has been restored', 'success');
    } catch (e: any) {
      addToast('Error', e.message || 'Unable to unblock user', 'error');
    }
  };

  const suspendUser = (userId: string, days: number, reason: string) => {
    try {
      const adminEmail = user?.email || 'admin@prism.edu';
      const adminName = user?.name || 'Administrator';
      dbService.suspendUser(userId, days, reason, adminEmail, adminName);
      setUsers(dbService.getUsers());
      setAuditLogs(dbService.getAuditLogs());
      addToast('User Suspended', `Suspended for ${days} days. Reason: ${reason}`, 'info');
    } catch (e: any) {
      addToast('Error', e.message || 'Unable to suspend user', 'error');
    }
  };

  const createMember = (memberData: Omit<UserAccount, 'id' | 'role' | 'joinedDate'>): UserAccount => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const newMember = dbService.createMemberAccount(memberData, adminEmail, adminName);
    setUsers(dbService.getUsers());
    setAuditLogs(dbService.getAuditLogs());
    setNotifications(dbService.getNotifications());
    addToast('Member Created', `Member ID ${newMember.studentId} assigned to ${newMember.name}!`, 'success');
    return newMember;
  };

  /* ------------------- MEMBERSHIP APPLICATIONS ------------------- */

  const submitMembershipRequest = (req: Omit<MembershipRequest, 'id' | 'status' | 'submittedAt'>) => {
    try {
      const newReq = dbService.submitMembershipRequest(req);
      setMembershipRequests(dbService.getMembershipRequests());
      setNotifications(dbService.getNotifications());
      addToast('Application Submitted', 'Your PRISM membership request is now under faculty review!', 'success');
    } catch (e: any) {
      addToast('Application Error', e.message || 'Unable to submit application', 'error');
    }
  };

  const approveMembershipRequest = (id: string, team: string, designation: string) => {
    try {
      const adminEmail = user?.email || 'admin@prism.edu';
      const adminName = user?.name || 'Administrator';
      dbService.approveMembershipRequest(id, team, designation, adminEmail, adminName);
      setMembershipRequests(dbService.getMembershipRequests());
      setUsers(dbService.getUsers());
      setAuditLogs(dbService.getAuditLogs());
      setNotifications(dbService.getNotifications());
      addToast('Membership Approved', `Granted PRISM Member clearance on ${team}!`, 'success');
    } catch (e: any) {
      addToast('Error', e.message || 'Approval failed', 'error');
    }
  };

  const rejectMembershipRequest = (id: string, reason: string) => {
    try {
      const adminEmail = user?.email || 'admin@prism.edu';
      const adminName = user?.name || 'Administrator';
      dbService.rejectMembershipRequest(id, reason, adminEmail, adminName);
      setMembershipRequests(dbService.getMembershipRequests());
      setAuditLogs(dbService.getAuditLogs());
      setNotifications(dbService.getNotifications());
      addToast('Request Rejected', `Membership application declined with reason: ${reason}`, 'info');
    } catch (e: any) {
      addToast('Error', e.message || 'Action failed', 'error');
    }
  };

  /* ------------------- CONTENT CREATION & APPROVAL WORKFLOW ------------------- */

  const submitContent = (
    contentData: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'authorEmail' | 'authorRole'>
  ): WebsiteContent => {
    const authorId = user?.id || 'usr_member_01';
    const authorName = user?.name || 'PRISM Member';
    const authorEmail = user?.email || 'member@prism.edu';
    const authorRole = user?.role || 'member';

    const newContent = dbService.createContent({
      ...contentData,
      authorId,
      authorName,
      authorEmail,
      authorRole,
    });

    setWebsiteContents(dbService.getContents());
    setNotifications(dbService.getNotifications());

    if (newContent.status === 'Pending Review') {
      addToast('Submitted for Review', `"${newContent.title}" has been submitted to the Admin Council!`, 'success');
    } else {
      addToast('Draft Saved', `"${newContent.title}" draft has been saved.`, 'info');
    }

    return newContent;
  };

  const updateContent = (id: string, updates: Partial<WebsiteContent>) => {
    const updated = dbService.updateContent(id, updates);
    setWebsiteContents(dbService.getContents());
    setNotifications(dbService.getNotifications());
    addToast('Content Updated', `"${updated.title}" changes saved`, 'success');
  };

  const approveContent = (id: string) => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const approved = dbService.approveContent(id, adminEmail, adminName);
    setWebsiteContents(dbService.getContents());
    setAuditLogs(dbService.getAuditLogs());
    setNotifications(dbService.getNotifications());
    addToast('Content Approved', `"${approved.title}" is approved and ready for publishing.`, 'success');
  };

  const requestContentChanges = (id: string, feedback: string) => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const updated = dbService.requestContentChanges(id, feedback, adminEmail, adminName);
    setWebsiteContents(dbService.getContents());
    setAuditLogs(dbService.getAuditLogs());
    setNotifications(dbService.getNotifications());
    addToast('Revisions Requested', `Feedback sent to ${updated.authorName}.`, 'info');
  };

  const rejectContent = (id: string, reason: string) => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const rejected = dbService.rejectContent(id, reason, adminEmail, adminName);
    setWebsiteContents(dbService.getContents());
    setAuditLogs(dbService.getAuditLogs());
    setNotifications(dbService.getNotifications());
    addToast('Content Rejected', `"${rejected.title}" marked as rejected.`, 'info');
  };

  // AUTOMATIC DISTRIBUTION TO PUBLIC PAGES ON PUBLISH
  const publishContent = (id: string) => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const published = dbService.publishContent(id, adminEmail, adminName);
    setWebsiteContents(dbService.getContents());
    setAuditLogs(dbService.getAuditLogs());
    setNotifications(dbService.getNotifications());

    // 1. Announcements & News -> Inject into live announcements
    if (published.category === 'College Announcements' || published.category === 'News') {
      const newAnn: Announcement = {
        id: 'ann_' + published.id,
        title: published.title,
        content: published.shortDescription,
        date: 'Just now',
        category: 'Campus',
        isImportant: true,
      };
      setAnnouncements((prev) => [newAnn, ...prev]);
    }

    // 2. Team Activities -> Inject into live team activities
    if (published.category === 'Team Activities' && published.relatedTeam) {
      setTeams((prev) =>
        prev.map((t) => {
          if (t.name.toLowerCase() === published.relatedTeam?.toLowerCase()) {
            return {
              ...t,
              recentActivities: [
                {
                  title: published.title,
                  date: 'Just now',
                  description: published.shortDescription,
                },
                ...t.recentActivities,
              ],
            };
          }
          return t;
        })
      );
    }

    // 3. Workshops & Programs -> Inject into live programs catalog
    if (published.category === 'Workshops' || published.category === 'Programs') {
      const newProg: Program = {
        id: 'prog_' + published.id,
        title: published.title,
        category: 'Workshop',
        date: published.eventDate || 'Upcoming',
        duration: 'Special Workshop',
        venue: published.venue || 'PRISM Innovation Center',
        description: published.shortDescription,
        longDescription: published.fullDescription,
        instructor: published.authorName,
        instructorRole: 'PRISM Lead Instructor',
        image: published.coverImage || 'https://images.unsplash.com/photo-1517976487502-5bfb04d1efc9?auto=format&fit=crop&w=800&q=80',
        enrolledCount: 1,
        maxCapacity: 60,
        isEnrolled: false,
        curriculum: ['Core Overview & Briefing', 'Hands-on Engineering Lab', 'Live Q&A & Mentorship'],
        prerequisites: 'Open to all students',
        certificateProvided: true,
      };
      setPrograms((prev) => [newProg, ...prev]);
    }

    // 4. Events & Competitions -> Inject into live events catalog
    if (published.category === 'Events' || published.category === 'Competitions') {
      const newEvt: CollegeEvent = {
        id: 'evt_' + published.id,
        title: published.title,
        category: 'Technical',
        status: 'Upcoming',
        date: published.eventDate || 'Upcoming',
        time: published.eventTime || '09:00 AM EST',
        venue: published.venue || 'PRISM Main Arena',
        fee: 0,
        poster: published.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        description: published.shortDescription,
        longDescription: published.fullDescription,
        capacity: 400,
        registeredCount: 0,
        isRegistered: false,
        highlights: ['Verified PRISM Event', 'Live Project Pitches', 'Cryptographic Digital Pass'],
        timeline: [{ time: '09:00 AM', activity: 'Inaugural Keynote & Hack Sprint' }],
        organizer: published.relatedTeam || 'PRISM Technical Council',
      };
      setEvents((prev) => [newEvt, ...prev]);
    }

    addToast('Content Live!', `"${published.title}" has been published to the website!`, 'success');
  };

  const unpublishContent = (id: string) => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const unpublished = dbService.unpublishContent(id, adminEmail, adminName);
    setWebsiteContents(dbService.getContents());
    setAuditLogs(dbService.getAuditLogs());
    addToast('Unpublished', `"${unpublished.title}" has been taken down from public view.`, 'info');
  };

  const archiveContent = (id: string) => {
    const adminEmail = user?.email || 'admin@prism.edu';
    const adminName = user?.name || 'Administrator';
    const archived = dbService.archiveContent(id, adminEmail, adminName);
    setWebsiteContents(dbService.getContents());
    setAuditLogs(dbService.getAuditLogs());
    addToast('Content Archived', `"${archived.title}" has been moved to archives.`, 'info');
  };

  /* ------------------- NOTIFICATIONS ------------------- */

  const markNotificationRead = (id: string) => {
    dbService.markNotificationAsRead(id);
    setNotifications(dbService.getNotifications());
  };

  const markAllNotificationsRead = () => {
    dbService.markAllNotificationsAsRead();
    setNotifications(dbService.getNotifications());
    addToast('Notifications Cleared', 'All notices marked as read', 'info');
  };

  // Program Enrollment
  const enrollProgram = (programId: string) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return;

    if (prog.isEnrolled) {
      addToast('Already Enrolled', `You are already enrolled in ${prog.title}`, 'info');
      return;
    }

    setPrograms((prev) =>
      prev.map((p) => (p.id === programId ? { ...p, isEnrolled: true, enrolledCount: p.enrolledCount + 1 } : p))
    );

    const newPayment: PaymentRecord = {
      id: 'pay_' + Date.now(),
      transactionRef: 'TXN-PRISM-' + Math.floor(10000000 + Math.random() * 90000000),
      itemTitle: prog.title,
      itemType: 'Program',
      amount: 0,
      currency: 'USD',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Successful',
      paymentMethod: 'Campus Academic Credit (Free)',
      receiptNumber: 'RCP-PROG-' + Math.floor(10000 + Math.random() * 90000),
    };

    setPayments((prev) => [newPayment, ...prev]);
    addToast('Enrollment Confirmed!', `You have joined ${prog.title}`, 'success');
  };

  // Event Registration & Digital Pass Issuance
  const registerForEvent = async (
    eventId: string,
    paymentMethod: string = 'Campus Pay (Student ID Balance)'
  ): Promise<DigitalPass | null> => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return null;

    if (evt.isRegistered) {
      addToast('Already Registered', `You have already registered for ${evt.title}`, 'info');
      return null;
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 } : e))
    );

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const registrationNumber = `PRISM-TKT-${randomSuffix}`;

    const newPass: DigitalPass = {
      id: 'pass_' + Date.now(),
      registrationNumber,
      eventId: evt.id,
      eventTitle: evt.title,
      eventDate: evt.date,
      eventTime: evt.time,
      venue: evt.venue,
      studentName: user?.name || 'Alex Vance',
      studentId: user?.studentId || 'PRISM-000UEC0000',
      department: user?.department || 'Computer Science & AI',
      checkInStatus: 'Valid',
      tier: evt.fee > 0 ? 'VIP Access' : 'General Pass',
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    setPasses((prev) => [newPass, ...prev]);

    const newTxn: PaymentRecord = {
      id: 'pay_' + Date.now(),
      transactionRef: 'TXN-PRISM-' + Math.floor(10000000 + Math.random() * 90000000),
      itemTitle: evt.title,
      itemType: 'Event',
      amount: evt.fee,
      currency: 'USD',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Successful',
      paymentMethod,
      receiptNumber: `RCP-2026-${randomSuffix}`,
    };

    setPayments((prev) => [newTxn, ...prev]);
    addToast('Registration Confirmed!', `Digital Pass ${registrationNumber} has been issued to your wallet`, 'success');

    return newPass;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        theme,
        toasts,
        teams,
        programs,
        events,
        payments,
        passes,
        announcements,
        sidebarCollapsed,
        mobileSidebarOpen,
        users,
        membershipRequests,
        websiteContents,
        publishedContents,
        auditLogs,
        notifications,
        unreadNotificationCount,
        login,
        loginWithRole,
        loginAsGuest,
        logout,
        switchTabRole,
        updateProfile,
        updatePassword,
        toggleTheme,
        addToast,
        removeToast,
        joinTeam,
        leaveTeam,
        deleteTeam,
        addTeam,
        publishAnnouncement,
        enrollProgram,
        registerForEvent,
        setSidebarCollapsed,
        setMobileSidebarOpen,
        blockUser,
        unblockUser,
        suspendUser,
        createMember,
        submitMembershipRequest,
        approveMembershipRequest,
        rejectMembershipRequest,
        submitContent,
        updateContent,
        approveContent,
        requestContentChanges,
        rejectContent,
        publishContent,
        unpublishContent,
        archiveContent,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
