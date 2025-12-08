'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Users, Building2, TrendingUp, Settings } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-heading font-bold text-aviation-navy mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card><CardHeader><CardDescription>Total Users</CardDescription><CardTitle className="text-3xl text-aviation-sky">1,247</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Organizations</CardDescription><CardTitle className="text-3xl text-aviation-gold">156</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Active Programs</CardDescription><CardTitle className="text-3xl text-green-600">89</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Total Impact</CardDescription><CardTitle className="text-3xl text-purple-600">200K+</CardTitle></CardHeader></Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />User Management</CardTitle></CardHeader><CardContent><p className="text-gray-600">Manage all platform users and roles.</p><Button className="mt-4 bg-aviation-navy">Manage Users</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Organization Approval</CardTitle></CardHeader><CardContent><p className="text-gray-600">Review and approve new organizations.</p><Button className="mt-4 bg-aviation-navy">Review Queue</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Analytics</CardTitle></CardHeader><CardContent><p className="text-gray-600">View platform-wide analytics and metrics.</p><Button className="mt-4 bg-aviation-navy">View Analytics</Button></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />System Settings</CardTitle></CardHeader><CardContent><p className="text-gray-600">Configure platform settings and features.</p><Button className="mt-4 bg-aviation-navy">Settings</Button></CardContent></Card>
        </div>
      </div>
    </div>
  )
}
