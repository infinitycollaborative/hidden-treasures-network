import { Timestamp } from 'firebase/firestore'

/**
 * Subscription System Types for Hidden Treasures Network
 * Supports three career tracks: Aviation, STEM, Entrepreneurship
 * Plus Mentor and Educator membership tiers
 */

// Career Track Types
export type CareerTrack = 'aviation' | 'stem' | 'entrepreneurship'

// Membership Tier Types (aligned with Product Specification)
export type StudentTier = 'free' | 'bronze' | 'silver' | 'gold'
export type MentorTier = 'volunteer' | 'flight_lead' | 'squadron_commander' | 'legacy_aviator'
export type EducatorTier = 'individual' | 'school_starter' | 'district_partner' | 'regional_affiliate' | 'global_franchise'

// Subscription Status
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'

// Billing Interval
export type BillingInterval = 'month' | 'year'

/**
 * Student Tier Configuration
 */
export interface StudentTierConfig {
  id: StudentTier
  name: string
  trackName: {
    aviation: string
    stem: string
    entrepreneurship: string
  }
  price: number // Annual price in cents
  mentorRatio: string // e.g., "1:10", "1:5", "1:3"
  features: string[]
  stripePriceId?: string // Set in production
}

/**
 * Mentor Tier Configuration
 */
export interface MentorTierConfig {
  id: MentorTier
  name: string
  price: number // Annual price in cents
  studentCapacity: string // e.g., "1-3", "5-10"
  features: string[]
  stripePriceId?: string
}

/**
 * Educator Tier Configuration
 */
export interface EducatorTierConfig {
  id: EducatorTier
  name: string
  price: number // Annual price in cents
  studentLimit: number | 'unlimited'
  revenueShare?: number // Percentage for affiliates
  features: string[]
  stripePriceId?: string
}

/**
 * User Subscription Record (stored in Firestore)
 */
export interface UserSubscription {
  id: string
  userId: string
  userEmail: string
  userRole: 'student' | 'mentor' | 'teacher' | 'organization'

  // Subscription Details
  tier: StudentTier | MentorTier | EducatorTier
  careerTrack?: CareerTrack // For students only
  status: SubscriptionStatus

  // Stripe IDs
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripePriceId: string

  // Billing
  billingInterval: BillingInterval
  currentPeriodStart: Timestamp
  currentPeriodEnd: Timestamp
  cancelAtPeriodEnd: boolean

  // Trial
  trialStart?: Timestamp
  trialEnd?: Timestamp

  // Payment
  latestInvoiceId?: string
  latestPaymentStatus?: 'succeeded' | 'pending' | 'failed'

  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  canceledAt?: Timestamp
  cancelReason?: string
}

/**
 * Stripe Customer Record (stored in Firestore)
 */
export interface StripeCustomer {
  id: string
  userId: string
  stripeCustomerId: string
  email: string
  name: string
  defaultPaymentMethodId?: string
  invoiceSettings?: {
    defaultPaymentMethod?: string
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Subscription Event Log (for audit trail)
 */
export interface SubscriptionEvent {
  id: string
  userId: string
  subscriptionId: string
  eventType:
    | 'subscription.created'
    | 'subscription.updated'
    | 'subscription.deleted'
    | 'subscription.trial_will_end'
    | 'invoice.paid'
    | 'invoice.payment_failed'
    | 'customer.subscription.paused'
    | 'customer.subscription.resumed'
  stripeEventId: string
  data: Record<string, any>
  timestamp: Timestamp
}

/**
 * Checkout Session Request
 */
export interface CreateCheckoutRequest {
  userId: string
  userEmail: string
  userRole: 'student' | 'mentor' | 'teacher' | 'organization'
  tier: StudentTier | MentorTier | EducatorTier
  careerTrack?: CareerTrack
  billingInterval?: BillingInterval
  successUrl: string
  cancelUrl: string
}

/**
 * Customer Portal Request
 */
export interface CreatePortalRequest {
  userId: string
  returnUrl: string
}

/**
 * Subscription Update Request
 */
export interface UpdateSubscriptionRequest {
  subscriptionId: string
  newTier?: StudentTier | MentorTier | EducatorTier
  newCareerTrack?: CareerTrack
  cancelAtPeriodEnd?: boolean
}
