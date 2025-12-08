import { Timestamp } from 'firebase/firestore'

/**
 * Sponsor Tier Types
 */
export interface SponsorTier {
  id: string
  name: string
  amountMin: number
  amountMax?: number
  benefits: string[]
  description: string
  color?: string
  isActive: boolean
  displayOrder: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Sponsor Record
 */
export type SponsorStatus = 'pending' | 'approved' | 'active' | 'inactive'

export interface Sponsor {
  id: string
  orgName: string
  contactEmail: string
  contactName: string
  contactPhone?: string
  tierId: string
  logoUrl?: string
  website?: string
  status: SponsorStatus
  totalContributions: number
  lastContributionAt?: Timestamp
  joinedAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
  region?: string
  programSupport?: string
  companyDescription?: string
  isPublished: boolean
}

/**
 * Sponsor Application
 */
export interface SponsorApplication {
  id: string
  orgName: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  website?: string
  tierId: string
  region?: string
  programSupport?: string
  message?: string
  logoFile?: File
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string
  reviewNotes?: string
}

/**
 * Sponsor Impact Metrics
 */
export interface SponsorImpactMetrics {
  sponsorId: string
  youthReached: number
  discoveryFlightsFunded: number
  certificationsSponsored: number
  eventsSupported: number
  studentsSponsored: string[] // Array of student IDs
  regionsImpacted: string[] // Array of region names
  programsFunded: string[] // Array of program IDs
  lastCalculated: Timestamp
}

/**
 * Sponsor Impact Report
 */
export interface SponsorImpactReport {
  id: string
  sponsorId: string
  reportPeriodStart: Timestamp
  reportPeriodEnd: Timestamp
  metrics: SponsorImpactMetrics
  pdfUrl?: string
  createdAt: Timestamp
  generatedBy: string
}
