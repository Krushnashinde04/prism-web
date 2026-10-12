export type UserRole = 'admin' | 'member' | 'student' | 'guest' | 'Student' | 'Team Lead' | 'Administrator';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: string;
  semester: string;
  avatar: string;
  bio: string;
  phone: string;
  role: UserRole;
  status?: UserAccountStatus;
  blockReason?: string;
  team?: string;
  designation?: string;
  joinedDate: string;
  theme: 'dark' | 'light';
  notifications: {
    email: boolean;
    sms: boolean;
    eventReminders: boolean;
    teamUpdates: boolean;
    announcements: boolean;
  };
}

export type TeamCategory = 'Technical' | 'Media' | 'Documentation' | 'Management' | 'Innovation' | 'Cultural' | 'Sports' | 'Entrepreneurship';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  category: TeamCategory;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  memberCount: number;
  lead: string;
  leadRole: string;
  established: string;
  status: 'member' | 'pending' | 'none';
  badgeColor?: string;
  badgeEmoji?: string;
  tags: string[];
  recentActivities: {
    title: string;
    date: string;
    description: string;
  }[];
  announcements: string[];
}

export type ProgramCategory = 'Technical' | 'Workshop' | 'Seminar' | 'Cultural' | 'Bootcamp';

export interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  date: string;
  duration: string;
  venue: string;
  description: string;
  longDescription?: string;
  instructor: string;
  instructorRole: string;
  image: string;
  enrolledCount: number;
  maxCapacity: number;
  isEnrolled: boolean;
  curriculum: string[];
  prerequisites: string;
  certificateProvided: boolean;
}

export type EventCategory = 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Other';
export type EventTimeStatus = 'Upcoming' | 'Ongoing' | 'Completed';

export interface CollegeEvent {
  id: string;
  title: string;
  category: EventCategory;
  status: EventTimeStatus;
  date: string;
  time: string;
  venue: string;
  fee: number; // 0 for free
  poster: string;
  description: string;
  longDescription?: string;
  capacity: number;
  registeredCount: number;
  isRegistered: boolean;
  highlights: string[];
  timeline: { time: string; activity: string }[];
  prizes?: string;
  organizer: string;
}

export interface PaymentRecord {
  id: string;
  transactionRef: string;
  itemTitle: string;
  itemType: 'Event' | 'Program' | 'Club Fee';
  amount: number;
  currency: string;
  date: string;
  status: 'Successful' | 'Pending' | 'Failed';
  paymentMethod: string;
  receiptNumber: string;
}

export interface DigitalPass {
  id: string;
  registrationNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  studentName: string;
  studentId: string;
  department: string;
  qrCodeUrl?: string;
  checkInStatus: 'Valid' | 'Checked In' | 'Expired';
  tier: 'General Pass' | 'VIP Access' | 'Workshop Seat';
  issuedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Campus' | 'Urgent' | 'Academic' | 'Festival';
  isImportant?: boolean;
}

export type UserAccountStatus = 'active' | 'suspended' | 'blocked' | 'pending' | 'inactive';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  studentId: string;
  role: UserRole;
  status: UserAccountStatus;
  blockReason?: string;
  blockedAt?: string;
  suspendedUntil?: string;
  department: string;
  year: string;
  team?: string;
  designation?: string;
  avatar: string;
  phone: string;
  joinedDate: string;
  lastActive?: string;
}

export type ContentCategory =
  | 'College Announcements'
  | 'News'
  | 'Events'
  | 'Programs'
  | 'Team Activities'
  | 'Achievements'
  | 'Workshops'
  | 'Competitions'
  | 'Other';

export type ContentStatus =
  | 'Draft'
  | 'Pending Review'
  | 'Changes Requested'
  | 'Approved'
  | 'Published'
  | 'Rejected'
  | 'Archived';

export interface WebsiteContent {
  id: string;
  title: string;
  category: ContentCategory;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  additionalImages?: string[];
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  relatedTeam?: string;
  relatedProgram?: string;
  externalLink?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorRole: UserRole;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewerName?: string;
  reviewFeedback?: string;
  adminFeedback?: string;
  rejectionReason?: string;
  publishedAt?: string;
}

export interface MembershipRequest {
  id: string;
  userId: string;
  userName: string;
  applicantName?: string;
  userEmail: string;
  applicantEmail?: string;
  studentId: string;
  department: string;
  year: string;
  appliedTeam: string;
  preferredTeam?: string;
  reason: string;
  skills: string[];
  portfolioUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  rejectionReason?: string;
  assignedTeam?: string;
  assignedDesignation?: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  category: 'User Management' | 'Content Moderation' | 'Team Operations' | 'Security' | 'System';
  performedBy: string;
  adminName?: string;
  adminEmail: string;
  target: string;
  targetUserOrContent?: string;
  details: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'danger';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'membership' | 'content' | 'security' | 'event' | 'system';
  type?: 'info' | 'warning' | 'danger' | 'success' | string;
  timestamp: string;
  read: boolean;
  targetRole?: UserRole;
  targetUserId?: string;
  link?: string;
}


