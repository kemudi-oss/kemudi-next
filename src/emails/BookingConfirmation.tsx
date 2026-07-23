import React from 'react'

interface BookingConfirmationProps {
  clientName: string
  providerName: string
  serviceName: string
  date: string
  time: string
  sessionFee: number
  providerProfileUrl: string
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  clientName,
  providerName,
  serviceName,
  date,
  time,
  sessionFee,
  providerProfileUrl,
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
          .muted { color: #8A8178; }
          .divider { border: none; border-top: 1px solid #E7D8C9; margin: 24px 0; }
          .details { background: #F5F0EB; border-radius: 8px; padding: 20px; margin: 24px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .detail-label { color: #8A8178; }
          .detail-value { font-weight: 500; color: #2B3137; }
          .button { display: inline-block; background: #1F5C5B; color: #FAF7F2; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; }
          .footer { text-align: center; margin-top: 32px; font-size: 13px; color: #8A8178; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">kemudi</div>
          </div>
          <div className="card">
            <h1 className="heading">Booking confirmed</h1>
            <p className="text">
              Hi {clientName}, your session has been booked. Here are your details:
            </p>
            <div className="details">
              <div className="detail-row">
                <span className="detail-label">Provider</span>
                <span className="detail-value">{providerName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Service</span>
                <span className="detail-value">{serviceName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">{date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time</span>
                <span className="detail-value">{time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total</span>
                <span className="detail-value">RM{sessionFee}</span>
              </div>
            </div>
            <p className="text muted">
              Take your time. We&rsquo;re here when you&rsquo;re ready.
            </p>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <a href={providerProfileUrl} className="button">View provider profile</a>
            </div>
          </div>
          <div className="footer">
            <p>Kemudi &mdash; Finding the right support, together.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
