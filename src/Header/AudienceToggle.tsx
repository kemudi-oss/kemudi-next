'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utilities/ui'

import type { Header } from '@/payload-types'

interface AudienceToggleProps {
  data: Header
}

export const AudienceToggle: React.FC<AudienceToggleProps> = ({ data }) => {
  const pathname = usePathname()
  const toggle = data?.audienceToggle

  if (!toggle?.helpSeekerLabel || !toggle?.therapistLabel) return null

  const isHelpSeeker = pathname === (toggle.helpSeekerUrl || '/')
  const isTherapist = pathname === (toggle.therapistUrl || '/for-therapists')

  return (
    <div className="flex items-center rounded-full bg-muted p-1">
      <Link
        href={toggle.helpSeekerUrl || '/'}
        className={cn(
          'rounded-full px-3 py-1 text-sm font-medium transition-all',
          isHelpSeeker || (!isTherapist && isHelpSeeker)
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {toggle.helpSeekerLabel}
      </Link>
      <Link
        href={toggle.therapistUrl || '/for-therapists'}
        className={cn(
          'rounded-full px-3 py-1 text-sm font-medium transition-all',
          isTherapist
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {toggle.therapistLabel}
      </Link>
    </div>
  )
}
