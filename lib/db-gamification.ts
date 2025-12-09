import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
  arrayUnion,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
  UserXP,
  XPTransaction,
  XPCategory,
  BadgeDefinition,
  UserBadge,
  BadgeCategory,
  BadgeTier,
  Quest,
  UserQuest,
  QuestStatus,
  Leaderboard,
  LeaderboardEntry,
  LeaderboardType,
  LeaderboardPeriod,
  UserRole,
} from '@/types'

// ============================================
// XP SYSTEM FUNCTIONS
// ============================================

/**
 * Calculate level from total XP using the formula: Level = floor(sqrt(totalXP / 100))
 * This creates a smooth progression where each level requires more XP
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100))
}

/**
 * Calculate XP required for a specific level
 */
export function getXPForLevel(level: number): number {
  return level * level * 100
}

/**
 * Calculate XP progress in current level
 */
export function getCurrentLevelProgress(totalXP: number): {
  level: number
  currentLevelXP: number
  xpForNextLevel: number
  progressPercent: number
} {
  const level = calculateLevel(totalXP)
  const xpForCurrentLevel = getXPForLevel(level)
  const xpForNextLevel = getXPForLevel(level + 1)
  const currentLevelXP = totalXP - xpForCurrentLevel
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel
  const progressPercent = (currentLevelXP / xpNeededForNextLevel) * 100

  return {
    level,
    currentLevelXP,
    xpForNextLevel: xpNeededForNextLevel,
    progressPercent,
  }
}

/**
 * Get or create user XP record
 */
export async function getUserXP(userId: string): Promise<UserXP | null> {
  try {
    const xpRef = doc(db, 'userXP', userId)
    const xpDoc = await getDoc(xpRef)

    if (!xpDoc.exists()) {
      // Create initial XP record
      const initialXP: UserXP = {
        id: userId,
        userId,
        totalXP: 0,
        level: 0,
        currentLevelXP: 0,
        xpBreakdown: {
          badges: 0,
          sessions: 0,
          programs: 0,
          quests: 0,
          events: 0,
          mentoring: 0,
          other: 0,
        },
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      }
      await setDoc(xpRef, initialXP)
      return initialXP
    }

    return xpDoc.data() as UserXP
  } catch (error) {
    console.error('Error getting user XP:', error)
    return null
  }
}

/**
 * Award XP to a user with validation and automatic level-up
 * Returns the new level if user leveled up, null otherwise
 */
export async function awardXP(
  userId: string,
  amount: number,
  category: XPCategory,
  reason: string,
  sourceId?: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; newLevel?: number; leveledUp: boolean; error?: string }> {
  try {
    // Validation
    if (amount <= 0) {
      return { success: false, leveledUp: false, error: 'XP amount must be positive' }
    }

    if (amount > 10000) {
      return { success: false, leveledUp: false, error: 'XP amount too large (max 10000)' }
    }

    // Get current XP
    const currentXP = await getUserXP(userId)
    if (!currentXP) {
      return { success: false, leveledUp: false, error: 'Failed to get user XP' }
    }

    const oldLevel = currentXP.level
    const newTotalXP = currentXP.totalXP + amount
    const newLevel = calculateLevel(newTotalXP)
    const leveledUp = newLevel > oldLevel
    const progress = getCurrentLevelProgress(newTotalXP)

    // Update user XP
    const xpRef = doc(db, 'userXP', userId)
    await updateDoc(xpRef, {
      totalXP: increment(amount),
      level: newLevel,
      currentLevelXP: progress.currentLevelXP,
      [`xpBreakdown.${category}`]: increment(amount),
      updatedAt: Timestamp.now(),
    })

    // Log transaction
    const transactionRef = doc(collection(db, 'xpTransactions'))
    const transaction: XPTransaction = {
      id: transactionRef.id,
      userId,
      amount,
      category,
      reason,
      sourceId,
      timestamp: Timestamp.now(),
      metadata,
    }
    await setDoc(transactionRef, transaction)

    return { success: true, newLevel: leveledUp ? newLevel : undefined, leveledUp }
  } catch (error) {
    console.error('Error awarding XP:', error)
    return { success: false, leveledUp: false, error: 'Failed to award XP' }
  }
}

/**
 * Get XP transaction history for a user
 */
export async function getUserXPTransactions(
  userId: string,
  limitCount: number = 50
): Promise<XPTransaction[]> {
  try {
    const q = query(
      collection(db, 'xpTransactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as XPTransaction)
  } catch (error) {
    console.error('Error getting XP transactions:', error)
    return []
  }
}

// ============================================
// BADGE SYSTEM FUNCTIONS
// ============================================

/**
 * Create a new badge definition
 */
export async function createBadgeDefinition(badge: Omit<BadgeDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const badgeRef = doc(collection(db, 'badgeDefinitions'))
    const badgeDefinition: BadgeDefinition = {
      ...badge,
      id: badgeRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(badgeRef, badgeDefinition)
    return badgeRef.id
  } catch (error) {
    console.error('Error creating badge definition:', error)
    throw error
  }
}

/**
 * Get all active badge definitions
 */
export async function getActiveBadges(): Promise<BadgeDefinition[]> {
  try {
    const q = query(collection(db, 'badgeDefinitions'), where('isActive', '==', true))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as BadgeDefinition)
  } catch (error) {
    console.error('Error getting active badges:', error)
    return []
  }
}

/**
 * Get badge definition by ID
 */
export async function getBadgeDefinition(badgeId: string): Promise<BadgeDefinition | null> {
  try {
    const badgeRef = doc(db, 'badgeDefinitions', badgeId)
    const badgeDoc = await getDoc(badgeRef)
    return badgeDoc.exists() ? (badgeDoc.data() as BadgeDefinition) : null
  } catch (error) {
    console.error('Error getting badge definition:', error)
    return null
  }
}

/**
 * Check if user already has a badge (duplicate prevention)
 */
export async function userHasBadge(userId: string, badgeId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'userBadges'),
      where('userId', '==', userId),
      where('badgeId', '==', badgeId),
      limit(1)
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error('Error checking user badge:', error)
    return false
  }
}

/**
 * Award a badge to a user with duplicate prevention and validation
 */
export async function awardBadge(
  userId: string,
  badgeId: string,
  reason: string,
  awardedBy?: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check for duplicate
    const hasBadge = await userHasBadge(userId, badgeId)
    if (hasBadge) {
      return { success: false, error: 'User already has this badge' }
    }

    // Get badge definition
    const badgeDefinition = await getBadgeDefinition(badgeId)
    if (!badgeDefinition) {
      return { success: false, error: 'Badge definition not found' }
    }

    if (!badgeDefinition.isActive) {
      return { success: false, error: 'Badge is not active' }
    }

    // Create user badge record
    const userBadgeRef = doc(collection(db, 'userBadges'))
    const userBadge: UserBadge = {
      id: userBadgeRef.id,
      userId,
      badgeId,
      badgeName: badgeDefinition.name,
      badgeCategory: badgeDefinition.category,
      badgeTier: badgeDefinition.tier,
      imageURL: badgeDefinition.imageURL,
      xpAwarded: badgeDefinition.xpReward,
      reason,
      awardedBy,
      awardedAt: Timestamp.now(),
      metadata,
    }
    await setDoc(userBadgeRef, userBadge)

    // Award XP for the badge
    await awardXP(userId, badgeDefinition.xpReward, 'badges', `Earned badge: ${badgeDefinition.name}`, badgeId)

    return { success: true }
  } catch (error) {
    console.error('Error awarding badge:', error)
    return { success: false, error: 'Failed to award badge' }
  }
}

/**
 * Get all badges earned by a user
 */
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  try {
    const q = query(
      collection(db, 'userBadges'),
      where('userId', '==', userId),
      orderBy('awardedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as UserBadge)
  } catch (error) {
    console.error('Error getting user badges:', error)
    return []
  }
}

/**
 * Get badge count by category for a user
 */
export async function getUserBadgeStats(userId: string): Promise<{
  total: number
  byCategory: Record<BadgeCategory, number>
  byTier: Record<BadgeTier, number>
}> {
  try {
    const badges = await getUserBadges(userId)

    const byCategory = badges.reduce((acc, badge) => {
      acc[badge.badgeCategory] = (acc[badge.badgeCategory] || 0) + 1
      return acc
    }, {} as Record<BadgeCategory, number>)

    const byTier = badges.reduce((acc, badge) => {
      acc[badge.badgeTier] = (acc[badge.badgeTier] || 0) + 1
      return acc
    }, {} as Record<BadgeTier, number>)

    return {
      total: badges.length,
      byCategory,
      byTier,
    }
  } catch (error) {
    console.error('Error getting user badge stats:', error)
    return {
      total: 0,
      byCategory: {} as Record<BadgeCategory, number>,
      byTier: {} as Record<BadgeTier, number>,
    }
  }
}

// ============================================
// QUEST SYSTEM FUNCTIONS
// ============================================

/**
 * Create a new quest
 */
export async function createQuest(quest: Omit<Quest, 'id' | 'participantCount' | 'completionCount' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const questRef = doc(collection(db, 'quests'))
    const newQuest: Quest = {
      ...quest,
      id: questRef.id,
      participantCount: 0,
      completionCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(questRef, newQuest)
    return questRef.id
  } catch (error) {
    console.error('Error creating quest:', error)
    throw error
  }
}

/**
 * Get available quests for a user based on role and level
 */
export async function getAvailableQuests(userId: string, userRole: UserRole): Promise<Quest[]> {
  try {
    const userXP = await getUserXP(userId)
    const userLevel = userXP?.level || 0

    const q = query(
      collection(db, 'quests'),
      where('isActive', '==', true),
      where('eligibleRoles', 'array-contains', userRole)
    )
    const snapshot = await getDocs(q)

    // Filter by level requirements
    const quests = snapshot.docs
      .map((doc) => doc.data() as Quest)
      .filter((quest) => {
        const meetsMinLevel = !quest.minLevel || userLevel >= quest.minLevel
        const meetsMaxLevel = !quest.maxLevel || userLevel <= quest.maxLevel
        const notExpired = !quest.endDate || quest.endDate.toMillis() > Date.now()
        return meetsMinLevel && meetsMaxLevel && notExpired
      })

    return quests
  } catch (error) {
    console.error('Error getting available quests:', error)
    return []
  }
}

/**
 * Start a quest for a user
 */
export async function startQuest(userId: string, questId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if quest exists
    const questDoc = await getDoc(doc(db, 'quests', questId))
    if (!questDoc.exists()) {
      return { success: false, error: 'Quest not found' }
    }

    const quest = questDoc.data() as Quest

    // Check if user already has this quest
    const q = query(
      collection(db, 'userQuests'),
      where('userId', '==', userId),
      where('questId', '==', questId),
      where('status', 'in', ['in_progress', 'completed']),
      limit(1)
    )
    const existingQuests = await getDocs(q)
    if (!existingQuests.empty) {
      return { success: false, error: 'Quest already started or completed' }
    }

    // Create user quest
    const userQuestRef = doc(collection(db, 'userQuests'))
    const userQuest: UserQuest = {
      id: userQuestRef.id,
      userId,
      questId,
      questTitle: quest.title,
      status: 'in_progress',
      progress: quest.requirements.map((req) => ({ ...req, current: 0 })),
      startedAt: Timestamp.now(),
      expiresAt: quest.endDate,
    }
    await setDoc(userQuestRef, userQuest)

    // Increment participant count
    await updateDoc(doc(db, 'quests', questId), {
      participantCount: increment(1),
    })

    return { success: true }
  } catch (error) {
    console.error('Error starting quest:', error)
    return { success: false, error: 'Failed to start quest' }
  }
}

/**
 * Update quest progress
 */
export async function updateQuestProgress(
  userId: string,
  questId: string,
  requirementIndex: number,
  newValue: number
): Promise<{ success: boolean; completed: boolean; error?: string }> {
  try {
    // Get user quest
    const q = query(
      collection(db, 'userQuests'),
      where('userId', '==', userId),
      where('questId', '==', questId),
      where('status', '==', 'in_progress'),
      limit(1)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return { success: false, completed: false, error: 'Quest not found or not in progress' }
    }

    const userQuestDoc = snapshot.docs[0]
    const userQuest = userQuestDoc.data() as UserQuest

    // Update progress
    userQuest.progress[requirementIndex].current = newValue

    // Check if all requirements met
    const allCompleted = userQuest.progress.every((req) => (req.current || 0) >= req.target)

    if (allCompleted) {
      // Complete quest
      await updateDoc(doc(db, 'userQuests', userQuestDoc.id), {
        progress: userQuest.progress,
        status: 'completed',
        completedAt: Timestamp.now(),
      })

      // Award rewards
      const questDoc = await getDoc(doc(db, 'quests', questId))
      if (questDoc.exists()) {
        const quest = questDoc.data() as Quest
        await awardXP(userId, quest.xpReward, 'quests', `Completed quest: ${quest.title}`, questId)

        if (quest.badgeReward) {
          await awardBadge(userId, quest.badgeReward, `Completed quest: ${quest.title}`)
        }

        // Increment completion count
        await updateDoc(doc(db, 'quests', questId), {
          completionCount: increment(1),
        })
      }

      return { success: true, completed: true }
    } else {
      // Update progress
      await updateDoc(doc(db, 'userQuests', userQuestDoc.id), {
        progress: userQuest.progress,
      })
      return { success: true, completed: false }
    }
  } catch (error) {
    console.error('Error updating quest progress:', error)
    return { success: false, completed: false, error: 'Failed to update quest progress' }
  }
}

/**
 * Get user's active quests
 */
export async function getUserActiveQuests(userId: string): Promise<UserQuest[]> {
  try {
    const q = query(
      collection(db, 'userQuests'),
      where('userId', '==', userId),
      where('status', '==', 'in_progress'),
      orderBy('startedAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => doc.data() as UserQuest)
  } catch (error) {
    console.error('Error getting user active quests:', error)
    return []
  }
}

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

/**
 * Generate a leaderboard
 */
export async function generateLeaderboard(
  type: LeaderboardType,
  period: LeaderboardPeriod,
  scope?: string,
  topN: number = 100
): Promise<Leaderboard> {
  try {
    // Query userXP based on leaderboard type and scope
    let q = query(collection(db, 'userXP'), orderBy('totalXP', 'desc'), limit(topN))

    const snapshot = await getDocs(q)

    const entries: LeaderboardEntry[] = []
    let rank = 1

    for (const docSnapshot of snapshot.docs) {
      const userXP = docSnapshot.data() as UserXP

      // Get user profile for display name and photo
      const userDoc = await getDoc(doc(db, 'users', userXP.userId))
      if (!userDoc.exists()) continue

      const user = userDoc.data()

      // Get badge count
      const badges = await getUserBadges(userXP.userId)

      entries.push({
        rank,
        userId: userXP.userId,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL,
        totalXP: userXP.totalXP,
        level: userXP.level,
        badgeCount: badges.length,
      })

      rank++
    }

    // Create leaderboard document
    const leaderboardRef = doc(collection(db, 'leaderboards'))
    const leaderboard: Leaderboard = {
      id: leaderboardRef.id,
      type,
      period,
      scope,
      entries,
      totalParticipants: entries.length,
      lastUpdated: Timestamp.now(),
    }

    await setDoc(leaderboardRef, leaderboard)

    return leaderboard
  } catch (error) {
    console.error('Error generating leaderboard:', error)
    throw error
  }
}

/**
 * Get current leaderboard
 */
export async function getLeaderboard(
  type: LeaderboardType,
  period: LeaderboardPeriod,
  scope?: string
): Promise<Leaderboard | null> {
  try {
    let q = query(
      collection(db, 'leaderboards'),
      where('type', '==', type),
      where('period', '==', period),
      orderBy('lastUpdated', 'desc'),
      limit(1)
    )

    if (scope) {
      q = query(q, where('scope', '==', scope))
    }

    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    return snapshot.docs[0].data() as Leaderboard
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return null
  }
}

/**
 * Get user's rank on leaderboard
 */
export async function getUserRank(
  userId: string,
  type: LeaderboardType,
  period: LeaderboardPeriod,
  scope?: string
): Promise<{ rank: number; totalParticipants: number } | null> {
  try {
    const leaderboard = await getLeaderboard(type, period, scope)
    if (!leaderboard) return null

    const entry = leaderboard.entries.find((e) => e.userId === userId)
    if (!entry) return null

    return {
      rank: entry.rank,
      totalParticipants: leaderboard.totalParticipants,
    }
  } catch (error) {
    console.error('Error getting user rank:', error)
    return null
  }
}
