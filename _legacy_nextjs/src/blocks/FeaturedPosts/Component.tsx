import React from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'

interface FeaturedPostsProps {
  heading?: string
  posts?: Array<{
    id?: string
    title?: string
    slug?: string
    heroImage?: any
    meta?: {
      description?: string
    }
  }>
  viewAllLink?: {
    label?: string
    url?: string
  }
  disableInnerContainer?: boolean
}

export const FeaturedPosts: React.FC<FeaturedPostsProps> = ({
  heading = 'Latest articles',
  posts = [],
  viewAllLink,
}) => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-3xl font-semibold text-foreground">{heading}</h2>
          {viewAllLink?.label && (
            <Link
              href={viewAllLink.url || '/posts'}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {viewAllLink.label} <ArrowRightIcon className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug || ''}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              {post.heroImage?.url && (
                <div className="aspect-video overflow-hidden bg-muted">
                  <img
                    src={post.heroImage.url}
                    alt={post.title || ''}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2">
                  {post.title}
                </h3>
                {post.meta?.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.meta.description}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Read more <ArrowRightIcon className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
