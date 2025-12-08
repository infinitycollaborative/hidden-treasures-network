import { Timestamp } from 'firebase/firestore'

/**
 * User Role Types
 */
export type UserRole = 'student' | 'mentor' | 'organization' | 'sponsor' | 'admin'

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
 * Admin Profile
 */
export interface AdminProfile extends BaseUser {
  role: 'admin'
  permissions: AdminPermission[]
  department?: string
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
