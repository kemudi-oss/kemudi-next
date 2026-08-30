'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon, XIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'

import type { Header } from '@/payload-types'
import { CMSLink } from '@/components/Link'

interface MobileMenuProps {
  data: Header
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ data, open, onOpenChange }) => {
  const pathname = usePathname()
  const navItems = data?.mobileMenuItems || data?.navItems || []
  const toggle = data?.audienceToggle
  const cta = data?.ctaButton

  return (
    <>
      <button
        onClick={() => onOpenChange(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          'fixed inset-x-0 top-[73px] z-50 border-b border-border bg-background shadow-elevated transition-all duration-300 lg:hidden',
          open ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none',
        )}
      >
        <nav className="container flex flex-col gap-1 py-4">
          {toggle?.helpSeekerLabel && (
            <div className="flex gap-2 pb-3 mb-3 border-b border-border">
              <Link
                href={toggle.helpSeekerUrl || '/'}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  pathname === (toggle.helpSeekerUrl || '/')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {toggle.helpSeekerLabel}
              </Link>
              <Link
                href={toggle.therapistUrl || '/for-therapists'}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  pathname === (toggle.therapistUrl || '/for-therapists')
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {toggle.therapistLabel}
              </Link>
            </div>
          )}

          {navItems.map(({ link }, i) => (
            <CMSLink key={i} {...link} appearance="link" className="py-2" />
          ))}

          {cta?.label && (
            <Link
              href={cta.url || '#'}
              className="mt-3 rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </>
  )
}
