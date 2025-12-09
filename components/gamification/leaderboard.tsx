'use client'

import { Leaderboard, LeaderboardEntry } from '@/types'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, TrendingUp, TrendingDown, Minus, Medal, Award } from 'lucide-react'
import Image from 'next/image'

interface LeaderboardComponentProps {
  leaderboard: Leaderboard
  currentUserId?: string
  showTop?: number
}

export function LeaderboardComponent({
  leaderboard,
  currentUserId,
  showTop = 100,
}: LeaderboardComponentProps) {
  const topEntries = leaderboard.entries.slice(0, showTop)
  const currentUserEntry = leaderboard.entries.find((entry) => entry.userId === currentUserId)
  const showCurrentUser = currentUserEntry && currentUserEntry.rank > showTop

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Leaderboard</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {leaderboard.type.replace('_', ' ').toUpperCase()} · {leaderboard.period.replace('_', ' ').toUpperCase()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{leaderboard.totalParticipants.toLocaleString()}</p>
          <p className="text-xs text-gray-500">participants</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topEntries.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-6">
          {/* 2nd Place */}
          <PodiumCard entry={topEntries[1]} rank={2} currentUserId={currentUserId} />

          {/* 1st Place */}
          <PodiumCard entry={topEntries[0]} rank={1} currentUserId={currentUserId} />

          {/* 3rd Place */}
          <PodiumCard entry={topEntries[2]} rank={3} currentUserId={currentUserId} />
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {topEntries.slice(3).map((entry) => (
          <LeaderboardRow
            key={entry.userId}
            entry={entry}
            isCurrentUser={entry.userId === currentUserId}
          />
        ))}
      </div>

      {/* Current User (if not in top) */}
      {showCurrentUser && currentUserEntry && (
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500 mb-2">Your Position</p>
          <LeaderboardRow entry={currentUserEntry} isCurrentUser={true} />
        </div>
      )}

      {/* Last Updated */}
      <p className="text-xs text-center text-gray-500">
        Last updated: {new Date(leaderboard.lastUpdated.toMillis()).toLocaleString()}
      </p>
    </Card>
  )
}

function PodiumCard({
  entry,
  rank,
  currentUserId,
}: {
  entry: LeaderboardEntry
  rank: number
  currentUserId?: string
}) {
  const heights = { 1: 'h-40', 2: 'h-32', 3: 'h-28' }
  const medals = {
    1: { icon: Trophy, color: 'from-yellow-400 to-yellow-600' },
    2: { icon: Medal, color: 'from-gray-400 to-gray-600' },
    3: { icon: Medal, color: 'from-amber-600 to-amber-800' },
  }

  const MedalIcon = medals[rank as keyof typeof medals].icon
  const isCurrentUser = entry.userId === currentUserId

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Avatar */}
      <div className={`relative ${isCurrentUser ? 'ring-4 ring-blue-500 rounded-full' : ''}`}>
        {entry.photoURL ? (
          <Image
            src={entry.photoURL}
            alt={entry.displayName}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
            {entry.displayName[0]}
          </div>
        )}
        {/* Medal Badge */}
        <div
          className={`absolute -top-2 -right-2 p-1.5 rounded-full bg-gradient-to-br ${
            medals[rank as keyof typeof medals].color
          } shadow-lg`}
        >
          <MedalIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Podium */}
      <div
        className={`${heights[rank as keyof typeof heights]} w-24 bg-gradient-to-br ${
          medals[rank as keyof typeof medals].color
        } rounded-t-lg flex flex-col items-center justify-center text-white shadow-lg`}
      >
        <p className="text-3xl font-bold">{rank}</p>
        <p className="text-xs font-semibold mt-1">{entry.level}</p>
        <p className="text-xs opacity-90">Level</p>
      </div>

      {/* Name & Stats */}
      <div className="text-center">
        <p className="font-semibold text-sm truncate max-w-[100px]">{entry.displayName}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {entry.totalXP.toLocaleString()} XP
        </p>
        <p className="text-xs text-gray-500">{entry.badgeCount} badges</p>
      </div>
    </div>
  )
}

function LeaderboardRow({
  entry,
  isCurrentUser,
}: {
  entry: LeaderboardEntry
  isCurrentUser: boolean
}) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
        isCurrentUser
          ? 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-500'
          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {/* Rank */}
      <div className="w-12 text-center">
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">#{entry.rank}</p>
        {entry.change !== undefined && entry.change !== 0 && (
          <div className="flex items-center justify-center">
            {entry.change > 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : entry.change < 0 ? (
              <TrendingDown className="w-3 h-3 text-red-500" />
            ) : (
              <Minus className="w-3 h-3 text-gray-400" />
            )}
            <span
              className={`text-xs ml-1 ${
                entry.change > 0
                  ? 'text-green-500'
                  : entry.change < 0
                  ? 'text-red-500'
                  : 'text-gray-400'
              }`}
            >
              {Math.abs(entry.change)}
            </span>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="relative">
        {entry.photoURL ? (
          <Image
            src={entry.photoURL}
            alt={entry.displayName}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
            {entry.displayName[0]}
          </div>
        )}
      </div>

      {/* Name & Level */}
      <div className="flex-1">
        <p className="font-semibold">{entry.displayName}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Level {entry.level}</p>
      </div>

      {/* Stats */}
      <div className="text-right space-y-1">
        <p className="font-bold text-blue-600 dark:text-blue-400">
          {entry.totalXP.toLocaleString()} XP
        </p>
        <div className="flex items-center gap-1 justify-end text-xs text-gray-600 dark:text-gray-400">
          <Award className="w-3 h-3" />
          <span>{entry.badgeCount} badges</span>
        </div>
      </div>

      {/* Current User Badge */}
      {isCurrentUser && (
        <Badge variant="default" className="ml-2">
          You
        </Badge>
      )}
    </div>
  )
}
