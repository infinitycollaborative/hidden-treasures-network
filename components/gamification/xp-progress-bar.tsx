'use client'

import { UserXP } from '@/types'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Award, Zap } from 'lucide-react'
import { getCurrentLevelProgress } from '@/lib/db-gamification'

interface XPProgressBarProps {
  userXP: UserXP
  showBreakdown?: boolean
  variant?: 'compact' | 'detailed'
}

export function XPProgressBar({ userXP, showBreakdown = false, variant = 'detailed' }: XPProgressBarProps) {
  const progress = getCurrentLevelProgress(userXP.totalXP)

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
          {progress.level}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Level {progress.level}</span>
            <span className="text-gray-600 dark:text-gray-400">
              {progress.currentLevelXP.toLocaleString()} / {progress.xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progress.progressPercent} className="h-2" />
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-2xl shadow-lg">
            {progress.level}
          </div>
          <div>
            <h3 className="text-xl font-bold">Level {progress.level}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {userXP.totalXP.toLocaleString()} Total XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">{Math.round(progress.progressPercent)}%</span>
          </div>
          <p className="text-xs text-gray-500">to next level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress.progressPercent} className="h-3" />
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{progress.currentLevelXP.toLocaleString()} XP</span>
          <span className="font-semibold">
            {(progress.xpForNextLevel - progress.currentLevelXP).toLocaleString()} XP to Level {progress.level + 1}
          </span>
          <span>{progress.xpForNextLevel.toLocaleString()} XP</span>
        </div>
      </div>

      {/* XP Breakdown */}
      {showBreakdown && (
        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Award className="w-4 h-4" />
            XP Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(userXP.xpBreakdown)
              .filter(([_, value]) => value > 0)
              .sort(([_, a], [__, b]) => b - a)
              .map(([category, xp]) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={category} />
                    <span className="text-sm font-medium capitalize">
                      {category.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {xp.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  )
}

function CategoryIcon({ category }: { category: string }) {
  const iconClass = 'w-4 h-4'

  switch (category) {
    case 'badges':
      return <Award className={`${iconClass} text-yellow-500`} />
    case 'sessions':
      return <Zap className={`${iconClass} text-blue-500`} />
    case 'programs':
      return <TrendingUp className={`${iconClass} text-green-500`} />
    case 'quests':
      return <Award className={`${iconClass} text-purple-500`} />
    case 'events':
      return <Award className={`${iconClass} text-red-500`} />
    case 'mentoring':
      return <Award className={`${iconClass} text-indigo-500`} />
    default:
      return <Zap className={`${iconClass} text-gray-500`} />
  }
}
