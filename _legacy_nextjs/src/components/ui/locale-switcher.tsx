'use client'

import React from 'react'
import { useLocale } from '@/providers/LocaleProvider'
import { cn } from '@/utilities/ui'

export const LocaleSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-0.5">
      <button
        onClick={() => setLocale('en')}
        className={cn(
          'rounded-md px-2 py-1 text-xs font-medium transition-colors',
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ms')}
        className={cn(
          'rounded-md px-2 py-1 text-xs font-medium transition-colors',
          locale === 'ms'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        MS
      </button>
    </div>
  )
}
