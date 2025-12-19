import {
  StudentTierConfig,
  MentorTierConfig,
  EducatorTierConfig,
  StudentTier,
  MentorTier,
  EducatorTier,
} from '@/types/subscription'

/**
 * Hidden Treasures Network Subscription Configuration
 * Based on the Complete Product Specification
 *
 * Three Career Tracks:
 * - Aviation: "From Discovery Flight to Dream Career"
 * - STEM: "From Curiosity to Creation"
 * - Entrepreneurship: "From Idea to Empire"
 */

// =============================================================================
// STUDENT TIERS (Section 3 of Product Specification)
// =============================================================================

export const STUDENT_TIERS: Record<StudentTier, StudentTierConfig> = {
  free: {
    id: 'free',
    name: 'Explorer',
    trackName: {
      aviation: 'Ground School',
      stem: 'Prototype',
      entrepreneurship: 'Ideation',
    },
    price: 0,
    mentorRatio: 'Community',
    features: [
      'Profile creation',
      'Intro courses',
      'Event calendar access',
      'Community forum',
      'Basic resources',
    ],
  },
  bronze: {
    id: 'bronze',
    name: 'Achiever',
    trackName: {
      aviation: 'First Solo',
      stem: 'Debug',
      entrepreneurship: 'Validate',
    },
    price: 9900, // $99/year in cents
    mentorRatio: '1:10',
    features: [
      'Full course library',
      'Progress tracking',
      'Digital badges',
      'Mentor matching (1:10 ratio)',
      'Certification prep materials',
      'Monthly live Q&A sessions',
    ],
    stripePriceId: process.env.STRIPE_PRICE_STUDENT_BRONZE,
  },
  silver: {
    id: 'silver',
    name: 'Navigator',
    trackName: {
      aviation: 'Cross-Country',
      stem: 'Compile',
      entrepreneurship: 'Accelerate',
    },
    price: 29900, // $299/year in cents
    mentorRatio: '1:5',
    features: [
      'Everything in Achiever tier',
      'Live workshop sessions',
      'Priority mentor matching (1:5 ratio)',
      'Certification exam prep',
      'Priority scholarship applications',
      'Hackathon/competition access',
      'Industry networking events',
    ],
    stripePriceId: process.env.STRIPE_PRICE_STUDENT_SILVER,
  },
  gold: {
    id: 'gold',
    name: 'Aviator',
    trackName: {
      aviation: 'Red Tail',
      stem: 'Deploy',
      entrepreneurship: 'Scale',
    },
    price: 59900, // $599/year in cents
    mentorRatio: '1:3',
    features: [
      'Everything in Navigator tier',
      'Dedicated mentor (1:3 ratio)',
      'Flight simulator credits',
      'Discovery flight discount',
      'Career coaching sessions',
      'AI/ML advanced tracks',
      'Cloud credits for projects',
      'Employer introduction program',
      'Seed funding connections',
    ],
    stripePriceId: process.env.STRIPE_PRICE_STUDENT_GOLD,
  },
}

// =============================================================================
// MENTOR TIERS (Section 6.2 of Product Specification)
// =============================================================================

export const MENTOR_TIERS: Record<MentorTier, MentorTierConfig> = {
  volunteer: {
    id: 'volunteer',
    name: 'Wingman',
    price: 0,
    studentCapacity: '1-3',
    features: [
      'Basic profile',
      'Match with 1-3 students',
      'Community forum access',
      'Digital volunteer badge',
      'Volunteer hour tracking',
    ],
  },
  flight_lead: {
    id: 'flight_lead',
    name: 'Flight Lead',
    price: 19900, // $199/year
    studentCapacity: '5-10',
    features: [
      'Priority student matching (5-10 students)',
      'Mentor training program',
      'Networking events access',
      'Speaking opportunities',
      'Professional development credits',
      'Recognition on platform',
    ],
    stripePriceId: process.env.STRIPE_PRICE_MENTOR_FLIGHT_LEAD,
  },
  squadron_commander: {
    id: 'squadron_commander',
    name: 'Squadron Commander',
    price: 49900, // $499/year
    studentCapacity: '10-20',
    features: [
      'Lead mentor groups',
      'Create curriculum modules',
      'Revenue share on courses',
      'VIP event access',
      'Curriculum development tools',
      'Advanced analytics dashboard',
    ],
    stripePriceId: process.env.STRIPE_PRICE_MENTOR_SQUADRON,
  },
  legacy_aviator: {
    id: 'legacy_aviator',
    name: 'Legacy Aviator',
    price: 99900, // $999/year
    studentCapacity: 'Unlimited',
    features: [
      'Advisory board seat',
      'Brand ambassador role',
      'Scholarship naming rights',
      'Lifetime recognition',
      'Strategic input on programs',
      'Executive networking',
      'Media opportunities',
    ],
    stripePriceId: process.env.STRIPE_PRICE_MENTOR_LEGACY,
  },
}

// =============================================================================
// EDUCATOR TIERS (Section 6.3 of Product Specification)
// =============================================================================

export const EDUCATOR_TIERS: Record<EducatorTier, EducatorTierConfig> = {
  individual: {
    id: 'individual',
    name: 'Individual Educator',
    price: 14900, // $149/year
    studentLimit: 30,
    features: [
      'Full curriculum access',
      'Lesson plans & activities',
      'Classroom resources',
      'Professional development credits',
      'Community forum access',
    ],
    stripePriceId: process.env.STRIPE_PRICE_EDUCATOR_INDIVIDUAL,
  },
  school_starter: {
    id: 'school_starter',
    name: 'School Starter',
    price: 99900, // $999/year
    studentLimit: 100,
    features: [
      'Up to 100 student accounts',
      'Full curriculum access',
      'Teacher training program',
      'Parent portal access',
      'Progress reporting',
      'School admin dashboard',
    ],
    stripePriceId: process.env.STRIPE_PRICE_EDUCATOR_SCHOOL,
  },
  district_partner: {
    id: 'district_partner',
    name: 'District Partner',
    price: 499900, // $4,999/year
    studentLimit: 500,
    features: [
      'Up to 500 student accounts',
      'FERPA compliance tools',
      'Admin analytics dashboard',
      'Grant writing support',
      'Dedicated support contact',
      'Integration assistance',
    ],
    stripePriceId: process.env.STRIPE_PRICE_EDUCATOR_DISTRICT,
  },
  regional_affiliate: {
    id: 'regional_affiliate',
    name: 'Regional Affiliate',
    price: 1499900, // $14,999/year
    studentLimit: 'unlimited',
    revenueShare: 20,
    features: [
      'Unlimited student accounts',
      'White-label option',
      'Exclusive territory rights',
      '20% revenue share',
      'Co-branded marketing',
      'Quarterly business reviews',
    ],
    stripePriceId: process.env.STRIPE_PRICE_EDUCATOR_REGIONAL,
  },
  global_franchise: {
    id: 'global_franchise',
    name: 'Global Franchise',
    price: 4999900, // $49,999/year
    studentLimit: 'unlimited',
    revenueShare: 30,
    features: [
      'Country/region exclusivity',
      'Full brand licensing',
      '30% revenue share',
      'Dedicated account manager',
      'Localization support',
      'Annual summit attendance',
      'Strategic partnership status',
    ],
    stripePriceId: process.env.STRIPE_PRICE_EDUCATOR_GLOBAL,
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get tier configuration by role and tier ID
 */
export function getTierConfig(
  role: 'student' | 'mentor' | 'educator',
  tierId: string
): StudentTierConfig | MentorTierConfig | EducatorTierConfig | null {
  switch (role) {
    case 'student':
      return STUDENT_TIERS[tierId as StudentTier] || null
    case 'mentor':
      return MENTOR_TIERS[tierId as MentorTier] || null
    case 'educator':
      return EDUCATOR_TIERS[tierId as EducatorTier] || null
    default:
      return null
  }
}

/**
 * Get all available tiers for a role
 */
export function getAvailableTiers(role: 'student' | 'mentor' | 'educator') {
  switch (role) {
    case 'student':
      return Object.values(STUDENT_TIERS)
    case 'mentor':
      return Object.values(MENTOR_TIERS)
    case 'educator':
      return Object.values(EDUCATOR_TIERS)
    default:
      return []
  }
}

/**
 * Check if a tier is free
 */
export function isFreeTier(
  tierId: StudentTier | MentorTier | EducatorTier
): boolean {
  return tierId === 'free' || tierId === 'volunteer'
}

/**
 * Get tier display name with track context (for students)
 */
export function getStudentTierDisplayName(
  tier: StudentTier,
  track: 'aviation' | 'stem' | 'entrepreneurship'
): string {
  const config = STUDENT_TIERS[tier]
  return config?.trackName[track] || config?.name || tier
}

/**
 * Format price for display
 */
export function formatPrice(priceInCents: number): string {
  if (priceInCents === 0) return 'Free'
  return `$${(priceInCents / 100).toFixed(0)}/year`
}

/**
 * Get upgrade path for a tier
 */
export function getUpgradePath(
  role: 'student' | 'mentor' | 'educator',
  currentTier: string
): string[] {
  const tiers = getAvailableTiers(role)
  const currentIndex = tiers.findIndex((t) => t.id === currentTier)
  if (currentIndex === -1) return []
  return tiers.slice(currentIndex + 1).map((t) => t.id)
}
