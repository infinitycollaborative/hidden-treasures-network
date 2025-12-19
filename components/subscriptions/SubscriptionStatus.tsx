'use client'

import { CreditCard, Calendar, AlertTriangle, CheckCircle, Settings } from 'lucide-react'
import { useSubscription } from '@/hooks/use-subscription'
import { STUDENT_TIERS, MENTOR_TIERS, formatPrice } from '@/config/subscriptions'
import type { StudentTier, MentorTier } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface SubscriptionStatusProps {
  userEmail: string
  userRole: 'student' | 'mentor'
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  trialing: 'bg-blue-100 text-blue-800',
  past_due: 'bg-red-100 text-red-800',
  canceled: 'bg-gray-100 text-gray-800',
  unpaid: 'bg-red-100 text-red-800',
  incomplete: 'bg-yellow-100 text-yellow-800',
  incomplete_expired: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  active: 'Active',
  trialing: 'Trial',
  past_due: 'Past Due',
  canceled: 'Canceled',
  unpaid: 'Unpaid',
  incomplete: 'Incomplete',
  incomplete_expired: 'Expired',
}

export function SubscriptionStatus({ userEmail, userRole }: SubscriptionStatusProps) {
  const {
    isLoading,
    hasSubscription,
    tier,
    careerTrack,
    status,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    openCustomerPortal,
    isFreeTier,
    isPaidTier,
  } = useSubscription({ userEmail })

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6">
        <div className="h-6 w-32 rounded bg-gray-200" />
        <div className="mt-4 h-4 w-48 rounded bg-gray-200" />
      </div>
    )
  }

  // Get tier configuration
  const tierConfig =
    userRole === 'student'
      ? STUDENT_TIERS[tier as StudentTier]
      : MENTOR_TIERS[tier as MentorTier]

  const tierName = tierConfig?.name || tier || 'Free'
  const tierPrice = tierConfig?.price || 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Membership Status</h3>
          <p className="text-sm text-gray-500">
            {isFreeTier ? 'Free tier' : 'Premium membership'}
          </p>
        </div>
        {status && (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              statusColors[status] || 'bg-gray-100 text-gray-800'
            )}
          >
            {statusLabels[status] || status}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {/* Current Plan */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
            <CreditCard className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{tierName}</p>
            <p className="text-sm text-gray-500">{formatPrice(tierPrice)}</p>
          </div>
        </div>

        {/* Career Track (for students) */}
        {careerTrack && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {careerTrack.charAt(0).toUpperCase() + careerTrack.slice(1)} Track
              </p>
              <p className="text-sm text-gray-500">Your career pathway</p>
            </div>
          </div>
        )}

        {/* Renewal Date */}
        {isPaidTier && currentPeriodEnd && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {cancelAtPeriodEnd ? 'Expires' : 'Renews'}{' '}
                {new Date(currentPeriodEnd).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {cancelAtPeriodEnd
                  ? 'Subscription will not renew'
                  : 'Auto-renewal enabled'}
              </p>
            </div>
          </div>
        )}

        {/* Cancellation Warning */}
        {cancelAtPeriodEnd && (
          <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Your subscription will end on{' '}
              {currentPeriodEnd
                ? new Date(currentPeriodEnd).toLocaleDateString()
                : 'the next billing date'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        {isPaidTier ? (
          <button
            onClick={openCustomerPortal}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            Manage Subscription
          </button>
        ) : (
          <a
            href="/pricing"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
          >
            Upgrade Now
          </a>
        )}
      </div>
    </div>
  )
}
