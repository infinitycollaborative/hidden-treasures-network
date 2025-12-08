/**
 * Mentor Matching Engine (AI-Ready)
 * Rule-based matching that can be enhanced with AI later
 */

import { UserProfile } from '@/types/user'

export interface MentorMatchInput {
  student: UserProfile       // must have studentProfile
  mentors: UserProfile[]     // mentors with mentorProfile
}

export interface MentorMatchResult {
  mentor: UserProfile
  score: number              // 0-100
  reasons: string[]          // why they match
}

/**
 * Compute match scores between a student and available mentors
 * Uses rule-based logic that can be replaced/augmented with AI
 */
export function computeMentorMatchScores(
  input: MentorMatchInput
): MentorMatchResult[] {
  const { student, mentors } = input
  const studentProfile = student.studentProfile

  if (!studentProfile) {
    return []
  }

  const results: MentorMatchResult[] = mentors.map((mentor) => {
    const mentorProfile = mentor.mentorProfile
    
    if (!mentorProfile) {
      return {
        mentor,
        score: 0,
        reasons: ['No mentor profile available']
      }
    }

    let score = 0
    const reasons: string[] = []

    // Rule 1: Shared interests/specialties (+40 points max)
    const studentInterests = studentProfile.interests || []
    const mentorSpecialties = mentorProfile.specialties || []
    const sharedInterests = studentInterests.filter(interest =>
      mentorSpecialties.some(specialty => 
        specialty.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(specialty.toLowerCase())
      )
    )
    
    if (sharedInterests.length > 0) {
      const interestScore = Math.min(40, sharedInterests.length * 15)
      score += interestScore
      reasons.push(`Shared interests: ${sharedInterests.join(', ')}`)
    }

    // Rule 2: Language match (+20 points)
    const studentLanguages = studentProfile.preferredLanguages || []
    const mentorLanguages = mentorProfile.languages || []
    const sharedLanguages = studentLanguages.filter(lang =>
      mentorLanguages.some(mLang => 
        mLang.toLowerCase() === lang.toLowerCase()
      )
    )
    
    if (sharedLanguages.length > 0) {
      score += 20
      reasons.push(`Speaks: ${sharedLanguages.join(', ')}`)
    }

    // Rule 3: Location/virtual preference match (+20 points)
    const studentLocationPref = studentProfile.locationPreference
    const mentorVirtualOnly = mentorProfile.virtualOnly
    
    if (studentLocationPref === 'virtual' && mentorVirtualOnly) {
      score += 20
      reasons.push('Both prefer virtual sessions')
    } else if (studentLocationPref === 'in_person' && !mentorVirtualOnly) {
      // Check if in same region
      const studentState = student.location?.state
      const mentorRegions = mentorProfile.inPersonRegions || []
      
      if (studentState && mentorRegions.some(region => 
        region.toLowerCase().includes(studentState.toLowerCase())
      )) {
        score += 20
        reasons.push('Available for in-person in your area')
      } else {
        score += 10
        reasons.push('Available for in-person sessions')
      }
    } else if (studentLocationPref === 'both') {
      score += 15
      reasons.push('Flexible meeting options')
    }

    // Rule 4: Age range preference (+10 points)
    const studentAge = studentProfile.ageRange
    const mentorAgePrefs = mentorProfile.preferredAgeRanges || []
    
    if (studentAge && mentorAgePrefs.includes(studentAge)) {
      score += 10
      reasons.push('Age range match')
    }

    // Rule 5: Accepting new mentees (required, -50 if not)
    if (!mentorProfile.acceptsNewMentees) {
      score -= 50
      reasons.push('Not currently accepting new mentees')
    } else {
      reasons.push('Accepting new mentees')
    }

    // Rule 6: Check capacity
    if (mentorProfile.maxMentees && mentorProfile.currentMenteeCount) {
      if (mentorProfile.currentMenteeCount >= mentorProfile.maxMentees) {
        score -= 30
        reasons.push('At capacity')
      }
    }

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score))

    return {
      mentor,
      score,
      reasons
    }
  })

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score)
}

/**
 * Helper to get display name from profile
 */
export function getMentorDisplayName(mentor: UserProfile): string {
  if (mentor.firstName && mentor.lastName) {
    return `${mentor.firstName} ${mentor.lastName}`
  }
  return mentor.displayName || mentor.email
}

/**
 * Helper to format availability summary
 */
export function formatAvailabilitySummary(mentor: UserProfile): string {
  const mentorProfile = mentor.mentorProfile
  if (!mentorProfile || !mentorProfile.availability.length) {
    return 'No availability set'
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const slots = mentorProfile.availability.map(slot => {
    const day = days[slot.dayOfWeek]
    return `${day} ${slot.startTime}-${slot.endTime}`
  })

  if (slots.length <= 2) {
    return slots.join(', ')
  }

  return `${slots.slice(0, 2).join(', ')} and more`
}
