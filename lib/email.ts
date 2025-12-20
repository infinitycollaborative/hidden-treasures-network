/**
 * Email utility functions for sending emails throughout the application
 */

import { EventRegistration } from '@/types/event'

interface SendEmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  replyTo?: string
  template?: string
  data?: Record<string, any>
}

/**
 * Send an email using the email API route
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Email send error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send an event confirmation email
 */
export async function sendEventConfirmationEmail(registration: EventRegistration): Promise<void> {
  if (!registration.email) return Promise.resolve()

  await sendEmail({
    to: registration.email,
    subject: `Registration confirmed for ${registration.eventId}`,
    html: `<p>Hi ${registration.name},</p><p>You're registered for the event. We look forward to seeing you!</p>`,
  })
}

/**
 * Send a contact form confirmation email to the user
 */
export async function sendContactConfirmation(data: {
  name: string
  email: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: data.email,
    subject: 'Thank you for contacting Hidden Treasures Network',
    template: 'contact-confirmation',
    data,
  })
}

/**
 * Send a contact form notification to the team
 */
export async function sendContactNotification(data: {
  name: string
  email: string
  organization?: string
  role: string
  message: string
}): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'info@hiddentreasuresnetwork.org'

  return sendEmail({
    to: adminEmail,
    subject: `New Contact: ${data.name} (${data.role})`,
    template: 'contact',
    data,
    replyTo: data.email,
  })
}

/**
 * Send a donation receipt email
 */
export async function sendDonationReceipt(data: {
  donorEmail: string
  donorName: string
  amount: number
  isMonthly: boolean
  transactionId: string
}): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: data.donorEmail,
    subject: `Thank you for your donation to Hidden Treasures Network`,
    template: 'donation-receipt',
    data,
  })
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(data: {
  email: string
  name: string
  role: string
}): Promise<{ success: boolean; error?: string }> {
  return sendEmail({
    to: data.email,
    subject: 'Welcome to Hidden Treasures Network!',
    template: 'welcome',
    data,
  })
}
