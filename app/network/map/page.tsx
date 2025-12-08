import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe } from 'lucide-react'

export default function NetworkMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-heading font-bold text-aviation-navy mb-8">Global Network Map</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-aviation-navy to-blue-900 rounded-lg h-96 flex items-center justify-center text-white">
              <div className="text-center">
                <Globe className="h-20 w-20 mx-auto mb-4 text-aviation-gold" />
                <h3 className="text-2xl font-heading font-bold mb-2">Interactive Map Coming Soon</h3>
                <p className="text-gray-300">Visualize our global network of organizations and partners</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
