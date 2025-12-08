'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, DollarSign, Users, TrendingUp } from 'lucide-react'

export default function SponsorDashboard() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-8">
          Sponsor Dashboard - {profile?.displayName}
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card><CardHeader><CardDescription>Programs Supported</CardDescription><CardTitle className="text-3xl text-aviation-sky">6</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Lives Impacted</CardDescription><CardTitle className="text-3xl text-aviation-gold">450</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Organizations Funded</CardDescription><CardTitle className="text-3xl text-green-600">8</CardTitle></CardHeader></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5" />Impact Report</CardTitle></CardHeader><CardContent><p className="text-gray-600">View the impact of your contributions.</p><Button className="mt-4 bg-aviation-navy">View Report</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Sponsored Programs</CardTitle></CardHeader><CardContent><p className="text-gray-600">Manage your sponsorships and funding.</p><Button className="mt-4 bg-aviation-navy">View Programs</Button></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
