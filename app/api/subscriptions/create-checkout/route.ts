import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { STUDENT_TIERS, MENTOR_TIERS, EDUCATOR_TIERS } from '@/config/subscriptions'

function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  })
}

/**
 * Create a Stripe Checkout Session for subscription
 * POST /api/subscriptions/create-checkout
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
    const {
      userId,
      userEmail,
      userRole,
      tier,
      careerTrack,
      billingInterval = 'year',
      successUrl,
      cancelUrl,
    } = body

    // Validate required fields
    if (!userId || !userEmail || !userRole || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, userEmail, userRole, tier' },
        { status: 400 }
      )
    }

    // Get tier configuration
    let tierConfig: any = null
    let priceId: string | undefined

    switch (userRole) {
      case 'student':
        tierConfig = STUDENT_TIERS[tier as keyof typeof STUDENT_TIERS]
        break
      case 'mentor':
        tierConfig = MENTOR_TIERS[tier as keyof typeof MENTOR_TIERS]
        break
      case 'teacher':
      case 'organization':
        tierConfig = EDUCATOR_TIERS[tier as keyof typeof EDUCATOR_TIERS]
        break
    }

    if (!tierConfig) {
      return NextResponse.json(
        { error: `Invalid tier "${tier}" for role "${userRole}"` },
        { status: 400 }
      )
    }

    // Check if it's a free tier
    if (tierConfig.price === 0) {
      return NextResponse.json(
        { error: 'Free tiers do not require checkout' },
        { status: 400 }
      )
    }

    priceId = tierConfig.stripePriceId

    // If no Stripe Price ID is configured, create a dynamic price
    // In production, you should pre-create prices in Stripe Dashboard
    if (!priceId) {
      // Create a product and price dynamically (for development)
      const product = await stripe.products.create({
        name: `${tierConfig.name} Membership`,
        description: `Hidden Treasures Network - ${tierConfig.name} tier`,
        metadata: {
          role: userRole,
          tier: tier,
        },
      })

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: tierConfig.price,
        currency: 'usd',
        recurring: {
          interval: billingInterval,
        },
        metadata: {
          role: userRole,
          tier: tier,
        },
      })

      priceId = price.id
    }

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })

    let customerId: string
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
          role: userRole,
        },
      })
      customerId = customer.id
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscription=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?subscription=cancelled`,
      metadata: {
        userId: userId,
        userRole: userRole,
        tier: tier,
        careerTrack: careerTrack || '',
      },
      subscription_data: {
        metadata: {
          userId: userId,
          userRole: userRole,
          tier: tier,
          careerTrack: careerTrack || '',
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
