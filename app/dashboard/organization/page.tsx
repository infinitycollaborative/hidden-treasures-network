'use client'

import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, TrendingUp, Globe } from 'lucide-react'

export default function OrganizationDashboard() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-8">
          Organization Dashboard - {profile?.organizationName || profile?.displayName}
        </h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card><CardHeader><CardDescription>Students Served</CardDescription><CardTitle className="text-3xl text-aviation-sky">245</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Active Programs</CardDescription><CardTitle className="text-3xl text-aviation-gold">8</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Partner Organizations</CardDescription><CardTitle className="text-3xl text-green-600">12</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Network Reach</CardDescription><CardTitle className="text-3xl text-purple-600">Global</CardTitle></CardHeader></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Organization Profile</CardTitle></CardHeader><CardContent><p className="text-gray-600">Manage your organization's information and programs.</p><Button className="mt-4 bg-aviation-navy">Edit Profile</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Network Connections</CardTitle></CardHeader><CardContent><p className="text-gray-600">Connect with other organizations in the network.</p><Button className="mt-4 bg-aviation-navy">Explore Network</Button></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
