import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  })
}

/**
 * Create a Stripe Customer Portal session
 * POST /api/subscriptions/create-portal
 *
 * Allows users to manage their subscription:
 * - Update payment method
 * - Cancel subscription
 * - View invoices
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()

    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { userEmail, returnUrl } = body

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing required field: userEmail' },
        { status: 400 }
      )
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json(
        { error: 'No subscription found for this account' },
        { status: 404 }
      )
    }

    const customerId = customers.data[0].id

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
