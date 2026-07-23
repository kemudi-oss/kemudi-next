'use client'

import React from 'react'

interface LicenceExpiryEmailProps {
  providerName: string
  licenceType: string
  expiryDate: string
  daysUntilExpiry: number
}

export const LicenceExpiryEmail: React.FC<LicenceExpiryEmailProps> = ({
  providerName,
  licenceType,
  expiryDate,
  daysUntilExpiry,
}) => {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: 'Noto Sans', sans-serif; background: #FAF7F2; color: #2B3137; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 32px; }
          .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 600; color: #1F5C5B; }
          .card { background: white; border-radius: 12px; padding: 32px; border: 1px solid #E7D8C9; }
          .warning { background: #FEF3CD; border: 1px solid #C49A3C; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .button { display: inline-block; background: #1F5C5B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; }
          .footer { text-align: center; margin-top: 32px; color: #8A8178; font-size: 14px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">Kemudi</div>
          </div>
          <div className="card">
            <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Licence Expiry Reminder</h1>
            <p>Dear {providerName},</p>
            <div className="warning">
              <strong>Your {licenceType} licence expires in {daysUntilExpiry} days</strong>
              <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
                Expiry date: {expiryDate}
              </p>
            </div>
            <p>
              To continue receiving bookings on Kemudi, please update your licence before it expires.
              Providers with expired licences are hidden from search results and cannot receive new bookings.
            </p>
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <a href={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`} className="button">
                Update Licence
              </a>
            </div>
            <p style={{ fontSize: '14px', color: '#8A8178' }}>
              If you have already renewed your licence, please ignore this email.
            </p>
          </div>
          <div className="footer">
            <p>Kemudi — Trusted mental health navigation for Malaysia</p>
          </div>
        </div>
      </body>
    </html>
  )
}
