/**
 * Extended User Types for Phase 7: Mentorship & Messaging
 */

export type UserRole = 'student' | 'mentor' | 'organization' | 'sponsor' | 'admin'

/**
 * Mentor Availability Slot
 */
export interface MentorAvailabilitySlot {
  dayOfWeek: number // 0-6 (Sunday=0, Monday=1, etc.)
  startTime: string // 'HH:MM'
  endTime: string   // 'HH:MM'
}

/**
 * Mentor Profile Extension
 */
export interface MentorProfile {
  bio: string
  experienceYears?: number
  certifications?: string[]  // e.g. ['CFI', 'ATP', 'A&P', 'Part 107']
  specialties: string[]      // e.g. ['flight_training', 'drones', 'maintenance', 'entrepreneurship']
  languages: string[]
  availabilityTimezone?: string
  availability: MentorAvailabilitySlot[]
  acceptsNewMentees: boolean
  maxMentees?: number
  currentMenteeCount?: number
  preferredAgeRanges?: string[]  // e.g. ['13-17', '18-24']
  virtualOnly?: boolean
  inPersonRegions?: string[]     // states/cities/regions
}

/**
 * Student Profile Extension
 */
export interface StudentProfile {
  interests: string[]        // e.g. ['flight', 'drones', 'mechanic', 'entrepreneurship']
  ageRange?: string          // '13-17', '18-24', etc.
  goals?: string             // free-text
  preferredLanguages?: string[]
  locationPreference?: 'virtual' | 'in_person' | 'both'
}

/**
 * Complete User Profile (compatible with existing auth.ts)
 */
export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
  displayName?: string
  location?: {
    country?: string
    state?: string
    city?: string
  }
  mentorProfile?: MentorProfile
  studentProfile?: StudentProfile
  profileComplete?: boolean
  createdAt: any  // Firebase Timestamp
  updatedAt: any  // Firebase Timestamp
  lastLoginAt?: any
}
