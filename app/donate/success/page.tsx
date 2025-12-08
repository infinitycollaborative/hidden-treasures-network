'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Home } from 'lucide-react'

export default function DonationSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null)

  useEffect(() => {
    const piParam = searchParams?.get('payment_intent')
    if (piParam) {
      setPaymentIntent(piParam)
    }
  }, [searchParams])

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
            <CardTitle className="text-3xl text-green-700">Thank You for Your Donation!</CardTitle>
            <CardDescription className="text-lg">
              Your generous contribution has been successfully processed.
            </CardDescription>
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
                  <span>Your tax receipt will be available within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>You'll receive quarterly impact reports showing how your donation makes a difference</span>
                </li>
              </ul>
            </div>

            {paymentIntent && (
              <div className="text-sm text-gray-600 text-center">
                Payment ID: {paymentIntent.substring(0, 20)}...
              </div>
            )}

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-aviation-navy mb-2">Your Impact</h3>
              <p className="text-gray-700 text-sm">
                Your donation directly supports flight training scholarships, STEM education programs,
                and mentorship opportunities for underserved youth worldwide. Together, we're building
                the future of aviation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                className="flex-1 bg-aviation-navy hover:bg-aviation-navy/90"
              >
                <Link href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1"
              >
                <Link href="/sponsors">
                  Learn About Sponsorship
                </Link>
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 pt-4">
              If you have any questions about your donation, please contact us at{' '}
              <a href="mailto:donations@hiddentreasuresnetwork.org" className="text-aviation-sky hover:underline">
                donations@hiddentreasuresnetwork.org
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
