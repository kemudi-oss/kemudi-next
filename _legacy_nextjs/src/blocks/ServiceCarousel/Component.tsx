'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface ServiceCarouselProps {
  heading?: string
  subheading?: string
  services?: Array<{
    id?: string
    title?: string
    description?: string
    category?: string
  }>
  viewAllLink?: {
    label?: string
    url?: string
  }
  disableInnerContainer?: boolean
}

const categoryIcons: Record<string, string> = {
  individual: '🧠',
  couples: '💑',
  family: '👨‍👩‍👧‍👦',
  group: '👥',
  psychiatric: '⚕️',
  'child-adolescent': '🧒',
  art: '🎨',
  emdr: '👁️',
  cbt: '💬',
  crisis: '🆘',
}

export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  heading = 'How can we help?',
  subheading = 'Browse our services to find the right support for you.',
  services = [],
  viewAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-3xl font-semibold text-foreground">{heading}</h2>
            {subheading && (
              <p className="mt-2 text-muted-foreground">{subheading}</p>
            )}
          </div>
          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => scroll('left')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Scroll left"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Scroll right"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/providers?specialty=${service.category || ''}`}
              className="group flex min-w-[280px] flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              <span className="text-3xl">{categoryIcons[service.category || ''] || '🌿'}</span>
              <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              {service.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                Learn more <ArrowRightIcon className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>

        {viewAllLink?.label && (
          <div className="mt-8 text-center">
            <Link
              href={viewAllLink.url || '/providers'}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              {viewAllLink.label} <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
