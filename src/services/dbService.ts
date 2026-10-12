import {
  UserAccount,
  MembershipRequest,
  WebsiteContent,
  AdminAuditLog,
  AppNotification,
  UserRole,
  ContentStatus,
  ContentCategory,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'prism_db_users',
  REQUESTS: 'prism_db_membership_requests',
  CONTENTS: 'prism_db_website_contents',
  AUDIT_LOGS: 'prism_db_audit_logs',
  NOTIFICATIONS: 'prism_db_notifications',
};

// Initial Seed Users
const SEED_USERS: UserAccount[] = [
  {
    id: 'usr_admin_01',
    name: 'Dr. Marcus Thorne',
    email: 'admin@prism.edu',
    studentId: 'PRISM-ADM-001',
    role: 'admin',
    status: 'active',
    department: 'Platform Administration & Faculty Senate',
    year: 'Executive Faculty',
    team: 'Platform Core',
    designation: 'Executive Administrator & Faculty Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 019-8234',
    joinedDate: 'January 2021',
    lastActive: 'Just now',
  },
  {
    id: 'usr_member_01',
    name: 'Aria Patel',
    email: 'member@prism.edu',
    studentId: 'PRISM-MEM-104',
    role: 'member',
    status: 'active',
    department: 'PRISM Technical Core Team',
    year: '3rd Year Core Engineer',
    team: 'Technical Team',
    designation: 'Lead Systems Architect & Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 742-9901',
    joinedDate: 'August 2023',
    lastActive: '10 mins ago',
  },
  {
    id: 'usr_member_02',
    name: 'Julian Rivera',
    email: 'julian.r@prism.edu',
    studentId: 'PRISM-MEM-105',
    role: 'member',
    status: 'active',
    department: 'Cinematography & Creative Media',
    year: '4th Year Senior Member',
    team: 'Media Team',
    designation: 'Creative Director & 4K Production Lead',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 912-4433',
    joinedDate: 'September 2022',
    lastActive: '1 hour ago',
  },
  {
    id: 'usr_member_03',
    name: 'Maya Lin',
    email: 'maya.lin@prism.edu',
    studentId: 'PRISM-MEM-106',
    role: 'member',
    status: 'active',
    department: 'Visual Arts & Motion Graphics',
    year: '3rd Year Core Member',
    team: 'Media Team',
    designation: 'Chief Motion Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 431-8899',
    joinedDate: 'November 2023',
    lastActive: '3 hours ago',
  },
  {
    id: 'usr_student_01',
    name: 'Alex Vance',
    email: 'student@prism.edu',
    studentId: 'PRISM-000UEC0000',
    role: 'student',
    status: 'active',
    department: 'Computer Science & AI',
    year: '3rd Year (Class of 2026)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 839-2041',
    joinedDate: 'August 2023',
    lastActive: 'Active now',
  },
  {
    id: 'usr_student_02',
    name: 'Rohan Mehta',
    email: 'rohan.m@prism.edu',
    studentId: 'PRISM-125UEC0089',
    role: 'student',
    status: 'suspended',
    blockReason: 'Temporary suspension pending academic council review',
    suspendedUntil: 'Nov 01, 2026',
    department: 'Electronics & Communication',
    year: '2nd Year (Class of 2027)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 234-9912',
    joinedDate: 'September 2024',
    lastActive: '3 days ago',
  },
  {
    id: 'usr_student_03',
    name: 'Vikram Joshi',
    email: 'vikram.j@prism.edu',
    studentId: 'PRISM-124UEC0012',
    role: 'student',
    status: 'blocked',
    blockReason: 'Repeated unauthorized access attempts and security policy violations',
    blockedAt: 'Oct 02, 2026',
    department: 'Computer Engineering',
    year: '4th Year (Class of 2025)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    phone: '+1 (555) 887-1234',
    joinedDate: 'August 2022',
    lastActive: 'Oct 02, 2026',
  },
];

// Initial Seed Membership Applications
const SEED_MEMBERSHIP_REQUESTS: MembershipRequest[] = [
  {
    id: 'req_01',
    userId: 'usr_student_01',
    userName: 'Alex Vance',
    userEmail: 'student@prism.edu',
    studentId: 'PRISM-000UEC0000',
    department: 'Computer Science & AI',
    year: '3rd Year (Class of 2026)',
    appliedTeam: 'Technical Team',
    reason: 'I have experience building real-time microservices in Go and React, and I want to contribute to the PRISM high-throughput registration scanner engine and robotics telemetry.',
    skills: ['TypeScript', 'Node.js', 'Docker', 'Embedded C++', 'Computer Vision'],
    portfolioUrl: 'https://github.com/alexvance-builder',
    status: 'pending',
    submittedAt: 'Oct 08, 2026, 03:20 PM',
  },
  {
    id: 'req_02',
    userId: 'usr_applicant_02',
    userName: 'Samantha Lee',
    userEmail: 'samantha.lee@prism.edu',
    studentId: 'PRISM-125UEC0044',
    department: 'Electrical Engineering',
    year: '2nd Year',
    appliedTeam: 'Media Team',
    reason: 'Experienced with DaVinci Resolve color grading and Sony cinema cameras. Directed our high school aftermovie with 50k views.',
    skills: ['DaVinci Resolve', 'Sony Alpha FX3', 'After Effects', 'Sound Mixing'],
    portfolioUrl: 'https://vimeo.com/samanthalee',
    status: 'pending',
    submittedAt: 'Oct 09, 2026, 11:45 AM',
  },
  {
    id: 'req_03',
    userId: 'usr_applicant_03',
    userName: 'Aria Patel',
    userEmail: 'member@prism.edu',
    studentId: 'PRISM-MEM-104',
    department: 'PRISM Technical Core Team',
    year: '3rd Year Core Engineer',
    appliedTeam: 'Technical Team',
    reason: 'Prior leadership in collegiate ACM chapter and CTF champion.',
    skills: ['Distributed Systems', 'Python', 'Kubernetes'],
    status: 'approved',
    submittedAt: 'Sep 01, 2026, 09:00 AM',
    reviewedAt: 'Sep 02, 2026, 10:15 AM',
    reviewedBy: 'Dr. Marcus Thorne',
    reviewNote: 'Exceptional background in systems engineering and competitive coding. Granted Lead Systems Architect clearance.',
    assignedTeam: 'Technical Team',
    assignedDesignation: 'Lead Systems Architect & Tech Lead',
  },
];

// Initial Seed Website Content
const SEED_CONTENTS: WebsiteContent[] = [
  {
    id: 'cnt_01',
    title: 'NASA Deep Space Robotics Keynote Inaugural Address',
    category: 'College Announcements',
    shortDescription: 'Dr. Katherine Bell from NASA Jet Propulsion Laboratory visits campus to inaugurate TechFest 2026.',
    fullDescription: `### Historic Keynote at Grand Atrium

We are thrilled to announce that **Dr. Katherine Bell**, Lead Roboticist at NASA JPL, will deliver the official inaugural keynote address for PRISM TechFest 2026!

#### Event Highlights:
- Deep-dive into autonomous decision trees aboard the Mars Perseverance rover.
- Demonstrations of radiation-hardened brushless motor actuators.
- Interactive Q&A for undergraduate aerospace and robotics scholars.
- Exclusive invite-only networking luncheon with PRISM Tech Team leads.

*All students with active PRISM Passes are eligible for priority hall seating.*`,
    coverImage: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    eventDate: 'Nov 18, 2026',
    eventTime: '09:00 AM EST',
    venue: 'Grand Technopolis Atrium',
    authorId: 'usr_admin_01',
    authorName: 'Dr. Marcus Thorne',
    authorEmail: 'admin@prism.edu',
    authorRole: 'admin',
    status: 'Published',
    createdAt: 'Oct 04, 2026',
    updatedAt: 'Oct 04, 2026',
    publishedAt: 'Oct 04, 2026',
  },
  {
    id: 'cnt_02',
    title: 'Autonomous Avionics & CubeSat Clean Room Certification',
    category: 'Workshops',
    shortDescription: 'Hands-on hardware fabrication of low-Earth orbit satellite modules and RTOS flight firmware.',
    fullDescription: `### 3-Week Intensive Avionics Bootcamp

Engineered in collaboration with leading aerospace research labs, this program equips students with flight-grade hardware fabrication skills.

#### Syllabus Modules:
1. **Form Factors (1U-3U)** and orbital thermal vacuum simulations.
2. **Radiation-Tolerant Circuit Design** and solder quality standards.
3. **FreeRTOS Telemetry** over I2C/SPI sensor busses.
4. **Vibration Shake Table Certification** in Aerospace Hangar 4B.`,
    coverImage: 'https://images.unsplash.com/photo-1517976487502-5bfb04d1efc9?auto=format&fit=crop&w=1200&q=80',
    eventDate: 'Nov 05 - 26, 2026',
    venue: 'Aerospace Systems Clean Room 4B',
    relatedProgram: 'Autonomous Avionics & CubeSat Engineering',
    authorId: 'usr_member_01',
    authorName: 'Aria Patel',
    authorEmail: 'member@prism.edu',
    authorRole: 'member',
    status: 'Published',
    createdAt: 'Sep 28, 2026',
    updatedAt: 'Oct 01, 2026',
    publishedAt: 'Oct 01, 2026',
  },
  {
    id: 'cnt_03',
    title: 'PRISM Autonomous Rover Team Qualifies for National Finals',
    category: 'Achievements',
    shortDescription: 'Collegiate rover team achieves #1 regional ranking in autonomous obstacle traversal challenge.',
    fullDescription: `### Unprecedented Engineering Victory

The PRISM Autonomous Rover Guild has officially secured **1st Place Regional Honors** at the National University Rover Challenge!

The team's custom rover chassis, powered by dual Jetson Orin compute modules and real-time LiDAR SLAM, successfully mapped a 2km simulated Martian quarry with zero human interventions. Congratulations to all student builders!`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    relatedTeam: 'Technical Team',
    authorId: 'usr_member_01',
    authorName: 'Aria Patel',
    authorEmail: 'member@prism.edu',
    authorRole: 'member',
    status: 'Published',
    createdAt: 'Oct 02, 2026',
    updatedAt: 'Oct 03, 2026',
    publishedAt: 'Oct 03, 2026',
  },
  {
    id: 'cnt_04',
    title: 'DEFCON Collegiate CTF Qualifier Sprint & Defense Workshop',
    category: 'Team Activities',
    shortDescription: 'Live adversary emulation, buffer overflow exploitation, and reverse engineering sprint.',
    fullDescription: `### Technical Team Internal Sprint

All PRISM Core members and permitted students are invited to our intense DEFCON qualifier practice sprint in Advanced Lab 3A.

**Prerequisites:** Familiarity with Linux command line, Wireshark packet capture, and binary disassemblers (Ghidra). Food and high-voltage energy drinks provided round-the-clock!`,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    eventDate: 'Oct 22, 2026',
    eventTime: '06:00 PM EST',
    venue: 'Advanced Cybersecurity Lab 3A',
    relatedTeam: 'Technical Team',
    authorId: 'usr_member_01',
    authorName: 'Aria Patel',
    authorEmail: 'member@prism.edu',
    authorRole: 'member',
    status: 'Pending Review',
    createdAt: 'Oct 09, 2026',
    updatedAt: 'Oct 09, 2026',
    submittedAt: 'Oct 09, 2026, 04:15 PM',
  },
  {
    id: 'cnt_05',
    title: 'Cinematic 4K Aftermovie Trailer & Color Grading Masterclass',
    category: 'Workshops',
    shortDescription: 'Learn multi-cam synchronization, anamorphic lensing, and Dolby Vision HDR export workflows.',
    fullDescription: `The Media Team is opening up their creative visual studio for a comprehensive masterclass on professional cinematic post-production.`,
    coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    eventDate: 'Nov 02, 2026',
    eventTime: '04:00 PM EST',
    venue: 'Digital Sound & Media Studio 2B',
    relatedTeam: 'Media Team',
    authorId: 'usr_member_02',
    authorName: 'Julian Rivera',
    authorEmail: 'julian.r@prism.edu',
    authorRole: 'member',
    status: 'Pending Review',
    createdAt: 'Oct 10, 2026',
    updatedAt: 'Oct 10, 2026',
    submittedAt: 'Oct 10, 2026, 11:30 AM',
  },
  {
    id: 'cnt_06',
    title: 'Inter-Collegiate Esports Apex Invitational Tournament Bracket',
    category: 'Events',
    shortDescription: '32 collegiate esports squads clash in Valorant and Rocket League on tournament-grade 240Hz rigs.',
    fullDescription: `Live stadium esports atmosphere with casting booths, replay cameras, and a $10,000 cash pool.`,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    eventDate: 'Oct 12, 2026',
    venue: 'Titan Gaming Arena',
    authorId: 'usr_member_01',
    authorName: 'Aria Patel',
    authorEmail: 'member@prism.edu',
    authorRole: 'member',
    status: 'Changes Requested',
    reviewFeedback: 'Please provide exact sponsor prize breakdown and safety compliance confirmation with campus security.',
    createdAt: 'Oct 07, 2026',
    updatedAt: 'Oct 08, 2026',
    submittedAt: 'Oct 07, 2026',
    reviewedAt: 'Oct 08, 2026',
    reviewerName: 'Dr. Marcus Thorne',
  },
  {
    id: 'cnt_07',
    title: 'Decentralized Microgrid Energy Distribution Project Draft',
    category: 'News',
    shortDescription: 'Student research team drafts solar microgrid battery trading protocol on campus smart meters.',
    fullDescription: `Research draft analyzing smart-contract settlement latency across 14 collegiate dormitory solar battery arrays.`,
    coverImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    authorId: 'usr_member_01',
    authorName: 'Aria Patel',
    authorEmail: 'member@prism.edu',
    authorRole: 'member',
    status: 'Draft',
    createdAt: 'Oct 10, 2026',
    updatedAt: 'Oct 10, 2026',
  },
];

// Initial Seed Audit Logs
const SEED_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_01',
    action: 'Platform Security Policy Initialized',
    category: 'Security',
    performedBy: 'Dr. Marcus Thorne',
    adminEmail: 'admin@prism.edu',
    target: 'System Kernel',
    details: 'Enforced cryptographic role verification and multi-role boundary defenses across collegiate sessions.',
    timestamp: 'Oct 01, 2026, 09:00 AM',
    severity: 'info',
  },
  {
    id: 'log_02',
    action: 'User Account Blocked',
    category: 'User Management',
    performedBy: 'Dr. Marcus Thorne',
    adminEmail: 'admin@prism.edu',
    target: 'Vikram Joshi (usr_student_03)',
    details: 'Reason: Repeated unauthorized access attempts and security policy violations.',
    timestamp: 'Oct 02, 2026, 02:45 PM',
    severity: 'critical',
  },
  {
    id: 'log_03',
    action: 'Membership Request Approved',
    category: 'User Management',
    performedBy: 'Dr. Marcus Thorne',
    adminEmail: 'admin@prism.edu',
    target: 'Aria Patel (PRISM-MEM-104)',
    details: 'Approved membership request and assigned Lead Systems Architect clearance on Technical Team.',
    timestamp: 'Sep 02, 2026, 10:15 AM',
    severity: 'info',
  },
  {
    id: 'log_04',
    action: 'Content Published',
    category: 'Content Moderation',
    performedBy: 'Dr. Marcus Thorne',
    adminEmail: 'admin@prism.edu',
    target: 'NASA Deep Space Robotics Keynote Inaugural Address',
    details: 'Reviewed and approved keynote publication for public collegiate Home Page display.',
    timestamp: 'Oct 04, 2026, 05:00 PM',
    severity: 'info',
  },
  {
    id: 'log_05',
    action: 'Content Changes Requested',
    category: 'Content Moderation',
    performedBy: 'Dr. Marcus Thorne',
    adminEmail: 'admin@prism.edu',
    target: 'Inter-Collegiate Esports Apex Invitational',
    details: 'Requested prize verification and campus arena safety sign-off.',
    timestamp: 'Oct 08, 2026, 11:20 AM',
    severity: 'warning',
  },
];

// Initial Seed Notifications
const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'New Membership Application Submitted',
    message: 'Alex Vance (Computer Science & AI) applied to join the Technical Team.',
    category: 'membership',
    timestamp: '2 hours ago',
    read: false,
    targetRole: 'admin',
    link: '/admin/membership-requests',
  },
  {
    id: 'notif_02',
    title: 'Content Awaiting Review',
    message: 'DEFCON Collegiate CTF Qualifier submitted by Aria Patel is pending your review.',
    category: 'content',
    timestamp: '3 hours ago',
    read: false,
    targetRole: 'admin',
    link: '/admin/content',
  },
  {
    id: 'notif_03',
    title: 'New PRISM Platform Announcement',
    message: 'NASA Deep Space Robotics Keynote address has been published on the platform.',
    category: 'system',
    timestamp: 'Yesterday',
    read: false,
    link: '/',
  },
  {
    id: 'notif_04',
    title: 'Digital Ticket Validated',
    message: 'VIP Pass PRISM-TKT-99214 is ready in your payments & passes wallet.',
    category: 'event',
    timestamp: '2 days ago',
    read: true,
    link: '/payments-and-passes',
  },
];

class DatabaseService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to persist key ${key}:`, e);
    }
  }

  /* ------------------- USER MANAGEMENT ------------------- */

  getUsers(): UserAccount[] {
    return this.getStorage<UserAccount[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  getUser(id: string): UserAccount | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByEmailOrStudentId(identifier: string): UserAccount | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.getUsers().find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.studentId.toLowerCase() === clean ||
        u.name.toLowerCase() === clean
    );
  }

  updateUser(id: string, updates: Partial<UserAccount>, adminName: string = 'Admin'): UserAccount {
    const users = this.getUsers();
    let updatedUser: UserAccount | undefined;

    const newUsers = users.map((u) => {
      if (u.id === id) {
        updatedUser = { ...u, ...updates };
        return updatedUser;
      }
      return u;
    });

    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found.`);
    }

    this.setStorage(STORAGE_KEYS.USERS, newUsers);
    return updatedUser;
  }

  blockUser(id: string, reason: string, adminEmail: string, adminName: string): UserAccount {
    if (id === 'usr_admin_01' || adminEmail === 'admin@prism.edu') {
      const target = this.getUser(id);
      if (target?.email === 'admin@prism.edu' || target?.role === 'admin') {
        throw new Error('Action Prohibited: Root Administrator accounts cannot be blocked.');
      }
    }

    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const user = this.updateUser(id, {
      status: 'blocked',
      blockReason: reason,
      blockedAt: now,
    }, adminName);

    // Audit log
    this.logAudit({
      action: 'User Account Blocked',
      category: 'User Management',
      target: `${user.name} (${user.studentId})`,
      details: `Account access terminated. Reason: ${reason}`,
      severity: 'critical',
      adminEmail,
      performedBy: adminName,
    });

    // Notify user
    this.addNotification({
      title: 'Security Alert: Account Blocked',
      message: `Your PRISM account has been blocked by Administrator. Reason: ${reason}`,
      category: 'security',
      targetUserId: id,
    });

    return user;
  }

  unblockUser(id: string, adminEmail: string, adminName: string): UserAccount {
    const user = this.updateUser(id, {
      status: 'active',
      blockReason: undefined,
      blockedAt: undefined,
    }, adminName);

    this.logAudit({
      action: 'User Account Unblocked',
      category: 'User Management',
      target: `${user.name} (${user.studentId})`,
      details: 'Account status restored to active.',
      severity: 'warning',
      adminEmail,
      performedBy: adminName,
    });

    this.addNotification({
      title: 'Account Restored',
      message: 'Your PRISM access has been reinstated by the Administrator.',
      category: 'security',
      targetUserId: id,
    });

    return user;
  }

  suspendUser(id: string, days: number, reason: string, adminEmail: string, adminName: string): UserAccount {
    const until = new Date();
    until.setDate(until.getDate() + days);
    const suspendedUntil = until.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const user = this.updateUser(id, {
      status: 'suspended',
      blockReason: reason,
      suspendedUntil,
    }, adminName);

    this.logAudit({
      action: 'User Account Suspended',
      category: 'User Management',
      target: `${user.name} (${user.studentId})`,
      details: `Suspended for ${days} days until ${suspendedUntil}. Reason: ${reason}`,
      severity: 'warning',
      adminEmail,
      performedBy: adminName,
    });

    return user;
  }

  createMemberAccount(memberData: Omit<UserAccount, 'id' | 'role' | 'joinedDate'>, adminEmail: string, adminName: string): UserAccount {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === memberData.email.toLowerCase())) {
      throw new Error(`A user with email ${memberData.email} already exists.`);
    }

    const newMember: UserAccount = {
      ...memberData,
      id: 'usr_mem_' + Date.now(),
      role: 'member',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      lastActive: 'Never (Invited)',
    };

    const updated = [newMember, ...users];
    this.setStorage(STORAGE_KEYS.USERS, updated);

    // Audit log
    this.logAudit({
      action: 'PRISM Member Created',
      category: 'User Management',
      target: `${newMember.name} (${newMember.studentId})`,
      details: `Created new member in ${newMember.team || 'Unassigned'} with designation "${newMember.designation || 'Core Member'}".`,
      severity: 'info',
      adminEmail,
      performedBy: adminName,
    });

    // Notify new member
    this.addNotification({
      title: 'Welcome to PRISM Core Team!',
      message: `You have been onboarded as ${newMember.designation || 'Member'} in ${newMember.team || 'PRISM'}.`,
      category: 'membership',
      targetUserId: newMember.id,
      targetRole: 'member',
    });

    return newMember;
  }

  /* ------------------- MEMBERSHIP REQUESTS ------------------- */

  getMembershipRequests(): MembershipRequest[] {
    return this.getStorage<MembershipRequest[]>(STORAGE_KEYS.REQUESTS, SEED_MEMBERSHIP_REQUESTS);
  }

  submitMembershipRequest(request: Omit<MembershipRequest, 'id' | 'status' | 'submittedAt'>): MembershipRequest {
    const existing = this.getMembershipRequests();
    
    // Check if applicant has an ongoing pending request
    if (existing.some((r) => r.userEmail.toLowerCase() === request.userEmail.toLowerCase() && r.status === 'pending')) {
      throw new Error('You already have a membership application pending review.');
    }

    const newReq: MembershipRequest = {
      ...request,
      id: 'req_' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.setStorage(STORAGE_KEYS.REQUESTS, [newReq, ...existing]);

    // Notify Admins
    this.addNotification({
      title: 'New PRISM Membership Request',
      message: `${newReq.userName} (${newReq.appliedTeam}) submitted an application for review.`,
      category: 'membership',
      targetRole: 'admin',
      link: '/admin/membership-requests',
    });

    return newReq;
  }

  approveMembershipRequest(
    id: string,
    team: string,
    designation: string,
    adminEmail: string,
    adminName: string
  ): MembershipRequest {
    const requests = this.getMembershipRequests();
    let updatedReq: MembershipRequest | undefined;

    const newRequests = requests.map((r) => {
      if (r.id === id) {
        updatedReq = {
          ...r,
          status: 'approved',
          reviewedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          reviewedBy: adminName,
          assignedTeam: team,
          assignedDesignation: designation,
        };
        return updatedReq;
      }
      return r;
    });

    if (!updatedReq) throw new Error('Application not found.');
    this.setStorage(STORAGE_KEYS.REQUESTS, newRequests);

    // Promote user in Users collection to 'member'
    const targetUser = this.getUserByEmailOrStudentId(updatedReq.userEmail);
    if (targetUser) {
      this.updateUser(targetUser.id, {
        role: 'member',
        team,
        designation,
      }, adminName);
    }

    // Log action
    this.logAudit({
      action: 'Membership Request Approved',
      category: 'User Management',
      target: `${updatedReq.userName} (${updatedReq.userEmail})`,
      details: `Approved membership for ${team} as ${designation}. User role updated to Member.`,
      severity: 'info',
      adminEmail,
      performedBy: adminName,
    });

    // Notify Applicant
    this.addNotification({
      title: 'Application Approved: Welcome to PRISM!',
      message: `Your membership application has been approved! Assigned to ${team} as ${designation}.`,
      category: 'membership',
      targetUserId: updatedReq.userId,
    });

    return updatedReq;
  }

  rejectMembershipRequest(id: string, reason: string, adminEmail: string, adminName: string): MembershipRequest {
    const requests = this.getMembershipRequests();
    let updatedReq: MembershipRequest | undefined;

    const newRequests = requests.map((r) => {
      if (r.id === id) {
        updatedReq = {
          ...r,
          status: 'rejected',
          reviewedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          reviewedBy: adminName,
          reviewNote: reason,
        };
        return updatedReq;
      }
      return r;
    });

    if (!updatedReq) throw new Error('Application not found.');
    this.setStorage(STORAGE_KEYS.REQUESTS, newRequests);

    this.logAudit({
      action: 'Membership Request Rejected',
      category: 'User Management',
      target: `${updatedReq.userName} (${updatedReq.userEmail})`,
      details: `Rejected membership request. Reason: ${reason}`,
      severity: 'warning',
      adminEmail,
      performedBy: adminName,
    });

    this.addNotification({
      title: 'Application Update',
      message: `Your PRISM membership application could not be approved at this time. Feedback: ${reason}`,
      category: 'membership',
      targetUserId: updatedReq.userId,
    });

    return updatedReq;
  }

  /* ------------------- WEBSITE CONTENT WORKFLOW ------------------- */

  getContents(): WebsiteContent[] {
    return this.getStorage<WebsiteContent[]>(STORAGE_KEYS.CONTENTS, SEED_CONTENTS);
  }

  getPublishedContents(category?: ContentCategory): WebsiteContent[] {
    const all = this.getContents().filter((c) => c.status === 'Published');
    if (category) {
      return all.filter((c) => c.category === category);
    }
    return all;
  }

  createContent(contentData: Omit<WebsiteContent, 'id' | 'createdAt' | 'updatedAt'>): WebsiteContent {
    const contents = this.getContents();
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const newContent: WebsiteContent = {
      ...contentData,
      id: 'cnt_' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };

    this.setStorage(STORAGE_KEYS.CONTENTS, [newContent, ...contents]);

    if (newContent.status === 'Pending Review') {
      this.addNotification({
        title: 'New Content Submitted for Approval',
        message: `"${newContent.title}" (${newContent.category}) submitted by ${newContent.authorName}.`,
        category: 'content',
        targetRole: 'admin',
        link: '/admin/content',
      });
    }

    return newContent;
  }

  updateContent(id: string, updates: Partial<WebsiteContent>): WebsiteContent {
    const contents = this.getContents();
    let updatedContent: WebsiteContent | undefined;
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const newContents = contents.map((c) => {
      if (c.id === id) {
        updatedContent = { ...c, ...updates, updatedAt: now };
        return updatedContent;
      }
      return c;
    });

    if (!updatedContent) throw new Error('Content not found.');
    this.setStorage(STORAGE_KEYS.CONTENTS, newContents);

    if (updates.status === 'Pending Review') {
      this.addNotification({
        title: 'Content Resubmitted for Approval',
        message: `"${updatedContent.title}" has been updated and resubmitted.`,
        category: 'content',
        targetRole: 'admin',
        link: '/admin/content',
      });
    }

    return updatedContent;
  }

  approveContent(id: string, adminEmail: string, adminName: string): WebsiteContent {
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const content = this.updateContent(id, {
      status: 'Approved',
      reviewedAt: now,
      reviewerName: adminName,
    });

    this.logAudit({
      action: 'Content Approved',
      category: 'Content Moderation',
      target: content.title,
      details: `Approved "${content.title}" by ${content.authorName}. Ready for publishing.`,
      severity: 'info',
      adminEmail,
      performedBy: adminName,
    });

    this.addNotification({
      title: 'Content Approved!',
      message: `Your post "${content.title}" has been approved by ${adminName}.`,
      category: 'content',
      targetUserId: content.authorId,
      link: '/member/my-submissions',
    });

    return content;
  }

  requestContentChanges(id: string, feedback: string, adminEmail: string, adminName: string): WebsiteContent {
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const content = this.updateContent(id, {
      status: 'Changes Requested',
      reviewFeedback: feedback,
      reviewedAt: now,
      reviewerName: adminName,
    });

    this.logAudit({
      action: 'Content Changes Requested',
      category: 'Content Moderation',
      target: content.title,
      details: `Requested revisions for "${content.title}". Feedback: ${feedback}`,
      severity: 'warning',
      adminEmail,
      performedBy: adminName,
    });

    this.addNotification({
      title: 'Revisions Requested for Submission',
      message: `Admin requested changes for "${content.title}": ${feedback}`,
      category: 'content',
      targetUserId: content.authorId,
      link: '/member/my-submissions',
    });

    return content;
  }

  rejectContent(id: string, reason: string, adminEmail: string, adminName: string): WebsiteContent {
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const content = this.updateContent(id, {
      status: 'Rejected',
      reviewFeedback: reason,
      reviewedAt: now,
      reviewerName: adminName,
    });

    this.logAudit({
      action: 'Content Rejected',
      category: 'Content Moderation',
      target: content.title,
      details: `Rejected "${content.title}". Reason: ${reason}`,
      severity: 'warning',
      adminEmail,
      performedBy: adminName,
    });

    this.addNotification({
      title: 'Content Submission Rejected',
      message: `Your post "${content.title}" was rejected. Reason: ${reason}`,
      category: 'content',
      targetUserId: content.authorId,
      link: '/member/my-submissions',
    });

    return content;
  }

  publishContent(id: string, adminEmail: string, adminName: string): WebsiteContent {
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const content = this.updateContent(id, {
      status: 'Published',
      publishedAt: now,
      reviewerName: adminName,
    });

    this.logAudit({
      action: 'Content Published Live',
      category: 'Content Moderation',
      target: content.title,
      details: `Published "${content.title}" to public website under category "${content.category}".`,
      severity: 'info',
      adminEmail,
      performedBy: adminName,
    });

    // Notify author and platform
    this.addNotification({
      title: 'Post Published Live on PRISM!',
      message: `"${content.title}" is now live on the campus platform.`,
      category: 'content',
      targetUserId: content.authorId,
      link: '/',
    });

    return content;
  }

  unpublishContent(id: string, adminEmail: string, adminName: string): WebsiteContent {
    const content = this.updateContent(id, {
      status: 'Approved',
      publishedAt: undefined,
    });

    this.logAudit({
      action: 'Content Unpublished',
      category: 'Content Moderation',
      target: content.title,
      details: `Withdrew "${content.title}" from public view.`,
      severity: 'warning',
      adminEmail,
      performedBy: adminName,
    });

    return content;
  }

  archiveContent(id: string, adminEmail: string, adminName: string): WebsiteContent {
    const content = this.updateContent(id, {
      status: 'Archived',
    });

    this.logAudit({
      action: 'Content Archived',
      category: 'Content Moderation',
      target: content.title,
      details: `Archived outdated entry "${content.title}".`,
      severity: 'info',
      adminEmail,
      performedBy: adminName,
    });

    return content;
  }

  /* ------------------- AUDIT LOGGING ------------------- */

  getAuditLogs(): AdminAuditLog[] {
    return this.getStorage<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  logAudit(log: Omit<AdminAuditLog, 'id' | 'timestamp'>): AdminAuditLog {
    const existing = this.getAuditLogs();
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog: AdminAuditLog = {
      ...log,
      id: 'log_' + Date.now(),
      timestamp: now,
    };

    this.setStorage(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...existing]);
    return newLog;
  }

  /* ------------------- NOTIFICATIONS ------------------- */

  getNotifications(): AppNotification[] {
    return this.getStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const existing = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif_' + Date.now(),
      timestamp: 'Just now',
      read: false,
    };

    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...existing]);
    return newNotif;
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  markAllNotificationsAsRead(): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  }
}

export const dbService = new DatabaseService();
