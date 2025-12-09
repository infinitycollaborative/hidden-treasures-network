'use client'

import { UserBadge, BadgeDefinition } from '@/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Trophy, Lock, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface BadgeCardProps {
  badge?: UserBadge | BadgeDefinition
  earned?: boolean
  locked?: boolean
  showXP?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const tierColors = {
  bronze: 'from-amber-700 to-amber-900',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
}

const tierBorders = {
  bronze: 'border-amber-700',
  silver: 'border-gray-400',
  gold: 'border-yellow-400',
  platinum: 'border-purple-400',
}

export function BadgeCard({ badge, earned = false, locked = false, showXP = true, size = 'md', onClick }: BadgeCardProps) {
  if (!badge) return null

  const isUserBadge = 'awardedAt' in badge
  const badgeData = badge as UserBadge | BadgeDefinition

  // Size classes
  const sizeClasses = {
    sm: {
      card: 'p-3',
      image: 64,
      title: 'text-sm font-semibold',
      description: 'text-xs',
      xp: 'text-xs',
    },
    md: {
      card: 'p-4',
      image: 96,
      title: 'text-base font-semibold',
      description: 'text-sm',
      xp: 'text-sm',
    },
    lg: {
      card: 'p-6',
      image: 128,
      title: 'text-lg font-bold',
      description: 'text-base',
      xp: 'text-base',
    },
  }

  const tier = 'badgeTier' in badgeData ? badgeData.badgeTier : (badgeData as BadgeDefinition).tier
  const name = 'badgeName' in badgeData ? badgeData.badgeName : (badgeData as BadgeDefinition).name
  const imageURL = badgeData.imageURL
  const xpReward = 'xpAwarded' in badgeData ? badgeData.xpAwarded : (badgeData as BadgeDefinition).xpReward
  const description = 'reason' in badgeData
    ? badgeData.reason
    : (badgeData as BadgeDefinition).description

  return (
    <Card
      className={`relative overflow-hidden transition-all hover:shadow-lg ${sizeClasses[size].card} ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } ${earned ? tierBorders[tier] : 'border-gray-300'} ${locked ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      {/* Tier gradient background */}
      {earned && (
        <div className={`absolute inset-0 bg-gradient-to-br ${tierColors[tier]} opacity-5`} />
      )}

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        {/* Badge Image */}
        <div className="relative">
          {locked ? (
            <div
              className="flex items-center justify-center rounded-full bg-gray-200"
              style={{ width: sizeClasses[size].image, height: sizeClasses[size].image }}
            >
              <Lock className="w-1/2 h-1/2 text-gray-400" />
            </div>
          ) : (
            <div className={`relative ${earned ? 'animate-pulse-slow' : ''}`}>
              <Image
                src={imageURL}
                alt={name}
                width={sizeClasses[size].image}
                height={sizeClasses[size].image}
                className={`rounded-full ${!earned ? 'grayscale' : ''}`}
              />
              {earned && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
              )}
              {!earned && !locked && (badgeData as BadgeDefinition).isSecret && (
                <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badge Info */}
        <div className="space-y-2 w-full">
          {/* Tier Badge */}
          <div className="flex items-center justify-center gap-2">
            <Badge
              variant="outline"
              className={`${
                earned ? `bg-gradient-to-r ${tierColors[tier]} text-white border-none` : ''
              }`}
            >
              {tier.toUpperCase()}
            </Badge>
          </div>

          {/* Name */}
          <h3 className={sizeClasses[size].title}>{locked ? '???' : name}</h3>

          {/* Description */}
          <p className={`${sizeClasses[size].description} text-gray-600 dark:text-gray-400 line-clamp-3`}>
            {locked ? 'Complete the requirements to unlock this badge.' : description}
          </p>

          {/* XP Reward */}
          {showXP && !locked && (
            <div className={`${sizeClasses[size].xp} font-semibold text-blue-600 dark:text-blue-400`}>
              +{xpReward} XP
            </div>
          )}

          {/* Earned Date */}
          {earned && isUserBadge && (
            <p className="text-xs text-gray-500">
              Earned{' '}
              {formatDistanceToNow(new Date((badge as UserBadge).awardedAt.toMillis()), {
                addSuffix: true,
              })}
            </p>
          )}

          {/* Real World Equivalent */}
          {!locked && 'realWorldEquivalent' in badgeData && badgeData.realWorldEquivalent && (
            <p className="text-xs text-gray-500 italic">≈ {badgeData.realWorldEquivalent}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
