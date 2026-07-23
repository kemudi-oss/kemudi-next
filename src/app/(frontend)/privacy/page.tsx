import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kemudi',
  description: 'Kemudi privacy policy — how we collect, use, and protect your personal data in compliance with Malaysia PDPA.',
}

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="container max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: July 2026</p>

        <div className="mt-8 space-y-8 text-muted-foreground">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Kemudi (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal data in accordance with
              Malaysia&apos;s Personal Data Protection Act 2010 (PDPA). This privacy policy explains how we collect,
              use, and protect your information.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">2. Data We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Account information:</strong> name, email address, phone number</li>
              <li><strong>Booking data:</strong> appointment details, intake form responses, payment records</li>
              <li><strong>Provider data:</strong> professional qualifications, licences, availability</li>
              <li><strong>Usage data:</strong> search queries, page views, feature usage</li>
              <li><strong>Device data:</strong> browser type, IP address, locale preference</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and improve our services</li>
              <li>To process bookings and payments</li>
              <li>To match you with suitable therapists</li>
              <li>To send booking confirmations and reminders</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">4. Data Sharing</h2>
            <p>
              We share your data only with: your chosen therapist (booking details), payment processors (Stripe),
              email service providers (Resend), and analytics tools (PostHog, Vercel Analytics). We do not sell
              your personal data to third parties.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data (within 21 days)</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account (30-day grace period)</li>
              <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Account data: retained while account is active</li>
              <li>Deleted accounts: purged after 30 days</li>
              <li>Booking records: retained for 7 years (financial compliance)</li>
              <li>Consent logs: retained for 3 years</li>
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">7. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data,
              including encryption at rest for sensitive health data (intake form responses).
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">8. Cross-Border Transfers</h2>
            <p>
              Your data may be processed in the United States by our infrastructure providers (Vercel, Neon).
              We have data processing agreements in place with all vendors.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p>
              For privacy-related enquiries, contact us at privacy@kemudi.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
