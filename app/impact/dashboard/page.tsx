import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Users, Globe, Target } from 'lucide-react'

export default function ImpactDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading font-bold text-aviation-navy mb-8">Impact Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card><CardHeader><CardDescription>Lives Impacted</CardDescription><CardTitle className="text-3xl text-aviation-sky">200,000+</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Partner Organizations</CardDescription><CardTitle className="text-3xl text-aviation-gold">50+</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>Countries Reached</CardDescription><CardTitle className="text-3xl text-green-600">25+</CardTitle></CardHeader></Card>
          <Card><CardHeader><CardDescription>2030 Goal Progress</CardDescription><CardTitle className="text-3xl text-purple-600">20%</CardTitle></CardHeader></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Our Mission: Impact 1 Million Lives by 2030</CardTitle></CardHeader>
          <CardContent><div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-500">Impact visualization charts will be displayed here</p></div></CardContent>
        </Card>
      </div>
    </div>
  )
}
