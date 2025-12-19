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
 * Get subscription status for a user
 * GET /api/subscriptions/status?email=user@example.com
 */
export async function GET(request: NextRequest) {
  try {
    const stripe = getStripe()

    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Missing required query parameter: email' },
        { status: 400 }
      )
    }

    // Find customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return NextResponse.json({
        hasSubscription: false,
        tier: 'free',
        status: null,
      })
    }

    const customerId = customers.data[0].id

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        hasSubscription: false,
        tier: 'free',
        status: null,
      })
    }

    const subscription = subscriptions.data[0]
    const metadata = subscription.metadata || {}

    return NextResponse.json({
      hasSubscription: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      tier: metadata.tier || 'unknown',
      careerTrack: metadata.careerTrack || null,
      userRole: metadata.userRole || null,
      currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
    })
  } catch (error: any) {
    console.error('Error getting subscription status:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}
