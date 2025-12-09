/**
 * Phase 13: Migration Script - Migrate Existing Student Data to Gamification System
 *
 * This script:
 * 1. Creates userXP records for all existing students
 * 2. Awards retroactive badges based on existing achievements
 * 3. Converts existing achievement data to new badge system
 * 4. Preserves all existing user data
 *
 * Run with: npx ts-node scripts/migrate-to-gamification.ts
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { calculateLevel, awardBadge } from '../lib/db-gamification'
import type { StudentProfile, UserXP } from '../types'

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
const serviceAccount = require('../service-account-key.json')

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore()

interface MigrationStats {
  totalStudents: number
  xpRecordsCreated: number
  badgesAwarded: number
  errors: string[]
}

/**
 * Main migration function
 */
async function migrateToGamification(): Promise<void> {
  console.log('🚀 Starting gamification migration...\n')

  const stats: MigrationStats = {
    totalStudents: 0,
    xpRecordsCreated: 0,
    badgesAwarded: 0,
    errors: [],
  }

  try {
    // Get all users with student role
    const usersSnapshot = await db.collection('users').where('role', '==', 'student').get()

    stats.totalStudents = usersSnapshot.size
    console.log(`📊 Found ${stats.totalStudents} students to migrate\n`)

    // Process each student
    for (const userDoc of usersSnapshot.docs) {
      const student = userDoc.data() as StudentProfile
      console.log(`\n👤 Processing student: ${student.displayName} (${student.id})`)

      try {
        // 1. Create userXP record
        await createUserXPRecord(student, stats)

        // 2. Award retroactive badges
        await awardRetroBadges(student, stats)

        console.log(`✅ Successfully migrated ${student.displayName}`)
      } catch (error) {
        const errorMsg = `❌ Error migrating ${student.displayName}: ${error}`
        console.error(errorMsg)
        stats.errors.push(errorMsg)
      }
    }

    // Print migration summary
    printMigrationSummary(stats)
  } catch (error) {
    console.error('💥 Fatal error during migration:', error)
    throw error
  }
}

/**
 * Create userXP record for a student
 */
async function createUserXPRecord(student: StudentProfile, stats: MigrationStats): Promise<void> {
  const xpRef = db.collection('userXP').doc(student.id)
  const xpDoc = await xpRef.get()

  if (xpDoc.exists()) {
    console.log('  ⏭️  XP record already exists, skipping...')
    return
  }

  // Calculate initial XP based on existing progress
  let initialXP = 0
  let xpBreakdown = {
    badges: 0,
    sessions: 0,
    programs: 0,
    quests: 0,
    events: 0,
    mentoring: 0,
    other: 0,
  }

  // Award XP for hours completed (10 XP per hour)
  if (student.hoursCompleted) {
    const hoursXP = student.hoursCompleted * 10
    initialXP += hoursXP
    xpBreakdown.programs = hoursXP
    console.log(`  ⭐ ${hoursXP} XP from ${student.hoursCompleted} hours completed`)
  }

  // Award XP for programs enrolled (50 XP per program)
  if (student.programsEnrolled && student.programsEnrolled.length > 0) {
    const programsXP = student.programsEnrolled.length * 50
    initialXP += programsXP
    xpBreakdown.programs += programsXP
    console.log(`  ⭐ ${programsXP} XP from ${student.programsEnrolled.length} programs`)
  }

  // Award XP for existing achievements (100 XP per achievement)
  if (student.achievements && student.achievements.length > 0) {
    const achievementsXP = student.achievements.length * 100
    initialXP += achievementsXP
    xpBreakdown.other = achievementsXP
    console.log(`  ⭐ ${achievementsXP} XP from ${student.achievements.length} achievements`)
  }

  const level = calculateLevel(initialXP)

  // Create userXP document
  const userXP: UserXP = {
    id: student.id,
    userId: student.id,
    totalXP: initialXP,
    level,
    currentLevelXP: initialXP - level * level * 100,
    xpBreakdown,
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  }

  await xpRef.set(userXP)
  stats.xpRecordsCreated++
  console.log(`  ✅ Created XP record: ${initialXP} XP, Level ${level}`)
}

/**
 * Award retroactive badges based on existing achievements
 */
async function awardRetroBadges(student: StudentProfile, stats: MigrationStats): Promise<void> {
  const badgesToAward: Array<{ badgeId: string; reason: string }> = []

  // Badge: Red Tail Legacy (for joining the network)
  if (student.createdAt) {
    badgesToAward.push({
      badgeId: 'red-tail-legacy',
      reason: 'Retroactive: Joined Hidden Treasures Network',
    })
  }

  // Badge: First Flight (if has any programs or hours)
  if ((student.programsEnrolled && student.programsEnrolled.length > 0) || student.hoursCompleted > 0) {
    badgesToAward.push({
      badgeId: 'first-flight',
      reason: 'Retroactive: Participated in aviation programs',
    })
  }

  // Badge: Community Champion (if has 5+ hours completed)
  if (student.hoursCompleted >= 5) {
    badgesToAward.push({
      badgeId: 'community-champion',
      reason: 'Retroactive: 5+ hours of community participation',
    })
  }

  // Badge: Mentee Excellence (if has mentor assigned)
  if (student.mentorIds && student.mentorIds.length > 0) {
    badgesToAward.push({
      badgeId: 'mentee-excellence',
      reason: 'Retroactive: Active mentee relationship',
    })
  }

  // Badge: STEM Scholar (if has achievements)
  if (student.achievements && student.achievements.length >= 3) {
    badgesToAward.push({
      badgeId: 'stem-scholar',
      reason: 'Retroactive: Multiple achievements earned',
    })
  }

  // Award all badges
  for (const { badgeId, reason } of badgesToAward) {
    try {
      // Note: You may need to look up actual badge IDs from badgeDefinitions collection
      // This uses the badge slug/name as ID for simplicity
      const result = await awardBadge(student.id, badgeId, reason)
      if (result.success) {
        stats.badgesAwarded++
        console.log(`  🎖️  Awarded badge: ${badgeId}`)
      } else {
        console.log(`  ⚠️  Badge award skipped: ${badgeId} - ${result.error}`)
      }
    } catch (error) {
      console.log(`  ⚠️  Error awarding badge ${badgeId}:`, error)
    }
  }
}

/**
 * Print migration summary
 */
function printMigrationSummary(stats: MigrationStats): void {
  console.log('\n\n' + '='.repeat(60))
  console.log('📊 MIGRATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total students processed: ${stats.totalStudents}`)
  console.log(`XP records created: ${stats.xpRecordsCreated}`)
  console.log(`Badges awarded: ${stats.badgesAwarded}`)
  console.log(`Errors encountered: ${stats.errors.length}`)

  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:')
    stats.errors.forEach((error, i) => {
      console.log(`  ${i + 1}. ${error}`)
    })
  }

  const successRate =
    stats.totalStudents > 0
      ? ((stats.xpRecordsCreated / stats.totalStudents) * 100).toFixed(1)
      : '0.0'
  console.log(`\n✅ Success rate: ${successRate}%`)
  console.log('='.repeat(60))
  console.log('\n🎉 Migration complete!\n')
}

/**
 * Verification function - check migration results
 */
async function verifyMigration(): Promise<void> {
  console.log('\n🔍 Verifying migration...\n')

  const studentsSnapshot = await db.collection('users').where('role', '==', 'student').get()
  const xpSnapshot = await db.collection('userXP').get()
  const badgesSnapshot = await db.collection('userBadges').get()

  console.log(`Students: ${studentsSnapshot.size}`)
  console.log(`UserXP records: ${xpSnapshot.size}`)
  console.log(`Badges awarded: ${badgesSnapshot.size}`)

  if (xpSnapshot.size === studentsSnapshot.size) {
    console.log('✅ All students have XP records')
  } else {
    console.log(`⚠️  Missing ${studentsSnapshot.size - xpSnapshot.size} XP records`)
  }
}

/**
 * Rollback function - remove migration data (use with caution!)
 */
async function rollbackMigration(): Promise<void> {
  console.log('\n⚠️  ROLLBACK: Removing gamification data...\n')

  const batch = db.batch()
  let count = 0

  // Delete all userXP records
  const xpSnapshot = await db.collection('userXP').get()
  xpSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
    count++
  })

  // Delete all userBadges
  const badgesSnapshot = await db.collection('userBadges').get()
  badgesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
    count++
  })

  // Delete all xpTransactions
  const transactionsSnapshot = await db.collection('xpTransactions').get()
  transactionsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref)
    count++
  })

  await batch.commit()
  console.log(`✅ Deleted ${count} documents`)
  console.log('🔄 Rollback complete\n')
}

// ============================================
// COMMAND LINE INTERFACE
// ============================================

const command = process.argv[2]

switch (command) {
  case 'migrate':
    migrateToGamification()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
    break

  case 'verify':
    verifyMigration()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
    break

  case 'rollback':
    // Require confirmation for rollback
    if (process.argv[3] === '--confirm') {
      rollbackMigration()
        .then(() => process.exit(0))
        .catch((error) => {
          console.error(error)
          process.exit(1)
        })
    } else {
      console.log('⚠️  Rollback requires confirmation. Use: npm run migrate:rollback -- --confirm')
      process.exit(1)
    }
    break

  default:
    console.log(`
📘 Phase 13: Gamification Migration Script

Usage:
  npx ts-node scripts/migrate-to-gamification.ts [command]

Commands:
  migrate   - Run the migration (creates XP records and awards badges)
  verify    - Verify migration results
  rollback  - Remove all gamification data (requires --confirm flag)

Examples:
  npx ts-node scripts/migrate-to-gamification.ts migrate
  npx ts-node scripts/migrate-to-gamification.ts verify
  npx ts-node scripts/migrate-to-gamification.ts rollback --confirm

⚠️  Important:
  - Backup your database before running migration
  - Test in development environment first
  - Download service account key from Firebase Console
  - Place key as service-account-key.json in project root
    `)
    process.exit(0)
}
