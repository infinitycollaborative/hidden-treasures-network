/**
 * Phase 13: Gamification - Starter Badge Definitions
 * 18 Aviation-Specific Badges Honoring Tuskegee Airmen Legacy
 * Aligned with Flight Plan 2030 Goals
 */

import { createBadgeDefinition } from './db-gamification'
import type { BadgeDefinition, BadgeCategory, BadgeTier } from '@/types'

// Badge data (omitting Firebase-specific fields)
export const STARTER_BADGES: Omit<BadgeDefinition, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // ============================================
  // TUSKEGEE TRIBUTE BADGES (4 badges)
  // ============================================
  {
    name: 'Red Tail Legacy',
    description: 'Join the Hidden Treasures Network and begin your journey, inspired by the Tuskegee Airmen who opened doors for all.',
    category: 'tuskegee_tribute',
    tier: 'bronze',
    imageURL: '/badges/red-tail-legacy.svg',
    xpReward: 100,
    requirements: {
      customCondition: 'Complete profile registration',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 10,
    realWorldEquivalent: 'First step in aviation journey',
  },
  {
    name: 'Breaking Barriers',
    description: 'Complete your first mentor session, following in the footsteps of pioneers who broke through barriers.',
    category: 'tuskegee_tribute',
    tier: 'silver',
    imageURL: '/badges/breaking-barriers.svg',
    xpReward: 250,
    requirements: {
      customCondition: 'Attend first mentor session',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 25,
    realWorldEquivalent: 'First mentorship connection',
  },
  {
    name: 'Double Victory',
    description: 'Achieve excellence in both academics and aviation training, embodying the Tuskegee Airmen\'s "Double V" campaign.',
    category: 'tuskegee_tribute',
    tier: 'gold',
    imageURL: '/badges/double-victory.svg',
    xpReward: 500,
    requirements: {
      minLevel: 5,
      customCondition: 'Excel in both academic and flight training modules',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 60,
    realWorldEquivalent: 'Academic and practical excellence',
  },
  {
    name: 'Sky\'s No Limit',
    description: 'Reach Level 20, proving that with determination, the sky truly is no limit.',
    category: 'tuskegee_tribute',
    tier: 'platinum',
    imageURL: '/badges/skys-no-limit.svg',
    xpReward: 1000,
    requirements: {
      minLevel: 20,
    },
    isActive: true,
    isSecret: false,
    rarityScore: 90,
    realWorldEquivalent: 'Master level achievement',
  },

  // ============================================
  // HIDDEN TREASURES BADGES (3 badges)
  // ============================================
  {
    name: 'Hidden Treasure',
    description: 'You are a Hidden Treasure! Recognize your unique potential and value to the aviation community.',
    category: 'hidden_treasures',
    tier: 'bronze',
    imageURL: '/badges/hidden-treasure.svg',
    xpReward: 150,
    requirements: {
      customCondition: 'Complete self-discovery assessment',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 15,
    realWorldEquivalent: 'Self-awareness achievement',
  },
  {
    name: 'Treasure Hunter',
    description: 'Help identify and mentor another Hidden Treasure, paying forward the gift of opportunity.',
    category: 'hidden_treasures',
    tier: 'gold',
    imageURL: '/badges/treasure-hunter.svg',
    xpReward: 400,
    requirements: {
      minLevel: 10,
      requiredRole: ['student', 'mentor'],
      customCondition: 'Refer and support a new student',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 55,
    realWorldEquivalent: 'Community builder',
  },
  {
    name: 'Network Builder',
    description: 'Connect 10+ students with mentors, organizations, or opportunities, expanding the HTN family.',
    category: 'hidden_treasures',
    tier: 'platinum',
    imageURL: '/badges/network-builder.svg',
    xpReward: 800,
    requirements: {
      minLevel: 15,
      customCondition: 'Facilitate 10+ meaningful connections',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 85,
    realWorldEquivalent: 'Community leadership',
  },

  // ============================================
  // FLIGHT MILESTONES BADGES (5 badges)
  // ============================================
  {
    name: 'First Flight',
    description: 'Take your first discovery flight or flight simulator session.',
    category: 'flight_milestones',
    tier: 'bronze',
    imageURL: '/badges/first-flight.svg',
    xpReward: 200,
    requirements: {
      customCondition: 'Complete first flight experience',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 20,
    realWorldEquivalent: 'Discovery flight completion',
  },
  {
    name: 'Solo Aviator',
    description: 'Complete your first solo flight simulator mission or achieve solo flight readiness.',
    category: 'flight_milestones',
    tier: 'silver',
    imageURL: '/badges/solo-aviator.svg',
    xpReward: 350,
    requirements: {
      minLevel: 5,
      prerequisiteBadges: ['first-flight'],
      customCondition: 'Achieve solo flight certification',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 40,
    realWorldEquivalent: 'Solo flight preparation',
  },
  {
    name: 'Cross Country',
    description: 'Complete a cross-country flight plan and navigation challenge.',
    category: 'flight_milestones',
    tier: 'gold',
    imageURL: '/badges/cross-country.svg',
    xpReward: 450,
    requirements: {
      minLevel: 8,
      prerequisiteBadges: ['solo-aviator'],
      customCondition: 'Complete navigation challenge',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 50,
    realWorldEquivalent: 'Cross-country flight planning',
  },
  {
    name: 'Private Pilot Ready',
    description: 'Demonstrate knowledge equivalent to FAA Private Pilot written exam.',
    category: 'flight_milestones',
    tier: 'gold',
    imageURL: '/badges/private-pilot-ready.svg',
    xpReward: 600,
    requirements: {
      minLevel: 12,
      minAge: 16,
      prerequisiteBadges: ['cross-country'],
      customCondition: 'Pass Private Pilot knowledge assessment',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 70,
    realWorldEquivalent: 'FAA Private Pilot Knowledge',
  },
  {
    name: 'Certified Aviator',
    description: 'Earn your FAA Private Pilot License or equivalent certification.',
    category: 'flight_milestones',
    tier: 'platinum',
    imageURL: '/badges/certified-aviator.svg',
    xpReward: 2000,
    requirements: {
      minLevel: 15,
      minAge: 17,
      prerequisiteBadges: ['private-pilot-ready'],
      customCondition: 'Obtain FAA Private Pilot License',
    },
    isActive: true,
    isSecret: true, // Hidden until earned
    rarityScore: 95,
    realWorldEquivalent: 'FAA Private Pilot License',
  },

  // ============================================
  // COMMUNITY BADGES (2 badges)
  // ============================================
  {
    name: 'Community Champion',
    description: 'Attend 5 HTN community events or workshops.',
    category: 'community',
    tier: 'silver',
    imageURL: '/badges/community-champion.svg',
    xpReward: 300,
    requirements: {
      customCondition: 'Attend 5 community events',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 35,
    realWorldEquivalent: 'Active community participation',
  },
  {
    name: 'Ambassador',
    description: 'Represent HTN at external events, schools, or organizations.',
    category: 'community',
    tier: 'gold',
    imageURL: '/badges/ambassador.svg',
    xpReward: 500,
    requirements: {
      minLevel: 10,
      customCondition: 'Represent HTN at 3+ external events',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 65,
    realWorldEquivalent: 'Brand ambassador',
  },

  // ============================================
  // MENTORSHIP BADGES (2 badges)
  // ============================================
  {
    name: 'Mentee Excellence',
    description: 'Complete 10 mentor sessions and apply feedback to improve.',
    category: 'mentorship',
    tier: 'silver',
    imageURL: '/badges/mentee-excellence.svg',
    xpReward: 350,
    requirements: {
      requiredRole: ['student'],
      customCondition: 'Complete 10 quality mentor sessions',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 45,
    realWorldEquivalent: 'Active mentee',
  },
  {
    name: 'Mentor of Excellence',
    description: 'Guide 5 students to achieve significant milestones.',
    category: 'mentorship',
    tier: 'platinum',
    imageURL: '/badges/mentor-excellence.svg',
    xpReward: 1000,
    requirements: {
      requiredRole: ['mentor'],
      minLevel: 10,
      customCondition: 'Successfully mentor 5 students',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 80,
    realWorldEquivalent: 'Master mentor certification',
  },

  // ============================================
  // EDUCATION BADGES (1 badge)
  // ============================================
  {
    name: 'STEM Scholar',
    description: 'Complete all aviation STEM modules with 90%+ scores.',
    category: 'education',
    tier: 'gold',
    imageURL: '/badges/stem-scholar.svg',
    xpReward: 450,
    requirements: {
      minLevel: 8,
      customCondition: 'Achieve 90%+ on all STEM modules',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 60,
    realWorldEquivalent: 'Academic excellence',
  },

  // ============================================
  // LEADERSHIP BADGE (1 badge)
  // ============================================
  {
    name: 'Flight Leader',
    description: 'Lead a student project, event, or initiative that impacts the HTN community.',
    category: 'leadership',
    tier: 'platinum',
    imageURL: '/badges/flight-leader.svg',
    xpReward: 750,
    requirements: {
      minLevel: 12,
      customCondition: 'Lead successful community initiative',
    },
    isActive: true,
    isSecret: false,
    rarityScore: 75,
    realWorldEquivalent: 'Leadership certification',
  },
]

/**
 * Seed the database with starter badges
 * Run this once during initial deployment
 */
export async function seedStarterBadges(): Promise<void> {
  console.log('🎖️  Seeding starter badges...')

  try {
    let successCount = 0
    let errorCount = 0

    for (const badge of STARTER_BADGES) {
      try {
        const badgeId = await createBadgeDefinition(badge)
        console.log(`✅ Created badge: ${badge.name} (ID: ${badgeId})`)
        successCount++
      } catch (error) {
        console.error(`❌ Failed to create badge: ${badge.name}`, error)
        errorCount++
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`  ✅ Successful: ${successCount}`)
    console.log(`  ❌ Failed: ${errorCount}`)
    console.log(`  📦 Total: ${STARTER_BADGES.length}`)

    console.log('\n🎉 Badge seeding complete!')
  } catch (error) {
    console.error('❌ Fatal error during badge seeding:', error)
    throw error
  }
}

/**
 * Get badge by name (helper for awarding badges)
 */
export function getBadgeDataByName(name: string): typeof STARTER_BADGES[0] | undefined {
  return STARTER_BADGES.find((badge) => badge.name === name)
}

/**
 * Export badge names for easy reference
 */
export const BADGE_NAMES = {
  // Tuskegee Tribute
  RED_TAIL_LEGACY: 'Red Tail Legacy',
  BREAKING_BARRIERS: 'Breaking Barriers',
  DOUBLE_VICTORY: 'Double Victory',
  SKYS_NO_LIMIT: "Sky's No Limit",

  // Hidden Treasures
  HIDDEN_TREASURE: 'Hidden Treasure',
  TREASURE_HUNTER: 'Treasure Hunter',
  NETWORK_BUILDER: 'Network Builder',

  // Flight Milestones
  FIRST_FLIGHT: 'First Flight',
  SOLO_AVIATOR: 'Solo Aviator',
  CROSS_COUNTRY: 'Cross Country',
  PRIVATE_PILOT_READY: 'Private Pilot Ready',
  CERTIFIED_AVIATOR: 'Certified Aviator',

  // Community
  COMMUNITY_CHAMPION: 'Community Champion',
  AMBASSADOR: 'Ambassador',

  // Mentorship
  MENTEE_EXCELLENCE: 'Mentee Excellence',
  MENTOR_OF_EXCELLENCE: 'Mentor of Excellence',

  // Education
  STEM_SCHOLAR: 'STEM Scholar',

  // Leadership
  FLIGHT_LEADER: 'Flight Leader',
} as const
