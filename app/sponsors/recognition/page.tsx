'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Award, Building2, Heart } from 'lucide-react'
import { getPublishedSponsors, getAllSponsorTiers } from '@/lib/db-sponsors'
import type { Sponsor, SponsorTier } from '@/types/sponsor'

export default function RecognitionWallPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [tiers, setTiers] = useState<Map<string, SponsorTier>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [publishedSponsors, allTiers] = await Promise.all([
        getPublishedSponsors(),
        getAllSponsorTiers(true),
      ])

      setSponsors(publishedSponsors)
      
      const tiersMap = new Map<string, SponsorTier>()
      allTiers.forEach((tier) => {
        tiersMap.set(tier.id, tier)
      })
      setTiers(tiersMap)
    } catch (error) {
      console.error('Error loading sponsors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Group sponsors by tier
  const sponsorsByTier = sponsors.reduce((acc, sponsor) => {
    const tierId = sponsor.tierId
    if (!acc[tierId]) {
      acc[tierId] = []
    }
    acc[tierId].push(sponsor)
    return acc
  }, {} as Record<string, Sponsor[]>)

  // Sort tiers by amount (descending)
  const sortedTierIds = Array.from(tiers.values())
    .sort((a, b) => b.amountMin - a.amountMin)
    .map((t) => t.id)

  const getTierColor = (tierName: string) => {
    const name = tierName.toLowerCase()
    if (name.includes('platinum')) return 'from-gray-400 to-gray-600'
    if (name.includes('gold')) return 'from-aviation-gold to-orange-600'
    if (name.includes('silver')) return 'from-gray-300 to-gray-500'
    if (name.includes('bronze')) return 'from-orange-400 to-orange-600'
    return 'from-blue-400 to-blue-600'
  }

  const getTierSize = (tierName: string) => {
    const name = tierName.toLowerCase()
    if (name.includes('platinum')) return 'large'
    if (name.includes('gold')) return 'medium'
    return 'small'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-aviation-gold/10 p-4">
              <Award className="h-12 w-12 text-aviation-gold" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Sponsor Recognition Wall
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We are grateful to these organizations and individuals who share our vision of
            empowering the next generation through aviation and STEM education.
          </p>
        </div>

        {/* Sponsors by Tier */}
        {sortedTierIds.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-6">
                Be the first to support our mission! Your organization could be featured here.
              </p>
              <Link href="/sponsors/apply">
                <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                  Become a Sponsor
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {sortedTierIds.map((tierId) => {
              const tier = tiers.get(tierId)
              const tierSponsors = sponsorsByTier[tierId] || []
              
              if (tierSponsors.length === 0 || !tier) return null

              const size = getTierSize(tier.name)
              const gridCols =
                size === 'large'
                  ? 'grid-cols-1 md:grid-cols-2'
                  : size === 'medium'
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-2 md:grid-cols-4'

              return (
                <div key={tierId}>
                  <div className="mb-6">
                    <div className={`h-3 w-full rounded-full bg-gradient-to-r ${getTierColor(tier.name)} mb-4`} />
                    <h2 className="text-2xl font-bold text-aviation-navy">{tier.name}</h2>
                    <p className="text-gray-600">{tier.description}</p>
                  </div>

                  <div className={`grid ${gridCols} gap-6`}>
                    {tierSponsors.map((sponsor) => (
                      <Link key={sponsor.id} href={`/sponsors/${sponsor.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div
                              className={`flex items-center justify-center ${
                                size === 'large' ? 'h-32' : size === 'medium' ? 'h-24' : 'h-20'
                              } mb-4 bg-gray-50 rounded-lg`}
                            >
                              {sponsor.logoUrl ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={sponsor.logoUrl}
                                    alt={sponsor.orgName}
                                    fill
                                    className="object-contain p-4"
                                  />
                                </div>
                              ) : (
                                <Building2 className="h-12 w-12 text-gray-400" />
                              )}
                            </div>
                            <h3 className="font-semibold text-aviation-navy text-center mb-2">
                              {sponsor.orgName}
                            </h3>
                            <div className="flex items-center justify-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {tier.name}
                              </Badge>
                              {sponsor.joinedAt && (
                                <span className="text-xs text-gray-500">
                                  Since{' '}
                                  {new Date(
                                    (sponsor.joinedAt as any).seconds * 1000
                                  ).getFullYear()}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-2">Join Our Community of Supporters</CardTitle>
            <CardDescription className="text-gray-300">
              Your organization can make a lasting impact on thousands of lives
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sponsors/apply">
                <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                  <Heart className="h-4 w-4 mr-2" />
                  Become a Sponsor
                </Button>
              </Link>
              <Link href="/donate">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Make a Donation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
