/**
 * Phase 1: Foundation - Complete Type Definitions
 * Hidden Treasures Network - Comprehensive Database Schema
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Extended User Role Types for Phase 1
 */
export type UserRole =
  | 'student'
  | 'mentor'
  | 'organization'
  | 'sponsor'
  | 'teacher'
  | 'school_admin'
  | 'district_admin'
  | 'platform_admin';

/**
 * User Status
 */
export type UserStatus = 'active' | 'inactive' | 'suspended';

/**
 * Data Access Level
 */
export type DataAccessLevel = 'full' | 'limited' | 'anonymous';

/**
 * Parental Consent Status
 */
export type ParentalConsentStatus = 'pending' | 'approved' | 'denied';

/**
 * Complete User Profile (users collection)
 */
export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  status: UserStatus;
  emailVerified: boolean;
  onboardingCompleted: boolean;

  // Profile metadata
  profile: {
    bio?: string;
    location?: {
      country: string;
      state?: string;
      city?: string;
    };
    timezone?: string;
    preferredLanguage: string; // 'en', 'es', 'fr'
  };

  // Privacy & Compliance
  privacy: {
    parentalConsentRequired: boolean;
    parentalConsentStatus?: ParentalConsentStatus;
    parentalConsentDate?: Timestamp | Date;
    dataAccessLevel: DataAccessLevel;
    ferpaCompliant: boolean;
  };

  // Notifications
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

/**
 * Student Profile (students collection)
 */
export interface StudentProfile {
  userId: string; // Reference to users collection
  studentId: string; // Unique student ID

  // Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp | Date;
  grade?: string;

  // Guardian Info (for minors)
  guardian?: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };

  // Academic & Interests
  interests: string[]; // ['aviation', 'drones', 'coding', 'robotics']
  educationLevel: 'elementary' | 'middle' | 'high_school' | 'college' | 'graduate';
  schoolId?: string;

  // Program Participation
  programs: string[]; // Array of program IDs
  mentorId?: string;

  // Progress Tracking
  progress: {
    totalXP: number;
    level: number;
    badges: string[]; // Array of badge IDs
    certifications: string[]; // ['FAA_TRUST', 'Part_107']
    flightHours: number;
    simulatorHours: number;
    discoveryFlights: number;
  };

  // Timestamps
  enrolledAt: Timestamp | Date;
  lastActive: Timestamp | Date;
}

/**
 * Mentor Profile (mentors collection)
 */
export interface MentorProfile {
  userId: string;
  mentorId: string;

  // Professional Info
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;

  // Expertise
  expertise: string[]; // ['commercial_pilot', 'drone_instructor', 'aerospace_engineer']
  certifications: string[]; // ['CFI', 'CFII', 'ATP', 'A&P']
  yearsExperience: number;

  // Availability
  availability: {
    hoursPerWeek: number;
    preferredDays: string[];
    timezone: string;
  };

  // Mentorship
  students: string[]; // Array of student IDs
  maxStudents: number;
  specialties: string[]; // ['flight_training', 'career_guidance', 'college_prep']

  // Background Check
  backgroundCheck: {
    completed: boolean;
    completedDate?: Timestamp | Date;
    expiresAt?: Timestamp | Date;
    status: 'pending' | 'approved' | 'denied';
  };

  // Training
  infinityTraining: {
    completed: boolean;
    completedDate?: Timestamp | Date;
    modules: string[];
  };

  // Metrics
  metrics: {
    totalSessions: number;
    totalHours: number;
    studentSuccessRate: number;
  };

  joinedAt: Timestamp | Date;
}

/**
 * Organization Profile (organizations collection)
 */
export interface OrganizationProfile {
  userId: string;
  orgId: string;

  // Organization Info
  name: string;
  type: 'school' | 'nonprofit' | 'flight_club' | 'corporate' | 'government';
  description: string;
  website?: string;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Location
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Programs
  programs: string[]; // Array of program IDs
  students: string[]; // Array of student IDs
  staff: string[]; // Array of user IDs

  // Capacity
  capacity: {
    maxStudents: number;
    currentStudents: number;
    aircraft?: number;
    simulators?: number;
    drones?: number;
  };

  // Affiliation
  affiliationType: 'full_affiliate' | 'partner' | 'ambassador';
  parentOrgId?: string; // For school districts

  // Verification
  verification: {
    status: 'pending' | 'verified' | 'rejected';
    verifiedDate?: Timestamp | Date;
    documents: string[]; // URLs to verification docs
  };

  // Metrics
  metrics: {
    totalStudentsServed: number;
    totalFlightHours: number;
    totalEvents: number;
    impactScore: number;
  };

  createdAt: Timestamp | Date;
}

/**
 * Sponsor Profile (sponsors collection)
 */
export interface SponsorProfile {
  userId: string;
  sponsorId: string;

  // Sponsor Info
  name: string; // Individual or company name
  type: 'individual' | 'corporate' | 'foundation';
  company?: string;
  website?: string;

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone?: string;

  // Sponsorship Tier
  tier: 'platinum' | 'gold' | 'silver' | 'community' | 'friends';

  // Commitment
  commitment: {
    amount: number;
    frequency: 'one-time' | 'monthly' | 'quarterly' | 'annual' | 'multi-year';
    startDate: Timestamp | Date;
    endDate?: Timestamp | Date;
    duration?: number; // months for multi-year
  };

  // Allocation Preferences
  allocation: {
    scholarships?: number; // percentage
    aircraft?: number;
    missionAcademy?: number;
    hiddenTreasuresTour?: number;
    unrestricted?: number;
  };

  // Recognition Preferences
  recognition: {
    publicListing: boolean;
    logoPlacement: boolean;
    eventInvitations: boolean;
    mediaFeatures: boolean;
    anonymous: boolean;
  };

  // Impact Tracking
  impact: {
    studentsSponsored: number;
    flightHoursEnabled: number;
    certificationsAwarded: number;
    programsSupported: string[];
  };

  // Payment Info (encrypted)
  stripeCustomerId?: string;

  joinedAt: Timestamp | Date;
}

/**
 * Teacher Profile (teachers collection)
 */
export interface TeacherProfile {
  userId: string;
  teacherId: string;

  // Teacher Info
  firstName: string;
  lastName: string;
  schoolId: string;
  department?: string;

  // Credentials
  certifications: string[]; // ['State_License', 'STEM_Certified', 'CTE_Credential']
  subjects: string[];
  grades: string[];

  // Training
  infinityTraining: {
    completed: boolean;
    completedDate?: Timestamp | Date;
    modules: string[];
  };

  missionAcademyAccess: boolean;

  // Classrooms
  classrooms: string[]; // Array of classroom IDs

  // Metrics
  metrics: {
    totalStudents: number;
    modulesAssigned: number;
    completionRate: number;
  };

  joinedAt: Timestamp | Date;
}

/**
 * School Profile (schools collection)
 */
export interface SchoolProfile {
  schoolId: string;

  // School Info
  name: string;
  type: 'public' | 'private' | 'charter' | 'homeschool_group';

  // Location
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };

  // Administration
  districtId?: string;
  principalName: string;
  contactEmail: string;
  contactPhone: string;

  // Enrollment
  enrollment: {
    total: number;
    htnParticipants: number;
  };

  // Programs
  programs: string[];
  teachers: string[]; // Array of teacher IDs
  classrooms: string[]; // Array of classroom IDs

  // Compliance
  compliance: {
    ferpaAgreement: boolean;
    ferpaDate?: Timestamp | Date;
    dataProtocolsAccepted: boolean;
  };

  createdAt: Timestamp | Date;
}

/**
 * Classroom Profile (classrooms collection)
 */
export interface ClassroomProfile {
  classroomId: string;
  schoolId: string;
  teacherId: string;

  // Classroom Info
  name: string;
  subject: string;
  gradeLevel: string;
  academicYear: string;

  // Students
  students: string[]; // Array of student IDs
  maxCapacity: number;

  // Schedule
  meetingSchedule?: {
    days: string[];
    time: string;
    duration: number; // minutes
  };

  // Curriculum
  assignedModules: string[];

  // Progress
  metrics: {
    averageCompletion: number;
    totalXP: number;
    certificationsEarned: number;
  };

  createdAt: Timestamp | Date;
}

/**
 * Program (programs collection)
 */
export interface Program {
  programId: string;
  orgId: string;

  // Program Info
  name: string;
  description: string;
  type: 'discovery_flights' | 'simulator_training' | 'drone_certification' | 'stem_workshop' | 'mentorship';

  // Logistics
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };

  schedule: {
    startDate: Timestamp | Date;
    endDate?: Timestamp | Date;
    frequency: string;
    daysOfWeek?: string[];
  };

  // Capacity
  capacity: {
    max: number;
    current: number;
    waitlist: number;
  };

  // Requirements
  requirements: {
    minAge: number;
    maxAge?: number;
    prerequisites?: string[];
  };

  // Participants
  students: string[];
  mentors: string[];

  // Status
  status: 'draft' | 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';

  createdAt: Timestamp | Date;
}

/**
 * Session (sessions collection)
 */
export interface Session {
  sessionId: string;

  // Session Info
  type: 'mentorship' | 'flight_training' | 'simulator' | 'classroom' | 'workshop';
  programId?: string;

  // Participants
  studentId: string;
  mentorId?: string;
  teacherId?: string;

  // Schedule
  scheduledAt: Timestamp | Date;
  duration: number; // minutes
  location: string;

  // Session Data
  notes?: string;
  objectives?: string[];
  outcomes?: string[];

  // Completion
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  completedAt?: Timestamp | Date;

  // XP Award
  xpAwarded?: number;

  createdAt: Timestamp | Date;
}

/**
 * Notification (notifications collection)
 */
export interface Notification {
  notificationId: string;
  userId: string;

  // Notification Content
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'program' | 'session' | 'achievement' | 'message';

  // Actions
  actionUrl?: string;
  actionLabel?: string;

  // Status
  read: boolean;
  readAt?: Timestamp | Date;

  createdAt: Timestamp | Date;
}

/**
 * Activity Log (activityLog collection)
 */
export interface ActivityLog {
  activityId: string;
  userId: string;

  // Activity Info
  action: string; // 'profile_updated', 'session_completed', 'badge_earned'
  description: string;
  category: 'profile' | 'program' | 'achievement' | 'admin';

  // Metadata
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;

  timestamp: Timestamp | Date;
}

/**
 * Permission Sets by Role
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  student: ['read_own_profile', 'update_own_profile', 'view_programs', 'apply_scholarships', 'track_progress'],
  mentor: ['read_own_profile', 'view_assigned_students', 'log_sessions', 'provide_feedback'],
  organization: ['manage_programs', 'add_students', 'track_metrics', 'request_funding'],
  sponsor: ['view_opportunities', 'fund_programs', 'track_impact', 'view_reports'],
  teacher: ['manage_classrooms', 'add_students', 'assign_modules', 'track_progress'],
  school_admin: ['manage_teachers', 'view_school_data', 'generate_reports'],
  district_admin: ['view_district_data', 'compliance_reporting', 'manage_schools'],
  platform_admin: ['full_access'],
};
