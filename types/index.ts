import { Timestamp } from 'firebase/firestore'

/**
 * User Role Types - Phase 11: Extended Admin Hierarchy
 */
export type UserRole = 
  | 'student' 
  | 'mentor' 
  | 'organization' 
  | 'sponsor' 
  | 'admin'
  | 'super_admin'
  | 'country_admin'
  | 'regional_admin'
  | 'organization_admin'

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  eventReminders: boolean
  resourceUpdates: boolean
  mentorMessages: boolean
  systemAnnouncements: boolean
}

/**
 * Base User Interface
 * Common fields shared across all user types
 */
export interface BaseUser {
  id: string
  email: string
  role: UserRole
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  isActive: boolean
  emailVerified: boolean
  notificationPreferences?: NotificationPreferences
}

/**
 * Student Profile
 */
export interface StudentProfile extends BaseUser {
  role: 'student'
  dateOfBirth?: Date
  grade?: string
  school?: string
  interests: string[]
  goals: string[]
  parentGuardianEmail?: string
  parentGuardianPhone?: string
  mentorIds: string[]
  programsEnrolled: string[]
  achievements: Achievement[]
  hoursCompleted: number
}

/**
 * Mentor Profile
 */
export interface MentorProfile extends BaseUser {
  role: 'mentor'
  occupation: string
  company?: string
  specialty: string[]
  certifications: string[]
  yearsOfExperience: number
  bio: string
  availableHours: number
  studentIds: string[]
  organizationIds: string[]
  volunteerHours: number
  socialLinks?: SocialLinks
}

/**
 * Organization Profile
 */
export interface OrganizationProfile extends BaseUser {
  role: 'organization'
  organizationName: string
  type: 'nonprofit' | 'school' | 'company' | 'government' | 'other'
  taxId?: string
  website?: string
  description: string
  foundedYear?: number
  location: Location
  contactPerson: ContactPerson
  programs: Program[]
  memberCount: number
  studentsImpacted: number
  mentorIds: string[]
  sponsorIds: string[]
  socialLinks?: SocialLinks
}

/**
 * Sponsor Profile
 */
export interface SponsorProfile extends BaseUser {
  role: 'sponsor'
  sponsorType: 'individual' | 'corporate' | 'foundation'
  companyName?: string
  website?: string
  description?: string
  contributionLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'custom'
  totalContributed: number
  organizationIds: string[]
  programsSupported: string[]
  impactMetrics: ImpactMetrics
  socialLinks?: SocialLinks
}

/**
 * Admin Profile - Phase 11: Extended for multi-tenant governance
 */
export interface AdminProfile extends BaseUser {
  role: 'admin' | 'super_admin' | 'country_admin' | 'regional_admin' | 'organization_admin'
  permissions: AdminPermission[]
  department?: string
  country?: string // For country_admin
  region?: string // For regional_admin
  organizationId?: string // For organization_admin
  managedCountries?: string[] // For super_admin
  managedRegions?: string[] // For country_admin
  managedOrganizations?: string[] // For regional_admin
}

/**
 * Union type for all user profiles
 */
export type UserProfile =
  | StudentProfile
  | MentorProfile
  | OrganizationProfile
  | SponsorProfile
  | AdminProfile

/**
 * Supporting Types
 */

export interface Location {
  address?: string
  city: string
  state: string
  country: string
  zipCode?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface ContactPerson {
  name: string
  email: string
  phone?: string
  position?: string
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  youtube?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  dateEarned: Timestamp
  badgeURL?: string
  issuedBy: string
}

export interface Program {
  id: string
  name: string
  description: string
  category: ProgramCategory
  startDate?: Timestamp
  endDate?: Timestamp
  capacity?: number
  enrolled: number
  status: 'active' | 'inactive' | 'completed'
  imageURL?: string
}

export type ProgramCategory =
  | 'aviation'
  | 'stem'
  | 'entrepreneurship'
  | 'mentorship'
  | 'scholarship'
  | 'workshop'
  | 'other'

export interface ImpactMetrics {
  studentsReached: number
  programsFunded: number
  organizationsSupported: number
  totalHoursSponsored: number
}

export type AdminPermission =
  | 'manage_users'
  | 'manage_organizations'
  | 'manage_programs'
  | 'manage_content'
  | 'view_analytics'
  | 'system_settings'
  | 'super_admin'

/**
 * Authentication Types
 */
export interface AuthUser {
  uid: string
  email: string | null
  emailVerified: boolean
  displayName: string | null
  photoURL: string | null
}

export interface SignUpData {
  email: string
  password: string
  displayName: string
  role: UserRole
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Form Types
 */
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  role?: UserRole
}

export interface JoinFormData {
  firstName: string
  lastName: string
  email: string
  role: UserRole
  organization?: string
  message?: string
}

/**
 * Network Statistics
 */
export interface NetworkStats {
  totalOrganizations: number
  totalMentors: number
  totalStudents: number
  totalSponsors: number
  totalLivesImpacted: number
  totalVolunteerHours: number
  totalProgramsActive: number
  countriesRepresented: number
  lastUpdated: Timestamp
}

/**
 * Map Data Types (for Mapbox integration)
 */
export interface MapMarker {
  id: string
  type: 'organization' | 'event' | 'partner'
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  description?: string
  imageURL?: string
}

/**
 * Event Types
 */
export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  startDate: Timestamp
  endDate: Timestamp
  location: Location | 'virtual'
  organizerId: string
  organizerName: string
  capacity?: number
  registered: number
  imageURL?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isPublic: boolean
}

export type EventCategory =
  | 'workshop'
  | 'webinar'
  | 'conference'
  | 'networking'
  | 'training'
  | 'competition'
  | 'other'

/**
 * Phase 11: Compliance System Types
 */
export interface ComplianceRequirement {
  id: string
  name: string
  appliesTo: ('organization' | 'mentor')[]
  frequency: 'annual' | 'biannual' | 'one-time'
  description: string
  required: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ComplianceSubmission {
  id: string
  orgId: string
  requirementId: string
  requirementName: string
  submittedBy: string
  submittedByName: string
  fileUrl: string
  fileName: string
  status: 'submitted' | 'approved' | 'rejected'
  adminReviewerId?: string
  adminReviewerName?: string
  reviewComments?: string
  expirationDate?: Timestamp
  submittedAt: Timestamp
  reviewedAt?: Timestamp
}

/**
 * Phase 11: Incident Reporting Types
 */
export type IncidentType = 
  | 'safety_violation'
  | 'code_of_conduct'
  | 'harassment'
  | 'abuse_suspicion'
  | 'inappropriate_messages'
  | 'event_safety'
  | 'other'

export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'under_review' | 'resolved' | 'closed'

export interface Incident {
  id: string
  type: IncidentType
  priority: IncidentPriority
  status: IncidentStatus
  title: string
  description: string
  location?: string
  organizationId?: string
  organizationName?: string
  eventId?: string
  personsInvolved?: string[]
  minorsInvolved: boolean
  evidenceUrls?: string[]
  reportedBy: string
  reportedByName: string
  reportedByRole: UserRole
  assignedTo?: string
  assignedToName?: string
  notes?: IncidentNote[]
  createdAt: Timestamp
  updatedAt: Timestamp
  resolvedAt?: Timestamp
}

export interface IncidentNote {
  id: string
  userId: string
  userName: string
  note: string
  timestamp: Timestamp
}

/**
 * Phase 11: Audit Log Types
 */
export type AuditAction = 
  | 'admin_role_changed'
  | 'organization_approved'
  | 'organization_suspended'
  | 'organization_activated'
  | 'compliance_approved'
  | 'compliance_rejected'
  | 'user_role_changed'
  | 'user_suspended'
  | 'user_activated'
  | 'incident_created'
  | 'incident_updated'
  | 'incident_resolved'
  | 'sponsor_tier_changed'
  | 'data_edited'
  | 'settings_changed'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  action: AuditAction
  targetId?: string
  targetType?: 'organization' | 'event' | 'session' | 'user' | 'compliance' | 'incident'
  targetName?: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: Timestamp
}

/**
 * Phase 11: AI Risk Scoring Types
 */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface RiskScore {
  organizationId: string
  organizationName: string
  score: number // 0-100
  level: RiskLevel
  reasons: string[]
  recommendedActions: string[]
  factors: RiskFactor[]
  calculatedAt: Timestamp
  calculatedBy: 'ai' | 'manual'
  overrideBy?: string
  overrideReason?: string
}

export interface RiskFactor {
  category: string
  weight: number
  description: string
  value: number
}

/**
 * Phase 11: Admin Communication Types
 */
export type MessageAudience = 
  | 'network_wide'
  | 'country'
  | 'region'
  | 'organization'
  | 'role_specific'

export interface AdminMessage {
  id: string
  title: string
  content: string
  audience: MessageAudience
  targetCountries?: string[]
  targetRegions?: string[]
  targetOrganizations?: string[]
  targetRoles?: UserRole[]
  senderId: string
  senderName: string
  deliveryChannels: ('in_app' | 'email' | 'sms')[]
  scheduledFor?: Timestamp
  sentAt?: Timestamp
  readBy?: string[]
  createdAt: Timestamp
}

/**
 * Phase 11: Enhanced Organization Types
 */
export interface OrganizationHealth {
  complianceScore: number // 0-100
  riskScore: number // 0-100
  riskLevel: RiskLevel
  engagementScore: number // 0-100
  lastActivityDate?: Timestamp
  activeStudents: number
  activeMentors: number
  eventsThisMonth: number
  sessionsThisMonth: number
  complianceIssues: string[]
  riskFactors: string[]
}
