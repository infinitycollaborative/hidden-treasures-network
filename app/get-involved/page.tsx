import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, Building2, Heart, ArrowRight } from 'lucide-react'

export default function GetInvolvedPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-aviation-navy to-blue-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl font-bold mb-6">Get Involved</h1>
          <p className="text-xl text-gray-200">
            Join the global movement to empower youth through aviation and STEM education
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: <GraduationCap className="h-8 w-8" />, title: 'Students', description: 'Access mentorship, programs, and resources to launch your aviation or STEM career.', href: '/register?role=student' },
            { icon: <Users className="h-8 w-8" />, title: 'Mentors', description: 'Share your expertise and inspire the next generation of aviation professionals.', href: '/register?role=mentor' },
            { icon: <Building2 className="h-8 w-8" />, title: 'Organizations', description: 'Join our network to amplify your impact and collaborate with global partners.', href: '/register?role=organization' },
            { icon: <Heart className="h-8 w-8" />, title: 'Sponsors', description: 'Support youth education and create lasting impact in underserved communities.', href: '/register?role=sponsor' }
          ].map((item) => (
            <Card key={item.title} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-aviation-sky/10 rounded-full flex items-center justify-center mb-4 text-aviation-sky">
                  {item.icon}
                </div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-6">{item.description}</CardDescription>
                <Link href={item.href}>
                  <Button className="bg-aviation-gold hover:bg-aviation-gold/90 text-aviation-navy">
                    Join as {item.title}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
