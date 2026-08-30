'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon, XIcon, ArrowRightIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

const SUGGESTIONS = [
  { label: 'Anxiety therapy', url: '/providers?specialty=anxiety' },
  { label: 'Couples counselling', url: '/providers?specialty=couples' },
  { label: 'Online sessions', url: '/providers?format=online' },
  { label: 'Malay-speaking', url: '/providers?language=ms' },
]

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (open) onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        router.push(`/providers?q=${encodeURIComponent(query.trim())}`)
        onClose()
      }
    },
    [query, router, onClose],
  )

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm transition-opacity duration-200',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'mx-auto max-w-2xl px-4 pt-24 transition-transform duration-300',
          open ? 'translate-y-0' : '-translate-y-8',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for therapy, counsellors, or services..."
            className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-12 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 rounded-xl border border-border bg-card p-3">
          <p className="px-2 pb-2 text-xs font-medium text-muted-foreground">Suggested searches</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => {
                  router.push(suggestion.url)
                  onClose()
                }}
                className="group flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                {suggestion.label}
                <ArrowRightIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">Esc</kbd> to close
        </p>
      </div>
    </div>
  )
}
