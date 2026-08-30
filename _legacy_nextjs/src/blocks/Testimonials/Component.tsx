import React from 'react'
import { QuoteIcon } from 'lucide-react'

interface TestimonialsProps {
  heading?: string
  testimonials?: Array<{
    quote: string
    author: string
    context?: string
  }>
  disableInnerContainer?: boolean
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  heading = 'What people are saying',
  testimonials = [],
}) => {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container">
        <h2 className="text-center font-heading text-3xl font-semibold text-foreground">
          {heading}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <blockquote
              key={i}
              className="flex flex-col rounded-xl border border-border bg-background p-6 shadow-card"
            >
              <QuoteIcon className="h-8 w-8 text-clay-rose/40" />
              <p className="mt-4 flex-1 font-serif text-lg italic text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist-sage/30 text-sm font-medium text-deep-teal">
                    {testimonial.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <cite className="not-italic text-sm font-medium text-foreground">
                      {testimonial.author}
                    </cite>
                    {testimonial.context && (
                      <p className="text-xs text-muted-foreground">{testimonial.context}</p>
                    )}
                  </div>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
