import React from 'react'
import { cn } from '@/utilities/ui'

interface BlobShapeProps {
  color?: 'mist-sage' | 'warm-sand' | 'clay-rose' | 'deep-teal'
  className?: string
  size?: number
}

const colorMap = {
  'mist-sage': 'bg-mist-sage/20',
  'warm-sand': 'bg-warm-sand/30',
  'clay-rose': 'bg-clay-rose/15',
  'deep-teal': 'bg-deep-teal/10',
}

export const BlobShape: React.FC<BlobShapeProps> = ({
  color = 'mist-sage',
  className,
  size = 300,
}) => {
  return (
    <div
      className={cn('absolute rounded-full blur-3xl', colorMap[color], className)}
      style={{
        width: size,
        height: size,
      }}
      aria-hidden="true"
    />
  )
}
