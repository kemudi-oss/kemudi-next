'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { AudienceToggle } from './AudienceToggle'
import { SearchButton } from './SearchButton'
import { MobileMenu } from './MobileMenu'
import { SearchOverlay } from '@/components/SearchOverlay'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  useEffect(() => {
    setMobileMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn('sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md')}
        {...(theme ? { 'data-theme': theme } : {})}
      >
        <div className="container flex items-center justify-between gap-4 py-4">
          <Link href="/" className="shrink-0">
            <Logo loading="eager" priority="high" className="h-8 invert dark:invert-0" />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            <AudienceToggle data={data} />
            <HeaderNav data={data} />
            {data?.ctaButton?.label && (
              <Link
                href={data.ctaButton.url || '#'}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {data.ctaButton.label}
              </Link>
            )}
            <SearchButton onClick={() => setSearchOpen(true)} />
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <SearchButton onClick={() => setSearchOpen(true)} />
            <MobileMenu
              data={data}
              open={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
            />
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
