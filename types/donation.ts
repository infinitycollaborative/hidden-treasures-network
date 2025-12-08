import { Timestamp } from 'firebase/firestore'

/**
 * Donation Types
 */
export type DonationType = 'one-time' | 'monthly'
export type DonationStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'

export interface Donation {
  id: string
  userId?: string // Optional for anonymous donations
  amount: number
  currency: string
  type: DonationType
  sponsorTier?: string
  status: DonationStatus
  paymentIntentId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  receiptUrl?: string
  receiptNumber?: string
  metadata?: Record<string, string>
}

/**
 * Donation Receipt
 */
export interface DonationReceipt {
  id: string
  donationId: string
  userId?: string
  receiptNumber: string
  amount: number
  currency: string
  donorName?: string
  donorEmail?: string
  organizationName: string
  organizationTaxId: string
  donationDate: Timestamp
  createdAt: Timestamp
  pdfUrl?: string
}

/**
 * Payment Intent Request
 */
export interface CreatePaymentIntentRequest {
  amount: number
  donorId?: string
  sponsorTier?: string
  donationType: DonationType
  email?: string
  name?: string
}

/**
 * Payment Intent Response
 */
export interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}
