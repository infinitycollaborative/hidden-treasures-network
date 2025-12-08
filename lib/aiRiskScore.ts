/**
 * Phase 11: AI-Assisted Risk & Health Scoring
 * 
 * This module provides AI-powered risk assessment for organizations
 */

import { RiskScore, RiskLevel, RiskFactor } from '@/types'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export interface OrganizationRiskInputs {
  organizationId: string
  organizationName: string
  
  // Activity metrics
  lastActivityDate?: Date
  daysInactive?: number
  monthlyActiveUsers?: number
  monthlyEvents?: number
  monthlySessions?: number
  eventCancellations?: number
  
  // Compliance metrics
  complianceScore?: number
  missedComplianceDeadlines?: number
  expiredDocuments?: number
  pendingComplianceItems?: number
  
  // Communication metrics
  messageVolumeChange?: number // percentage change
  unusualMessagePatterns?: boolean
  
  // Student/Mentor metrics
  studentInactivityRate?: number
  mentorOverloadCount?: number
  averageMentorToStudentRatio?: number
  
  // Safety metrics
  openIncidentReports?: number
  highPriorityIncidents?: number
  incidentsInvolveMinors?: number
  
  // Geographic/contextual
  highRiskRegion?: boolean
  newOrganization?: boolean
  rapidGrowth?: boolean
}

/**
 * Calculate risk score based on various factors
 */
export async function calculateRiskScore(
  inputs: OrganizationRiskInputs
): Promise<RiskScore> {
  const factors: RiskFactor[] = []
  let totalScore = 0
  let maxScore = 0

  // Activity Risk Factors (weight: 20%)
  const activityRisk = calculateActivityRisk(inputs)
  factors.push(...activityRisk.factors)
  totalScore += activityRisk.score
  maxScore += activityRisk.maxScore

  // Compliance Risk Factors (weight: 30%)
  const complianceRisk = calculateComplianceRisk(inputs)
  factors.push(...complianceRisk.factors)
  totalScore += complianceRisk.score
  maxScore += complianceRisk.maxScore

  // Safety Risk Factors (weight: 35%)
  const safetyRisk = calculateSafetyRisk(inputs)
  factors.push(...safetyRisk.factors)
  totalScore += safetyRisk.score
  maxScore += safetyRisk.maxScore

  // Engagement Risk Factors (weight: 15%)
  const engagementRisk = calculateEngagementRisk(inputs)
  factors.push(...engagementRisk.factors)
  totalScore += engagementRisk.score
  maxScore += engagementRisk.maxScore

  // Calculate final score (0-100, higher = more risk)
  const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  // Determine risk level
  const level = getRiskLevel(finalScore)

  // Generate reasons and recommendations
  const reasons = factors
    .filter(f => f.value > 50) // Only include significant risk factors
    .map(f => f.description)

  const recommendedActions = generateRecommendations(factors, level)

  // Optionally enhance with AI if available
  let aiEnhancedReasons = reasons
  let aiEnhancedActions = recommendedActions

  if (openai && reasons.length > 0) {
    try {
      const aiAnalysis = await getAIRiskAnalysis(inputs, factors, finalScore)
      if (aiAnalysis) {
        aiEnhancedReasons = aiAnalysis.reasons
        aiEnhancedActions = aiAnalysis.actions
      }
    } catch (error) {
      console.error('AI risk analysis failed, using rule-based analysis:', error)
    }
  }

  return {
    organizationId: inputs.organizationId,
    organizationName: inputs.organizationName,
    score: finalScore,
    level,
    reasons: aiEnhancedReasons,
    recommendedActions: aiEnhancedActions,
    factors,
    calculatedAt: new Date() as any,
    calculatedBy: openai ? 'ai' : 'manual',
  }
}

/**
 * Calculate activity-based risk
 */
function calculateActivityRisk(inputs: OrganizationRiskInputs): {
  factors: RiskFactor[]
  score: number
  maxScore: number
} {
  const factors: RiskFactor[] = []
  let score = 0
  const maxScore = 20

  // Inactivity risk
  if (inputs.daysInactive !== undefined) {
    const inactivityScore = Math.min(100, (inputs.daysInactive / 90) * 100)
    factors.push({
      category: 'activity',
      weight: 0.4,
      description: `${inputs.daysInactive} days inactive`,
      value: inactivityScore,
    })
    score += (inactivityScore / 100) * maxScore * 0.4
  }

  // Event cancellations
  if (inputs.eventCancellations !== undefined && inputs.eventCancellations > 0) {
    const cancellationScore = Math.min(100, inputs.eventCancellations * 20)
    factors.push({
      category: 'activity',
      weight: 0.3,
      description: `${inputs.eventCancellations} event cancellations`,
      value: cancellationScore,
    })
    score += (cancellationScore / 100) * maxScore * 0.3
  }

  // Low monthly activity
  if (inputs.monthlyEvents !== undefined && inputs.monthlyEvents < 2) {
    factors.push({
      category: 'activity',
      weight: 0.3,
      description: 'Low monthly event activity',
      value: 60,
    })
    score += 0.6 * maxScore * 0.3
  }

  return { factors, score, maxScore }
}

/**
 * Calculate compliance-based risk
 */
function calculateComplianceRisk(inputs: OrganizationRiskInputs): {
  factors: RiskFactor[]
  score: number
  maxScore: number
} {
  const factors: RiskFactor[] = []
  let score = 0
  const maxScore = 30

  // Low compliance score
  if (inputs.complianceScore !== undefined) {
    const riskScore = 100 - inputs.complianceScore
    factors.push({
      category: 'compliance',
      weight: 0.4,
      description: `Compliance score: ${inputs.complianceScore}%`,
      value: riskScore,
    })
    score += (riskScore / 100) * maxScore * 0.4
  }

  // Missed deadlines
  if (inputs.missedComplianceDeadlines !== undefined && inputs.missedComplianceDeadlines > 0) {
    const deadlineScore = Math.min(100, inputs.missedComplianceDeadlines * 25)
    factors.push({
      category: 'compliance',
      weight: 0.3,
      description: `${inputs.missedComplianceDeadlines} missed compliance deadlines`,
      value: deadlineScore,
    })
    score += (deadlineScore / 100) * maxScore * 0.3
  }

  // Expired documents
  if (inputs.expiredDocuments !== undefined && inputs.expiredDocuments > 0) {
    const expiredScore = Math.min(100, inputs.expiredDocuments * 30)
    factors.push({
      category: 'compliance',
      weight: 0.3,
      description: `${inputs.expiredDocuments} expired compliance documents`,
      value: expiredScore,
    })
    score += (expiredScore / 100) * maxScore * 0.3
  }

  return { factors, score, maxScore }
}

/**
 * Calculate safety-based risk
 */
function calculateSafetyRisk(inputs: OrganizationRiskInputs): {
  factors: RiskFactor[]
  score: number
  maxScore: number
} {
  const factors: RiskFactor[] = []
  let score = 0
  const maxScore = 35

  // Open incident reports (highest weight)
  if (inputs.openIncidentReports !== undefined && inputs.openIncidentReports > 0) {
    const incidentScore = Math.min(100, inputs.openIncidentReports * 30)
    factors.push({
      category: 'safety',
      weight: 0.4,
      description: `${inputs.openIncidentReports} open incident reports`,
      value: incidentScore,
    })
    score += (incidentScore / 100) * maxScore * 0.4
  }

  // High priority incidents
  if (inputs.highPriorityIncidents !== undefined && inputs.highPriorityIncidents > 0) {
    factors.push({
      category: 'safety',
      weight: 0.35,
      description: `${inputs.highPriorityIncidents} high priority incidents`,
      value: 80,
    })
    score += 0.8 * maxScore * 0.35
  }

  // Incidents involving minors (critical)
  if (inputs.incidentsInvolveMinors !== undefined && inputs.incidentsInvolveMinors > 0) {
    factors.push({
      category: 'safety',
      weight: 0.25,
      description: `${inputs.incidentsInvolveMinors} incidents involving minors`,
      value: 100,
    })
    score += maxScore * 0.25
  }

  return { factors, score, maxScore }
}

/**
 * Calculate engagement-based risk
 */
function calculateEngagementRisk(inputs: OrganizationRiskInputs): {
  factors: RiskFactor[]
  score: number
  maxScore: number
} {
  const factors: RiskFactor[] = []
  let score = 0
  const maxScore = 15

  // Student inactivity
  if (inputs.studentInactivityRate !== undefined) {
    factors.push({
      category: 'engagement',
      weight: 0.4,
      description: `${Math.round(inputs.studentInactivityRate * 100)}% student inactivity`,
      value: inputs.studentInactivityRate * 100,
    })
    score += inputs.studentInactivityRate * maxScore * 0.4
  }

  // Mentor overload
  if (inputs.mentorOverloadCount !== undefined && inputs.mentorOverloadCount > 0) {
    const overloadScore = Math.min(100, inputs.mentorOverloadCount * 25)
    factors.push({
      category: 'engagement',
      weight: 0.3,
      description: `${inputs.mentorOverloadCount} overloaded mentors`,
      value: overloadScore,
    })
    score += (overloadScore / 100) * maxScore * 0.3
  }

  // Unusual message patterns
  if (inputs.unusualMessagePatterns) {
    factors.push({
      category: 'engagement',
      weight: 0.3,
      description: 'Unusual messaging patterns detected',
      value: 70,
    })
    score += 0.7 * maxScore * 0.3
  }

  return { factors, score, maxScore }
}

/**
 * Determine risk level from score
 */
function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}

/**
 * Generate recommendations based on risk factors
 */
function generateRecommendations(factors: RiskFactor[], level: RiskLevel): string[] {
  const recommendations: string[] = []

  // Safety recommendations
  const safetyFactors = factors.filter(f => f.category === 'safety' && f.value > 50)
  if (safetyFactors.length > 0) {
    recommendations.push('Immediately review and address all open incident reports')
    recommendations.push('Conduct safety audit and implement corrective actions')
  }

  // Compliance recommendations
  const complianceFactors = factors.filter(f => f.category === 'compliance' && f.value > 50)
  if (complianceFactors.length > 0) {
    recommendations.push('Complete all pending compliance submissions')
    recommendations.push('Update expired compliance documents')
    recommendations.push('Schedule compliance review meeting')
  }

  // Activity recommendations
  const activityFactors = factors.filter(f => f.category === 'activity' && f.value > 50)
  if (activityFactors.length > 0) {
    recommendations.push('Increase program activity and engagement')
    recommendations.push('Reach out to organization contacts to ensure continued participation')
  }

  // Engagement recommendations
  const engagementFactors = factors.filter(f => f.category === 'engagement' && f.value > 50)
  if (engagementFactors.length > 0) {
    recommendations.push('Re-engage inactive students and mentors')
    recommendations.push('Balance mentor workloads to prevent burnout')
  }

  // Level-based recommendations
  if (level === 'critical' || level === 'high') {
    recommendations.push('Schedule urgent review meeting with organization leadership')
    recommendations.push('Consider temporary suspension until issues are resolved')
  }

  return recommendations
}

/**
 * Get AI-enhanced risk analysis (if OpenAI is available)
 */
async function getAIRiskAnalysis(
  inputs: OrganizationRiskInputs,
  factors: RiskFactor[],
  score: number
): Promise<{ reasons: string[]; actions: string[] } | null> {
  if (!openai) return null

  try {
    const prompt = `Analyze the following organization risk assessment and provide insights:

Organization: ${inputs.organizationName}
Risk Score: ${score}/100

Risk Factors:
${factors.map(f => `- ${f.category}: ${f.description} (${f.value}/100)`).join('\n')}

Additional Context:
- Days inactive: ${inputs.daysInactive || 'N/A'}
- Compliance score: ${inputs.complianceScore || 'N/A'}%
- Open incidents: ${inputs.openIncidentReports || 0}
- Incidents involving minors: ${inputs.incidentsInvolveMinors || 0}

Please provide:
1. Top 3-5 key risk factors (concise, actionable)
2. Top 3-5 recommended actions (specific, prioritized)

Format as JSON:
{
  "reasons": ["reason1", "reason2", ...],
  "actions": ["action1", "action2", ...]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a risk assessment expert for youth programs and educational organizations. Provide concise, actionable insights.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      const parsed = JSON.parse(response)
      return {
        reasons: parsed.reasons || [],
        actions: parsed.actions || [],
      }
    }
  } catch (error) {
    console.error('AI analysis error:', error)
  }

  return null
}
