'use client'

import React, { Fragment, useCallback, useState } from 'react'
import { toast } from '@payloadcms/ui'

import './index.scss'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded with Kemudi data! You can now{' '}
    <a target="_blank" href="/">
      visit your website
    </a>
  </div>
)

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleSeed = useCallback(
    async (force: boolean) => {
      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          fetch('/api/seed', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ force }),
          }).then(async (res) => {
            if (!res.ok) {
              const data = await res.json().catch(() => ({}))
              throw new Error(data.error || 'Seeding failed')
            }
            setSeeded(true)
            return true
          }),
          {
            loading: 'Seeding with Kemudi data...',
            success: <SuccessMessage />,
            error: 'An error occurred while seeding.',
          },
        )
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err)
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [loading, seeded, error],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={() => handleSeed(false)}>
        Seed your database
      </button>
      <button
        className="seedButton"
        onClick={() => handleSeed(true)}
        style={{ marginLeft: '8px', opacity: 0.7 }}
      >
        Force re-seed
      </button>
      {message}
    </Fragment>
  )
}
