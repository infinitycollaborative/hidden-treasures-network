'use client'

import { Check, Star, Zap, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  name: string
  price: number
  description?: string
  features: string[]
  isPopular?: boolean
  isCurrent?: boolean
  isDisabled?: boolean
  ctaText?: string
  onSelect: () => void
  tier: 'free' | 'bronze' | 'silver' | 'gold' | string
}

const tierIcons = {
  free: null,
  bronze: Zap,
  silver: Star,
  gold: Crown,
}

const tierColors = {
  free: 'border-gray-200 bg-white',
  bronze: 'border-amber-300 bg-amber-50',
  silver: 'border-gray-400 bg-gray-50',
  gold: 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50',
}

const tierButtonColors = {
  free: 'bg-gray-600 hover:bg-gray-700',
  bronze: 'bg-amber-600 hover:bg-amber-700',
  silver: 'bg-gray-700 hover:bg-gray-800',
  gold: 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700',
}

export function PricingCard({
  name,
  price,
  description,
  features,
  isPopular = false,
  isCurrent = false,
  isDisabled = false,
  ctaText,
  onSelect,
  tier,
}: PricingCardProps) {
  const Icon = tierIcons[tier as keyof typeof tierIcons]
  const cardColor = tierColors[tier as keyof typeof tierColors] || tierColors.free
  const buttonColor = tierButtonColors[tier as keyof typeof tierButtonColors] || tierButtonColors.free

  const formatPrice = (priceInCents: number) => {
    if (priceInCents === 0) return 'Free'
    return `$${(priceInCents / 100).toFixed(0)}`
  }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border-2 p-6 shadow-sm transition-all duration-200',
        cardColor,
        isPopular && 'ring-2 ring-sky-500 ring-offset-2',
        isCurrent && 'ring-2 ring-green-500 ring-offset-2',
        !isDisabled && 'hover:shadow-lg'
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white">
            <Star className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Current Badge */}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
            <Check className="h-3 w-3" />
            Current Plan
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-amber-500" />}
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      </div>

      {/* Price */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-gray-900">{formatPrice(price)}</span>
        {price > 0 && <span className="text-gray-500">/year</span>}
      </div>

      {/* Description */}
      {description && (
        <p className="mb-6 text-sm text-gray-600">{description}</p>
      )}

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        disabled={isDisabled || isCurrent}
        className={cn(
          'w-full rounded-lg px-4 py-3 font-semibold text-white transition-all',
          buttonColor,
          (isDisabled || isCurrent) && 'cursor-not-allowed opacity-50'
        )}
      >
        {isCurrent ? 'Current Plan' : ctaText || (price === 0 ? 'Get Started Free' : 'Subscribe Now')}
      </button>
    </div>
  )
}
