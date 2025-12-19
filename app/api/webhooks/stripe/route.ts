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
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * Handles subscription lifecycle events:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 * - invoice.payment_failed
 */
export async function POST(request: NextRequest) {
  const stripe = getStripe()

  if (!stripe) {
    console.error('Stripe not configured')
    return NextResponse.json(
      { error: 'Webhook handler not configured' },
      { status: 503 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      // In development, parse without verification
      console.warn('STRIPE_WEBHOOK_SECRET not set, parsing without verification')
      event = JSON.parse(body) as Stripe.Event
    } else {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)

  const metadata = session.metadata || {}
  const userId = metadata.userId
  const userRole = metadata.userRole
  const tier = metadata.tier
  const careerTrack = metadata.careerTrack

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  // TODO: Update user subscription in Firebase
  // This would be implemented when Firebase Admin SDK is configured
  console.log('Subscription created for user:', {
    userId,
    userRole,
    tier,
    careerTrack,
    subscriptionId: session.subscription,
    customerId: session.customer,
  })

  // In production, update Firestore:
  // await updateUserSubscription(userId, {
  //   tier,
  //   careerTrack,
  //   status: 'active',
  //   stripeCustomerId: session.customer as string,
  //   stripeSubscriptionId: session.subscription as string,
  // })
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)

  const metadata = subscription.metadata || {}
  const userId = metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  // Log subscription details
  console.log('New subscription:', {
    userId,
    subscriptionId: subscription.id,
    status: subscription.status,
    tier: metadata.tier,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  })
}

/**
 * Handle subscription updates (upgrades, downgrades, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)

  const metadata = subscription.metadata || {}
  const userId = metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  // Log update details
  console.log('Subscription update:', {
    userId,
    subscriptionId: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  })

  // TODO: Update user subscription status in Firebase
}

/**
 * Handle subscription cancellation/deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)

  const metadata = subscription.metadata || {}
  const userId = metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  // Log cancellation
  console.log('Subscription cancelled:', {
    userId,
    subscriptionId: subscription.id,
  })

  // TODO: Downgrade user to free tier in Firebase
  // await updateUserSubscription(userId, {
  //   tier: 'free',
  //   status: 'canceled',
  //   stripeSubscriptionId: null,
  // })
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id)

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) {
    return // Not a subscription invoice
  }

  // Log payment
  console.log('Payment received:', {
    invoiceId: invoice.id,
    subscriptionId,
    amountPaid: invoice.amount_paid,
    customerEmail: invoice.customer_email,
  })

  // TODO: Record payment in Firebase
  // TODO: Send receipt email
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) {
    return // Not a subscription invoice
  }

  // Log failure
  console.log('Payment failed:', {
    invoiceId: invoice.id,
    subscriptionId,
    customerEmail: invoice.customer_email,
    attemptCount: invoice.attempt_count,
  })

  // TODO: Update subscription status to 'past_due' in Firebase
  // TODO: Send payment failed notification email
}

/**
 * Handle trial ending soon notification
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log('Trial will end:', subscription.id)

  const metadata = subscription.metadata || {}
  const userId = metadata.userId

  if (!userId) {
    return
  }

  // Log trial ending
  console.log('Trial ending soon:', {
    userId,
    subscriptionId: subscription.id,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
  })

  // TODO: Send trial ending reminder email
}
