import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Home, Mail } from 'lucide-react'

export default function SponsorApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl text-green-700">
              Application Submitted Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-aviation-navy text-lg">What happens next?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>A confirmation email has been sent to your inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will review your application within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>We'll reach out to schedule a call to discuss partnership details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You'll receive information about next steps and onboarding</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-aviation-navy mb-2">
                Thank you for your interest!
              </h3>
              <p className="text-gray-700 text-sm">
                We're excited about the possibility of partnering with your organization to
                empower the next generation of aviation and STEM leaders. Your support will
                make a real difference in the lives of thousands of students worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                className="flex-1 bg-aviation-navy hover:bg-aviation-navy/90"
              >
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/sponsors">
                  Learn More About Sponsorship
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-4">
              <Mail className="h-4 w-4" />
              <span>
                Questions?{' '}
                <a
                  href="mailto:sponsors@hiddentreasuresnetwork.org"
                  className="text-aviation-sky hover:underline"
                >
                  sponsors@hiddentreasuresnetwork.org
                </a>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
