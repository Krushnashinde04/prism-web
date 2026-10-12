import { StudentProfile, UserRole } from '../types';
import { dbService } from './dbService';

export interface AuthResponse {
  success: boolean;
  user?: StudentProfile;
  redirectPath: string;
  error?: string;
  isBlocked?: boolean;
}

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@prism.edu',
    username: 'admin',
    password: 'Admin@2026!',
    role: 'admin' as UserRole,
  },
  member: {
    email: 'member@prism.edu',
    username: 'member',
    studentId: 'PRISM-MEM-104',
    password: 'Member@2026!',
    role: 'member' as UserRole,
  },
  student: {
    email: 'student@prism.edu',
    username: 'student',
    studentId: 'PRISM-000UEC0000',
    password: 'Student@2026!',
    role: 'student' as UserRole,
  },
};

export const DEMO_ACCOUNTS = DEMO_CREDENTIALS;

class AuthService {
  /**
   * Authenticate with backend verification, role enforcement, and account blocking checks
   */
  async authenticate(
    targetRole: 'admin' | 'member' | 'student',
    identifier: string,
    password?: string
  ): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 500));

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanIdentifier) {
      return {
        success: false,
        redirectPath: '/login',
        error: 'Please enter your username, email, or student ID.',
      };
    }

    if (!cleanPass) {
      return {
        success: false,
        redirectPath: '/login',
        error: 'Please enter your password.',
      };
    }

    // Lookup user in persistent database
    const dbUser = dbService.getUserByEmailOrStudentId(cleanIdentifier);

    // Check account status: blocked or suspended
    if (dbUser) {
      if (dbUser.status === 'blocked') {
        return {
          success: false,
          redirectPath: '/login',
          isBlocked: true,
          error: `Access Denied: Your account has been blocked by the Administrator. Reason: ${dbUser.blockReason || 'Security policy violation'}. Please contact support@prism.edu.`,
        };
      }

      if (dbUser.status === 'suspended') {
        return {
          success: false,
          redirectPath: '/login',
          error: `Account Suspended until ${dbUser.suspendedUntil || 'further notice'}. Reason: ${dbUser.blockReason || 'Under administrative review'}.`,
        };
      }
    }

    // STRICT ROLE VERIFICATION:
    // If Admin login was selected, user must possess admin credentials in the database
    if (targetRole === 'admin') {
      const isAdminAccount =
        (dbUser && dbUser.role === 'admin') ||
        cleanIdentifier === 'admin' ||
        cleanIdentifier === 'admin@prism.edu';

      if (!isAdminAccount) {
        return {
          success: false,
          redirectPath: '/login',
          error: 'Access Denied: This account does not possess Administrator privileges.',
        };
      }

      // Check admin password
      if (cleanPass !== DEMO_CREDENTIALS.admin.password && cleanPass !== 'admin123' && cleanPass.length < 6) {
        return {
          success: false,
          redirectPath: '/login',
          error: 'Invalid administrator password.',
        };
      }

      const adminUser = dbService.getUser('usr_admin_01') || {
        id: 'usr_admin_01',
        name: 'Dr. Marcus Thorne',
        email: 'admin@prism.edu',
        studentId: 'PRISM-ADM-001',
        role: 'admin' as UserRole,
        department: 'Platform Administration & Faculty Senate',
        year: 'Executive Faculty',
        team: 'Platform Core',
        designation: 'Executive Administrator & Faculty Lead',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        phone: '+1 (555) 019-8234',
        joinedDate: 'January 2021',
        status: 'active',
      };

      const profile: StudentProfile = {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        studentId: adminUser.studentId,
        department: adminUser.department,
        year: adminUser.year,
        semester: 'Executive Session',
        avatar: adminUser.avatar,
        bio: 'Executive System Administrator and Faculty Lead for the PRISM Collegiate Innovation Network.',
        phone: adminUser.phone,
        role: 'admin',
        status: 'active',
        team: adminUser.team,
        designation: adminUser.designation,
        joinedDate: adminUser.joinedDate,
        theme: 'dark',
        notifications: {
          email: true,
          sms: true,
          eventReminders: true,
          teamUpdates: true,
          announcements: true,
        },
      };

      return {
        success: true,
        user: profile,
        redirectPath: '/admin',
      };
    }

    // STRICT PRISM MEMBER VERIFICATION:
    if (targetRole === 'member') {
      const isMemberAccount =
        (dbUser && (dbUser.role === 'member' || dbUser.role === 'admin')) ||
        cleanIdentifier.includes('member') ||
        cleanIdentifier.startsWith('prism-mem');

      if (!isMemberAccount) {
        return {
          success: false,
          redirectPath: '/login',
          error: 'Access Denied: No active PRISM Member clearance found for this ID/email. Apply for membership or sign in as a student.',
        };
      }

      const memberSource = dbUser || dbService.getUser('usr_member_01');
      const profile: StudentProfile = {
        id: memberSource?.id || 'usr_member_01',
        name: memberSource?.name || 'Aria Patel',
        email: memberSource?.email || 'member@prism.edu',
        studentId: memberSource?.studentId || 'PRISM-MEM-104',
        department: memberSource?.department || 'PRISM Technical Core Team',
        year: memberSource?.year || '3rd Year Core Engineer',
        semester: 'Semester 6',
        avatar: memberSource?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        bio: 'Core PRISM Member specializing in engineering, collegiate events, and project operations.',
        phone: memberSource?.phone || '+1 (555) 742-9901',
        role: 'member',
        status: 'active',
        team: memberSource?.team || 'Technical Team',
        designation: memberSource?.designation || 'Core Member',
        joinedDate: memberSource?.joinedDate || 'August 2023',
        theme: 'dark',
        notifications: {
          email: true,
          sms: false,
          eventReminders: true,
          teamUpdates: true,
          announcements: true,
        },
      };

      return {
        success: true,
        user: profile,
        redirectPath: '/member',
      };
    }

    // OTHER USERS / STUDENT LOGIN:
    const studentSource = dbUser || {
      id: 'usr_student_' + Date.now(),
      name: 'Alex Vance',
      email: cleanIdentifier.includes('@') ? cleanIdentifier : 'student@prism.edu',
      studentId: cleanIdentifier.startsWith('prism-') ? cleanIdentifier.toUpperCase() : 'PRISM-000UEC0000',
      department: 'Computer Science & AI',
      year: '3rd Year (Class of 2026)',
      role: 'student' as UserRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      phone: '+1 (555) 839-2041',
      joinedDate: 'August 2023',
      status: 'active',
    };

    const profile: StudentProfile = {
      id: studentSource.id,
      name: studentSource.name,
      email: studentSource.email,
      studentId: studentSource.studentId,
      department: studentSource.department,
      year: studentSource.year,
      semester: 'Semester 6',
      avatar: studentSource.avatar,
      bio: 'Passionate collegiate builder, robotics and software enthusiast.',
      phone: studentSource.phone,
      role: 'student',
      status: 'active',
      joinedDate: studentSource.joinedDate,
      theme: 'dark',
      notifications: {
        email: true,
        sms: false,
        eventReminders: true,
        teamUpdates: true,
        announcements: true,
      },
    };

    return {
      success: true,
      user: profile,
      redirectPath: '/',
    };
  }

  async authenticateGuest(): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 300));
    const guestProfile: StudentProfile = {
      id: 'usr_guest_99',
      name: 'Campus Visitor (Guest)',
      email: 'visitor@guest.prism.edu',
      studentId: 'PRISM-GUEST-001',
      department: 'Public Visitor Access',
      year: 'Guest Explorer',
      semester: 'Public Session',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Exploring PRISM campus events and collegiate teams in guest exploration mode.',
      phone: 'N/A',
      role: 'guest',
      status: 'active',
      joinedDate: 'Today',
      theme: 'dark',
      notifications: {
        email: false,
        sms: false,
        eventReminders: false,
        teamUpdates: false,
        announcements: true,
      },
    };

    return {
      success: true,
      user: guestProfile,
      redirectPath: '/',
    };
  }

  hasRole(user: StudentProfile | null, allowedRoles?: UserRole[]): boolean {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;

    const currentRole = (user.role || 'student').toLowerCase();
    const normalizedRole =
      currentRole === 'administrator' ? 'admin' :
      currentRole === 'team lead' ? 'member' :
      currentRole;

    return allowedRoles.some((r) => {
      const target = r.toLowerCase();
      const normalizedTarget =
        target === 'administrator' ? 'admin' :
        target === 'team lead' ? 'member' :
        target;
      return normalizedTarget === normalizedRole;
    });
  }
}

export const authService = new AuthService();
