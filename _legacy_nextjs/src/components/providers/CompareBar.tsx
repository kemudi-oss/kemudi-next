'use client'

import React from 'react'
import Link from 'next/link'
import { XIcon, ArrowRightIcon } from 'lucide-react'
import { useCompare } from '@/providers/CompareProvider'

export const CompareBar: React.FC = () => {
  const { providers, remove, clear } = useCompare()

  if (providers.length === 0) return null

  const compareUrl = `/compare?ids=${providers.map((p) => p.id).join(',')}`

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md shadow-elevated">
      <div className="container flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="shrink-0 text-sm font-medium text-foreground">
            Compare ({providers.length}/3):
          </span>
          {providers.map((p) => (
            <span
              key={p.id}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm"
            >
              {p.name}
              <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-foreground">
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-foreground">
            Clear
          </button>
          <Link
            href={compareUrl}
            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Compare <ArrowRightIcon className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
