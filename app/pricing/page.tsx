'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { StudentPricingSection } from '@/components/subscriptions/StudentPricingSection'
import { useSubscription } from '@/hooks/use-subscription'
import { useAuth } from '@/hooks/use-auth'
import type { StudentTier, CareerTrack } from '@/types/subscription'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function PricingPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  const {
    isLoading,
    tier: currentTier,
    careerTrack: currentTrack,
    createCheckout,
    error,
  } = useSubscription({
    userEmail: user?.email || null,
  })

  // Handle URL params for subscription status
  useEffect(() => {
    const subscription = searchParams.get('subscription')
    if (subscription === 'success') {
      setNotification({
        type: 'success',
        message: 'Welcome aboard! Your subscription is now active.',
      })
    } else if (subscription === 'cancelled') {
      setNotification({
        type: 'info',
        message: 'Checkout was cancelled. Choose a plan when you\'re ready.',
      })
    }
  }, [searchParams])

  // Show error notification
  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: error,
      })
    }
  }, [error])

  const handleSelectTier = async (tier: StudentTier, track: CareerTrack) => {
    if (!user) {
      // Redirect to login with return URL
      window.location.href = `/login?returnUrl=${encodeURIComponent(`/pricing?tier=${tier}&track=${track}`)}`
      return
    }

    if (tier === 'free') {
      // Free tier - no checkout needed
      setNotification({
        type: 'success',
        message: 'You\'re on the free tier. Explore and upgrade when ready!',
      })
      return
    }

    // Create checkout session
    await createCheckout({
      userId: user.uid,
      userEmail: user.email || '',
      userRole: 'student',
      tier,
      careerTrack: track,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`px-4 py-3 ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
            {notification.type === 'error' && <XCircle className="h-5 w-5" />}
            {notification.type === 'info' && <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-700 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Unlock Your Hidden Treasure
          </h1>
          <p className="text-xl text-sky-100">
            Join 200,000+ students on their journey to aviation, STEM, and entrepreneurship careers.
            Start free, grow with us.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <StudentPricingSection
        currentTier={currentTier as StudentTier}
        currentTrack={currentTrack as CareerTrack}
        onSelectTier={handleSelectTier}
        isLoading={isLoading}
      />

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">
                Can I switch career tracks later?
              </h3>
              <p className="text-gray-600">
                Yes! You can switch between Aviation, STEM, and Entrepreneurship tracks
                at any time. Your progress and badges transfer with you.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">
                What's included in the free tier?
              </h3>
              <p className="text-gray-600">
                The free tier includes profile creation, introductory courses, event access,
                and community forum participation. It's a great way to explore the platform.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel anytime. Your subscription remains active until the
                end of your billing period, and you'll retain access to earned badges
                and certifications.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">
                Are scholarships available?
              </h3>
              <p className="text-gray-600">
                Yes! We offer need-based scholarships through our Funding Marketplace.
                Premium tier members get priority access to scholarship applications.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Ready to Discover Your Hidden Treasure?
          </h2>
          <p className="mb-8 text-gray-600">
            Join thousands of students breaking barriers in aviation and STEM.
            Your journey starts with a single step.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleSelectTier('free', 'aviation')}
              className="rounded-lg bg-sky-600 px-8 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Start Free Today
            </button>
            <a
              href="/about"
              className="rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:border-gray-400"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
