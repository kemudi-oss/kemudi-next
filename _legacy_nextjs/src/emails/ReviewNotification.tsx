import React from 'react'

interface ReviewNotificationProps {
  providerName: string
  reviewerName: string
  rating: number
  reviewTitle?: string
}

export const ReviewNotification: React.FC<ReviewNotificationProps> = ({
  providerName,
  reviewerName,
  rating,
  reviewTitle,
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
          .stars { color: #C49A3C; font-size: 18px; letter-spacing: 2px; }
          .footer { text-align: center; margin-top: 32px; font-size: 13px; color: #8A8178; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">kemudi</div>
          </div>
          <div className="card">
            <h1 className="heading">New review received</h1>
            <p className="text">
              Hi {providerName}, you&rsquo;ve received a new review from {reviewerName}.
            </p>
            <p className="stars">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>
            {reviewTitle && (
              <p className="text" style={{ fontStyle: 'italic', marginTop: '12px' }}>
                &ldquo;{reviewTitle}&rdquo;
              </p>
            )}
          </div>
          <div className="footer">
            <p>Kemudi &mdash; Finding the right support, together.</p>
          </div>
        </div>
      </body>
    </html>
  )
}
