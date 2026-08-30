'use client'

import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

interface FAQProps {
  heading?: string
  subheading?: string
  items?: Array<{
    question: string
    answer: any
  }>
  disableInnerContainer?: boolean
}

export const FAQ: React.FC<FAQProps> = ({
  heading = 'Frequently asked questions',
  subheading,
  items = [],
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-center font-heading text-3xl font-semibold text-foreground">
          {heading}
        </h2>
        {subheading && (
          <p className="mt-2 text-center text-muted-foreground">{subheading}</p>
        )}

        <div className="mt-10 divide-y divide-border rounded-xl border border-border">
          {items.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/50"
              >
                <span className="font-heading font-medium text-foreground">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={cn(
                    'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                    openIndex === i && 'rotate-180',
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                )}
              >
                <div className="px-6 pb-5 text-muted-foreground">
                  <RichText data={item.answer} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
