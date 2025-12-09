'use client'

import { Quest, UserQuest, QuestDifficulty } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Clock, Users, CheckCircle2, Zap, Target } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface QuestCardProps {
  quest?: Quest
  userQuest?: UserQuest
  onStart?: (questId: string) => void
  onClaim?: (questId: string) => void
  variant?: 'available' | 'in-progress' | 'completed'
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-700 border-green-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  hard: 'bg-orange-100 text-orange-700 border-orange-300',
  expert: 'bg-red-100 text-red-700 border-red-300',
}

const difficultyIcons = {
  easy: '⭐',
  medium: '⭐⭐',
  hard: '⭐⭐⭐',
  expert: '⭐⭐⭐⭐',
}

export function QuestCard({ quest, userQuest, onStart, onClaim, variant = 'available' }: QuestCardProps) {
  // Determine which data to use
  const questData = quest
  const isCompleted = variant === 'completed' || userQuest?.status === 'completed'
  const isInProgress = variant === 'in-progress' || userQuest?.status === 'in_progress'
  const isAvailable = variant === 'available'

  if (!questData && !userQuest) {
    return null
  }

  // Calculate progress for in-progress quests
  let progressPercent = 0
  if (userQuest && isInProgress) {
    const totalRequirements = userQuest.progress.length
    const completedRequirements = userQuest.progress.filter(
      (req) => (req.current || 0) >= req.target
    ).length
    progressPercent = (completedRequirements / totalRequirements) * 100
  }

  // Check if quest is expiring soon
  const expiresAt = userQuest?.expiresAt || quest?.endDate
  const isExpiringSoon =
    expiresAt && expiresAt.toMillis() - Date.now() < 24 * 60 * 60 * 1000 // Less than 24 hours

  return (
    <Card
      className={`p-6 space-y-4 transition-all hover:shadow-lg ${
        isCompleted
          ? 'border-green-500 bg-green-50 dark:bg-green-950'
          : isExpiringSoon
          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
          : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : isInProgress ? (
              <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
            ) : (
              <Target className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
            <h3 className="text-lg font-bold">
              {userQuest?.questTitle || questData?.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {questData?.description}
          </p>
        </div>

        {/* Difficulty Badge */}
        {questData && (
          <Badge
            variant="outline"
            className={difficultyColors[questData.difficulty]}
          >
            {difficultyIcons[questData.difficulty]} {questData.difficulty.toUpperCase()}
          </Badge>
        )}
      </div>

      {/* Rewards */}
      <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">XP Reward</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              +{questData?.xpReward.toLocaleString()}
            </p>
          </div>
        </div>

        {questData?.badgeReward && (
          <>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Badge</p>
                <p className="text-sm font-semibold">Included</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Progress (for in-progress quests) */}
      {isInProgress && userQuest && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Progress</span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(progressPercent)}% Complete
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          {/* Requirements */}
          <div className="space-y-2">
            {userQuest.progress.map((req, index) => {
              const isReqCompleted = (req.current || 0) >= req.target
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    isReqCompleted
                      ? 'bg-green-50 dark:bg-green-950'
                      : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isReqCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                    <span className={isReqCompleted ? 'line-through text-gray-500' : ''}>
                      {req.description}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {req.current || 0} / {req.target}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Requirements (for available quests) */}
      {isAvailable && questData && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">Requirements:</p>
          <ul className="space-y-1">
            {questData.requirements.map((req, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>{req.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        {/* Quest Info */}
        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
          {questData && (
            <>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{questData.participantCount} participating</span>
              </div>
              {expiresAt && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span
                    className={isExpiringSoon ? 'text-orange-600 font-semibold' : ''}
                  >
                    Ends {formatDistanceToNow(new Date(expiresAt.toMillis()), { addSuffix: true })}
                  </span>
                </div>
              )}
            </>
          )}

          {isInProgress && userQuest && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Started {formatDistanceToNow(new Date(userQuest.startedAt.toMillis()), { addSuffix: true })}
              </span>
            </div>
          )}

          {isCompleted && userQuest?.completedAt && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Completed {formatDistanceToNow(new Date(userQuest.completedAt.toMillis()), { addSuffix: true })}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {isAvailable && onStart && questData && (
          <Button onClick={() => onStart(questData.id)} size="sm">
            Start Quest
          </Button>
        )}

        {isCompleted && onClaim && questData && (
          <Button onClick={() => onClaim(questData.id)} size="sm" variant="outline" disabled>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Claimed
          </Button>
        )}

        {isInProgress && progressPercent === 100 && onClaim && questData && (
          <Button onClick={() => onClaim(questData.id)} size="sm" className="bg-green-600 hover:bg-green-700">
            Claim Reward
          </Button>
        )}
      </div>
    </Card>
  )
}
