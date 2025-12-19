'use client'

import { useState } from 'react'
import { Plane, Code, Briefcase } from 'lucide-react'
import { PricingCard } from './PricingCard'
import { STUDENT_TIERS, getStudentTierDisplayName, formatPrice } from '@/config/subscriptions'
import type { CareerTrack, StudentTier } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface StudentPricingSectionProps {
  currentTier?: StudentTier
  currentTrack?: CareerTrack
  onSelectTier: (tier: StudentTier, track: CareerTrack) => void
  isLoading?: boolean
}

const trackConfig = {
  aviation: {
    id: 'aviation' as CareerTrack,
    name: 'Aviation',
    tagline: 'From Discovery Flight to Dream Career',
    icon: Plane,
    color: 'sky',
    description: 'Become a pilot, drone operator, or aviation professional',
  },
  stem: {
    id: 'stem' as CareerTrack,
    name: 'STEM',
    tagline: 'From Curiosity to Creation',
    icon: Code,
    color: 'purple',
    description: 'Master coding, robotics, AI, and engineering',
  },
  entrepreneurship: {
    id: 'entrepreneurship' as CareerTrack,
    name: 'Entrepreneurship',
    tagline: 'From Idea to Empire',
    icon: Briefcase,
    color: 'amber',
    description: 'Launch your business with AI-powered tools',
  },
}

export function StudentPricingSection({
  currentTier = 'free',
  currentTrack,
  onSelectTier,
  isLoading = false,
}: StudentPricingSectionProps) {
  const [selectedTrack, setSelectedTrack] = useState<CareerTrack>(currentTrack || 'aviation')

  const tiers = Object.values(STUDENT_TIERS)
  const track = trackConfig[selectedTrack]
  const TrackIcon = track.icon

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Choose Your Path to Success
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Select your career track and membership tier. Start free and upgrade as you grow.
        </p>
      </div>

      {/* Track Selector */}
      <div className="mb-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Object.values(trackConfig).map((t) => {
              const Icon = t.icon
              const isSelected = selectedTrack === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={cn(
                    'flex flex-col items-center rounded-xl border-2 p-6 transition-all',
                    isSelected
                      ? 'border-sky-500 bg-sky-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  )}
                >
                  <div
                    className={cn(
                      'mb-3 rounded-full p-3',
                      isSelected ? 'bg-sky-100' : 'bg-gray-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-6 w-6',
                        isSelected ? 'text-sky-600' : 'text-gray-500'
                      )}
                    />
                  </div>
                  <h3
                    className={cn(
                      'mb-1 font-semibold',
                      isSelected ? 'text-sky-900' : 'text-gray-900'
                    )}
                  >
                    {t.name}
                  </h3>
                  <p className="text-center text-xs text-gray-500">{t.tagline}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Selected Track Banner */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-center text-white">
        <div className="flex items-center justify-center gap-3">
          <TrackIcon className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-bold">{track.name} Track</h3>
            <p className="text-sm text-sky-100">{track.description}</p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const tierName = getStudentTierDisplayName(tier.id, selectedTrack)
          const isCurrent = currentTier === tier.id && currentTrack === selectedTrack

          return (
            <PricingCard
              key={tier.id}
              name={tierName}
              price={tier.price}
              description={`Mentor ratio: ${tier.mentorRatio}`}
              features={tier.features}
              tier={tier.id}
              isPopular={tier.id === 'silver'}
              isCurrent={isCurrent}
              isDisabled={isLoading}
              ctaText={tier.price === 0 ? 'Start Free' : 'Subscribe'}
              onSelect={() => onSelectTier(tier.id, selectedTrack)}
            />
          )
        })}
      </div>

      {/* Trust Badges */}
      <div className="mt-12 text-center">
        <p className="mb-4 text-sm text-gray-500">Trusted by 200,000+ students worldwide</p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
          <span className="text-xs uppercase tracking-wider">501(c)(3) Nonprofit</span>
          <span className="text-xs uppercase tracking-wider">FERPA Compliant</span>
          <span className="text-xs uppercase tracking-wider">Secure Payments</span>
          <span className="text-xs uppercase tracking-wider">Cancel Anytime</span>
        </div>
      </div>
    </div>
  )
}
