'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Globe, 
  Mail, 
  Calendar, 
  Award, 
  Users, 
  Target,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react'
import { getSponsor, getSponsorTier, getSponsorMetrics } from '@/lib/db-sponsors'
import type { Sponsor, SponsorTier, SponsorImpactMetrics } from '@/types/sponsor'

export default function SponsorSpotlightPage() {
  const params = useParams()
  const sponsorId = params?.sponsorId as string

  const [sponsor, setSponsor] = useState<Sponsor | null>(null)
  const [tier, setTier] = useState<SponsorTier | null>(null)
  const [metrics, setMetrics] = useState<SponsorImpactMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (sponsorId) {
      loadSponsorData()
    }
  }, [sponsorId])

  const loadSponsorData = async () => {
    try {
      const sponsorData = await getSponsor(sponsorId)
      if (!sponsorData) {
        setIsLoading(false)
        return
      }

      setSponsor(sponsorData)

      // Load tier info
      const tierData = await getSponsorTier(sponsorData.tierId)
      setTier(tierData)

      // Load metrics
      const metricsData = await getSponsorMetrics(sponsorId)
      setMetrics(metricsData)
    } catch (error) {
      console.error('Error loading sponsor data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTierColor = (tierName?: string) => {
    if (!tierName) return 'from-blue-400 to-blue-600'
    const name = tierName.toLowerCase()
    if (name.includes('platinum')) return 'from-gray-400 to-gray-600'
    if (name.includes('gold')) return 'from-aviation-gold to-orange-600'
    if (name.includes('silver')) return 'from-gray-300 to-gray-500'
    if (name.includes('bronze')) return 'from-orange-400 to-orange-600'
    return 'from-blue-400 to-blue-600'
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

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-aviation-navy mb-2">Sponsor Not Found</h2>
              <p className="text-gray-600 mb-6">
                The sponsor you're looking for doesn't exist or is no longer active.
              </p>
              <Link href="/sponsors/recognition">
                <Button>View All Sponsors</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <Card className="mb-8 overflow-hidden">
          <div className={`h-32 bg-gradient-to-r ${getTierColor(tier?.name)}`} />
          <CardContent className="relative -mt-16 pb-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Logo */}
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="w-32 h-32 flex items-center justify-center">
                  {sponsor.logoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={sponsor.logoUrl}
                        alt={sponsor.orgName}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Building2 className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Sponsor Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-aviation-navy mb-2">
                      {sponsor.orgName}
                    </h1>
                    {tier && (
                      <Badge variant="secondary" className="mb-4">
                        {tier.name}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {sponsor.joinedAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Member since{' '}
                        {new Date((sponsor.joinedAt as any).seconds * 1000).getFullYear()}
                      </span>
                    </div>
                  )}
                  {sponsor.region && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{sponsor.region}</span>
                    </div>
                  )}
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-aviation-sky hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Visit Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Impact Metrics */}
          {metrics && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Youth Reached</CardDescription>
                  <CardTitle className="text-3xl text-aviation-sky">
                    {metrics.youthReached.toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Students impacted</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Discovery Flights</CardDescription>
                  <CardTitle className="text-3xl text-aviation-gold">
                    {metrics.discoveryFlightsFunded}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>Flights funded</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Events Supported</CardDescription>
                  <CardTitle className="text-3xl text-green-600">
                    {metrics.eventsSupported}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>Community events</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* About the Sponsor */}
          {sponsor.companyDescription && (
            <Card>
              <CardHeader>
                <CardTitle>About {sponsor.orgName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{sponsor.companyDescription}</p>
              </CardContent>
            </Card>
          )}

          {/* Contribution Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Contribution Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Contributions</span>
                <span className="text-2xl font-bold text-aviation-navy">
                  ${(sponsor.totalContributions / 100).toLocaleString()}
                </span>
              </div>

              {sponsor.programSupport && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Focus Areas:</span>
                  <p className="text-gray-600 mt-1">{sponsor.programSupport}</p>
                </div>
              )}

              {metrics && metrics.regionsImpacted.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Regions Impacted:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {metrics.regionsImpacted.map((region, index) => (
                      <Badge key={index} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tier Benefits */}
        {tier && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{tier.name} Benefits</CardTitle>
              <CardDescription>
                As a {tier.name}, {sponsor.orgName} receives these exclusive benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid md:grid-cols-2 gap-3">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-aviation-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-aviation-navy to-blue-900 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Inspired by {sponsor.orgName}?</CardTitle>
            <CardDescription className="text-gray-300">
              Join them in making a difference in the lives of aspiring aviation professionals
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sponsors/apply">
                <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
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
