'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  StudentTier,
  MentorTier,
  EducatorTier,
  CareerTrack,
  SubscriptionStatus,
} from '@/types/subscription'

interface SubscriptionState {
  isLoading: boolean
  hasSubscription: boolean
  tier: StudentTier | MentorTier | EducatorTier | null
  careerTrack: CareerTrack | null
  status: SubscriptionStatus | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  error: string | null
}

interface UseSubscriptionOptions {
  userEmail: string | null
  autoFetch?: boolean
}

interface UseSubscriptionReturn extends SubscriptionState {
  fetchStatus: () => Promise<void>
  createCheckout: (params: CreateCheckoutParams) => Promise<string | null>
  openCustomerPortal: () => Promise<void>
  isFreeTier: boolean
  isPaidTier: boolean
}

interface CreateCheckoutParams {
  userId: string
  userEmail: string
  userRole: 'student' | 'mentor' | 'teacher' | 'organization'
  tier: StudentTier | MentorTier | EducatorTier
  careerTrack?: CareerTrack
}

/**
 * Hook for managing user subscription state and actions
 */
export function useSubscription({
  userEmail,
  autoFetch = true,
}: UseSubscriptionOptions): UseSubscriptionReturn {
  const [state, setState] = useState<SubscriptionState>({
    isLoading: false,
    hasSubscription: false,
    tier: null,
    careerTrack: null,
    status: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    error: null,
  })

  /**
   * Fetch subscription status from API
   */
  const fetchStatus = useCallback(async () => {
    if (!userEmail) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        hasSubscription: false,
        tier: 'free',
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(
        `/api/subscriptions/status?email=${encodeURIComponent(userEmail)}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }

      const data = await response.json()

      setState({
        isLoading: false,
        hasSubscription: data.hasSubscription || false,
        tier: data.tier || 'free',
        careerTrack: data.careerTrack || null,
        status: data.status || null,
        currentPeriodEnd: data.currentPeriodEnd || null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
        error: null,
      })
    } catch (error: any) {
      console.error('Error fetching subscription:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch subscription',
      }))
    }
  }, [userEmail])

  /**
   * Create a checkout session and redirect to Stripe
   */
  const createCheckout = useCallback(
    async (params: CreateCheckoutParams): Promise<string | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch('/api/subscriptions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...params,
            successUrl: `${window.location.origin}/dashboard?subscription=success`,
            cancelUrl: `${window.location.origin}/pricing?subscription=cancelled`,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create checkout session')
        }

        const data = await response.json()

        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url
          return data.url
        }

        return data.sessionId
      } catch (error: any) {
        console.error('Error creating checkout:', error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Failed to create checkout',
        }))
        return null
      }
    },
    []
  )

  /**
   * Open Stripe Customer Portal for subscription management
   */
  const openCustomerPortal = useCallback(async () => {
    if (!userEmail) {
      setState((prev) => ({
        ...prev,
        error: 'User email is required',
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/subscriptions/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          returnUrl: `${window.location.origin}/dashboard`,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to open customer portal')
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Error opening portal:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to open customer portal',
      }))
    }
  }, [userEmail])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && userEmail) {
      fetchStatus()
    }
  }, [autoFetch, userEmail, fetchStatus])

  // Computed properties
  const isFreeTier = !state.hasSubscription || state.tier === 'free' || state.tier === 'volunteer'
  const isPaidTier = state.hasSubscription && state.status === 'active' && !isFreeTier

  return {
    ...state,
    fetchStatus,
    createCheckout,
    openCustomerPortal,
    isFreeTier,
    isPaidTier,
  }
}
