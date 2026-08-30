import React from 'react'

interface ProviderApprovalProps {
  providerName: string
  approved: boolean
  notes?: string
}

export const ProviderApproval: React.FC<ProviderApprovalProps> = ({
  providerName,
  approved,
  notes,
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
          .heading { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 600; color: #2B3137; margin: 0 0 16px; }
          .text { font-size: 15px; line-height: 1.6; color: #2B3137; }
          .badge { display: inline-block; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; }
          .badge-approved { background: #4A8B6E15; color: #4A8B6E; }
          .badge-rejected { background: #B8545015; color: #B85450; }
          .footer { text-align: center; margin-top: 32px; font-size: 13px; color: #8A8178; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">kemudi</div>
          </div>
          <div className="card">
            <h1 className="heading">
              {approved ? 'Your profile has been approved' : 'Profile review update'}
            </h1>
            <p className="text">
              Hi {providerName},<br /><br />
              {approved
                ? 'Great news! Your provider profile has been approved and is now visible to people searching for therapy on Kemudi.'
                : 'We&rsquo;ve reviewed your profile submission. Unfortunately, we need some changes before it can go live.'}
            </p>
            {notes && (
              <p className="text" style={{ background: '#F5F0EB', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                <strong>Notes:</strong> {notes}
              </p>
            )}
            <p className="text" style={{ marginTop: '24px' }}>
              {approved
                ? 'You can now log in to your dashboard to manage your profile, reviews, and bookings.'
                : 'Please log in to your dashboard to review the feedback and update your profile.'}
            </p>
          </div>
          <div className="footer">
            <p>Kemudi &mdash; Finding the right support, together.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
